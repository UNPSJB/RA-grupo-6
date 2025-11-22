from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import delete, select, update, func
from src.Pregunta.models import Pregunta, Opcion, EnumTipoPregunta
from src.Pregunta import schemas, exceptions
from src.Opciones.models import Opcion
from src.Instrumento.models import Instrumento, TipoInstrumento

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


def preparar_preguntas_materia(pregunta_id: int, db: Session):
    pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    
    if not pregunta or not pregunta.grupo_cuadro_id:
        return {"preguntas_creadas": False, "mensaje": "Pregunta no válida o sin grupo_cuadro"}
    
    grupo_cuadro_id = pregunta.grupo_cuadro_id
    rol_id = pregunta.rol_id
    grupo_pregunta_id = pregunta.grupo_pregunta_id
    
    preguntas_existentes = db.scalars(
        select(Pregunta).where(
            Pregunta.grupo_cuadro_id == grupo_cuadro_id,
            Pregunta.texto.in_([
                "Código de actividad curricular",
                "Nombre de la actividad curricular"
            ])
        )
    ).all()
    
    if len(preguntas_existentes) >= 2:
        return {"preguntas_creadas": False, "mensaje": "Las preguntas ya existen"}

    orden_minimo = db.scalar(
        select(func.min(Pregunta.orden_en_grupo)).where(
            Pregunta.grupo_cuadro_id == grupo_cuadro_id
        )
    )
    
    orden_codigo = 1 if orden_minimo is None else orden_minimo - 2
    orden_nombre = 2 if orden_minimo is None else orden_minimo - 1

    pregunta_codigo = Pregunta(
        texto="Código de actividad curricular",
        tipo=EnumTipoPregunta.abierta,
        grupo_pregunta_id=grupo_pregunta_id,
        estadistica=False,
        rol_id=rol_id,
        multiple_respuestas=pregunta.multiple_respuestas,
        grupo_cuadro_id=grupo_cuadro_id,
        orden_en_grupo=orden_codigo,
        obligatoria=False
    )
    

    pregunta_nombre = Pregunta(
        texto="Nombre de la actividad curricular",
        tipo=EnumTipoPregunta.abierta,
        grupo_pregunta_id=grupo_pregunta_id,
        estadistica=False,
        rol_id=rol_id,
        multiple_respuestas=pregunta.multiple_respuestas,
        grupo_cuadro_id=grupo_cuadro_id,
        orden_en_grupo=orden_nombre,
        obligatoria=False
    )
    
    db.add(pregunta_codigo)
    db.add(pregunta_nombre)
    db.commit()
    
    return {
        "preguntas_creadas": True, 
        "mensaje": "Preguntas creadas exitosamente",
        "pregunta_codigo_id": pregunta_codigo.id,
        "pregunta_nombre_id": pregunta_nombre.id
    }

def preparar_pregunta_info_general_sintetico(instrumento_id: int, db: Session):
    
    # Obtener el instrumento
    instrumento = db.scalar(select(Instrumento).where(Instrumento.id == instrumento_id))
    
    if not instrumento or instrumento.tipo != TipoInstrumento.INFORME_SINTETICO:
        return {"pregunta_creada": False, "mensaje": "No es un informe sintético"}
    
    plantilla = instrumento.plantilla_formulario
    if not plantilla:
        return {"pregunta_creada": False, "mensaje": "La plantilla no existe"}
    
    # Obtener el primer grupo de preguntas usando la relación directa
    primer_grupo = None
    if plantilla.preguntas and len(plantilla.preguntas) > 0:
        # Tomar el grupo_pregunta del primer pregunta de la plantilla
        primer_grupo = plantilla.preguntas[0].grupo_pregunta
    
    if not primer_grupo:
        return {"pregunta_creada": False, "mensaje": "No hay grupos de preguntas asociados"}
    
    # Verificar si la pregunta ya existe
    pregunta_existente = db.scalar(
        select(Pregunta).where(
            Pregunta.texto == "Información general de actividades curriculares",
            Pregunta.grupo_pregunta_id == primer_grupo.id
        )
    )
    
    if pregunta_existente:
        return {
            "pregunta_creada": False,
            "mensaje": "La pregunta ya existe",
            "pregunta_id": pregunta_existente.id
        }
    
    # Crear la nueva pregunta
    nueva_pregunta = Pregunta(
        texto="Información general de actividades curriculares",
        tipo=EnumTipoPregunta.abierta,
        grupo_pregunta_id=primer_grupo.id,
        estadistica=False,
        rol_id=plantilla.rol_id,
        multiple_respuestas=False,
        grupo_cuadro_id=None,
        orden_en_grupo=None,
        obligatoria=False
    )
    
    db.add(nueva_pregunta)
    db.commit()
    db.refresh(nueva_pregunta)
    
    return {
        "pregunta_creada": True,
        "mensaje": "Pregunta creada exitosamente",
        "pregunta_id": nueva_pregunta.id
    }