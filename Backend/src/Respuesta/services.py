from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import delete, or_, select, update, func
from src.Respuesta.models import Respuesta
from src.Instrumento.models import Instrumento, TipoInstrumento
from src.RespuestasFormulario.models import RespuestasFormulario
from src.Respuesta.models import Respuesta
from src.Respuesta import schemas, exceptions
from src.Pregunta.models import Pregunta
from src.Opciones.models import Opcion
from src.Materias.models import Materia

def crear_respuesta(db: Session, respuesta: schemas.RespuestaCreate) -> schemas.Respuesta:
    pregunta = db.scalar(select(Pregunta).where(Pregunta.id == respuesta.pregunta_id))
    if not pregunta:
        raise exceptions.PreguntaNoEncontrada()
    
    if pregunta.tipo == "abierta" and not respuesta.texto:
        raise exceptions.RespuestaInvalida()
    if pregunta.tipo == "cerrada" and not respuesta.opcion_id:
        raise exceptions.RespuestaInvalida()
    if pregunta.multiple_respuestas and not respuesta.instancia_respuesta:
        raise exceptions.RespuestaInvalida()
    
    nueva_respuesta = Respuesta(**respuesta.model_dump())
    db.add(nueva_respuesta)
    db.commit()
    db.refresh(nueva_respuesta)
    return nueva_respuesta

def listar_respuestas(db: Session) -> List[schemas.Respuesta]:
    return db.scalars(select(Respuesta)).all()

def obtner_respuesta(db: Session, respuesta_id: int) -> schemas.Respuesta:
    db_respuesta = db.scalar(select(Respuesta).where(Respuesta.id == respuesta_id))
    if db_respuesta is None:
        raise exceptions.RespuestaNoEncontrada()
    return db_respuesta

def modificar_respuesta(db: Session, respuesta_id: int, respuesta: schemas.RespuestaUpdate) -> schemas.Respuesta:
    db_respuesta = obtner_respuesta(db, respuesta_id)
    
    # Validar tipo de respuesta según la pregunta 
    if db_respuesta.pregunta.tipo == "abierta" and not respuesta.texto:
        raise exceptions.RespuestaInvalida("La pregunta es abierta, se requiere 'texto'")
    if db_respuesta.pregunta.tipo == "cerrada" and not respuesta.opcion_id:
        raise exceptions.RespuestaInvalida("La pregunta es cerrada, se requiere 'opcion_id'")

    db.execute(
        update(Respuesta)
        .where(Respuesta.id == respuesta_id)
        .values(**respuesta.model_dump())
    )
    db.commit()
    db.refresh(db_respuesta)
    return db_respuesta

def eliminar_respuesta(db: Session, respuesta_id: int) -> schemas.RespuestaDelete:
    db_respuesta = obtner_respuesta(db, respuesta_id)
    db.execute(delete(Respuesta).where(Respuesta.id == respuesta_id))
    db.commit()
    return db_respuesta

def obtener_respuesta_fuente(db: Session, pregunta_id: int, instrumento_actual_id: int) -> dict:
    pregunta = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_id))
    
    if not pregunta:
        return {"respuestas": [], "multiple": False}
    
    instrumento_actual = db.scalar(select(Instrumento).where(Instrumento.id == instrumento_actual_id))
    
    if not instrumento_actual:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
    
    pregunta_fuente_id = None
    
    if instrumento_actual.materia and instrumento_actual.materia.ciclo:
        ciclo = instrumento_actual.materia.ciclo
        
        if ciclo == "CICLO_SUPERIOR":
            pregunta_fuente_id = pregunta.pregunta_fuente_id
        elif ciclo == "CICLO_BASICO":
            pregunta_fuente_id = pregunta.pregunta_fuente_dos_id
        
        if not pregunta_fuente_id:
            pregunta_fuente_id = pregunta.pregunta_fuente_dos_id if ciclo == "CICLO_SUPERIOR" else pregunta.pregunta_fuente_id
    
    if not pregunta_fuente_id:
        pregunta_fuente_id = pregunta.pregunta_fuente_id or pregunta.id
    
    pregunta_fuente = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_fuente_id))
    
    if not pregunta_fuente:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
    
    if instrumento_actual.tipo == TipoInstrumento.INFORME_CATEDRA:
        return _obtener_respuestas_informe_catedra(
            db, pregunta_fuente, instrumento_actual, pregunta
        )
    
    elif instrumento_actual.tipo == TipoInstrumento.INFORME_SINTETICO:
        return _obtener_respuestas_informe_sintetico(
            db, pregunta_fuente, instrumento_actual, pregunta
        )
    
    return {"respuestas": [], "multiple": pregunta.multiple_respuestas}

def _obtener_respuestas_informe_catedra(db: Session, pregunta_fuente: Pregunta, instrumento_actual: Instrumento, pregunta: Pregunta) -> dict:
    if not instrumento_actual.instrumento_fuente_id:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
        
    grupo_pregunta_id_fuente = pregunta_fuente.grupo_pregunta_id
    
    preguntas_del_grupo = db.scalars(
        select(Pregunta)
        .where(
            Pregunta.grupo_pregunta_id == grupo_pregunta_id_fuente,
            Pregunta.tipo == "cerrada",
            Pregunta.estadistica == True
        )
        .order_by(Pregunta.id)
    ).all()
    
    if not preguntas_del_grupo:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
    
    conteo_total_por_opcion = {}
    total_respuestas_general = 0
    
    for pregunta_grupo in preguntas_del_grupo:
        conteo_opciones = db.execute(
            select(Opcion.texto, func.count(Respuesta.id))
            .join(Respuesta, Respuesta.opcion_id == Opcion.id)
            .join(RespuestasFormulario, RespuestasFormulario.id == Respuesta.formulario_id)
            .where(
                Respuesta.pregunta_id == pregunta_grupo.id,
                RespuestasFormulario.instrumento_id == instrumento_actual.instrumento_fuente_id 
            )
            .group_by(Opcion.id, Opcion.texto)
        ).all()
        
        for opcion_texto, count in conteo_opciones:
            if opcion_texto not in conteo_total_por_opcion:
                conteo_total_por_opcion[opcion_texto] = 0
            conteo_total_por_opcion[opcion_texto] += count
            total_respuestas_general += count
    
    if total_respuestas_general == 0:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
    
    estadisticas_generales = []
    for opcion_texto, count in sorted(conteo_total_por_opcion.items()):
        porcentaje = round((count / total_respuestas_general) * 100, 1)
        estadisticas_generales.append(f"{opcion_texto}: {porcentaje}%")
    
    texto_final = ", ".join(estadisticas_generales)
    
    return {
        "respuestas": [{
            "texto": texto_final,
            "instancia": None,
            "opcion_id": None
        }],
        "multiple": False
    }

def _obtener_respuestas_informe_sintetico(db: Session, pregunta_fuente: Pregunta, instrumento_actual: Instrumento, pregunta: Pregunta) -> dict:
    if not instrumento_actual.dictado_id or not instrumento_actual.departamento_id:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}

    instrumentos_catedra = db.scalars(
        select(Instrumento)
        .join(Materia, Instrumento.materia_id == Materia.id)
        .where(
            Instrumento.dictado_id == instrumento_actual.dictado_id,
            Instrumento.tipo == TipoInstrumento.INFORME_CATEDRA,
            Materia.departamento_id == instrumento_actual.departamento_id
        )
    ).all()
    
    if not instrumentos_catedra:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
    
    pregunta_id_a_buscar = pregunta_fuente.id 
    
    if pregunta_fuente.tipo == "abierta" or (pregunta.tipo == "abierta" and pregunta_fuente.tipo == "cerrada"):
        
        respuestas_sintetizadas = []
        for instrumento_catedra in instrumentos_catedra:
            materia = db.scalar(select(Materia).where(Materia.id == instrumento_catedra.materia_id))
            materia_nombre = materia.nombre if materia else None
            materia_id = materia.id if materia else None
            
            if pregunta_fuente.tipo == "abierta":
                q = select(Respuesta.texto)
                q = q.where(Respuesta.texto.isnot(None)) 
                
            else:
                q = select(Opcion.texto).join(Respuesta, Respuesta.opcion_id == Opcion.id)
                q = q.where(Respuesta.opcion_id.isnot(None))


            respuestas_de_texto = db.scalars(
                q
                .join(RespuestasFormulario, RespuestasFormulario.id == Respuesta.formulario_id)
                .where(
                    Respuesta.pregunta_id == pregunta_fuente.id,
                    RespuestasFormulario.instrumento_id == instrumento_catedra.id
                )
            ).all()

            for texto_respuesta in respuestas_de_texto:
                respuestas_sintetizadas.append({
                    "texto": texto_respuesta,
                    "instancia": None, 
                    "opcion_id": None,
                    "materia_nombre": materia_nombre,
                    "materia_id": materia_id
                })
        
        return {
            "respuestas": respuestas_sintetizadas,
            "multiple": pregunta.multiple_respuestas 
        }

    elif pregunta_fuente.tipo == "cerrada":
        
        grupo_pregunta_id_fuente = pregunta_fuente.grupo_pregunta_id
        target_group_id = grupo_pregunta_id_fuente if grupo_pregunta_id_fuente else pregunta_fuente.id
        
        preguntas_del_grupo = db.scalars(
            select(Pregunta)
            .where(
                or_(Pregunta.grupo_pregunta_id == target_group_id, Pregunta.id == target_group_id),
                Pregunta.tipo == "cerrada",
                Pregunta.estadistica == True
            )
            .order_by(Pregunta.id)
        ).all()
        
        if not preguntas_del_grupo:
            return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
        
        respuestas_sintetizadas = []
        for instrumento_catedra in instrumentos_catedra: 
             conteo_total_por_opcion_local = {}
             total_respuestas_general_local = 0
             
             materia = db.scalar(select(Materia).where(Materia.id == instrumento_catedra.materia_id))
             materia_nombre = materia.nombre if materia else None
             materia_id = materia.id if materia else None

             for pregunta_grupo in preguntas_del_grupo:
                 conteo_opciones = db.execute(
                     select(Opcion.texto, func.count(Respuesta.id))
                     .join(Respuesta, Respuesta.opcion_id == Opcion.id)
                     .join(RespuestasFormulario, RespuestasFormulario.id == Respuesta.formulario_id)
                     .where(
                         Respuesta.pregunta_id == pregunta_grupo.id, 
                         RespuestasFormulario.instrumento_id == instrumento_catedra.id
                     )
                     .group_by(Opcion.id, Opcion.texto)
                 ).all()

                 for opcion_texto, count in conteo_opciones:
                     if opcion_texto not in conteo_total_por_opcion_local:
                         conteo_total_por_opcion_local[opcion_texto] = 0
                     conteo_total_por_opcion_local[opcion_texto] += count
                     total_respuestas_general_local += count
            
             if total_respuestas_general_local > 0:
                 estadisticas_generales = []
                 for opcion_texto, count in sorted(conteo_total_por_opcion_local.items()):
                     porcentaje = round((count / total_respuestas_general_local) * 100, 1)
                     estadisticas_generales.append(f"{opcion_texto}: {porcentaje}%")
                
                 texto_final = ", ".join(estadisticas_generales)
                
                 respuestas_sintetizadas.append({
                     "texto": texto_final,
                     "instancia": None,
                     "opcion_id": None,
                     "materia_nombre": materia_nombre,
                     "materia_id": materia_id
                 })

        return {
            "respuestas": respuestas_sintetizadas,
            "multiple": pregunta.multiple_respuestas
        }
    
    return {"respuestas": [], "multiple": pregunta.multiple_respuestas}

def obtener_respuestas_por_formulario(db, formulario_id: int):
    return db.query(Respuesta).filter(Respuesta.formulario_id == formulario_id).all()