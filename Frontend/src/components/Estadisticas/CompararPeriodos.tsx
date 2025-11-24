import { useEffect, useState } from "react";
import { CButton, CCol, CRow, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody,CCard, CCardHeader, CCardBody } from "@coreui/react";
import type { PlantillaFormulario } from "../types";
import ShadowedCard from "../coreui-components/ShadowedCard";

type EstadisticasPlantilla = {
    Titulo: string;
    CantPreguntas: number;
    CantObligatorias: number;
    Grupos: number;       
    TasaRespuestas: number;     
    Completitud: number;        
}

export function CompararPlantillas(){

    const [rol, setRol] = useState(1)
    const url_base = `http://127.0.0.1:8000/formularios/EstadisticasFormularios/rol_${rol}` 
    const url_base_mejor_plantilla= `http://127.0.0.1:8000/formularios/MejorPlantilla/rol_${rol}`
    const url_tasa_respuesta= `http://127.0.0.1:8000/formularios/TasaRespuestasPlantillas/rol_${rol}`

    const [estadisticas, setEstadisticas] = useState<EstadisticasPlantilla[]>([]);
    const [mejorPlantilla, setMejorPlantilla] = useState<PlantillaFormulario>()
    const [tasaRespuestas, setTasaRespuestas] = useState()


    const [activo, setActivo] = useState("1")
    const estiloBotonActivo = {backgroundColor: "#0d6efd", border: "none", color:"#ffffffff"}
    const estiloBotonInactivo = {backgroundColor: "#E8ECEF", border: "none", color:"#5A5B65"}

    useEffect(() => {
        fetch(url_base)
            .then(response => response.json())
            .then((data) => setEstadisticas(data))
            .catch(error => console.log(error));

        fetch(url_base_mejor_plantilla)
            .then(response => response.json())
            .then((data) => setMejorPlantilla(data))
            .catch(error => console.log(error));

        fetch(url_tasa_respuesta)
            .then(response => response.json())
            .then((data) => setTasaRespuestas(data))
            .catch(error => console.log(error));

    }, [rol]);

    return(
            <ShadowedCard>
                <CCardHeader>
                        <div className='m-2'>
                            <h4>Comparación de Estadísticas</h4>
                        </div>
                            
                        
                </CCardHeader>
                <CCardHeader >
                    <CButton className='m-1' color={activo === "1" ? "primary" : "outline-primary" } onClick={() => {setRol(1); setActivo("1")}}>Estudiantes</CButton>
                    <CButton className='m-1' color={activo === "2" ? "primary" : "outline-primary"} onClick={() => {setRol(2); setActivo("2")}}>Docentes</CButton>
                    <CButton className='m-1' color={activo === "3" ? "primary" :  "outline-primary"} onClick={() => {setRol(3); setActivo("3")}}>Departamento</CButton>
                </CCardHeader>
                <CCardBody>

                    <CCard className="mb-4">
                        
                        
                        <CCardHeader>
                            <h5 className="mb-0">Resumen General</h5>
                        </CCardHeader>
                        <CCardBody>
                            
                            <CRow className="g-3 text-center">
                                
                                <CCol md={4}>
                                    <div className="p-3 border rounded h-100">
                                        <i className="fa-regular fa-file-lines text-primary" style={{fontSize: "2rem", marginBottom: "10px"}}></i>
                                        <p className="mb-0 text-medium-emphasis fw-bold">Total de plantillas</p>
                                        <p className="mb-0 fs-4 fw-semibold">{estadisticas.length}</p>
                                    </div>
                                </CCol>
                                <CCol md={4}>
                                    <div className="p-3 border rounded h-100">
                                        <i className="fa-solid fa-star text-warning" style={{fontSize: "2rem", marginBottom: "10px"}}></i>
                                        <p className="mb-0 text-medium-emphasis fw-bold">Mejor plantilla</p>
                                        <p className="mb-0 fs-5 fw-semibold">{mejorPlantilla? mejorPlantilla.titulo : "-"}</p>
                                    </div>
                                </CCol>
                                <CCol md={4}>
                                    <div className="p-3 border rounded h-100">
                                        <i className="fa-solid fa-chart-simple text-success" style={{fontSize: "2rem", marginBottom: "10px"}}></i>
                                        <p className="mb-0 text-medium-emphasis fw-bold">Tasa promedio de respuestas</p>
                                        <p className="mb-0 fs-4 fw-semibold"> {(tasaRespuestas? tasaRespuestas * 100 : 0)? (tasaRespuestas? tasaRespuestas * 100 : 0).toFixed(2) : "-"} %</p>
                                    </div>
                                </CCol>
                            </CRow>
                        </CCardBody>
                    </CCard>

                    <CCard>
                        <CCardHeader>
                            <h5 className="mb-0">Métricas por Plantilla</h5>
                        </CCardHeader>
                        <CCardBody>
                            <CTable responsive="sm" hover>
                                <CTableHead>
                                    <CTableRow className="text-center">
                                        <CTableHeaderCell> <i className="fa-solid fa-clipboard-list text-medium-emphasis"></i> Plantilla</CTableHeaderCell>
                                        <CTableHeaderCell> <i className="fa-regular fa-circle-question text-medium-emphasis"></i> <br /> Preguntas</CTableHeaderCell>
                                        <CTableHeaderCell> <i className="fa-solid fa-circle-exclamation text-medium-emphasis"></i> <br />Obligatorias</CTableHeaderCell>
                                        <CTableHeaderCell> <i className="fa-solid fa-layer-group text-medium-emphasis"></i> <br /> Secciones</CTableHeaderCell>
                                        <CTableHeaderCell> <i className="fa-light fa-percent text-medium-emphasis"> </i> <br />  Tasa respuestas</CTableHeaderCell>
                                        <CTableHeaderCell> <i className="fa-regular fa-circle-check text-medium-emphasis"></i> <br /> Completitud</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                        {estadisticas.length > 0? estadisticas.map((plantilla, indice) => (
                            <tr key={indice}>
                            <td className="text-center"> {plantilla.Titulo}</td>
                            <td className="text-center"> {plantilla.CantPreguntas}</td>
                            <td className="text-center"> {plantilla.CantObligatorias}</td>
                            <td className="text-center"> {plantilla.Grupos}</td>
                            <td className="text-center"> {(plantilla.TasaRespuestas * 100)?  (plantilla.TasaRespuestas * 100).toFixed(2) : "-"}  % </td>
                            <td className="text-center"> {(plantilla.Completitud * 100)? (plantilla.Completitud * 100).toFixed(2) : "-"} %</td>
                            </tr>
                        ))
                        :
                            <>
                                <tr key={0}>
                                <td className="text-center"> - </td>
                                    <td className="text-center"> - </td>
                                    <td className="text-center"> - </td>
                                    <td className="text-center"> - </td>
                                    <td className="text-center"> - % </td>
                                    <td className="text-center"> - %</td>
                                </tr>
                            </>
                                }
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCardBody>
            </ShadowedCard>
    )

}