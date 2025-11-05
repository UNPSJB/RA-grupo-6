from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session
from src.Roles.models import Rol
from src.Usuarios.models import Usuario
from src.Usuarios import schemas
from src.Usuarios.exceptions import Usuario_No_Encontrado
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .schemas import UserCreate
from typing import Optional


def leer_usuario(db: Session, usuario_id: int) -> schemas.Usuario:

    db_usuario = db.scalar(select(Usuario).where(Usuario.id == usuario_id))

    if (db_usuario == None):
        raise Usuario_No_Encontrado()

    return db_usuario


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user_by_id(db: Session, user_id: int):
    """Get user by ID."""
    return db.query(Usuario).filter(Usuario.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    """Get user by username."""
    return db.query(Usuario).filter(Usuario.username == username).first()

def get_user_by_email(db: Session, email: str):
    """Get user by email."""
    return db.query(Usuario).filter(Usuario.email == email).first()

def create_user(db: Session, user: UserCreate):
    """Create a new user."""
    hashed_password = pwd_context.hash(user.password)
    db_user = Usuario(
        username=user.username,
        email=user.email,
        nombre=user.nombre,
        apellido=user.apellido,
        legajo=user.legajo,
        rol_id=1,
        hashed_password=hashed_password
    )

    # Assign default user role
    user_role = db.query(Rol).filter(Rol.nombre == "user").first()
    if user_role:
        db_user.roles.append(user_role)

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, username: str, password: str):
    """Authenticate user with username and password."""
    user = get_user_by_username(db, username)
    if not user:
        return False
    if not pwd_context.verify(password, user.hashed_password):
        return False
    return user

def create_role(db: Session, name: str, description: str = ""):
    """Create a new role."""
    db_role = Rol(name=name, description=description)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    """Get all users with pagination."""
    return db.query(Usuario).offset(skip).limit(limit).all()
