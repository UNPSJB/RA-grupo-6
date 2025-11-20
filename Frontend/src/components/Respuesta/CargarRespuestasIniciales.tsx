import type { RespuestaTemporal, InstanciaRespuestas } from "../types";

export function cargarRespuesta(pregunta: any, instrumentoId: number): Promise<RespuestaTemporal> {
    if (pregunta.pregunta_fuente_id) {
        return fetch(`http://127.0.0.1:8000/respuestas/fuente?pregunta_id=${pregunta.id}&instrumento_id=${instrumentoId}`)
            .then((res) => res.ok ? res.json() : null)
            .then((prefillData) => {
                const r = prefillData?.respuestas?.[0];
                return {
                    pregunta_id: pregunta.id,
                    texto: r?.texto || '',
                    opcion_id: r?.opcion_id,
                };
            })
            .catch(() => ({
                pregunta_id: pregunta.id,
                texto: '',
                opcion_id: undefined
            }));
    }

    return Promise.resolve({
        pregunta_id: pregunta.id,
        texto: '',
        opcion_id: undefined,
    });
}

export async function cargarRespuestasIniciales(
    plantillaFormulario: any,
    instrumentoId: number
): Promise<{
    respuestasSimples: RespuestaTemporal[];
    respuestasMultiples: { [grupoId: number]: InstanciaRespuestas[] };
}> {
    const todas = plantillaFormulario.preguntas;

    const preguntasSimples = todas.filter((p: any) => !p.multiple_respuestas);
    const respuestasSimples = await Promise.all(
        preguntasSimples.map((p: any) => cargarRespuesta(p, instrumentoId))
    );

    const preguntasMultiples = todas.filter((p: any) => p.multiple_respuestas);
    const preguntasConFuente = todas.filter((p: any) => p.pregunta_fuente_id != null);

    const resultadosFuente = await Promise.all(
        preguntasConFuente.map(async (pregunta: any) => {
            try {
                const res = await fetch(
                    `http://127.0.0.1:8000/respuestas/fuente?pregunta_id=${pregunta.id}&instrumento_id=${instrumentoId}`
                );
                if (res.ok) {
                    const data = await res.json();
                    if (data?.respuestas?.length > 0) {
                        return { pregunta, prefillData: data };
                    }
                }
            } catch (_) {}
            return null;
        })
    );

    const preguntasPorGrupo: { [id: number]: any[] } = {};
    const respuestasMultiples: { [id: number]: InstanciaRespuestas[] } = {};

    for (const p of preguntasMultiples) {
        if (!preguntasPorGrupo[p.grupo_cuadro_id]) {
            preguntasPorGrupo[p.grupo_cuadro_id] = [];
        }
        preguntasPorGrupo[p.grupo_cuadro_id].push(p);
    }

    for (const resultado of resultadosFuente) {
        if (!resultado) continue;

        const { pregunta, prefillData } = resultado;
        const grupoId = pregunta.grupo_cuadro_id;

        if (grupoId && prefillData.multiple) {
            if (!respuestasMultiples[grupoId]) {
                respuestasMultiples[grupoId] = [];
            }

            const instancias = respuestasMultiples[grupoId];
            const pregGrupo = preguntasPorGrupo[grupoId] || [];

            prefillData.respuestas.forEach((resp: any, index: number) => {
                if (!instancias[index]) {
                    const instancia: InstanciaRespuestas = {};
                    pregGrupo.forEach((p: any) => {
                        instancia[p.id] = {
                            pregunta_id: p.id,
                            texto: '',
                            opcion_id: undefined,
                            instancia_respuesta: index + 1,
                        };
                    });
                    instancias.push(instancia);
                }

                instancias[index][pregunta.id] = {
                    pregunta_id: pregunta.id,
                    texto: resp.texto || '',
                    opcion_id: resp.opcion_id,
                    instancia_respuesta: index + 1,
                    materia_nombre: resp.materia_nombre,
                    materia_id: resp.materia_id
                };
            });
        }
    }

    for (const grupoId in preguntasPorGrupo) {
        const num = parseInt(grupoId);
        if (!respuestasMultiples[num] || respuestasMultiples[num].length === 0) {
            const instancia: InstanciaRespuestas = {};
            preguntasPorGrupo[num].forEach((p: any) => {
                instancia[p.id] = {
                    pregunta_id: p.id,
                    texto: '',
                    opcion_id: undefined,
                    instancia_respuesta: 1
                };
            });
            respuestasMultiples[num] = [instancia];
        }
    }

    return {
        respuestasSimples,
        respuestasMultiples
    };
}

