from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from src.UsuarioDepartamento.models import UsuarioDepartamento
from src.Usuarios.models import Usuario
from src.Departamento.models import Departamento

from . import schemas

def get_by_id(db: Session, id: int) -> UsuarioDepartamento | None:
    """Obtiene una asociación por su ID."""
    return db.query(UsuarioDepartamento).filter(UsuarioDepartamento.id == id).first()

def get_by_usuario_id(db: Session, usuario_id: int) -> UsuarioDepartamento | None:
    """Obtiene una asociación por el ID del usuario (ya que es unique)."""
    return db.query(UsuarioDepartamento).filter(UsuarioDepartamento.usuario_id == usuario_id).first()

def get_multi(db: Session, skip: int = 0, limit: int = 100) -> list[UsuarioDepartamento]:
    """Obtiene una lista paginada de asociaciones."""
    return db.query(UsuarioDepartamento).offset(skip).limit(limit).all()

def create(db: Session, item_in: schemas.UsuarioDepartamentoCreate) -> UsuarioDepartamento:
    """Crea una nueva asociación Usuario-Departamento."""
    db_obj = get_by_usuario_id(db, usuario_id=item_in.usuario_id)
    if db_obj:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"El usuario con ID {item_in.usuario_id} ya tiene un departamento asignado."
        )
        
    if not db.get(Usuario, item_in.usuario_id):
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró el Usuario con ID {item_in.usuario_id}."
        )
    
    if not db.get(Departamento, item_in.departamento_id):
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró el Departamento con ID {item_in.departamento_id}."
        )

    db_obj = UsuarioDepartamento(**item_in.model_dump())
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(
    db: Session, 
    db_obj: UsuarioDepartamento, 
    obj_in: schemas.UsuarioDepartamentoUpdate
) -> UsuarioDepartamento:
    """Actualiza una asociación existente."""
    
    update_data = obj_in.model_dump(exclude_unset=True)
    
    if "departamento_id" in update_data:
        if not db.get(Departamento, update_data["departamento_id"]):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No se encontró el Departamento con ID {update_data['departamento_id']}."
            )

    for field, value in update_data.items():
        setattr(db_obj, field, value)
        
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def remove(db: Session, id: int) -> UsuarioDepartamento:
    """Elimina una asociación por su ID."""
    db_obj = get_by_id(db, id)
    if not db_obj:
         raise HTTPException(
            status_code=status.HTTP_44_NOT_FOUND,
            detail=f"No se encontró la asociación con ID {id}."
        )
        
    db.delete(db_obj)
    db.commit()
    return db_obj