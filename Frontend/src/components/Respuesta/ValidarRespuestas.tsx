import type { RespuestaTemporal, InstanciaRespuestas } from "../types";

export function validarInstanciaCompleta(instancia: InstanciaRespuestas, preguntasDelGrupo?: any[]): boolean {
    for (const key in instancia) {
        const r = instancia[key];
        if (preguntasDelGrupo) {
            const pregunta = preguntasDelGrupo.find(p => p.id === Number(key));
            if (pregunta?.obligatoria && !(r.texto?.trim() || r.opcion_id)) {
                return false;
            }
        } else {
            if (!(r.texto?.trim() || r.opcion_id)) return false;
        }
    }
    return true;
}

export function validarInstanciaObligatoriasCompletas(instancia: InstanciaRespuestas, preguntasDelGrupo: any[]): boolean {
    const preguntasObligatorias = preguntasDelGrupo.filter((p: any) => p.obligatoria);
    
    for (const pregunta of preguntasObligatorias) {
        const r = instancia[pregunta.id];
        if (!(r?.texto?.trim() || r?.opcion_id)) {
            return false;
        }
    }
    return true;
}

export function validarTodasRespuestasCompletas(
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] },
    plantillaFormulario: any
): boolean {
    if (!plantillaFormulario || !plantillaFormulario.preguntas) {
        return false;
    }

    const preguntasObligatorias = plantillaFormulario.preguntas.filter(
        (pregunta: any) => pregunta.obligatoria && !pregunta.multiple_respuestas
    );

    const simplesCompletas = preguntasObligatorias.every((pregunta: any) => {
        return respuestas.some(
            (respuesta) =>
                respuesta.pregunta_id === pregunta.id && (respuesta.texto?.trim() || respuesta.opcion_id)
        );
    });

    const preguntasMultiples = plantillaFormulario?.preguntas.filter(
        (p: any) => p.multiple_respuestas && p.obligatoria
    ) || [];

    const gruposCuadro = new Set<number>(
        preguntasMultiples
            .map((p: any) => p.grupo_cuadro_id)
            .filter((id: any): id is number => id !== null && id !== undefined)
    );

    const multiplesCompletas = (() => {
        for (const grupoCuadroId of gruposCuadro) {
            const instancias = respuestasMultiples[grupoCuadroId] || [];
            if (instancias.length === 0) return false;

            const preguntasGrupo = plantillaFormulario.preguntas.filter(
                (p: any) => p.grupo_cuadro_id === grupoCuadroId
            );

            for (const instancia of instancias) {
                if (!validarInstanciaObligatoriasCompletas(instancia, preguntasGrupo)) return false;
            }
        }
        return true;
    })();

    return simplesCompletas && multiplesCompletas;
}

export function calcularProgresoTotal(respuestas: RespuestaTemporal[], respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }, plantillaFormulario?: any
): number {
    let totalPreguntas = 0;
    let preguntasRespondidas = 0;

    if (plantillaFormulario && plantillaFormulario.preguntas) {
        const preguntasObligatorias = plantillaFormulario.preguntas.filter(
            (p: any) => p.obligatoria && !p.multiple_respuestas
        );

        totalPreguntas = preguntasObligatorias.length;
        preguntasRespondidas = preguntasObligatorias.filter((p: any) =>
            respuestas.some(
                (r) =>
                    r.pregunta_id === p.id && (r.texto?.trim() || r.opcion_id)
            )
        ).length;

        const preguntasMultiples = plantillaFormulario.preguntas.filter(
            (p: any) => p.multiple_respuestas && p.obligatoria
        );

        const gruposCuadro = new Set<number>(
            preguntasMultiples
                .map((p: any) => p.grupo_cuadro_id)
                .filter((id: any): id is number => id !== null && id !== undefined)
        );

        for (const grupoCuadroId of gruposCuadro) {
            const instancias = respuestasMultiples[grupoCuadroId] || [];
            if (instancias.length > 0) {
                totalPreguntas += 1;
                
                const preguntasGrupo = plantillaFormulario.preguntas.filter(
                    (p: any) => p.grupo_cuadro_id === grupoCuadroId
                );
                
                if (instancias.every((inst) => validarInstanciaObligatoriasCompletas(inst, preguntasGrupo))) {
                    preguntasRespondidas += 1;
                }
            }
        }
    } else {
        respuestas.forEach((r) => {
            totalPreguntas++;
            if (r.texto?.trim() || r.opcion_id) preguntasRespondidas++;
        });

        for (const grupoId in respuestasMultiples) {
            const instancias = respuestasMultiples[grupoId];

            for (const instancia of instancias) {
                for (const key in instancia) {
                    const r = instancia[key];
                    totalPreguntas++;
                    if (r.texto?.trim() || r.opcion_id) {
                        preguntasRespondidas++;
                    }
                }
            }
        }
    }

    return totalPreguntas > 0 ? (preguntasRespondidas / totalPreguntas) * 100 : 0;
}

export function validarPaginaCompleta(paginaActual: number,gruposOrganizados: any[],
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }
): boolean {
    if (paginaActual >= gruposOrganizados.length) return false;

    const grupoActual = gruposOrganizados[paginaActual];

    if (grupoActual.tipo === 'simple') {
        const preguntasObligatorias = grupoActual.preguntas.filter((p: any) => p.obligatoria);
     
        if (preguntasObligatorias.length === 0) return true;

        return preguntasObligatorias.every((pregunta: any) => {
            const respuesta = respuestas.find((r) => r.pregunta_id === pregunta.id);
            return respuesta?.texto?.trim() || respuesta?.opcion_id;
        });
    } else {
        const preguntasObligatorias = grupoActual.preguntas.filter((p: any) => p.obligatoria);

        if (preguntasObligatorias.length === 0) return true;

        const instancias = respuestasMultiples[grupoActual.id] || [];
        return instancias.length > 0 && instancias.every((instancia) =>
            validarInstanciaObligatoriasCompletas(instancia, grupoActual.preguntas)
        );
    }
}

export function paginaTieneOpcionalesIncompletos(paginaActual: number, gruposOrganizados: any[], respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }
): boolean {
    if (paginaActual >= gruposOrganizados.length) return false;

    const grupoActual = gruposOrganizados[paginaActual];

    if (grupoActual.tipo === 'simple') {
        return grupoActual.preguntas
            .filter((p: any) => !p.obligatoria)
            .some((pregunta: any) => {
                const respuesta = respuestas.find((r) => r.pregunta_id === pregunta.id);
                return !(respuesta?.texto?.trim() || respuesta?.opcion_id);
            });
    } else {
        const preguntasOpcionales = grupoActual.preguntas.filter((p: any) => !p.obligatoria);
        
        if (preguntasOpcionales.length === 0) return false;

        const instancias = respuestasMultiples[grupoActual.id] || [];
        
        if (instancias.length === 0) return true;

        return instancias.some((instancia) => {
            return preguntasOpcionales.some((pregunta: any) => {
                const respuesta = instancia[pregunta.id];
                return !(respuesta?.texto?.trim() || respuesta?.opcion_id);
            });
        });
    }
}

export function paginaTotalmenteCompleta(
    index: number,
    gruposOrganizados: any[],
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }
): boolean {
    if (index >= gruposOrganizados.length) return false;

    const grupo = gruposOrganizados[index];

    if (grupo.tipo === 'simple') {
        return grupo.preguntas.every((pregunta: any) => {
            const respuesta = respuestas.find((r) => r.pregunta_id === pregunta.id);
            return respuesta?.texto?.trim() || respuesta?.opcion_id;
        });
    } else {
        const instancias = respuestasMultiples[grupo.id] || [];
        if (instancias.length === 0) return false;

        return instancias.every((instancia) => {
            return grupo.preguntas.every((pregunta: any) => {
                const respuesta = instancia[pregunta.id];
                return respuesta?.texto?.trim() || respuesta?.opcion_id;
            });
        });
    }
}