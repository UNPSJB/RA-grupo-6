from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from src.RespuestasFormulario import schemas, exceptions
from src.RespuestasFormulario.models import RespuestasFormulario
from src.Respuesta.models import Respuesta
from src.Pregunta.models import Pregunta
from src.Instrumento.models import Instrumento

def crear_respuestas_formulario(
    db: Session, 
    respuestas_formulario: schemas.RespuestasFormularioCreate
) -> schemas.RespuestasFormulario:

    _respuestas_formulario = RespuestasFormulario(
        **respuestas_formulario.model_dump()
    )
    db.add(_respuestas_formulario)
    db.commit()
    db.refresh(_respuestas_formulario)
    return _respuestas_formulario


def obtener_respuestas_formulario(db: Session, respuestas_formulario_id: int):
    formulario = db.scalar(select(RespuestasFormulario).where(RespuestasFormulario.id == respuestas_formulario_id))

    if not formulario:
        return None

    respuestas_formulario = {
        "id": formulario.id,
        "fecha_envio": formulario.fecha_envio,
        "instrumento_id": formulario.instrumento_id,
        "usuario_id": formulario.usuario_id,
        "respuestas": [
            {
                "id": respuesta.id,
                "pregunta_id": respuesta.pregunta_id,
                "opcion_id": respuesta.opcion_id,
                "texto_respuesta": respuesta.texto,
                "instancia_respuesta": respuesta.instancia_repuesta,
                "pregunta": {
                    "tipo": respuesta.pregunta.tipo,
                    "texto": respuesta.pregunta.texto,
                    "multiples_respuestas": respuesta.pregunta.multiple_respuestas,
                    "grupo_cuadro_id": respuesta.pregunta.grupo_cuadro_id,
                    "orden_en_grupo": respuesta.pregunta.orden_en_grupo,
                } if respuesta.pregunta else None,
                "opcion": {"texto": respuesta.opcion.texto} if respuesta.opcion else None,
            }
            for respuesta in formulario.respuestas
        ],
        "materia": {
            "id": formulario.instrumento.materia.id,
            "nombre": formulario.instrumento.materia.nombre,
        } if formulario.instrumento and formulario.instrumento.materia else None,
    }

    return {"respuestas_formulario": respuestas_formulario}
