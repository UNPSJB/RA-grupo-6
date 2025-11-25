from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from src.RespuestasFormulario import schemas, exceptions
from src.RespuestasFormulario.models import RespuestasFormulario
from src.Respuesta.models import Respuesta
from src.Pregunta.models import Pregunta
from src.Instrumento.models import Instrumento
from src.Opciones.models import Opcion
import json

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
    formulario = db.scalar(
        select(RespuestasFormulario)
        .options(
            joinedload(RespuestasFormulario.respuestas).joinedload(Respuesta.pregunta),
            joinedload(RespuestasFormulario.respuestas).joinedload(Respuesta.opcion),
            joinedload(RespuestasFormulario.instrumento).joinedload(Instrumento.materia)
        )
        .where(RespuestasFormulario.id == respuestas_formulario_id)
    )

    if not formulario:
        return None

    # Obtener los datos de la tabla general si existen
    datos_tabla = None
    if formulario.datos:
        try:
            datos_tabla = json.loads(formulario.datos) if isinstance(formulario.datos, str) else formulario.datos
        except:
            datos_tabla = None

    respuestas_formulario = {
        "id": formulario.id,
        "fecha_envio": formulario.fecha_envio,
        "instrumento_id": formulario.instrumento_id,
        "usuario_id": formulario.usuario_id,
        "datos": datos_tabla,
        "respuestas": [
            {
                "id": respuesta.id,
                "pregunta_id": respuesta.pregunta_id,
                "opcion_id": respuesta.opcion_id,
                "texto_respuesta": respuesta.texto,
                "instancia_respuesta": respuesta.instancia_respuesta,
                "pregunta": {
                    "id": respuesta.pregunta.id,
                    "tipo": respuesta.pregunta.tipo,
                    "texto": respuesta.pregunta.texto,
                    "multiple_respuestas": respuesta.pregunta.multiple_respuestas,
                    "grupo_cuadro_id": respuesta.pregunta.grupo_cuadro_id,
                    "orden_en_grupo": respuesta.pregunta.orden_en_grupo,
                    "obligatoria": respuesta.pregunta.obligatoria,
                } if respuesta.pregunta else None,
                "opcion": {
                    "id": respuesta.opcion.id,
                    "texto": respuesta.opcion.texto
                } if respuesta.opcion else None,
            }
            for respuesta in formulario.respuestas
        ],
        "materia": {
            "id": formulario.instrumento.materia.id,
            "nombre": formulario.instrumento.materia.nombre,
        } if formulario.instrumento and formulario.instrumento.materia else None,
    }

    return {"respuestas_formulario": respuestas_formulario}

def buscar_respuestas_formulario(db: Session, instrumento_id: int = None, usuario_id: int = None):
    from sqlalchemy import select, and_
    from sqlalchemy.orm import joinedload
    
    query = select(RespuestasFormulario)
    
    conditions = []
    if instrumento_id:
        conditions.append(RespuestasFormulario.instrumento_id == instrumento_id)
    if usuario_id:
        conditions.append(RespuestasFormulario.usuario_id == usuario_id)
    
    if conditions:
        query = query.where(and_(*conditions))
    
    formularios = db.scalars(
        query.options(
            joinedload(RespuestasFormulario.instrumento).joinedload(Instrumento.materia),
            joinedload(RespuestasFormulario.instrumento).joinedload(Instrumento.plantilla_formulario),
            joinedload(RespuestasFormulario.usuario),
            joinedload(RespuestasFormulario.respuestas).joinedload(Respuesta.pregunta)
        )
    ).unique().all()
    
    resultado = []
    for form in formularios:
        # Parsear datos de tabla si existen
        datos_tabla = None
        if form.datos:
            try:
                datos_tabla = json.loads(form.datos) if isinstance(form.datos, str) else form.datos
            except:
                datos_tabla = None
        
        form_data = {
            "id": form.id,
            "fecha_envio": form.fecha_envio,
            "instrumento_id": form.instrumento_id,
            "usuario_id": form.usuario_id,
            "datos": datos_tabla,
            "materia": {
                "id": form.instrumento.materia.id,
                "nombre": form.instrumento.materia.nombre
            } if form.instrumento and form.instrumento.materia else None,
            "plantilla_formulario_id": form.instrumento.plantilla_formulario_id
            if form.instrumento else None,
            "tipo_instrumento": form.instrumento.tipo.value if form.instrumento else None
        }
        
        # Agregar información de código y nombre de materia si existen en las respuestas
        if form.respuestas:
            codigos_materias = []
            nombres_materias = []
            
            for respuesta in form.respuestas:
                if respuesta.pregunta:
                    if respuesta.pregunta.texto == "Código de actividad curricular" and respuesta.texto:
                        codigos_materias.append({
                            "instancia": respuesta.instancia_respuesta,
                            "codigo": respuesta.texto
                        })
                    elif respuesta.pregunta.texto == "Nombre de la actividad curricular" and respuesta.texto:
                        nombres_materias.append({
                            "instancia": respuesta.instancia_respuesta,
                            "nombre": respuesta.texto
                        })
            
            if codigos_materias:
                form_data["codigos_materias"] = codigos_materias
            if nombres_materias:
                form_data["nombres_materias"] = nombres_materias
        
        resultado.append(form_data)
    
    return resultado