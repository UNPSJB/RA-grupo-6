from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update
from src.Pregunta.models import Pregunta, Opcion, EnumTipoPregunta
from src.Pregunta import schemas, exceptions
from src.Opciones.models import Opcion

def crear_pregunta_abierta(db: Session, pregunta: schemas.PreguntaAbiertaCreate) -> Pregunta:

    _nueva_pregunta = Pregunta(
                    texto=pregunta.texto, 
                    tipo=EnumTipoPregunta.abierta, 
                    grupo_pregunta_id = pregunta.grupo_pregunta_id, 
                    estadistica = pregunta.estadistica, 
                    rol_id = pregunta.rol_id, 
                    multiple_respuestas = pregunta.multiple_respuestas, 
                    grupo_cuadro_id = pregunta.grupo_cuadro_id, 
                    orden_en_grupo=pregunta.orden_en_grupo if pregunta.grupo_cuadro_id else None, 
                    obligatoria = pregunta.obligatoria, 
                    tipo_respuesta = pregunta.tipo_respuesta,
                    pregunta_fuente_id = pregunta.pregunta_fuente_id)
    
    db.add(_nueva_pregunta)
    db.commit()
    db.refresh(_nueva_pregunta)
    return _nueva_pregunta

def crear_pregunta_cerrada(db: Session, pregunta: schemas.PreguntaCerradaCreate) -> Pregunta:
    if len(pregunta.opciones) <= 1:
        raise exceptions.PreguntaSinOpciones("Tiene que tener como minimo 2 opciones")
    
    # Filtrar ids validos
    opciones_validas = db.query(Opcion).filter(Opcion.id.in_([op for op in pregunta.opciones if op > 0])).all()

    if len(opciones_validas) != len(pregunta.opciones):
        raise exceptions.PreguntaSinOpciones("Algunas opciones proporcionadas no son válidas.")



    _nueva = Pregunta(texto=pregunta.texto, tipo=EnumTipoPregunta.cerrada, grupo_pregunta_id=pregunta.grupo_pregunta_id, estadistica = pregunta.estadistica, rol_id = pregunta.rol_id, multiple_respuestas = pregunta.multiple_respuestas, grupo_cuadro_id = pregunta.grupo_cuadro_id,  orden_en_grupo=pregunta.orden_en_grupo if pregunta.grupo_cuadro_id else None, obligatoria = pregunta.obligatoria)
    _nueva.opciones = opciones_validas
    
    db.add(_nueva)
    db.commit()
    db.refresh(_nueva)
    return _nueva

def listar_preguntas(db: Session) -> List[schemas.Pregunta]:
    db_preguntas = db.scalars(select(Pregunta)).all()
    resultado = []
    for preg in db_preguntas:
        en_formulario = bool(preg.formularios and len(preg.formularios) > 0)
        resultado.append(
            schemas.Pregunta(
                id= preg.id,
                texto= preg.texto,
                tipo = preg.tipo,
                opciones= preg.opciones,
                grupo_pregunta_id= preg.grupo_pregunta_id,
                grupo_pregunta= preg.grupo_pregunta,
                rol_id = preg.rol_id,
                estadistica = preg.estadistica,
                puede_eliminarse= not en_formulario,
                puede_modificarse= not en_formulario,
                multiple_respuestas= preg.multiple_respuestas,
                grupo_cuadro_id = preg.grupo_cuadro_id,
                orden_en_grupo= preg.orden_en_grupo,
                obligatoria= preg.obligatoria
            )
        )
    return resultado

def obtner_pregunta(db: Session, pregunta_id: int) -> schemas.Pregunta:
    db_pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    if db_pregunta is None:
        raise exceptions.PreguntaNoEncontrada()
    return db_pregunta

def modificar_pregunta(db: Session, pregunta_id: int, pregunta: schemas.PreguntaUpdate) -> Pregunta:
    db_pregunta = obtner_pregunta(db, pregunta_id)
    if not db_pregunta:
        raise exceptions.PreguntaNoEncontrada()
    
    if db_pregunta.formularios and len(db_pregunta.formularios) > 0:
        raise exceptions.PreguntaNoModificable()

    data_update = pregunta.model_dump(exclude={"opciones"}, exclude_unset=True)
    db.execute(
        update(Pregunta)
        .where(Pregunta.id == pregunta_id)
        .values(**data_update)
    )

    if pregunta.opciones is not None:
        db_pregunta.opciones = (
            db.query(Opcion)
            .filter(Opcion.id.in_(pregunta.opciones))
            .all()
        )

    db.commit()
    db.refresh(db_pregunta)
    return db_pregunta  

def eliminar_pregunta(db: Session, pregunta_id: int) -> schemas.PreguntaDelete:
    db_pregunta = db.query(Pregunta).filter(Pregunta.id == pregunta_id).first()
    if not db_pregunta:
        raise exceptions.PreguntaNoEncontrada()

    if db_pregunta.formularios and len(db_pregunta.formularios) > 0:
        raise exceptions.PreguntaNoEliminable()

    db.delete(db_pregunta)
    db.commit()

    return db_pregunta 


