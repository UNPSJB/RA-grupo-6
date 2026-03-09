from typing import List
from sqlalchemy import select
from sqlalchemy.orm import Session
from src.Materias.exceptions import MateriaSinDocente
from src.Materias.models import Materia
from src.Materias import schemas

from src.Usuarios.schemas import UsuarioSchema 

def listar_materias(db: Session) -> List[schemas.Materia]:
    return db.scalars(select(Materia)).all()


from src.utils import get_today

def get_Docente(materia_id:str, db:Session) -> UsuarioSchema:
    materia = db.scalar(select(Materia).where(Materia.id == materia_id))
    hoy = get_today()
    docente = list(filter(lambda periodo_vinculado: periodo_vinculado.fecha_hasta is None or periodo_vinculado.fecha_hasta >= hoy, materia.periodos_vinculados))[0]

    if docente is None:
        raise MateriaSinDocente
    
    return docente.usuario

