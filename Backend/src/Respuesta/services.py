from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import delete, or_, select, update, func
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
    
    if pregunta.multiple_respuestas and respuesta.instancia_respuesta == 1 and pregunta.grupo_cuadro_id:
        _crear_preguntas_materia_si_no_existen(db, pregunta)

    nueva_respuesta = Respuesta(**respuesta.model_dump())
    db.add(nueva_respuesta)
    db.commit()
    db.refresh(nueva_respuesta)
    return nueva_respuesta

def _crear_preguntas_materia_si_no_existen(db: Session, pregunta_referencia: Pregunta):
    grupo_cuadro_id = pregunta_referencia.grupo_cuadro_id
    rol_id = pregunta_referencia.rol_id
    grupo_pregunta_id = pregunta_referencia.grupo_pregunta_id
    
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
        return
    
    ultima_pregunta = db.scalar(select(Pregunta).order_by(Pregunta.id.desc()))
    proximo_id = (ultima_pregunta.id + 1) if ultima_pregunta else 1
    
    orden_minimo = db.scalar(
        select(func.min(Pregunta.orden_en_grupo)).where(
            Pregunta.grupo_cuadro_id == grupo_cuadro_id
        )
    )
    orden_codigo = (orden_minimo - 2) if orden_minimo and orden_minimo > 0 else -2
    orden_nombre = (orden_minimo - 1) if orden_minimo and orden_minimo > 0 else -1
    
    textos_existentes = {p.texto for p in preguntas_existentes}
    
    if "Código de actividad curricular" not in textos_existentes:
        pregunta_codigo = Pregunta(
            texto="Código de actividad curricular",
            tipo="abierta",
            grupo_pregunta_id=grupo_pregunta_id,
            rol_id=rol_id,
            multiple_respuestas=True,
            grupo_cuadro_id=grupo_cuadro_id,
            orden_en_grupo=orden_codigo,
            obligatoria=True,
            estadistica=False,
            pregunta_fuente_id=None
        )
        db.add(pregunta_codigo)
        
    
    if "Nombre de la actividad curricular" not in textos_existentes:
        pregunta_nombre = Pregunta(
            texto="Nombre de la actividad curricular",
            tipo="abierta",
            grupo_pregunta_id=grupo_pregunta_id,
            rol_id=rol_id,
            multiple_respuestas=True,
            grupo_cuadro_id=grupo_cuadro_id,
            orden_en_grupo=orden_nombre,
            obligatoria=True,
            estadistica=False,
            pregunta_fuente_id=None
        )
        db.add(pregunta_nombre)
    
    db.commit()

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
    
    pregunta_fuente_id = pregunta.pregunta_fuente_id if pregunta.pregunta_fuente_id else pregunta.id
    pregunta_fuente = db.scalar(select(Pregunta).where(Pregunta.id == pregunta_fuente_id))
    
    if not pregunta_fuente:
        return {"respuestas": [], "multiple": pregunta.multiple_respuestas}
    
    instrumento_actual = db.scalar(select(Instrumento).where(Instrumento.id == instrumento_actual_id))
    
    if not instrumento_actual:
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