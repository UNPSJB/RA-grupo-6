import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Materia = {
    id:string;
    nombre: string;
};

const url_base = 'http://127.0.0.1:8000/materias/'

const ElegirMateria = ({eleccion} : {eleccion : string}) =>{

    window.location.href =`/URL/${eleccion}`

}


function MateriaList(){

    const [materias, setMaterias] = useState<Materia[]>([])

    useEffect(() => {
        fetch(url_base)
        .then(response => response.json())
        .then((data) => setMaterias(data))
        .catch(error => console.log(error));
    }, []);

    return(
        <>
            <h1>Materias</h1>

            <ul className="list-group">
                {materias.map((materia) => (
                    <>
                        {/* <li className="list-group-item"> {materia.id} - {materia.nombre}</li>
                        <button className={materia.id}> Seleccionar materia </button> */}
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title">{materia.nombre}</h2>
                                <h5 className="card-subtitle"> Cod. {materia.id}</h5>
                                <div className="button-container">

                                    <button className="button-materia" onClick={() => ElegirMateria({eleccion: materia.id})}> Realizar informe</button>
                                </div>
                                {/* <a href="#" className="card-link"> Realizar informe </a> */}
                            </div>
                        </div>
                    </>
                ))}
                
            </ul>

        </>
        
    );

};

export function mostrarMateria(){

    return(

        <h1> Elegiste la materia ##### para hacer la encuesta </h1>
    
    )

}



export default MateriaList;

