import { useEffect, useState } from "react";
import { Form, Alert } from "react-bootstrap";
import { CButton, CCardBody, CCardHeader, CCol, CFormLabel, CFormSelect, CRow, CFormInput } from "@coreui/react";
import ShadowedCard from "../coreui-components/ShadowedCard";
import ModalExito from "../ModalEnvio";
import { esTipoRespuestaValido, formatearFecha, getFecha, parsearStringFecha } from "../Funciones";
import { TipoRespuesta } from "../types";


interface Parametros {
    inicio_primer_dictado: string;
    cierre_primer_dictado: string;
    inicio_segundo_dictado: string;
    cierre_segundo_dictado: string;

    plantilla_estudiante_basico: number;
    plantilla_estudiante_superior: number;
    plantilla_docente: number;
    plantilla_departamento: number;

    disponibilidad_estudiante: number;
    disponibilidad_docente: number;
    disponibilidad_departamento: number;
}

interface PlantillaFormulario {
    id: number;
    titulo: string;
    ciclo?: string;
}

export function PlanificarPeriodos() {
    const [parametros, setParametros] = useState<Parametros>();
    const [modificacionesParametros, setModificacionesParametros] = useState<Parametros>();
    const [errorValidacion, setErrorValidacion] = useState<string>("");
    const [plantillasEstudianteBasico, setPlantillasEstudianteBasico] = useState<PlantillaFormulario[]>([]);
    const [plantillasEstudianteSuperior, setPlantillasEstudianteSuperior] = useState<PlantillaFormulario[]>([]);
    const [plantillasDocente, setPlantillasDocente] = useState<PlantillaFormulario[]>([]);
    const [plantillasDepartamento, setPlantillasDepartamento] = useState<PlantillaFormulario[]>([]);

    const anioActual = (new Date().getUTCFullYear()) + 1


    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const [estBasico, estSuperior, doc, dep] = await Promise.all([
                    fetch("http://127.0.0.1:8000/formularios/rol/1?ciclo=CICLO_BASICO").then(r => r.json()),
                    fetch("http://127.0.0.1:8000/formularios/rol/1?ciclo=CICLO_SUPERIOR").then(r => r.json()),
                    fetch("http://127.0.0.1:8000/formularios/rol/2").then(r => r.json()),
                    fetch("http://127.0.0.1:8000/formularios/rol/3").then(r => r.json())
                ]);

                setPlantillasEstudianteBasico(estBasico);
                setPlantillasEstudianteSuperior(estSuperior);
                setPlantillasDocente(doc);
                setPlantillasDepartamento(dep);

                const paramsRes = await fetch("http://127.0.0.1:8000/Parametros/");
                const paramsData = await paramsRes.json();

                setParametros(paramsData);
                setModificacionesParametros(paramsData);

            } catch (e) {
                console.error("Error al cargar datos iniciales:", e);
                setErrorValidacion("Error de conexión al cargar los datos.");
            }
        };

        cargarDatos();
    }, []);

    const handleFechaChange = (campo: keyof Parametros, valor: string) => {
        if (!modificacionesParametros) return;

        let modificaciones = { ...modificacionesParametros, [campo]: valor }

        if (campo === "inicio_primer_dictado") {
            const inicio = parsearStringFecha(valor);
            const cierre = parsearStringFecha(modificacionesParametros?.cierre_primer_dictado);

            if (cierre <= inicio) {
                const nuevoCierre = new Date(inicio);
                nuevoCierre.setDate(inicio.getUTCDate() + 1);
                modificaciones = ({ ...modificaciones, ["cierre_primer_dictado"]: formatearFecha(nuevoCierre) });
            }
        }

        if (campo === "inicio_segundo_dictado") {
            const inicio = parsearStringFecha(valor);
            const cierre = parsearStringFecha(modificacionesParametros?.cierre_segundo_dictado);

            if (cierre <= inicio) {
                const nuevoCierre = new Date(inicio);
                nuevoCierre.setDate(inicio.getUTCDate() + 1);
                modificaciones = ({ ...modificaciones, ["cierre_segundo_dictado"]: formatearFecha(nuevoCierre) });
            }
        }

        setModificacionesParametros(modificaciones)
        setErrorValidacion("");
    };

    const handlePlantillaChange = (campo: keyof Parametros, valor: string) => {
        if (!modificacionesParametros) return;
        setModificacionesParametros({ ...modificacionesParametros, [campo]: Number(valor) });
    };

    const handleDisponibilidadChange = (campo: keyof Parametros, valor: string) => {
        if (!modificacionesParametros) return;
        const numVal = Number(valor);
        if (numVal >= 0 && numVal <= 60) {
            setModificacionesParametros({ ...modificacionesParametros, [campo]: numVal });
        }
    };

    const validarFechas = (): boolean => {
        if (!modificacionesParametros) return false;


        const inicio1 = parsearStringFecha(modificacionesParametros.inicio_primer_dictado);
        const cierre1 = parsearStringFecha(modificacionesParametros.cierre_primer_dictado);
        const inicio2 = parsearStringFecha(modificacionesParametros.inicio_segundo_dictado);
        const cierre2 = parsearStringFecha(modificacionesParametros.cierre_segundo_dictado);

        console.log(inicio1)

        const fechaInicioPrimDictado = (new Date(anioActual, 0, 1))
        return true;
        if (inicio1 < fechaInicioPrimDictado) {
            setErrorValidacion(`Error en 1° Dictado: La fecha de inicio debe ser mayor o igual a 01/01/${anioActual}`)
            return false;
        }

        if (cierre1 <= inicio1) {
            setErrorValidacion("Error en 1° Dictado: La fecha de cierre debe ser posterior al inicio.");
            return false;
        }

        const fechaCierrePrimDictado = (new Date(anioActual, 5, 30))
        if (cierre1 > fechaCierrePrimDictado) {
            setErrorValidacion(`Error en 1° Dictado: La fecha de cierre debe ser menor o igual a 30/06/${anioActual}`)
            return false;
        }

        const fechaInicioSegDictado = (new Date(anioActual, 5, 30))
        if (inicio2 < fechaInicioSegDictado) {
            setErrorValidacion(`Error en 2° Dictado: La fecha de inicio debe ser mayor a 30/06/${anioActual}`)
            return false;

        }

        if (cierre2 <= inicio2) {
            setErrorValidacion("Error en 2° Dictado: La fecha de cierre debe ser posterior al inicio.");
            return false;
        }

        const fechaCierreSegDictado = new Date(anioActual, 11, 31);
        if (cierre2 > fechaCierreSegDictado) {
            setErrorValidacion(`Error en 2° Dictado: La fecha de cierre debe ser menor a 31/12/${anioActual}`)
            return false;

        }

        return true;
    };


    const actualizarParametrosServidor = async () => {
        if (!validarFechas() || !modificacionesParametros) return false;

        try {
            const res = await fetch("http://127.0.0.1:8000/Parametros/actualizar/", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(modificacionesParametros),
            });

            if (res.ok) {
                const dataActualizada = await res.json();
                setParametros(dataActualizada);
                return true;
            } else {
                console.error("Error en respuesta del servidor");
                return false;
            }
        } catch (e) {
            console.error("Error de red:", e);
            return false;
        }
    };

    return (
        <ShadowedCard>
            <CCardHeader>
                <div className="m-2">
                    <h4>Parametrización de los dictados</h4>
                    <p className="text-medium-emphasis">
                        Configure los dictados para su asignación automática
                    </p>
                </div>
            </CCardHeader>

            <CCardBody className="m-2">
                {errorValidacion && <Alert variant="danger" className="mb-4">{errorValidacion}</Alert>}

                <CRow className="p-2" style={{ borderLeft: "3px solid #0d6efd" }}>
                    <h5>Primer Dictado</h5>
                    <CCol>
                        <CFormLabel className="text-muted">Fecha de inicio:</CFormLabel>
                        <CFormInput
                            type="date"
                            min={`${anioActual}-01-01`}
                            max={`${anioActual}-06-29`}
                            value={modificacionesParametros?.inicio_primer_dictado || ''}
                            onChange={(e) => { handleFechaChange('inicio_primer_dictado', e.target.value); validarFechas() }}
                        />
                    </CCol>
                    <CCol>
                        <CFormLabel className="text-muted">Fecha de cierre:</CFormLabel>
                        <CFormInput
                            type="date"
                            min={modificacionesParametros?.inicio_primer_dictado}
                            max={`${anioActual}-06-30`}
                            disabled={!(modificacionesParametros?.inicio_primer_dictado)}
                            value={modificacionesParametros?.cierre_primer_dictado || ''}
                            onChange={(e) => { handleFechaChange('cierre_primer_dictado', e.target.value); validarFechas() }}
                        />
                    </CCol>
                </CRow>

                <CRow className="p-2" style={{ borderLeft: "3px solid #198754" }}>
                    <h5>Segundo Dictado</h5>
                    <CCol>
                        <CFormLabel className="text-muted">Fecha de inicio:</CFormLabel>
                        <CFormInput
                            type="date"
                            min={`${anioActual}-07-01`}
                            max={`${anioActual}-12-30`}
                            value={modificacionesParametros?.inicio_segundo_dictado || ''}
                            onChange={(e) => { handleFechaChange('inicio_segundo_dictado', e.target.value); validarFechas() }}
                        />
                    </CCol>
                    <CCol>
                        <CFormLabel className="text-muted">Fecha de cierre:</CFormLabel>
                        <CFormInput
                            type="date"
                            min={modificacionesParametros?.inicio_segundo_dictado}
                            max={`${anioActual}-12-31`}
                            value={modificacionesParametros?.cierre_segundo_dictado || ''}
                            disabled={!(modificacionesParametros?.inicio_segundo_dictado)}
                            onChange={(e) => { handleFechaChange('cierre_segundo_dictado', e.target.value); validarFechas() }}
                        />
                    </CCol>
                </CRow>

                <CRow className="p-2" style={{ borderLeft: "3px solid #dc3545" }}>
                    <h5>Plantillas</h5>

                    <CCol>
                        <CFormLabel className="text-muted">Plantilla del estudiante (Básico)</CFormLabel>
                        <CFormSelect
                            value={modificacionesParametros?.plantilla_estudiante_basico}
                            onChange={(e) => handlePlantillaChange('plantilla_estudiante_basico', e.target.value)}
                        >
                            <option value="0" disabled>Seleccione una plantilla..</option>
                            {plantillasEstudianteBasico.map(p => (
                                <option key={p.id} value={p.id}>{p.titulo}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol>
                        <CFormLabel className="text-muted">Plantilla del estudiante (Superior)</CFormLabel>
                        <CFormSelect
                            value={modificacionesParametros?.plantilla_estudiante_superior}
                            onChange={(e) => handlePlantillaChange('plantilla_estudiante_superior', e.target.value)}
                        >
                            <option value="0" disabled>Seleccione una plantilla..</option>
                            {plantillasEstudianteSuperior.map(p => (
                                <option key={p.id} value={p.id}>{p.titulo}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol>
                        <CFormLabel className="text-muted">Plantilla del docente</CFormLabel>
                        <CFormSelect
                            value={modificacionesParametros?.plantilla_docente}
                            onChange={(e) => handlePlantillaChange('plantilla_docente', e.target.value)}
                        >
                            <option value="0" disabled>Seleccione una plantilla..</option>
                            {plantillasDocente.map(p => (
                                <option key={p.id} value={p.id}>{p.titulo}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol>
                        <CFormLabel className="text-muted">Plantilla del departamento</CFormLabel>
                        <CFormSelect
                            value={modificacionesParametros?.plantilla_departamento}
                            onChange={(e) => handlePlantillaChange('plantilla_departamento', e.target.value)}
                        >
                            <option value="0" disabled>Seleccione una plantilla..</option>
                            {plantillasDepartamento.map(p => (
                                <option key={p.id} value={p.id}>{p.titulo}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                </CRow>

                <CRow className="p-2" style={{ borderLeft: "3px solid #ffc107" }}>
                    <h5>Disponibilidad de Formularios</h5>

                    {['estudiante', 'docente', 'departamento'].map(tipo => {
                        const key = `disponibilidad_${tipo}` as keyof Parametros;
                        return (
                            <CCol key={tipo} className="d-flex justify-content-center flex-column">
                                <CFormLabel>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</CFormLabel>
                                <Form.Control
                                    type="number"
                                    min={1}
                                    max={60}
                                    placeholder="Cantidad de días"
                                    value={String(modificacionesParametros?.[key] ?? '')}
                                    onChange={(e) => handleDisponibilidadChange(key, e.target.value)}
                                />
                            </CCol>
                        );
                    })}
                </CRow>

                {/* BOTONES ACCIÓN */}
                <CRow className="justify-content-center mt-4 pt-4 border-top">
                    <CCol xs="auto">
                        <ModalExito
                            onEnviar={actualizarParametrosServidor}
                            onExito={() => setParametros(modificacionesParametros)}
                            desactivado={!modificacionesParametros || !validarFechas}
                            textoBoton="Guardar configuración"
                            variante="success"
                            className="text-white"
                        />
                    </CCol>
                    <CCol xs="auto">
                        <CButton
                            color="secondary"
                            variant="outline"
                            onClick={() => setModificacionesParametros(parametros)}
                        >
                            Restablecer
                        </CButton>
                    </CCol>
                </CRow>
            </CCardBody>
        </ShadowedCard>
    );
}