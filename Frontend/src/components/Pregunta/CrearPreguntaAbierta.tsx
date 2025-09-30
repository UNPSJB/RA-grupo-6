import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import IngresarPregunta from './IngresarPregunta';

function CrearPreguntaAbierta() {
    const [texto, setTexto] = useState('');
    
    const [mensaje, setMensaje] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); 

        if (!texto.trim()) {
            setMensaje('Por favor, escriba el texto de la pregunta.');
            return;
        }
        
        const nuevaPregunta = {
            texto: texto,
            tipo: "Abierta" 
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/preguntas/abierta", {
                method: 'POST',
                headers: {
        
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaPregunta),
            });

            if (response.ok) {
                const data = await response.json();
                setMensaje(`Pregunta guardada con éxito`);
                setTexto(''); 
            } else {
                setMensaje('Error al guardar la pregunta.');
            }
        } catch (error) {
            setMensaje('Error de conexión. Verificar configuracion de backend...');
            console.error('Error de conexión:', error);
        }
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>

                <IngresarPregunta texto={texto} setTexto={setTexto}></IngresarPregunta>

                <Col className="d-flex justify-content-center">
                    <Button className="mt-3" variant='primary' type='submit'>Crear Pregunta</Button>
                </Col>
            </Form>

            {mensaje && <p style={{ marginTop: '15px' }}>{mensaje}</p>}
        </div>
    );
}

export default CrearPreguntaAbierta;
