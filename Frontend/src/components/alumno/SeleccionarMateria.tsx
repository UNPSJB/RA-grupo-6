import React, { useState, useEffect } from 'react';

function SeleccionarMateria(){
    const [materias, setMaterias] = useState<any[]>([]);
    const [mensaje, setMensaje] = useState('');

    //materias de ejemplo
    const materiasEjemplo =
    [
        { id: "IF001", nombre: "Elementos de Informática" },
        { id: "MA045", nombre: "Álgebra" },
        { id: "IF002", nombre: "Expresión de Problemas y Algoritmos" },
    ];

    useEffect(() => {
        const cargarMaterias = async () => {
            try {//cargar desde el backend
                const response = await fetch('http://127.0.0.1:8000/'); //así sería el fetch? T_T
                
                if (response.ok){
                    const data = await response.json();
                    setMaterias(data);
                }
                else{
                    setMensaje('Error de conexión');
                    setMaterias(materiasEjemplo);//cargar ejemplos
                }
            } catch (error) {
                setMensaje('Error de conexión');
                console.error('Error de conexión', error);
                setMaterias(materiasEjemplo); //cargo ejemplos en el error
            }
        };
        cargarMaterias();
    }, []);

    const handleResponder = (materiaId: string, materiaNombre: string) => { 
        setMensaje(`Accediendo a encuesta`);
        //navegar hacia la pagina de la encuesta
    };

    return (
        <div className="bg-black text-white min-vh-100 p-4" style={{ width: '100%' }}>
            <h2 className="text-center mb-4">Materias cursadas</h2>
            
            {materias.map(materia => (
                <div key={materia.id} className="card bg-dark text-white mb-3 mx-auto" style={{ maxWidth: '500px' }}>
                    <div className="card-body text-center">
                        <h5 className="card-title">{materia.nombre}</h5>
                        <p className="card-text">Código: {materia.id}</p>
                        <button 
                            className="btn"
                            style={{ backgroundColor: '#6f42c1', color: 'white', border: 'none' }}
                            onClick={() => handleResponder(materia.id, materia.nombre)}
                        >
                            Responder encuesta
                        </button>
                    </div>
                </div>
            ))}
            
            {mensaje && <p className="text-center mt-3">{mensaje}</p>}
        </div>
    );
}

export default SeleccionarMateria;