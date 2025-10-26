from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from . import services, schemas
from src.database import get_db

router = APIRouter(
    prefix="/usuario-departamento",
    tags=["Usuario-Departamento"],
    responses={404: {"description": "No encontrado"}}
)

@router.post(
    "/", 
    response_model=schemas.UsuarioDepartamentoRead, 
    status_code=status.HTTP_201_CREATED,
    summary="Asignar un usuario a un departamento"
)
def create_usuario_departamento(
    item_in: schemas.UsuarioDepartamentoCreate, 
    db: Session = Depends(get_db)
):
    return services.create(db=db, item_in=item_in)

@router.get(
    "/", 
    response_model=List[schemas.UsuarioDepartamentoRead],
    summary="Obtener todas las asignaciones"
)
def read_usuarios_departamento(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    items = services.get_multi(db, skip=skip, limit=limit)
    return items

@router.get(
    "/{id}", 
    response_model=schemas.UsuarioDepartamentoRead,
    summary="Obtener una asignación por su ID"
)
def read_usuario_departamento(id: int, db: Session = Depends(get_db)):
    db_obj = services.get_by_id(db, id=id)
    if db_obj is None:
        raise HTTPException(status_code=404, detail="Asociación no encontrada")
    return db_obj

@router.get(
    "/por-usuario/{usuario_id}", 
    response_model=schemas.UsuarioDepartamentoRead,
    summary="Obtener la asignación de un usuario específico"
)
def read_usuario_departamento_by_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_obj = services.get_by_usuario_id(db, usuario_id=usuario_id)
    if db_obj is None:
        raise HTTPException(status_code=404, detail="El usuario no tiene un departamento asignado")
    return db_obj

@router.put(
    "/{id}", 
    response_model=schemas.UsuarioDepartamentoRead,
    summary="Actualizar una asignación"
)
def update_usuario_departamento(
    id: int, 
    obj_in: schemas.UsuarioDepartamentoUpdate, 
    db: Session = Depends(get_db)
):
    db_obj = services.get_by_id(db, id=id)
    if db_obj is None:
        raise HTTPException(status_code=404, detail="Asociación no encontrada")
    
    updated_obj = services.update(db=db, db_obj=db_obj, obj_in=obj_in)
    return updated_obj

@router.delete(
    "/{id}", 
    response_model=schemas.UsuarioDepartamentoRead,
    summary="Eliminar una asignación"
)
def delete_usuario_departamento(id: int, db: Session = Depends(get_db)):
    deleted_obj = services.remove(db=db, id=id)
    return deleted_obj