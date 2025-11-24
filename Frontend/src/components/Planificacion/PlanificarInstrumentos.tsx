import { useEffect, useState } from "react";
import { Form} from "react-bootstrap";
import type { Parametros, PlantillaFormulario} from "../types";
import ModalExito from "../ModalEnvio";
import { CButton, CCardBody, CCardHeader, CCol, CFormLabel, CFormSelect, CRow } from "@coreui/react";
import ShadowedCard from "../coreui-components/ShadowedCard";

export function PlanificarPeriodos() {

    const [parametros, setParametros] = useState<Parametros>();
    const [modificacionesParametros, setModificacionesParametros] = useState<Parametros>();

    const [plantillasEstudiante, setPlantillasEstudiante] = useState<PlantillaFormulario[]>([])
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/formularios/rol/${1}`)
            .then(res => res.json())
            .then((data) =>  setPlantillasEstudiante(data))
            .catch(console.log);
    }, []);

    
    const [plantillasDocente, setPlantillasDocente] = useState<PlantillaFormulario[]>([])
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/formularios/rol/${2}`)
            .then(res => res.json())
            .then((data) =>  setPlantillasDocente(data))
            .catch(console.log);
    }, []);

    
    const [plantillasDepartamento, setPlantillasDepartamento] = useState<PlantillaFormulario[]>([])
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/formularios/rol/${3}`)
            .then(res => res.json())
            .then((data) =>  setPlantillasDepartamento(data))
            .catch(console.log);
    }, []);


    useEffect(() => {
        fetch("http://127.0.0.1:8000/Parametros/")
            .then(res => res.json())
            .then((data) => {
                setParametros(data);
                setModificacionesParametros(data);
            })
            .catch(console.log);
    }, []);

    const esBisiesto = (anio: number) =>
        (anio % 4 === 0 && anio % 100 !== 0) || anio % 400 === 0;

    const obtenerDiasDelMes = (mes: number, anio?: number) => {
        // if (!mes) return 31;
        const anioActual = anio || new Date().getFullYear();
        if (mes == 2) return esBisiesto(anioActual) ? 29 : 28;
        if ([4, 6, 9, 11].includes(mes)) return 30;
        return 31;
    };

    const formatearFecha = (fecha: any): string => {
        if (!fecha) return "";
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
        const dd = String(d.getUTCDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };


    const handleFechaChange = (campo: keyof Parametros, parte: "mes" | "dia", valor: string) => {
        if (!valor) return;

        const fechaActual = formatearFecha(modificacionesParametros?.[campo]) || `${new Date().getFullYear()}-01-01`;
        const partes = fechaActual.split("-");

        const anioActual = parseInt(partes[0]);

        if (parte === "mes") {
            partes[1] = valor;
            const maxDias = obtenerDiasDelMes(Number(valor), anioActual);
            const diaSeleccionado = parseInt(partes[2] || "1");
            partes[2] = String(Math.min(diaSeleccionado, maxDias)).padStart(2, "0");
        } else {
            const mesActual = partes[1] || "01";
            const maxDias = obtenerDiasDelMes(Number(mesActual), anioActual);
            partes[2] = String(Math.min(parseInt(valor), maxDias)).padStart(2, "0");
        }

        const nuevaFecha = `${partes[0]}-${partes[1]}-${partes[2]}`;

        setModificacionesParametros({
            ...modificacionesParametros!,
            [campo]: nuevaFecha,
        });
    };

    const renderOpcionesDias = (mes: number, campo?: keyof Parametros) => {
        let anioActual = new Date().getFullYear();

        if (campo && modificacionesParametros?.[campo]) {
            const fechaStr = formatearFecha(modificacionesParametros[campo]);
            if (fechaStr) {
                anioActual = parseInt(fechaStr.split("-")[0]);
            }
        }
        
        const maxDias = obtenerDiasDelMes(mes, anioActual);
        // const opciones = [<option key="empty" value="">Día</option>];
        let opciones = []

        let i = 1

        if (modificacionesParametros){
                let fechaInicio
                let fechaCierre

                if (campo == "cierre_primer_dictado"){
                    fechaInicio = new Date(modificacionesParametros.inicio_primer_dictado)
                    fechaCierre = new Date(modificacionesParametros.cierre_primer_dictado)
                    
                }
                if (campo == "cierre_segundo_dictado"){
                    fechaInicio = new Date(modificacionesParametros.inicio_segundo_dictado)
                    fechaCierre = new Date(modificacionesParametros.cierre_segundo_dictado)
                    
                }

                if (fechaInicio && fechaCierre && (fechaInicio.getUTCMonth() == fechaCierre.getUTCMonth())){
                    i = fechaInicio.getUTCDate();                 
                }

        }

        for (i; i <= maxDias; i++) {
            opciones.push(
                <option key={i} value={i}>
                    {i}
                </option>
            );
        }
        return opciones;
    };



    function actualizarParametros(parametros : Parametros): Promise<boolean>{
        return new Promise((resolve) => {
            if(parametros.inicio_primer_dictado && parametros.cierre_primer_dictado && parametros.inicio_segundo_dictado &&
            parametros.cierre_segundo_dictado && parametros.plantilla_estudiante && parametros.plantilla_docente &&
            parametros.plantilla_departamento && parametros.disponibilidad_estudiante && parametros.disponibilidad_docente && parametros.disponibilidad_departamento
            ){
                fetch("http://localhost:8000/Parametros/actualizar/", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parametros),
                })
                .then(res => {
                    if(res.ok) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(() => resolve(false));
            } else {
                resolve(false);
            }
        });
    }

    const meses = [
        { valor: "1", nombre: "Enero" },
        { valor: "2", nombre: "Febrero" },
        { valor: "3", nombre: "Marzo" },
        { valor: "4", nombre: "Abril" },
        { valor: "5", nombre: "Mayo" },
        { valor: "6", nombre: "Junio" },
        { valor: "7", nombre: "Julio" },
        { valor: "8", nombre: "Agosto" },
        { valor: "9", nombre: "Septiembre" },
        { valor: "10", nombre: "Octubre" },
        { valor: "11", nombre: "Noviembre" },
        { valor: "12", nombre: "Diciembre" }
    ];

    return (
            <ShadowedCard >
                <CCardHeader>
                    <div className="m-2">
                        <h4>Parametrización de los dictados</h4>
                        <p className="text-medium-emphasis">Configure los dictados para su asignación automática</p>
                    </div>
                </CCardHeader>
            
                <CCardBody className="m-2">
                    <CRow className="p-2" style={{ borderLeft: "3px solid #0d6efd" }}>

                    <h5 >Primer Dictado</h5>
                    
                    <CCol>
                        <CFormLabel className="text-muted">Fecha de inicio:</CFormLabel>
                            <div className="d-flex gap-2">
                                <CFormSelect
                                    value={(modificacionesParametros && (new Date(modificacionesParametros.inicio_primer_dictado)).getUTCMonth() + 1)}
                                    onChange={(e) => handleFechaChange("inicio_primer_dictado", "mes", e.target.value)}
                                >
                                    {meses.slice(0,6).map(m => (
                                        <option key={m.valor} value={m.valor}>{m.nombre}</option>
                                    ))}
                                </CFormSelect>

                                <CFormSelect
                                    value={(modificacionesParametros && (new Date(modificacionesParametros.inicio_primer_dictado)).getUTCDate())}
                                    onChange={(e) => handleFechaChange("inicio_primer_dictado", "dia", e.target.value)}
                                >
                                    {modificacionesParametros && renderOpcionesDias((new Date(modificacionesParametros.inicio_primer_dictado)).getUTCMonth() + 1, "inicio_primer_dictado")}
                                </CFormSelect>
                            </div>
                        </CCol>
                    <CCol>

                    <CFormLabel className="text-muted">Fecha de cierre:</CFormLabel>
                        <div className="d-flex gap-2">
                            <CFormSelect
                                value={(modificacionesParametros && (new Date(modificacionesParametros.cierre_primer_dictado)).getUTCMonth() + 1)}
                                onChange={(e) => handleFechaChange("cierre_primer_dictado", "mes", e.target.value)}
                            >
                                {modificacionesParametros && meses.filter(m => Number(m.valor) >= (new Date(modificacionesParametros.inicio_primer_dictado).getUTCMonth() + 1)).map(m => (
                                    <option key={m.valor} value={m.valor}>{m.nombre}</option>
                                ))}
                            </CFormSelect>
                            
                            <CFormSelect
                                value={(modificacionesParametros && (new Date(modificacionesParametros.cierre_primer_dictado)).getUTCDate())}
                                onChange={(e) => handleFechaChange("cierre_primer_dictado", "dia", e.target.value)}
                            >
                                {modificacionesParametros && renderOpcionesDias((new Date(modificacionesParametros.cierre_primer_dictado)).getUTCMonth() + 1, "cierre_primer_dictado")}
                            </CFormSelect>
                        </div>
                    </CCol>
                    </CRow>

                    {/* Segundo dictado */}
                    <CRow className="p-2" style={{ borderLeft: "3px solid #198754" }}>
                    <h5>Segundo Dictado</h5>
                    <CCol>
                    <CFormLabel className="text-muted">Fecha de inicio:</CFormLabel>
                    <div className="d-flex gap-2">
                        <CFormSelect
                            value={(modificacionesParametros && (new Date(modificacionesParametros.inicio_segundo_dictado)).getUTCMonth() + 1)}
                            onChange={(e) => handleFechaChange("inicio_segundo_dictado", "mes", e.target.value)}
                        >
                            {meses.slice(6,12).map(m => (
                                <option key={m.valor} value={m.valor}>{m.nombre}</option>
                            ))}
                        </CFormSelect>
                        <CFormSelect
                            value={(modificacionesParametros && (new Date(modificacionesParametros.inicio_segundo_dictado)).getUTCDate())}
                            onChange={(e) => handleFechaChange("inicio_segundo_dictado", "dia", e.target.value)}
                        >
                            { modificacionesParametros && renderOpcionesDias((new Date(modificacionesParametros.inicio_segundo_dictado)).getUTCMonth() + 1, "inicio_segundo_dictado")}
                        </CFormSelect>
                    </div>
                    </CCol>
                    <CCol>

                    <CFormLabel className="text-muted">Fecha de cierre:</CFormLabel>
                    <div className="d-flex gap-2">
                        <CFormSelect
                            value={(modificacionesParametros && (new Date(modificacionesParametros.cierre_segundo_dictado)).getUTCMonth() + 1)}
                            onChange={(e) => handleFechaChange("cierre_segundo_dictado", "mes", e.target.value)}
                        >
                            {modificacionesParametros && meses.slice((new Date(modificacionesParametros?.inicio_segundo_dictado)).getUTCMonth(), 12).map(m => (
                                    <option key={m.valor} value={m.valor}>{m.nombre}</option>
                                ))}
                        </CFormSelect>

                        <CFormSelect
                            value={(modificacionesParametros && (new Date(modificacionesParametros.cierre_segundo_dictado)).getUTCDate())}
                            onChange={(e) => handleFechaChange("cierre_segundo_dictado", "dia", e.target.value)}
                        >
                            {modificacionesParametros && renderOpcionesDias((new Date(modificacionesParametros.inicio_segundo_dictado)).getUTCMonth()+ 1, "cierre_segundo_dictado")}
                        </CFormSelect>
                    </div>
                    </CCol>
                    </CRow>

                    {/* Plantillas */}
                    <CRow className="p-2" style={{ borderLeft: "3px solid #dc3545" }}>
                    <h5 >Plantillas</h5>
                    <CCol >
                        <CFormLabel className="text-muted"> Plantilla del estudiante</CFormLabel>
                        <CFormSelect
                            value={modificacionesParametros?.plantilla_estudiante}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const plantillaSeleccionada = plantillasEstudiante?.find(p => p.id === selectedId);

                                if (plantillaSeleccionada) {
                                setModificacionesParametros({
                                    ...modificacionesParametros!,
                                    plantilla_estudiante: plantillaSeleccionada.id,
                                    obj_plantilla_estudiante: plantillaSeleccionada
                                });
                                }
                            }}
                        >
                            <option value="0" disabled>Seleccione una plantilla.. </option>
                            {plantillasEstudiante?.map((plantilla) => (
                                <option key={plantilla.id} value={String(plantilla.id)}>{plantilla.titulo}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol >
                        <CFormLabel className="text-muted"> Plantilla del docente</CFormLabel>
                        <CFormSelect
                            value={modificacionesParametros?.plantilla_docente}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const plantillaSeleccionada = plantillasDocente?.find(p => p.id === selectedId);

                                if (plantillaSeleccionada) {
                                setModificacionesParametros({
                                    ...modificacionesParametros!,
                                    plantilla_docente: plantillaSeleccionada.id,
                                    obj_plantilla_docente: plantillaSeleccionada
                                });
                                }
                            }}>
                            <option value="0" disabled>Seleccione una plantilla.. </option>
                            {plantillasDocente?.map((plantilla) => (
                                <option key={plantilla.id} value={String(plantilla.id)}>{plantilla.titulo}</option>
                            ))}
                        </CFormSelect>
                    </CCol>

                    <CCol >
                        <CFormLabel className="text-muted"> Plantilla del departamento</CFormLabel>
                        <CFormSelect value={modificacionesParametros?.plantilla_departamento}   
                        onChange={(e) => {
                            const selectedId = Number(e.target.value);
                            const plantillaSeleccionada = plantillasDepartamento?.find(p => p.id === selectedId);

                            if (plantillaSeleccionada) {
                            setModificacionesParametros({
                                ...modificacionesParametros!,
                                plantilla_departamento: plantillaSeleccionada.id,
                                obj_plantilla_departamento: plantillaSeleccionada
                            });
                            }
                        }}>
                            <option value="0" disabled>Seleccione una plantilla.. </option>
                            {plantillasDepartamento?.map((plantilla) => (
                                <option key={plantilla.id} value={String(plantilla.id)}>{plantilla.titulo}</option>
                            ))}
                        </CFormSelect>
                    </CCol>
                    </CRow>


                    {/* Disponibilidad */}
                    <CRow className="p-2" style={{ borderLeft: "3px solid #ffc107" }}>
                    <h5>Disponibilidad de Formularios</h5>
                    {["estudiante", "docente", "departamento"].map((tipo) => {
                    const key = `disponibilidad_${tipo}` as keyof Parametros;
                    return (
                        <CCol key={tipo} className="d-flex justify-content-center flex-column">
                            <CFormLabel>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</CFormLabel>
                            <Form.Control
                                type="number"
                                min={0}
                                max={30}
                                placeholder="Cantidad de dias"
                                value={String(modificacionesParametros?.[key] ?? "")}
                                onChange={(e) => {
                                    const value = Number(e.target.value);
                                    if (value <= 30) {
                                        setModificacionesParametros({
                                            ...modificacionesParametros!,
                                            [key]: value,
                                        });
                                    }
                                }}
                            />
                        </CCol>
                    );
                    })}
                    </CRow>

                    <CRow className="justify-content-center mt-4 pt-4 border-top">
                        <CCol xs="auto">
                            <ModalExito 
                                onEnviar={() => modificacionesParametros ? actualizarParametros(modificacionesParametros) : Promise.resolve(false)}
                                onExito={() => setParametros(modificacionesParametros)}
                                desactivado={!modificacionesParametros}
                                textoBoton="Guardar configuración"
                                variante="success"
                                className="text-white"
                            />
                        </CCol>
                        <CCol xs="auto">
                            <CButton color="secondary" variant="outline" onClick={() => setModificacionesParametros(parametros)}>
                                Restablecer
                            </CButton>
                        </CCol>
                    </CRow>
                </CCardBody>

            
            </ShadowedCard>
    );
}