from typing import List, Optional
from fastapi import APIRouter, Depends, Query
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

@router.get("/CantidadRespuestas", response_model=dict)
def get_cantidad_respondidos(db:Session = Depends(get_db)):
    return services.getCantRespInstUltDic(db)

@router.get("/PromediosDocentes", response_model=list[dict])
def get_promedios_docentes(db:Session = Depends(get_db)):
    return services.getPromedioDocentes(db)


# NUEVOS ENDPOINTS PARA ESTADÍSTICAS
@router.get("/EstadisticasDetalladas", response_model=dict)
def get_estadisticas_detalladas( departamento_id: Optional[int] = Query(None, description="Filtrar por departamento"), db: Session = Depends(get_db)): 
    return services.getEstadisticasDetalladas(db, departamento_id)

@router.get("/EstadisticasPorCarrera", response_model=dict)
def get_estadisticas_por_carrera(departamento_id: Optional[int] = Query(None, description="Filtrar por departamento"), db: Session = Depends(get_db)):
    return services.getEstadisticasPorCarrera(db, departamento_id)

@router.get("/EstadisticasPorMateria/{carrera_id}", response_model=dict)
def get_estadisticas_por_materia(carrera_id: int, db: Session = Depends(get_db)):
    return services.getEstadisticasPorMateria(db, carrera_id)

@router.get("/EstadisticasPorAnio", response_model=dict)
def get_estadisticas_por_anio(departamento_id: Optional[int] = Query(None, description="Filtrar por departamento"), db: Session = Depends(get_db)):
    return services.getEstadisticasPorAnio(db, departamento_id)


@router.get("/Inscriptos/{materia_id}/{instrumento_id}", response_model=int)
def get_inscriptos(materia_id:str, instrumento_id:int, db: Session = Depends(get_db)):
    return services.get_inscriptos(db, materia_id, instrumento_id)


@router.post("/Prueba", response_model=list[schemas.Dictado])
def probar(db:Session = Depends(get_db)):
    return services.CrearDictadosAnuales(db)