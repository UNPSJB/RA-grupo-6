import React, { useState } from 'react';

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
            tipo: "abierta" 
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
                setMensaje(`Pregunta guardada con éxito, ID: ${data.id}`);
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
            <h2>Crear Nueva Pregunta Abierta</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="texto-pregunta">Ingresar pregunta:</label>
                    <textarea
                        id="texto-pregunta"
                        value={texto}
                        onChange={(e) => setTexto(e.target.value)}
                        placeholder="Ingresar nueva pregunta para el formulario."
                        rows={4}
                        style={{ width: '100%', marginTop: '8px' }}
                    />
                </div>
                <button type="submit" style={{ marginTop: '10px' }}>
                    Guardar Pregunta
                </button>
            </form>

            {mensaje && <p style={{ marginTop: '15px' }}>{mensaje}</p>}
        </div>
    );
}

export default CrearPreguntaAbierta;
