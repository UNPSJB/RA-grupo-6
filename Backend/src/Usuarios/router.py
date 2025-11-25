# src/Usuarios/router.py

from fastapi import APIRouter, Depends, HTTPException, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta

from src.database import get_db
from src.Usuarios import schemas, services

router = APIRouter(tags=["Usuarios y Autenticación"])

@router.get("/usuarios/{usuario_id}", response_model= list[dict])
def leer_respuestas_de_usuario(usuario_id: int , db: Session = Depends(get_db)):
    return services.leer_respuestas_usuario(db, usuario_id)


from src.Usuarios.auth import (
    create_access_token, 
    ACCESS_TOKEN_EXPIRE_MINUTES, 
    get_current_active_user_from_cookie
)

@router.post("/token", response_model=schemas.UsuarioSchema)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    """
    Inicia sesión y devuelve un token en una httpOnly cookie.
    """
    user = services.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,  # Poner en True en producción (con HTTPS)
        samesite="lax",
        domain=None,
        path="/",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    return user

@router.post("/logout")
async def logout(response: Response):
    """
    Borra la cookie de autenticación.
    """
    response.delete_cookie(key="access_token", domain=None, path="/")
    return {"status": "success"}

@router.post("/register", response_model=schemas.AuthUsuarioSchema)
async def register_user(user: schemas.UserCreateSchema, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario.
    """
    db_user = services.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = services.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = services.create_user(db=db, user=user)
    return new_user

@router.get("/users/me", response_model=schemas.UsuarioSchema)
async def read_users_me(
    current_user: schemas.UsuarioSchema = Depends(get_current_active_user_from_cookie)
):
    """
    Devuelve el usuario actualmente autenticado.
    """
    return current_user
    
@router.get("/protected")
async def protected_route(
    current_user: schemas.UsuarioSchema = Depends(get_current_active_user_from_cookie)
):
    """
    Una ruta de ejemplo protegida por autenticación.
    """
    return {"message": f"Hello {current_user.username}, this is a protected route!"}



@router.get("/usuarios/{usuario_id}", response_model=schemas.UsuarioSchema)
def read_usuario(usuario_id: int, db: Session = Depends(get_db)):
    """
    Lee un usuario específico por su ID.
    """
    db_user = services.get_user(db, user_id=usuario_id) 
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

