import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import IngresarPregunta from './IngresarPregunta';
import { EnumTipoPregunta } from "../types";
import ElegirGrupoPregunta from '../GrupoPregunta/GrupoPregunta';
import ELegirRol from '../Rol/ElegirRol';
import type { ErrorPreguntaAbierta } from '../types';

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
            rol_id: rolSeleccionado,
            estadistica: estadisticaSeleccionada,
        };

        
        fetch("http://127.0.0.1:8000/preguntas/abierta",{
            method: "POST",
            headers:{ "Content-Type": "application/json" },
            body: JSON.stringify(nuevaPregunta),
        }).then(() =>{
            setTexto("");
            setRolSeleccionado("");
            setGrupoSeleccionado(0);
            setEstadistica(false);
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
    
    return (
        <>
        <Form>
            <IngresarPregunta texto={texto} setTexto={setTexto} error={errores.texto} />
            <ElegirGrupoPregunta
                selectedGrupo={grupoSeleccionado}
                onChangeGrupo={setGrupoSeleccionado}
                error={errores.grupo}
            />
            <ELegirRol selectedRol={rolSeleccionado} onChangeRol={setRolSeleccionado} error={errores.rol} />
            
            <Col className="d-flex justify-content-center">
                <Button className="mt-3" type="submit" size="sm" onClick={crearPregunta}>
                Crear Pregunta
                </Button>
            </Col>
        </Form>

        </>
        
    );
}

export default CrearPreguntaAbierta;
