from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Dictados import schemas, services
from src.Materias.schemas import Materia 
from src.Instrumento.schemas import Instrumento

router = APIRouter(prefix="/Dictados", tags=["Dictados"])


@router.post("/", response_model=schemas.Dictado)
def create_dictado(dictado: schemas.DictadoCreate, db:Session = Depends(get_db)):
    return services.create_dictado(db, dictado)


@router.get("/Materias", response_model=list[Materia])
def get_materias_ult_dictado(db:Session = Depends(get_db)):
    return services.getMateriasUltimoDictado(db)

@router.get("/Instrumentos", response_model=list[Instrumento])
def get_instrumentos_ult_dictado(db:Session = Depends(get_db)):
    return services.getInstrumentosUltDictado(db)

@router.get("/CantidadRespuestas", response_model=int)
def get_cantidad_respondidos(db:Session = Depends(get_db)):
    return services.getCantInstrumentosUltDic(db)
