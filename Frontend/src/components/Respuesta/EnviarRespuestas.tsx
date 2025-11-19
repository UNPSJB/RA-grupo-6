import { getDatosInstrumento } from "../Funciones";
import type { RespuestaTemporal, InstanciaRespuestas } from "../types";

export async function enviarFormularioCompleto(
    instrumentoSeleccionado: any,
    usuarioActual: any,
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }
): Promise<boolean> {
    try {
    
        if (!instrumentoSeleccionado) {
            throw new Error('No hay instrumento seleccionado');
        }
        if (!usuarioActual) {
            throw new Error('No hay usuario actual');
        }
        const formularioCreado = await crearFormulario(instrumentoSeleccionado, usuarioActual);
        
        await enviarRespuestasSimples(respuestas, formularioCreado.id);
        
        await enviarRespuestasMultiples(respuestasMultiples, formularioCreado.id);
        
        return true;
    } catch (err: unknown) {
        const mensaje = err instanceof Error ? err.message : 'Error desconocido';
        return false;
    }
}

async function crearFormulario(instrumentoSeleccionado: any, usuarioActual: any) {
    if (!usuarioActual || !usuarioActual.id) {
        throw new Error('No hay usuario autenticado para crear el formulario');
    }

    let datos 
    if (instrumentoSeleccionado){
        datos = " "
    }
    else{
        datos =JSON.stringify(getDatosInstrumento(instrumentoSeleccionado)) 
    }

    const cuerpoFormulario = {
        materia_id: instrumentoSeleccionado.materia?.id,
        usuario_id: usuarioActual.id,
        instrumento_id: instrumentoSeleccionado.id,
        fecha_envio: new Date().toISOString().split('T')[0],
        datos: datos
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

        const resultado = await respuestaResponse.json();
        return resultado;
    });
    
    await Promise.all(promesas);
}

async function enviarRespuestasMultiples(
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] },
    formularioId: number
) {
    let totalEnviadas = 0;
    
    for (const grupoCuadroId in respuestasMultiples) {
        const instancias = respuestasMultiples[grupoCuadroId] || [];

        for (let instanciaIndex = 0; instanciaIndex < instancias.length; instanciaIndex++) {
            const instancia = instancias[instanciaIndex];

            for (const preguntaId in instancia) {
                const respuesta = instancia[preguntaId];
                if (respuesta.texto?.trim() || respuesta.opcion_id) {
                    const cuerpoRespuesta = {
                        pregunta_id: parseInt(preguntaId),
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

                    const resultado = await respuestaResponse.json();
                    console.log(`    Respuesta múltiple enviada:`, resultado);
                    totalEnviadas++;
                }
            }
        }
    }
    
    console.log(`Total de respuestas múltiples enviadas: ${totalEnviadas}`);
}