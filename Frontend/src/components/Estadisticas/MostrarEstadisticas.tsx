import { useEffect, useState } from "react";
import { CCol, CContainer, CRow, CCard, CCardBody, CCardHeader } from "@coreui/react";
import { CardCantRespondidos } from "./CardCantRespondidos";

export interface EstadisticasDictado {
    Respondidas_Alumno: number;
    Asignadas_Alumno: number;
    Respondidas_Docente: number;
    Asignadas_Docente: number;
    Respondidas_Departamento: number;
    Asignadas_Departamento: number;
}


export function MostrarEstadisticas(){

    const url_base = "http://127.0.0.1:8000/Dictados/CantidadRespuestas" 

    const [estadisticas, setEstadisticas] = useState<EstadisticasDictado>()

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => setEstadisticas(data))
            .catch(error => console.log(error));
    }, []);

    const totalesRespondidos = estadisticas? (estadisticas.Respondidas_Alumno + estadisticas.Respondidas_Docente + estadisticas.Respondidas_Departamento) : 0
    const totalesAsignadas = estadisticas? (estadisticas.Asignadas_Alumno + estadisticas.Asignadas_Docente + estadisticas.Asignadas_Departamento) : 0

    return(
            <CCard>
                <CCardHeader>
                    <div className="m-2">
                        <h4>Tasa de Respuestas Totales</h4>
                        <p className="text-medium-emphasis">
                            Visualiza las tasas de respuesta por carrera, materia y año
                        </p>
                    </div>
                </CCardHeader>
                <CCardBody>
                    <CRow className="g-4 justify-content-center">
                        <CCol md={6} className="d-flex align-items-stretch">
                            <CardCantRespondidos titulo={"General"} totalesAsignadas={totalesAsignadas}  totalesRespondidos={totalesRespondidos}/>
                        </CCol>
                        <CCol md={6} className="d-flex align-items-stretch">
                            <CardCantRespondidos titulo={"Estudiantes"} totalesAsignadas={estadisticas? estadisticas.Asignadas_Alumno :0}  totalesRespondidos={estadisticas? estadisticas.Respondidas_Alumno :0}/>
                        </CCol>
                        <CCol md={6} className="d-flex align-items-stretch">
                            <CardCantRespondidos titulo={"Docentes"} totalesAsignadas={estadisticas? estadisticas.Asignadas_Docente :0}  totalesRespondidos={estadisticas? estadisticas.Respondidas_Docente :0}/>
                        </CCol>
                        <CCol md={6} className="d-flex align-items-stretch">
                            <CardCantRespondidos titulo={"Departamentos"} totalesAsignadas={estadisticas? estadisticas.Asignadas_Departamento :0}  totalesRespondidos={estadisticas? estadisticas.Respondidas_Departamento :0}/>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
    )


}