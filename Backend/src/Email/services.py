import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
from src.utils import get_today
from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import select, and_, not_, exists
import concurrent.futures

class EmailService:
    def __init__(self):
        # Configuración para Gmail
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email_from = "grupo6desarrollo2025@gmail.com"
        ###
        self.password = "xitn ofip wmng ozwf"  # Contraseña de aplicación de Gmail
        ###
        
    def enviar_email(self, destinatario: str, asunto: str, mensaje: str) -> bool:
        try:
            msg = MIMEMultipart()
            msg['From'] = self.email_from
            msg['To'] = destinatario
            msg['Subject'] = asunto
            msg.attach(MIMEText(mensaje, 'plain'))
            
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email_from, self.password)
            server.send_message(msg)
            server.quit()
            return True
        except Exception as e:
            print(f"Error al enviar email: {e}")
            return False

def obtener_estudiantes_pendientes_proximos_vencer(db: Session, dias_antes: int = 7, departamento_id: int = None): # dias_antes
    # Obtiene estudiantes con instrumentos pendientes que vencen en los próximos X días
    from src.Usuarios.models import Usuario
    from src.Instrumento.models import Instrumento, TipoInstrumento
    from src.RespuestasFormulario.models import RespuestasFormulario
    from src.PeriodoVinculado.models import PeriodoVinculado
    from src.Materias.models import Materia
    
    # Calcular fecha límite (hoy + días especificados)
    fecha_hoy = get_today()
    fecha_limite = fecha_hoy + timedelta(days=dias_antes)
    
    # Consulta para estudiantes con encuestas pendientes que vencen pronto
    subquery_respuesta = exists().where(
        and_(
            RespuestasFormulario.instrumento_id == Instrumento.id,
            RespuestasFormulario.usuario_id == Usuario.id
        )
    )
    
    query = select(Usuario).distinct().join(PeriodoVinculado).join(Materia).join(Instrumento).where(
        and_(
            Instrumento.tipo == TipoInstrumento.ENCUESTA_ESTUDIANTE,
            not_(subquery_respuesta),  # No tienen respuesta
            Instrumento.fecha_cierre <= fecha_limite,  # Vence en los próximos X días
            Instrumento.fecha_cierre >= fecha_hoy,  # Aún no venció
            # El estudiante está vinculado al período del instrumento
            PeriodoVinculado.materia_id == Instrumento.materia_id
        )
    )
    
    if departamento_id:
        query = query.where(Materia.departamento_id == departamento_id)
    
    return db.scalars(query).all()

def obtener_instrumentos_proximos_vencer(db: Session, dias_antes: int = 7, departamento_id: int = None):
    # Obtiene instrumentos que vencen en los próximos X días con info de estudiantes pendientes
    from src.Instrumento.models import Instrumento, TipoInstrumento
    from src.RespuestasFormulario.models import RespuestasFormulario
    from src.Usuarios.models import Usuario
    from src.PeriodoVinculado.models import PeriodoVinculado
    
    fecha_hoy = get_today()
    fecha_limite = fecha_hoy + timedelta(days=dias_antes)
    
    instrumentos = db.scalars(
        select(Instrumento).where(
            and_(
                Instrumento.tipo == TipoInstrumento.ENCUESTA_ESTUDIANTE,
                Instrumento.fecha_cierre <= fecha_limite,
                Instrumento.fecha_cierre >= fecha_hoy
            )
        )
    ).all()
    
    resultado = []
    for instrumento in instrumentos:
        if departamento_id and instrumento.materia.departamento_id != departamento_id:
            continue
            
        # Estudiantes pendientes para este instrumento
        estudiantes_pendientes = db.scalars(
            select(Usuario).join(PeriodoVinculado).where(
                and_(
                    PeriodoVinculado.materia_id == instrumento.materia_id,
                    not_(
                        exists().where(
                            and_(
                                RespuestasFormulario.instrumento_id == instrumento.id,
                                RespuestasFormulario.usuario_id == Usuario.id
                            )
                        )
                    )
                )
            )
        ).all()
        
        if estudiantes_pendientes:
            resultado.append({
                "instrumento": instrumento,
                "estudiantes_pendientes": estudiantes_pendientes,
                "dias_para_vencer": (instrumento.fecha_cierre - fecha_hoy).days
            })
    
    return resultado

def enviar_recordatorios_automaticos(db: Session, dias_antes: int = 7, departamento_id: int = None) -> dict:
    email_service = EmailService()
    instrumentos_proximos = obtener_instrumentos_proximos_vencer(db, dias_antes, departamento_id)

    resultados = {"enviados": 0, "fallidos": 0, "total_estudiantes": 0, "detalles": []}

    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = []
        detalles_info = [] 
        
        for item in instrumentos_proximos:
            instrumento = item["instrumento"]
            dias_para_vencer = item["dias_para_vencer"]
            for estudiante in item["estudiantes_pendientes"]:
                resultados["total_estudiantes"] += 1
                
                detalles_info.append({
                    "estudiante": estudiante,
                    "instrumento": instrumento,
                    "dias_para_vencer": dias_para_vencer
                })
                
                futures.append(executor.submit(
                    email_service.enviar_email,
                    estudiante.email,
                    f"Recordatorio: Encuesta pendiente - Vence en {dias_para_vencer} día(s)",
                    f"Hola {estudiante.nombre} {estudiante.apellido},\n\n"
                    f"Te recordamos que tienes pendiente completar la encuesta:\n"
                    f"Materia: {instrumento.materia.nombre}\n"
                    f"Fecha de cierre: {instrumento.fecha_cierre.strftime('%d/%m/%Y')}\n"
                    f"Días restantes: {dias_para_vencer}\n\n"
                    f"Por favor, ingresa al sistema para completarla.\n\n"
                    f"Saludos,\nSistema de Encuestas"
                ))

        for i, future in enumerate(futures):
            exito = future.result()
            info = detalles_info[i]
            
      
            detalle = {
                "estudiante": f"{info['estudiante'].nombre} {info['estudiante'].apellido}",
                "email": info['estudiante'].email,
                "materia": info['instrumento'].materia.nombre, 
                "fecha_cierre": info['instrumento'].fecha_cierre.strftime('%d/%m/%Y'), 
                "dias_restantes": info['dias_para_vencer'], 
                "estado": "enviado" if exito else "fallido"
            }
            
            resultados["detalles"].append(detalle)
            if exito:
                resultados["enviados"] += 1
            else:
                resultados["fallidos"] += 1

    return resultados