import { esTipoRespuestaValido } from "../Funciones";
import type { RespuestaTemporal, InstanciaRespuestas} from "../types";


function getPregunta(pregunta_id:number){

    return fetch(`http://127.0.0.1:8000/preguntas/${pregunta_id}`)
        .then((res) => res.ok ? res.json() : null)
}

export function validarInstanciaCompleta(instancia: InstanciaRespuestas): boolean {
    for (const key in instancia) {
        const r = instancia[key];
    
        const pregunta = getPregunta(r.pregunta_id)

        if(!pregunta || !((r?.texto && (pregunta.tipo_respuesta))? esTipoRespuestaValido(r.texto, pregunta.tipo_respuesta) : r.texto))
            return false;
    }
    return true;
}

export function validarTodasRespuestasCompletas(
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] },
    plantillaFormulario: any, 
): boolean {

    const preguntasObligatorias = plantillaFormulario.preguntas.filter((pregunta: any) => pregunta.obligatoria && !pregunta.multiple_respuestas)

    const simplesCompletas = preguntasObligatorias.every((pregunta: any) => {
    return respuestas.some((respuesta) => respuesta.pregunta_id === pregunta.id && (respuesta.texto?.trim() || respuesta.opcion_id) );
    });

    const preguntasMultiples = plantillaFormulario?.preguntas.filter((p: any) => p.multiple_respuestas && p.obligatoria) || [];
    const gruposCuadro = new Set<number>(
        preguntasMultiples
            .map((p: any) => p.grupo_cuadro_id)
            .filter((id: any): id is number => id !== null && id !== undefined)
    );

    const multiplesCompletas = (() => {
        for (const grupoCuadroId of gruposCuadro) {
            const instancias = respuestasMultiples[grupoCuadroId] || [];
            if (instancias.length === 0) return false;

            for (const instancia of instancias) {
                if (!validarInstanciaCompleta(instancia)) return false;
            }
        }
        return true;
    })();

    return simplesCompletas && multiplesCompletas;
}

export function calcularProgresoTotal(
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] }
): number {
    let totalPreguntas = 0;
    let preguntasRespondidas = 0;

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

    return totalPreguntas > 0 ? (preguntasRespondidas / totalPreguntas) * 100 : 0;
}

export function validarPaginaCompleta(
    paginaActual: number,
    gruposOrganizados: any[],
    respuestas: RespuestaTemporal[],
    respuestasMultiples: { [grupoCuadroId: number]: InstanciaRespuestas[] },
): boolean {
    if (paginaActual >= gruposOrganizados.length) return false;

    const grupoActual = gruposOrganizados[paginaActual];

    let esPaginaCompleta : boolean

    if (grupoActual.tipo === 'simple') {
        esPaginaCompleta = grupoActual.preguntas.filter((pregunta : any) => pregunta.obligatoria).every((pregunta: any) => {
            const respuesta = respuestas.find((r) => r.pregunta_id === pregunta.id);
            
            if (!respuesta){
                return false
            }

            return  respuesta?.opcion_id || ((respuesta?.texto && (pregunta.tipo_respuesta))? esTipoRespuestaValido(respuesta.texto, pregunta.tipo_respuesta) : respuesta.texto);
        });
    } 
    else {
        const instancias = respuestasMultiples[grupoActual.id] || [];
        esPaginaCompleta = instancias.length > 0 && instancias.every((instancia) => validarInstanciaCompleta(instancia));
    }

    return esPaginaCompleta;

}


