from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.Opciones import services, schemas

router = APIRouter(prefix="/opciones", tags=["Opciones"])

# Crear opción
@router.post("/", response_model=schemas.Opcion)
def crear_opcion(opcion: schemas.OpcionCreate, db: Session = Depends(get_db)):
    return services.crear_opcion(db, opcion)

# Listar todas las opciones
@router.get("/", response_model=list[schemas.Opcion])
def leer_opciones(db: Session = Depends(get_db)) -> list[schemas.Opcion]:
    return services.listar_opciones(db)

# Leer una opción por id
@router.get("/{opcion_id}", response_model=schemas.Opcion)
def leer_una_opcion(opcion_id: int, db: Session = Depends(get_db)) -> schemas.Opcion:
    return services.obtener_opcion(db, opcion_id)

# Actualizar opción
@router.put("/{opcion_id}", response_model=schemas.Opcion)
def actualizar_opcion(opcion_id: int, opcion: schemas.OpcionUpdate, db: Session = Depends(get_db)) -> schemas.Opcion:
    return services.modificar_opcion(db, opcion_id, opcion)

# Borrar opción
@router.delete("/{opcion_id}", response_model=schemas.OpcionDelete)
def borrar_opcion(opcion_id: int, db: Session = Depends(get_db)) -> schemas.OpcionDelete:
    return services.eliminar_opcion(db, opcion_id)


