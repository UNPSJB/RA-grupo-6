import type { GrupoPreguntas, InstrumentoDetail } from '../types';

const PREGUNTAS_POR_PAGINA = 5;

export function organizarPreguntasEnGrupos(
    plantillaFormulario: any,
    instrumento?: InstrumentoDetail
): GrupoPreguntas[] {
    if (!plantillaFormulario) return [];
    
    const grupos: GrupoPreguntas[] = [];
    const esInformeSintetico = instrumento?.tipo === "INFORME_SINTETICO";

    if (esInformeSintetico) {
        grupos.push({
            id: -1,
            nombre: "Información General",
            preguntas: [],
            tipo: 'simple'
        });
    }


    const preguntasSimples = plantillaFormulario.preguntas.filter((p: any) => !p.multiple_respuestas);
    const preguntasMultiples = plantillaFormulario.preguntas.filter((p: any) => p.multiple_respuestas);
    
    const preguntasSimplesPorGrupo = new Map<number | null, any[]>();
    preguntasSimples.forEach((pregunta: any) => {
        const grupoId = pregunta.grupo_cuadro_id;
        if (!preguntasSimplesPorGrupo.has(grupoId)) {
            preguntasSimplesPorGrupo.set(grupoId, []);
        }
        preguntasSimplesPorGrupo.get(grupoId)!.push(pregunta);
    });
    
    let contadorGrupo = esInformeSintetico ? 2 : 1;

    preguntasSimplesPorGrupo.forEach((preguntas, grupoId) => {
        if (grupoId !== null && preguntas.length > 0) {
            grupos.push({
                id: grupoId,
                nombre: `Sección ${contadorGrupo}`,
                preguntas: preguntas,
                tipo: 'simple'
            });
            contadorGrupo++;
        } else if (grupoId === null) {
            for (let i = 0; i < preguntas.length; i += PREGUNTAS_POR_PAGINA) {
                grupos.push({
                    id: -contadorGrupo,
                    nombre: `Sección ${contadorGrupo}`,
                    preguntas: preguntas.slice(i, i + PREGUNTAS_POR_PAGINA),
                    tipo: 'simple'
                });
                contadorGrupo++;
            }
        }
    });

    const gruposCuadro = new Set<number>(
        preguntasMultiples
            .map((p: any) => p.grupo_cuadro_id)
            .filter((id: any): id is number => id !== null && id !== undefined)
    );
    
    gruposCuadro.forEach((grupoCuadroId) => {
        const preguntasDelGrupo = preguntasMultiples
            .filter((p: any) => p.grupo_cuadro_id === grupoCuadroId)
            .sort((a: any, b: any) => (a.orden_en_grupo || 0) - (b.orden_en_grupo || 0));
        
        grupos.push({
            id: grupoCuadroId,
            nombre: `Sección ${contadorGrupo} (Repetible)`,
            preguntas: preguntasDelGrupo,
            tipo: 'multiple'
        });
        contadorGrupo++;
    });
    
    return grupos;
}