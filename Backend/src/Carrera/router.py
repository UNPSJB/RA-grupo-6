from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Carrera import schemas, services
from src.Usuarios.auth import require_role

router = APIRouter(prefix="/carreras", tags=["carreras"])

#Rutas para Carrera
#TODO Ejemplo de restricción de ruta:
#@router.get("/", response_model=list[schemas.CarreraSimple], dependencies=[Depends(require_role(["Docente","Estudiante","Departamento"]))])
@router.get("/", response_model=list[schemas.CarreraSimple],)
def read_carreras(db: Session = Depends(get_db)):
    return services.listar_carreras(db)