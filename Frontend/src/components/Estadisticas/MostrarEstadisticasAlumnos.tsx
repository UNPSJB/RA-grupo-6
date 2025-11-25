import { useEffect, useState } from "react";
import { CCol, CRow, CCardBody, CCardHeader } from "@coreui/react";
import { CardCantRespondidos } from "./CardCantRespondidos";
import ShadowedCard from "../coreui-components/ShadowedCard";

function MostrarCardEstadisticas(estadisticas: any[]){
    
    let filas = []

    for(let i = 0; i < estadisticas.length; i += 2){

        const primerElemento = estadisticas[i];
        const segundoElemento = i + 1 < estadisticas.length? estadisticas[i + 1] : null
        
        filas.push(
            <CRow className="g-3 mb-3" key={i}>                 
                <CCol md={6} className="d-flex align-items-stretch">
                        <CardCantRespondidos titulo={primerElemento.Materia} totalesAsignadas={primerElemento.Asignados}  totalesRespondidos={primerElemento.Respondidos}/>
                </CCol>
                {segundoElemento &&

                <CCol md={6} className="d-flex align-items-stretch">
                        <CardCantRespondidos titulo={segundoElemento.Materia} totalesAsignadas={segundoElemento.Asignados}  totalesRespondidos={segundoElemento.Respondidos}/>
                </CCol>
                }
            </CRow>
        )
    }
    return filas
}

export function MostrarEstadisticasAlumnos({docente_id} : {docente_id : number}){

    const url_base = `http://127.0.0.1:8000/instrumentos/ObtenerTasaRespuestasDocente/${docente_id}` 

    const [estadisticas, setEstadisticas] = useState([])

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => setEstadisticas(data))
            .catch(error => console.log(error));
    }, []);

    return(
            <ShadowedCard>
                <CCardHeader>
                    <div className="m-2">
                        <h4>Tasa de Respuestas por cada materia</h4>
                        <p className="text-medium-emphasis">
                            Visualiza las tasas de respuesta por cada materia dictada
                        </p>
                    </div>
                </CCardHeader>
                <CCardBody>
                    
                    <CRow className="g-4 justify-content-center">
                        {estadisticas && MostrarCardEstadisticas(estadisticas)}
                    </CRow>
                </CCardBody>
            </ShadowedCard>
    )
}