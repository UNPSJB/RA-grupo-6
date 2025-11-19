import { useEffect, useState } from "react";
import type { InstrumentoDetail, Usuario } from "./types";

export function capitalizarCadena(cadena: string): string {
    cadena = cadena.toLocaleLowerCase()

    let cadenaCapitalizada = ""

    cadena.split(" ").forEach(subcadena => {
        cadenaCapitalizada = cadenaCapitalizada + " " + subcadena.charAt(0).toUpperCase() + subcadena.slice(1);
    });

    return cadenaCapitalizada
}

export function getDatosInstrumento(instrumento : InstrumentoDetail){

    const [docente, setDocente] = useState<Usuario>()
    const [cantInscriptos, setCantInscriptos] = useState(0)
    const [datosInstrumento, setDatosInstrumento] = useState<any>(null);

    useEffect(() => {
        fetch(`http://127.0.0.1:8000/materias/get_docente/${instrumento.materia.id}`)
        .then(response => response.json())
        .then((data) => setDocente(data))
        .catch(error => console.log(error));

        fetch(`http://127.0.0.1:8000/Dictados/Inscriptos/${instrumento.materia.id}/${instrumento.id}`)
        .then(response => response.json())
        .then((data) => setCantInscriptos(data))
        .catch(error => console.log(error));
    }, []);

    useEffect(() =>{
        if (instrumento.tipo == "ENCUESTA_ESTUDIANTE"){
            setDatosInstrumento({
                sede: instrumento.departamento.sede,
                carrera: instrumento.materia.carrera.nombre,
                asignatura: instrumento.materia.nombre
            })
        }
        else if(instrumento.tipo == "INFORME_CATEDRA"){

            setDatosInstrumento({
                sede: instrumento.departamento.sede,
                cicloLectivo: (new Date(instrumento.dictado.fecha_inicio).getFullYear()),
                asignatura: instrumento.materia.nombre,
                codAsignatura: instrumento.materia.id,
                docente: capitalizarCadena((docente?.nombre + " "+ docente?.apellido)), 
                inscriptos: cantInscriptos,
                comisionesTeoricas: "-",
                comisionesPracticas: "-",
            })
        }
        else{
            setDatosInstrumento({
                sede: instrumento.departamento.sede,
                cicloLectivo: (new Date(instrumento.dictado.fecha_inicio).getFullYear()),
                departamento:instrumento.departamento.nombre,
                integrantes: "-",
            })
        }
    }, [instrumento, docente, cantInscriptos])
    
    return datosInstrumento
}

