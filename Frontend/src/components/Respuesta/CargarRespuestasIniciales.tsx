import type { RespuestaTemporal, InstanciaRespuestas } from "../types";


export function cargarRespuesta(pregunta : any, instrumentoId: number){

    let textoPrefill = '';
    let opcionPrefill = undefined;

    if (pregunta.pregunta_fuente_id) {
        console.log(pregunta.pregunta_fuente_id)
        return fetch(`http://127.0.0.1:8000/respuestas/fuente?pregunta_id=${pregunta.id}&instrumento_id=${instrumentoId}`)
            .then((res) => res.ok ? res.json() : null)
            .then((prefillData) => {
                if (prefillData?.respuestas?.length > 0) {
                    const primeraRespuesta = prefillData.respuestas[0];
                    textoPrefill = primeraRespuesta.texto || '';
                    opcionPrefill = primeraRespuesta.opcion_id;
                }
                return {
                    pregunta_id: pregunta.id,
                    texto: textoPrefill,
                    opcion_id: opcionPrefill,
                };
            })
            .catch((error) => {
                console.error(`Error cargando prefill pregunta ${pregunta.id}:`, error);
                return { pregunta_id: pregunta.id, texto: '', opcion_id: undefined };
            });
    } else {
        
        return Promise.resolve({
            pregunta_id: pregunta.id,
            texto: '',
            opcion_id: undefined,
        });
    }


}




export function cargarRespuestasIniciales(
    plantillaFormulario: any,
    instrumentoId: number
): Promise<{
    respuestasSimples: RespuestaTemporal[];
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] };
}> {
    
    const preguntasSimples = plantillaFormulario.preguntas.filter((p: any) => !p.multiple_respuestas);

    const respuestasSimplesPromises = preguntasSimples.map((pregunta: any) => {

        return cargarRespuesta(pregunta=pregunta, instrumentoId=instrumentoId);

    });

    const preguntasMultiples = plantillaFormulario.preguntas.filter((p: any) => p.multiple_respuestas);
    const gruposCuadro = new Set<number>(
        preguntasMultiples.map((p: any) => p.grupo_cuadro_id).filter((id: any): id is number => id !== null && id !== undefined)
    );

    return Promise.all(respuestasSimplesPromises).then((respuestasSimples) => {
        const respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] } = {};

        const grupoPromises = Array.from(gruposCuadro).map((grupoCuadroId) => {
            const preguntasDelGrupo = preguntasMultiples
                .filter((p: any) => p.grupo_cuadro_id === grupoCuadroId)
                .sort((a: any, b: any) => (a.orden_en_grupo || 0) - (b.orden_en_grupo || 0));

            const preguntaConFuente = preguntasDelGrupo.find((p: any) => p.pregunta_fuente_id);

            if (!preguntaConFuente) {
                const primeraInstancia: InstanciaRespuestas = {};
                preguntasDelGrupo.forEach((pregunta: any) => {
                    primeraInstancia[pregunta.id] = {
                        pregunta_id: pregunta.id,
                        texto: '',
                        opcion_id: undefined,
                        instancia_respuesta: 1,
                    };
                });
                respuestasMultiples[grupoCuadroId] = [primeraInstancia];
                return Promise.resolve();
            }

            return fetch(`http://127.0.0.1:8000/respuestas/fuente?pregunta_id=${preguntaConFuente.id}&instrumento_id=${instrumentoId}`)
                .then((res) => res.ok ? res.json() : null)
                .then((prefillData) => {
                    console.log(`📊 Prefill data para grupo ${grupoCuadroId}:`, prefillData);
                    const instanciasCargadas: InstanciaRespuestas[] = [];

                    if (prefillData?.respuestas?.length > 0) {
                        const esInformeSintetico = prefillData.respuestas.some((r: any) => r.materia_nombre || r.materia_id);

                        if (esInformeSintetico) {
                            prefillData.respuestas.forEach((respuestaPrefill: any, index: number) => {
                                const instancia: InstanciaRespuestas = {};
                                
                                preguntasDelGrupo.forEach((pregunta: any) => {
                                    if (pregunta.id === preguntaConFuente.id) {
                                        instancia[pregunta.id] = {
                                            pregunta_id: pregunta.id,
                                            texto: respuestaPrefill.texto || '',
                                            opcion_id: respuestaPrefill.opcion_id,
                                            instancia_respuesta: index + 1,
                                        };
                                    } else {
                                        instancia[pregunta.id] = {
                                            pregunta_id: pregunta.id,
                                            texto: '',
                                            opcion_id: undefined,
                                            instancia_respuesta: index + 1,
                                        };
                                    }
                                });
                                
                                instanciasCargadas.push(instancia);
                            });
                        } else if (prefillData.multiple) {
                            const respuestasPorInstancia = new Map<number, any[]>();

                            for (const respuesta of prefillData.respuestas) {
                                const instancia = respuesta.instancia || 1;
                                if (!respuestasPorInstancia.has(instancia)) {
                                    respuestasPorInstancia.set(instancia, []);
                                }
                                respuestasPorInstancia.get(instancia)!.push(respuesta);
                            }

                            let instanciaNum = 1;
                            respuestasPorInstancia.forEach((respuestasInstancia) => {
                                const instancia: InstanciaRespuestas = {};
                                
                                const respuestasPorPregunta = new Map<number, any>();
                                respuestasInstancia.forEach((resp) => {
                                    const preguntaCorrespondiente = preguntasDelGrupo.find((p: any) => 
                                        p.pregunta_fuente_id === resp.pregunta_id || p.id === resp.pregunta_id
                                    );
                                    if (preguntaCorrespondiente) {
                                        respuestasPorPregunta.set(preguntaCorrespondiente.id, resp);
                                    }
                                });

                                preguntasDelGrupo.forEach((pregunta: any) => {
                                    const respuestaExistente = respuestasPorPregunta.get(pregunta.id);
                                    instancia[pregunta.id] = {
                                        pregunta_id: pregunta.id,
                                        texto: respuestaExistente?.texto || '',
                                        opcion_id: respuestaExistente?.opcion_id,
                                        instancia_respuesta: instanciaNum,
                                    };
                                });
                                
                                instanciasCargadas.push(instancia);
                                instanciaNum++;
                            });
                        } else {
                           
                            const primeraRespuesta = prefillData.respuestas[0];
                            const instancia: InstanciaRespuestas = {};
                            
                            preguntasDelGrupo.forEach((pregunta: any) => {
                                if (pregunta.id === preguntaConFuente.id) {
                                    instancia[pregunta.id] = {
                                        pregunta_id: pregunta.id,
                                        texto: primeraRespuesta.texto || '',
                                        opcion_id: primeraRespuesta.opcion_id,
                                        instancia_respuesta: 1,
                                    };
                                } else {
                                    instancia[pregunta.id] = {
                                        pregunta_id: pregunta.id,
                                        texto: '',
                                        opcion_id: undefined,
                                        instancia_respuesta: 1,
                                    };
                                }
                            });
                            
                            instanciasCargadas.push(instancia);
                        }

                        respuestasMultiples[grupoCuadroId] = instanciasCargadas;
                    } else {
                        const primeraInstancia: InstanciaRespuestas = {};
                        preguntasDelGrupo.forEach((pregunta: any) => {
                            primeraInstancia[pregunta.id] = {
                                pregunta_id: pregunta.id,
                                texto: '',
                                opcion_id: undefined,
                                instancia_respuesta: 1,
                            };
                        });
                        respuestasMultiples[grupoCuadroId] = [primeraInstancia];
                    }
                })
                .catch((error) => {
                    console.error(`Error al cargar grupo ${grupoCuadroId}:`, error);
                    const primeraInstancia: InstanciaRespuestas = {};
                    preguntasDelGrupo.forEach((pregunta: any) => {
                        primeraInstancia[pregunta.id] = {
                            pregunta_id: pregunta.id,
                            texto: '',
                            opcion_id: undefined,
                            instancia_respuesta: 1,
                        };
                    });
                    respuestasMultiples[grupoCuadroId] = [primeraInstancia];
                });
        });

        return Promise.all(grupoPromises).then(() => ({
            respuestasSimples,
            respuestasMultiples,
        }));
    });
}