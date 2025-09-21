import CrearPreguntaAbierta from "./CrearPreguntaAbierta";
import CrearPreguntaCerrada from "./CrearPreguntaCerrada";
import { useState } from "react";


function CrearPregunta({numero}:{numero : number}){


    const [opcion, cambiarOpcion] = useState(<CrearPreguntaAbierta/>);

    return(

    <>
        <div className={`pregunta-${numero}`}>
            <input type="radio" className='tipo-pregunta' name={`tipo-pregunta-${numero}`} id='pregunta-abierta' defaultChecked={true} onChange={() => cambiarOpcion(<CrearPreguntaAbierta/>)}/>
            <label htmlFor="pregunta-abierta"> Abierta </label>

            <input type="radio" className='tipo-pregunta' name={`tipo-pregunta-${numero}`} id='pregunta-cerrada' onChange={() => cambiarOpcion(<CrearPreguntaCerrada/>)} />
            <label htmlFor="pregunta-cerrada"> Cerrada </label>
        </div>

        {opcion}

    </>

    )

}


export default CrearPregunta;