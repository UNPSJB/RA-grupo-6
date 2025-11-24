import type { InstrumentoDetail } from "../types";
import { useEffect, useState, useRef } from "react";
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CTable } from "@coreui/react";
import { obtenerFilas } from "./DatosInstrumento";


type Props = {
    instrumento: InstrumentoDetail;
    onDatosListos?: (datos: any[], preguntaId: number | null) => void;
};

export function DatosInstrumentoSintetico({ instrumento, onDatosListos }: Props) {
    const [filas, setFilas] = useState<any[][]>([]);
    const [datosCompletos, setDatosCompletos] = useState<any[]>([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [preguntaInfoGeneralId, setPreguntaInfoGeneralId] = useState<number | null>(null);
    const [cargando, setCargando] = useState(true);
    const cargaYaRealizadaRef = useRef(false);
    const MATERIAS_VISTA_PREVIA = 3;

    useEffect(() => {
        if (cargaYaRealizadaRef.current) {
            return;
        }

        const cargarDatos = async () => {
            try {
                setCargando(true);
                cargaYaRealizadaRef.current = true;

                const responsePregunta = await fetch(
                    `http://127.0.0.1:8000/preguntas/preparar-pregunta-info-general/${instrumento.id}`,
                    { method: 'POST' }
                );
                
                let idPregunta: number | null = null;
                if (responsePregunta.ok) {
                    const resultadoPregunta = await responsePregunta.json();
                    if (resultadoPregunta.pregunta_id) {
                        idPregunta = resultadoPregunta.pregunta_id;
                        setPreguntaInfoGeneralId(idPregunta);
                        console.log('Pregunta de información general lista:', idPregunta);
                    }
                } else {
                    console.error('Error al crear pregunta:', responsePregunta.status);
                }

                const response = await fetch(
                    `http://127.0.0.1:8000/instrumentos/ObtenerDatosInstrumentoSintetico/${instrumento.id}`
                );
                
                if (!response.ok) {
                    throw new Error(`Error al obtener datos: ${response.status}`);
                }
                
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    setDatosCompletos(data);
                    const todasLasFilas = data.map(obj => obtenerFilas(obj));
                    setFilas(todasLasFilas);

                
                    if (onDatosListos) {
                        onDatosListos(data, idPregunta);
                    }
                }
            } catch (error) {
                console.error('Error al cargar datos del instrumento sintético:', error);
                cargaYaRealizadaRef.current = false; 
            } finally {
                setCargando(false);
            }
        };

        cargarDatos();
    }, [instrumento.id]); 

    const filasVistaPrevias = filas.slice(0, MATERIAS_VISTA_PREVIA);
    const hayMasMaterias = filas.length > MATERIAS_VISTA_PREVIA;

    if (cargando) {
        return (
            <div className="mb-4 text-center">
                <div className="spinner-border" role="status" style={{ color: '#816767ff' }}>
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2 text-muted">Cargando información general...</p>
            </div>
        );
    }

    return (
        <>
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0" style={{ color: '#1f2937' }}>
                        <i className="fas fa-table me-2"></i>
                        Información General
                    </h5>
                    {hayMasMaterias && (
                        <CButton
                            color="primary"
                            variant="outline"
                            size="sm"
                            onClick={() => setMostrarModal(true)}
                        >
                            <i className="fas fa-expand-alt me-2"></i>
                            Ver tabla completa ({filas.length} materias)
                        </CButton>
                    )}
                </div>

                <CTable
                    striped
                    bordered
                    className="rounded-3 overflow-hidden"
                    style={{ tableLayout: "fixed" }}
                >
                    <thead>
                        <tr className="text-center">
                            <th
                                colSpan={filasVistaPrevias?.[0]?.length ?? 1}
                                style={{
                                    fontSize: "16px",
                                    backgroundColor: "#816767ff",
                                    color: "white",
                                }}
                            >
                                Vista previa ({MATERIAS_VISTA_PREVIA} de {filas.length} materias)
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {filasVistaPrevias.map((fila, i) => (
                            <tr key={i}>{fila}</tr>
                        ))}
                    </tbody>
                </CTable>


            </div>

            <CModal
                visible={mostrarModal}
                onClose={() => setMostrarModal(false)}
                size="xl"
            >
                <CModalHeader closeButton style={{ backgroundColor: "#816767ff", color: "white" }}>
                    <CModalTitle>
                        <i className="fas fa-table me-2"></i>
                        Información General Completa
                    </CModalTitle>
                </CModalHeader>

                <CModalBody>
                <div className="contenedor-scroll" style={{maxHeight: '400px', overflowY: 'auto', padding: '1.25rem'}}>
                    <CTable
                        striped
                        bordered
                        className="rounded-3 overflow-hidden"
                        style={{ tableLayout: "fixed" }}
                    >
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                            <tr className="text-center">
                                <th
                                    colSpan={filas?.[0]?.length ?? 1}
                                    style={{
                                        fontSize: "18px",
                                        backgroundColor: "#816767ff",
                                        color: "white",
                                    }}
                                >
                                    Todas las actividades curriculares ({filas.length})
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filas.map((fila, i) => (
                                <tr key={i}>{fila}</tr>
                            ))}
                        </tbody>
                    </CTable>
                </div>
                </CModalBody>

                <CModalFooter>
                    <CButton color="secondary" onClick={() => setMostrarModal(false)}>
                        Cerrar
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
}