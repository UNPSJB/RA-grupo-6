from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, Request, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from src.Usuarios import services
from src.Usuarios.schemas import UsuarioSchema
from src.database import get_db

SECRET_KEY = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Función de Creación de Token ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) 
    return encoded_jwt

# --- Dependencias de Autenticación por Cookie ---

def get_token_from_cookie(request: Request) -> str:
    """
    Dependencia para extraer el token de la cookie HttpOnly.
    """
    token = request.cookies.get("access_token") 
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No estás autenticado (token no encontrado en cookie)",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return token

async def get_current_user_from_cookie(
    token: str = Depends(get_token_from_cookie), 
    db: Session = Depends(get_db)
) -> UsuarioSchema: 
    """
    Decodifica el token de la cookie y obtiene el usuario de la DB.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudieron validar las credenciales (token inválido)",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    db_user = services.get_user_by_username(db, username=username)
    if db_user is None:
        raise credentials_exception
    return db_user

async def get_current_active_user_from_cookie(
    current_user: UsuarioSchema = Depends(get_current_user_from_cookie)
):
    """
    Toma el usuario de la cookie y verifica si está activo.
    """
    is_active = getattr(current_user, 'is_active', True)
    disabled = getattr(current_user, 'disabled', False)

    if not is_active or disabled:
        raise HTTPException(status_code=400, detail="Usuario inactivo")
    return current_user

def require_role(allowed_roles: list[str]):
    """
    Dependencia que verifica si el usuario actual tiene uno de los roles permitidos.
    """
    def role_checker(current_user: UsuarioSchema = Depends(get_current_active_user_from_cookie)):
        if current_user.rol.nombre not in allowed_roles + ["admin"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tiene permisos para realizar esta acción"
            )
        return current_user
    return role_checker
