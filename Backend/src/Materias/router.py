from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Materias import schemas, services
from src.Usuarios.schemas import UsuarioSchema

router = APIRouter(prefix="/materias", tags=["materias"])

# Rutas para Materias
@router.get("/", response_model=list[schemas.Materia])
def read_materias(db: Session = Depends(get_db)):
    return services.listar_materias(db)

@router.get("/usuario/{usuario_id}", response_model=list[schemas.Materia])
def read_materias_usuario(usuario_id: int, db: Session = Depends(get_db)):
    # Devolver todas las materias, luego deberiamos filtar por user?
    return services.listar_materias(db)


@router.get("/get_docente/{materia_id}", response_model=UsuarioSchema)
def get_docente_materia(materia_id: str, db: Session = Depends(get_db)):
    return services.get_Docente(materia_id, db)
