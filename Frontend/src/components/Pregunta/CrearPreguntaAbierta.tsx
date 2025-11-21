import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import IngresarPregunta from './IngresarPregunta';
import { EnumTipoPregunta } from "../types";
import ElegirGrupoPregunta from '../GrupoPregunta/GrupoPregunta';
import ELegirRol from '../Rol/ElegirRol';
import ElegirGrupoCuadro from '../GrupoCuadro/ElegirGrupoCuadro';
import type { ErrorPreguntaAbierta } from '../types';
import { Row } from 'react-bootstrap';

type Props = {
    manejarPestania: () => void;
    refrescarPreguntas: () => void;
};

function CrearPreguntaAbierta({ manejarPestania, refrescarPreguntas}: Props) {
    const [texto, setTexto] = useState(''); 
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(0)
    const [rolSeleccionado, setRolSeleccionado] = useState<string>("");
    const [estadisticaSeleccionada, setEstadistica] = useState<boolean>(false);
    const [errores, setErrores] = useState<ErrorPreguntaAbierta>({});
    const [multiplesRespuestas, setMultiplesRespuestas] = useState<boolean>(false);



    const [grupoCuadroSeleccionado, setGrupoCuadroSeleccionado] = useState<number | null>(null)
    const [ordenEnGrupo, setOrdenEnGrupo] = useState<number>(1);
    const [obligatoria, setObligatoria] =useState<boolean>(false);

    const crearPregunta = (event: React.FormEvent) => {
        const nuevosErrores: ErrorPreguntaAbierta = {};
        event.preventDefault();

        let erroresTotales = 0;

        if (!texto.trim()){
            nuevosErrores.texto = "El texto de la pregunta es obligatorio";
            erroresTotales++;
        };
        if (grupoSeleccionado === 0){
            nuevosErrores.grupo = "Debes seleccionar un grupo";
            erroresTotales++;
        };
        if (!rolSeleccionado) {
            nuevosErrores.rol = "Debes seleccionar un rol";
            erroresTotales++;
    }

        setErrores(nuevosErrores);

        if (erroresTotales > 0) return;

        
        const nuevaPregunta = {
            texto: texto,
            tipo: EnumTipoPregunta.abierta,
            grupo_pregunta_id: grupoSeleccionado,
            rol_id: (rolSeleccionado),
            estadistica: estadisticaSeleccionada,
            multiple_respuestas: multiplesRespuestas,
            grupo_cuadro_id: grupoCuadroSeleccionado,
            orden_en_grupo: grupoCuadroSeleccionado? ordenEnGrupo: null,
            obligatoria: obligatoria
        };

        console.log("Payload que se envía:", nuevaPregunta);

        fetch("http://127.0.0.1:8000/preguntas/abierta",{
            method: "POST",
            headers:{ "Content-Type": "application/json" },
            body: JSON.stringify(nuevaPregunta),
        }).then(() =>{
            setTexto("");
            setRolSeleccionado("");
            setGrupoSeleccionado(0);
            setEstadistica(false);
            setMultiplesRespuestas(false);
            setGrupoCuadroSeleccionado(null);
            setOrdenEnGrupo(1);
            setObligatoria(false);
            setErrores({});
            refrescarPreguntas();
            manejarPestania();
        });
    };

      useEffect(() => {
        const nuevosErrores = { ...errores };
        let huboCambios = false;
    
        if (texto.trim() && nuevosErrores.texto) {
          delete nuevosErrores.texto;
          huboCambios = true;
        }
    
        if (grupoSeleccionado !== 0 && nuevosErrores.grupo) {
          delete nuevosErrores.grupo;
          huboCambios = true;
        }
    
        if (rolSeleccionado && nuevosErrores.rol) {
          delete nuevosErrores.rol;
          huboCambios = true;
        }
    
        if (huboCambios) {
          setErrores(nuevosErrores);
        }
      }, [texto, grupoSeleccionado, rolSeleccionado, errores]);
    

    const [tipoDato, setTipoDato] = useState("Texto")

    return (
        <>
            <div className="contenedor-scroll"style={{maxHeight: '400px', 
            overflowY: 'auto',  padding: '1.25rem'}}>
                <IngresarPregunta texto={texto} setTexto={setTexto} error={errores.texto} label={"Contenido de la pregunta"}/>
                <ElegirGrupoPregunta
                    selectedGrupo={grupoSeleccionado}
                    onChangeGrupo={setGrupoSeleccionado}
                    error={errores.grupo}
                />
                <ELegirRol selectedRol={rolSeleccionado} onChangeRol={setRolSeleccionado} error={errores.rol} />
                


                <Form.Group className='mb-3 text-start mt-3'>
                    <Form.Label className='fw-semibold mb-2'>Configuración</Form.Label>
                    <div className='d-flex flex-column gap-2'>

                    <div className='d-flex align-items-center justify-content-between border rounded p-2 px-3 shadow-sm'>
                        <div className='d-flex flex-column'>
                            <span className='fw-semibold' style={{fontSize: "0.9rem"}}>
                                Permite múltiples respuestas
                            </span>
                            <small className='text-muted' style={{fontSize: "0.75rem"}}>
                                Para cuadros con varias filas (ej: un docente por fila)
                            </small>
                        </div>
                        <Form.Check
                            type='switch'
                            id='switch-multiples-respuestas'
                            checked={multiplesRespuestas}
                            onChange={(e) => setMultiplesRespuestas(e.target.checked)}
                        />


                    </div>

                    <div className='d-flex align-items-center justify-content-between border rounded p-2 px-3 shadow-sm'>
                        <div className='d-flex flex-column'>
                            <span className='fw-semibold' style={{fontSize: "0.9rem"}}>
                                Respuesta obligatoria
                            </span>
                            <small className='text-muted' style={{fontSize: "0.75rem"}}>
                                La respuesta será requerida antes de continuar
                            </small>
                        </div>
                                            
                        <Form.Check
                            type='switch'
                            id='switch-pregunta-obligatoria'
                            checked={obligatoria}
                            onChange={(e) => setObligatoria(e.target.checked)}
                        />
                    </div>

                    <div className='d-flex flex-column gap-3 border rounded p-2 px-3 shadow-sm'>
                        
                        <Row className='d-flex align-items-center justify-content-between'>
                            <Col className='d-flex flex-column'>
                                <span className='fw-semibold' style={{fontSize: "0.9rem"}}>
                                    Tipo de respuesta
                                </span>
                                <small className='text-muted' style={{fontSize: "0.75rem"}}>
                                    Que tipo de respuesta se espera
                                </small>
                            </Col>
                            
                            <Col >
                                <Form.Select onChange={(e) => setTipoDato(e.target.value)}>
                                    <option value="Texto">Texto</option>
                                    <option value="Entero">Entero </option>
                                    <option value="Decimal">Decimal </option>
                                    <option value="Rango-entero">Rango entero</option>
                                    <option value="Rango-real">Rango decimal</option>
                                </Form.Select>
                            </Col>
                        </Row>


                        {(tipoDato == "Rango-entero" || tipoDato == "Rango-real") && 

                        <Row>
                            <Col className='text-muted'>
                                <Form>
                                    <Form.Control type="number" placeholder="Ingrese el valor minimo..." />
                                </Form>
                            </Col>

                            <Col className='text-muted'>
                                <Form>
                                    <Form.Control type="number" placeholder="Ingrese el valor maximo..." />
                                </Form>
                            </Col>
                        </Row>
                        }

                    </div>


                    </div>

                </Form.Group>

                <ElegirGrupoCuadro seleccionarGrupo={grupoCuadroSeleccionado} cambiarGrupo={setGrupoCuadroSeleccionado}/>

                {grupoCuadroSeleccionado && (
                    <Form.Group className='mb-3 text-start'>
                        <Form.Label className='fw-semibold'>Orden en el grupo</Form.Label>
                        <Form.Control
                            type='number'
                            min={0}
                            value={ordenEnGrupo}
                            onChange={(e) => setOrdenEnGrupo(parseInt(e.target.value) || 0)}
                        />
                        <Form.Text className='text-muted'>
                            Define el orden de esta pregunta dentro del cuadro (0,1,2..)
                        </Form.Text>
                    </Form.Group>
                )}

                <Col className="d-flex justify-content-center">
                    <Button className="mt-3" type="submit" size="sm" onClick={crearPregunta}>
                    Crear Pregunta
                    </Button>
                </Col>
            </div>    
        </>
    );
}

export default CrearPreguntaAbierta;
