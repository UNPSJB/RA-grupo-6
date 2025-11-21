import type { RespuestaTemporal } from "../types";

export interface InstanciaRespuestas {
    [preguntaId: number]: RespuestaTemporal;
}

type Pregunta = {
    id: number;
    texto: string;
    grupo_cuadro_id: number | null;
};

let preguntasCache: Record<number, Pregunta[]> | null = null;


async function obtenerPreguntasPorGrupoCuadro(): Promise<Record<number, Pregunta[]>> {
    if (preguntasCache) {
        return preguntasCache;
    }
    
    const response = await fetch('http://127.0.0.1:8000/preguntas/todos'); 
    if (!response.ok) {
        console.error("Error al obtener todas las preguntas para autocompletar. Verifique el error 422 en el Back-end.");
        return {};
    }
    const todasLasPreguntas: Pregunta[] = await response.json();
    
    const preguntasAgrupadas: Record<number, Pregunta[]> = {};
    for (const p of todasLasPreguntas) {
        if (p.grupo_cuadro_id) {
            const grupoId = p.grupo_cuadro_id;
            if (!preguntasAgrupadas[grupoId]) {
                preguntasAgrupadas[grupoId] = [];
            }
            preguntasAgrupadas[grupoId].push(p);
        }
    }
    
    preguntasCache = preguntasAgrupadas;
    return preguntasAgrupadas;
}

async function crearFormulario(instrumentoSeleccionado: any, usuarioActual: any) {
    if (!usuarioActual || !usuarioActual.id) {
        throw new Error('No hay usuario autenticado para crear el formulario');
    }
    
    const datos = await fetch(
            `http://127.0.0.1:8000/instrumentos/ObtenerDatosInstrumento/${instrumentoSeleccionado.id}`
    ).then(r => r.json());
    
    const cuerpoFormulario = {
        materia_id: instrumentoSeleccionado.materia?.id,
        usuario_id: usuarioActual.id,
        instrumento_id: instrumentoSeleccionado.id,
        fecha_envio: new Date().toISOString().split('T')[0],
        datos: JSON.stringify(datos)
    };
    const formularioResponse = await fetch('http://127.0.0.1:8000/RespuestasFormulario/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cuerpoFormulario),
    });

    if (!formularioResponse.ok) {
        const errorText = await formularioResponse.text();
        console.error('Error del servidor al crear formulario:', errorText);
        throw new Error(`Error al crear el formulario: ${formularioResponse.status} - ${errorText}`);
    }

    return await formularioResponse.json();
}

async function enviarRespuestasSimples(respuestas: RespuestaTemporal[], formularioId: number) {
    const respuestasFiltradas = respuestas.filter((r) => r.texto?.trim() || r.opcion_id);

    const promesas = respuestasFiltradas.map(async (r) => {
        const cuerpoRespuesta = {
            pregunta_id: r.pregunta_id,
            texto: r.texto?.trim() || null,
            opcion_id: r.opcion_id || null,
            formulario_id: formularioId,
            instancia_respuesta: null,
        };
        
        const respuestaResponse = await fetch('http://127.0.0.1:8000/respuestas/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cuerpoRespuesta),
        });
        
        if (!respuestaResponse.ok) {
            const errorText = await respuestaResponse.text();
            throw new Error(`Error al enviar respuesta ${r.pregunta_id}: ${respuestaResponse.status} - ${errorText}`);
        }

        return await respuestaResponse.json();
    });
    
    await Promise.all(promesas);
}

async function preCrearPreguntasMateria(
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }
): Promise<void> {
   const gruposConMetadata: Map<number, number> = new Map();
    
    for (const grupoCuadroIdStr in respuestasMultiples) {
        const grupoCuadroId = parseInt(grupoCuadroIdStr);
        const instancias = respuestasMultiples[grupoCuadroIdStr] || [];
        
        if (instancias.length > 0) {
            const primeraInstancia = instancias[0];

            for (const key in primeraInstancia) {
                const r = primeraInstancia[key];
                if (r?.materia_nombre) {
                    gruposConMetadata.set(grupoCuadroId, parseInt(key));
                    break;
                }
            }
        }
    }
    
    if (gruposConMetadata.size > 0) {
        console.log(` Pre-creando preguntas para ${gruposConMetadata.size} grupos_cuadro...`);
        
        for (const [grupoCuadroId, preguntaId] of gruposConMetadata) {
            try {
                const response = await fetch(`http://127.0.0.1:8000/preguntas/preparar-preguntas-materia/${preguntaId}`, {
                    method: 'POST',
                });
                
                if (response.ok) {
                    const resultado = await response.json();
                    if (resultado.preguntas_creadas) {
                        console.log(`Preguntas creadas para grupo_cuadro ${grupoCuadroId}`);
                    } else {
                        console.log(`Preguntas ya existían para grupo_cuadro ${grupoCuadroId}`);
                    }
                } else {
                    console.warn(`Error al pre-crear preguntas para grupo_cuadro ${grupoCuadroId}`);
                }
            } catch (error) {
                console.error(`Error al pre-crear preguntas para grupo_cuadro ${grupoCuadroId}:`, error);
            }
        }
        
        preguntasCache = null;    }
}


async function enviarRespuestasMultiples(
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] },
    formularioId: number
) {
    let totalEnviadas = 0;
    
    const preguntasPorGrupo = await obtenerPreguntasPorGrupoCuadro(); 

    for (const grupoCuadroIdStr in respuestasMultiples) {
        const grupoCuadroId = parseInt(grupoCuadroIdStr);
        const instancias = respuestasMultiples[grupoCuadroIdStr] || [];
        
        const preguntasGrupo = preguntasPorGrupo[grupoCuadroId] || [];
        const preguntaCodigo = preguntasGrupo.find(p => p.texto === "Código de actividad curricular");
        const preguntaNombre = preguntasGrupo.find(p => p.texto === "Nombre de la actividad curricular");

        for (let instanciaIndex = 0; instanciaIndex < instancias.length; instanciaIndex++) {
            const instancia = instancias[instanciaIndex];
            
            let materiaNombre: string | undefined = undefined;
            let materiaId: string | undefined = undefined;
            let respuestaConMetadataKey: string | undefined = undefined; 

            for (const key in instancia) {
                const preguntaId = parseInt(key);
                const r = instancia[preguntaId];

                if (r?.materia_nombre) { 
                    materiaNombre = r.materia_nombre;
                    materiaId = r.materia_id;
                    respuestaConMetadataKey = key; 
                    break; 
                }
            }
            
            if (materiaNombre && materiaId && preguntaCodigo && preguntaNombre) {
                const codigoPreguntaId = preguntaCodigo.id;
                const nombrePreguntaId = preguntaNombre.id;

                instancia[codigoPreguntaId] = {
                    pregunta_id: codigoPreguntaId,
                    texto: materiaId, 
                    opcion_id: null,
                } as RespuestaTemporal; 
                
                instancia[nombrePreguntaId] = {
                    pregunta_id: nombrePreguntaId,
                    texto: materiaNombre,
                    opcion_id: null,
                } as RespuestaTemporal;
                
                console.log(`Inyectado autocompletado para ${materiaNombre} en grupo_cuadro ${grupoCuadroId}, instancia ${instanciaIndex + 1}`);
            }

            if (respuestaConMetadataKey) {
                const claveNumber = parseInt(respuestaConMetadataKey);
                const respuestaOriginal = instancia[claveNumber];
                
                delete respuestaOriginal.materia_nombre;
                delete respuestaOriginal.materia_id;
            }

            for (const key in instancia) {
                const preguntaId = parseInt(key);
                const respuesta = instancia[preguntaId];
                
                if (respuesta.texto?.trim() || respuesta.opcion_id) {
                    const cuerpoRespuesta = {
                        pregunta_id: preguntaId,
                        texto: respuesta.texto?.trim() || null,
                        opcion_id: respuesta.opcion_id || null,
                        formulario_id: formularioId,
                        instancia_respuesta: instanciaIndex + 1,
                    };

                    const respuestaResponse = await fetch('http://127.0.0.1:8000/respuestas/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cuerpoRespuesta),
                    });

                    if (!respuestaResponse.ok) {
                        const errorText = await respuestaResponse.text();
                        throw new Error(`Error al enviar respuesta múltiple ${preguntaId}: ${respuestaResponse.status} - ${errorText}`);
                    }

                    await respuestaResponse.json();
                    totalEnviadas++;
                }
            }
        }
    }
    
    console.log(`Total de respuestas múltiples enviadas: ${totalEnviadas}`);
}

export async function enviarFormularioCompleto(
    instrumentoSeleccionado: any,
    usuarioActual: any,
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }
): Promise<boolean> {
    try {
        if (!instrumentoSeleccionado || !usuarioActual) return false;
        
        await preCrearPreguntasMateria(respuestasMultiples);
        
        const formularioCreado = await crearFormulario(instrumentoSeleccionado, usuarioActual);
        
        await enviarRespuestasSimples(respuestas, formularioCreado.id);
        
        await enviarRespuestasMultiples(respuestasMultiples, formularioCreado.id);
    
        preguntasCache = null;
        
        return true;
    } catch (err: unknown) {
        const mensaje = err instanceof Error ? err.message : 'Error desconocido';
        console.error("Error en enviarFormularioCompleto:", mensaje);
        return false;
    }
}