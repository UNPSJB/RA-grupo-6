import { CCol, CRow, CCardBody, CCardHeader } from "@coreui/react";
import { GraficoRespondidos } from "../Graficos/GraficoRespondidos";

export function CardCantRespondidos({titulo, totalesRespondidos, totalesAsignadas} : {titulo: string, totalesRespondidos:number, totalesAsignadas: number}){

    return(
            <CCardBody className="col-sm h-100 border rounded">
                <CCardHeader>
                    <h6 className="mb-0 fw-bold">{titulo}</h6>
                </CCardHeader>
                <div className="d-flex justify-content-center">
                    <GraficoRespondidos titulo="" respondidos={totalesRespondidos} noRespondidos={totalesAsignadas - totalesRespondidos}/>
                </div>
                <hr className="mt-0 mb-0"/>
                <CCardBody>
                    <CRow>
                        <CCol className="col-sm text-center">
                            <p className="mb-0">
                                <span className="fw-bold text-success" style={{fontSize: '24px'}}>{totalesRespondidos}</span><br/> Respondidos
                            </p>
                        </CCol>

                        <CCol className="col-sm text-center">
                            <p className="mb-0">
                                <span className="fw-bold text-danger" style={{fontSize: '24px'}}>{totalesAsignadas - totalesRespondidos}</span> <br />Sin responder
                            </p>
                        </CCol>

                        <CCol className="col-sm text-center">
                            <p className="mb-0">
                                <span className="fw-bold" style={{fontSize: '24px'}}>{totalesAsignadas}</span> <br /> Total
                            </p>
                        </CCol>

                    </CRow>
                </CCardBody>

            </CCardBody>

    )

}