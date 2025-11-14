import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import type { Parametros, PlantillaFormulario} from "../types";
import ModalExito from "../ModalEnvio";

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

    const obtenerDiasDelMes = (mes: string, anio?: number) => {
        if (!mes) return 31;
        const mesNum = parseInt(mes);
        const anioActual = anio || new Date().getFullYear();
        if (mesNum === 2) return esBisiesto(anioActual) ? 29 : 28;
        if ([4, 6, 9, 11].includes(mesNum)) return 30;
        return 31;
    };

    const formatearFecha = (fecha: any): string => {
        if (!fecha) return "";
        const d = new Date(fecha);
        if (isNaN(d.getTime())) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };


    const handleFechaChange = (campo: keyof Parametros, parte: "mes" | "dia", valor: string) => {
        if (!valor) return;

        const fechaActual = formatearFecha(modificacionesParametros?.[campo]) || `${new Date().getFullYear()}-01-01`;
        const partes = fechaActual.split("-");

        const anioActual = parseInt(partes[0]);

        if (parte === "mes") {
            partes[1] = valor;
            const maxDias = obtenerDiasDelMes(valor, anioActual);
            const diaSeleccionado = parseInt(partes[2] || "1");
            partes[2] = String(Math.min(diaSeleccionado, maxDias)).padStart(2, "0");
        } else {
            const mesActual = partes[1] || "01";
            const maxDias = obtenerDiasDelMes(mesActual, anioActual);
            partes[2] = String(Math.min(parseInt(valor), maxDias)).padStart(2, "0");
        }

        const nuevaFecha = `${partes[0]}-${partes[1]}-${partes[2]}`;

        setModificacionesParametros({
            ...modificacionesParametros!,
            [campo]: nuevaFecha,
        });
    };

    const renderOpcionesDias = (mes: string, campo?: keyof Parametros) => {
        let anioActual = new Date().getFullYear();
        
        if (campo && modificacionesParametros?.[campo]) {
            const fechaStr = formatearFecha(modificacionesParametros[campo]);
            if (fechaStr) {
                anioActual = parseInt(fechaStr.split("-")[0]);
            }
        }
        
        const maxDias = obtenerDiasDelMes(mes, anioActual);
        const opciones = [<option key="empty" value="">Día</option>];
        for (let i = 1; i <= maxDias; i++) {
            opciones.push(
                <option key={i} value={String(i).padStart(2, "0")}>
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
        { valor: "01", nombre: "Enero" },
        { valor: "02", nombre: "Febrero" },
        { valor: "03", nombre: "Marzo" },
        { valor: "04", nombre: "Abril" },
        { valor: "05", nombre: "Mayo" },
        { valor: "06", nombre: "Junio" },
        { valor: "07", nombre: "Julio" },
        { valor: "08", nombre: "Agosto" },
        { valor: "09", nombre: "Septiembre" },
        { valor: "10", nombre: "Octubre" },
        { valor: "11", nombre: "Noviembre" },
        { valor: "12", nombre: "Diciembre" }
    ];

    return (
        <Container className="d-flex flex-column gap-5 pb-5">
            <Row>
                <h2>Parametrización de los dictados</h2>
                <p>Configure los dictados para su asignación automática</p>
            </Row>


            <Row className="p-2" style={{ borderLeft: "3px solid #0d6efd" }}>
                <h4 className="mb-4">Primer Dictado</h4>
                <Col>
                    <Form.Label className="text-muted">Fecha de inicio:</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.inicio_primer_dictado).split("-")[1] || ""}
                            onChange={(e) => handleFechaChange("inicio_primer_dictado", "mes", e.target.value)}
                        >
                            {meses.slice(0,6).map(m => (
                                <option key={m.valor} value={m.valor}>{m.nombre}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.inicio_primer_dictado).split("-")[2] || ""}
                            onChange={(e) => handleFechaChange("inicio_primer_dictado", "dia", e.target.value)}
                        >
                            {renderOpcionesDias(formatearFecha(modificacionesParametros?.inicio_primer_dictado).split("-")[1], "inicio_primer_dictado")}
                        </Form.Select>
                    </div>
                </Col>
                <Col>
                    <Form.Label className="text-muted">Fecha de cierre:</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.cierre_primer_dictado).split("-")[1] || ""}
                            onChange={(e) => handleFechaChange("cierre_primer_dictado", "mes", e.target.value)}
                        >
                            {meses.slice(Number(formatearFecha(modificacionesParametros?.inicio_primer_dictado).split("-")[1]) - 1, 6).map(m => (
                                <option key={m.valor} value={m.valor}>{m.nombre}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.cierre_primer_dictado).split("-")[2] || ""}
                            onChange={(e) => handleFechaChange("cierre_primer_dictado", "dia", e.target.value)}
                        >
                            {renderOpcionesDias(formatearFecha(modificacionesParametros?.cierre_primer_dictado).split("-")[1], "cierre_primer_dictado")}
                        </Form.Select>
                    </div>
                </Col>
            </Row>





            {/* Segundo dictado */}
            <Row className="p-2" style={{ borderLeft: "3px solid #198754" }}>
                <h4 className="mb-4">Segundo Dictado</h4>
                <Col>
                    <Form.Label className="text-muted">Fecha de inicio:</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.inicio_segundo_dictado).split("-")[1] || ""}
                            onChange={(e) => handleFechaChange("inicio_segundo_dictado", "mes", e.target.value)}
                        >
                            {meses.slice(6,12).map(m => (
                                <option key={m.valor} value={m.valor}>{m.nombre}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.inicio_segundo_dictado).split("-")[2] || ""}
                            onChange={(e) => handleFechaChange("inicio_segundo_dictado", "dia", e.target.value)}
                        >
                            {renderOpcionesDias(formatearFecha(modificacionesParametros?.inicio_segundo_dictado).split("-")[1], "inicio_segundo_dictado")}
                        </Form.Select>
                    </div>
                </Col>
                <Col>
                    <Form.Label className="text-muted">Fecha de cierre:</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.cierre_segundo_dictado).split("-")[1] || ""}
                            onChange={(e) => handleFechaChange("cierre_segundo_dictado", "mes", e.target.value)}
                        >
                            {meses.slice(Number(formatearFecha(modificacionesParametros?.inicio_segundo_dictado).split("-")[1]) - 1,12).map(m => (
                                <option key={m.valor} value={m.valor}>{m.nombre}</option>
                            ))}
                        </Form.Select>
                        <Form.Select
                            value={formatearFecha(modificacionesParametros?.cierre_segundo_dictado).split("-")[2] || ""}
                            onChange={(e) => handleFechaChange("cierre_segundo_dictado", "dia", e.target.value)}
                        >
                            {renderOpcionesDias(formatearFecha(modificacionesParametros?.cierre_segundo_dictado).split("-")[1], "cierre_segundo_dictado")}
                        </Form.Select>
                    </div>
                </Col>
            </Row>

            <Row className="p-2" style={{ borderLeft: "3px solid #dc3545" }}>
                <h4 className="mb-4">Plantillas</h4>
                    <Col >
                        <Form.Label className="text-muted"> Plantilla del estudiante</Form.Label>
                        <Form.Select
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
                        </Form.Select>
                    </Col>

                    <Col >
                        <Form.Label className="text-muted"> Plantilla del docente</Form.Label>
                        <Form.Select
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
                        </Form.Select>
                    </Col>

                    <Col >
                        <Form.Label className="text-muted"> Plantilla del departamento</Form.Label>
                        <Form.Select value={modificacionesParametros?.plantilla_departamento}   
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
                        </Form.Select>
                    </Col>
            </Row>

            <Row className="p-2" style={{ borderLeft: "3px solid #ffc107" }}>
                <h4 className="mb-4">Disponibilidad de Formularios</h4>
                {["estudiante", "docente", "departamento"].map((tipo) => {
                    const key = `disponibilidad_${tipo}` as keyof Parametros;
                    return (
                        <Col key={tipo} className="d-flex justify-content-center flex-column">
                            <Form.Label>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</Form.Label>
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
                        </Col>
                    );
                })}
            </Row>

            <Row className="d-flex align-items-center justify-content-center">
                <Col xs={3}>
                    <ModalExito 
                        onEnviar={() => modificacionesParametros ? actualizarParametros(modificacionesParametros) : Promise.resolve(false)}
                        onExito={() => setParametros(modificacionesParametros)}
                        desactivado={!modificacionesParametros}
                        textoBoton="Guardar configuración"
                        variante="success"
                        className=""
                    />
                </Col>
                <Col xs={1}>
                    <Button variant="outline-secondary" onClick={() => setModificacionesParametros(parametros)}>
                        Limpiar
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}