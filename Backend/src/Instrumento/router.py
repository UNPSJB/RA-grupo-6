from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload

from src.Instrumento.models import Instrumento as InstrumentoModel, TipoInstrumento 
from src.Instrumento.schemas import InstrumentoParaListado
from src.database import get_db
from .schemas import InstrumentoDetalle, RespuestaDetalle
from src.RespuestasFormulario.models import RespuestasFormulario as RespuestasFormularioModel
from src.Respuesta.models import Respuesta as RespuestaModel
from fastapi import APIRouter, Depends, HTTPException
router = APIRouter(prefix="/instrumentos", tags=["instrumentos"])

@router.get("/{tipo_instrumento}", response_model=List[InstrumentoParaListado])
def get_instrumentos_por_tipo(tipo_instrumento: TipoInstrumento, db: Session = Depends(get_db)):
    """
    Este endpoint devuelve una lista de instrumentos filtrada por su tipo.
    """
    print('Obteniendo instrumentos de tipo:', tipo_instrumento)
    instrumentos = db.query(InstrumentoModel).filter(
        InstrumentoModel.tipo == tipo_instrumento
    ).all()
    
    return instrumentos





@router.get("/{instrumento_id}", response_model=InstrumentoDetalle)
def get_instrumento_detalle(instrumento_id: int, db: Session = Depends(get_db)):
    """
    Obtiene el detalle completo de un único instrumento para ser visualizado.
    """
    print('Obteniendo detalle del instrumento con ID:', instrumento_id)
    instrumento = db.query(InstrumentoModel).options(
        joinedload(InstrumentoModel.plantilla_formulario),
        joinedload(InstrumentoModel.respuestas_formulario)
            .joinedload(RespuestasFormularioModel.usuario),
        joinedload(InstrumentoModel.respuestas_formulario)
            .joinedload(RespuestasFormularioModel.respuestas)
            .joinedload(RespuestaModel.pregunta),
        joinedload(InstrumentoModel.respuestas_formulario)
            .joinedload(RespuestasFormularioModel.respuestas)
            .joinedload(RespuestaModel.opcion_seleccionada)
    ).filter(InstrumentoModel.id == instrumento_id).first()

    if not instrumento:
        raise HTTPException(status_code=404, detail="Instrumento no encontrado")

    if not instrumento.respuestas_formulario:
         raise HTTPException(status_code=404, detail="El instrumento no tiene respuestas asociadas")

    respuestas_form = instrumento.respuestas_formulario[0]
    
    respuestas_procesadas = [
        RespuestaDetalle(
            pregunta_texto=r.pregunta.texto,
            respuesta_texto=r.texto_respuesta,
            opcion_seleccionada=r.opcion_seleccionada.texto if r.opcion_seleccionada else None
        ) for r in respuestas_form.respuestas
    ]
    
    autor = respuestas_form.usuario
    autor_nombre_completo = f"{autor.nombre} {autor.apellido}"

    return InstrumentoDetalle(
        id=instrumento.id,
        titulo_formulario=instrumento.plantilla_formulario.titulo,
        autor_nombre=autor_nombre_completo,
        fecha_completado=respuestas_form.fecha_envio,
        respuestas=respuestas_procesadas
    )