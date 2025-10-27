from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, exists

from src.Instrumento.models import Instrumento as InstrumentoModel, TipoInstrumento 
from src.Instrumento.schemas import InstrumentoParaListado
from src.database import get_db
from .schemas import InstrumentoDetalle, RespuestaDetalle
from src.RespuestasFormulario.models import RespuestasFormulario as RespuestasFormularioModel
from src.Respuesta.models import Respuesta as RespuestaModel
from fastapi import APIRouter, Depends, HTTPException, Query
router = APIRouter(prefix="/instrumentos", tags=["instrumentos"])

@router.get("/{tipo_instrumento}", response_model=List[InstrumentoParaListado])
def get_instrumentos_por_tipo(
    tipo_instrumento: str,
    usuario_id: int,
    mostrar_respondidos: bool = Query(False),
    db: Session = Depends(get_db)
):
    try:
        tipo_enum = TipoInstrumento(tipo_instrumento)
    except ValueError:
        # compatibilidad temporal con valores antiguos
        if tipo_instrumento == "ENCUESTA_DOCENTE":
            tipo_enum = TipoInstrumento.INFORME_CATEDRA
        else:
            raise HTTPException(status_code=400, detail=f"Tipo de instrumento inválido: {tipo_instrumento}")

    print(">>> tipo_instrumento recibido:", tipo_instrumento)
    print(">>> tipo_enum.value:", tipo_enum.value)

    todos = db.query(InstrumentoModel).all()
    print(">>> Todos los instrumentos en DB:", [(i.id, i.tipo) for i in todos])
    # FIX: comparar contra el .value, no contra el Enum
    query = db.query(InstrumentoModel).filter(
        InstrumentoModel.tipo == tipo_enum.value
    )

    if not mostrar_respondidos:
        tiene_respuesta = exists().where(
            and_(
                RespuestasFormularioModel.instrumento_id == InstrumentoModel.id,
                RespuestasFormularioModel.usuario_id == usuario_id
            )
        )
        query = query.filter(~tiene_respuesta)

    instrumentos = query.all()
    return instrumentos


@router.get("/{instrumento_id}/detail", response_model=InstrumentoDetalle)
def get_instrumento_detalle(instrumento_id: int, db: Session = Depends(get_db)):
    instrumento = db.query(InstrumentoModel).options(
        joinedload(InstrumentoModel.plantilla_formulario),
        joinedload(InstrumentoModel.respuestas_formulario)
            .joinedload(RespuestasFormularioModel.usuario),
        joinedload(InstrumentoModel.respuestas_formulario)
            .joinedload(RespuestasFormularioModel.respuestas)
            .joinedload(RespuestaModel.pregunta),
        joinedload(InstrumentoModel.respuestas_formulario)
            .joinedload(RespuestasFormularioModel.respuestas)
            .joinedload(RespuestaModel.opcion)
    ).filter(InstrumentoModel.id == instrumento_id).first()

    if not instrumento:
        raise HTTPException(status_code=404, detail="Instrumento no encontrado")

    if not instrumento.respuestas_formulario or len(instrumento.respuestas_formulario) == 0:
        return InstrumentoDetalle(
            id=instrumento.id,
            titulo_formulario=instrumento.titulo(),
            autor_nombre="Sin respuestas",
            fecha_completado=None,
            plantilla_formulario_id=instrumento.plantilla_formulario_id,
            respuestas=[],  # Lista vacía
            plantilla_formulario=instrumento.plantilla_formulario,
            respuestas_formulario=instrumento.respuestas_formulario,
            materia=instrumento.materia
        )
    
    respuestas_form = instrumento.respuestas_formulario[0] 
    
    respuestas_procesadas = [
        RespuestaDetalle(
            pregunta_texto=r.pregunta.texto,
            respuesta_texto=r.texto,
            opcion_seleccionada=r.opcion.texto if r.opcion else None
        ) for r in respuestas_form.respuestas
    ]
    
    autor = respuestas_form.usuario
    autor_nombre_completo = f"{autor.nombre} {autor.apellido}"

    return InstrumentoDetalle(
        id=instrumento.id,
        titulo_formulario=instrumento.titulo(),
        autor_nombre=autor_nombre_completo,
        fecha_completado=respuestas_form.fecha_envio,
        plantilla_formulario_id=instrumento.plantilla_formulario_id, 
        respuestas=respuestas_procesadas,
        plantilla_formulario=instrumento.plantilla_formulario,
        respuestas_formulario=instrumento.respuestas_formulario or [], 
        materia=instrumento.materia
    )