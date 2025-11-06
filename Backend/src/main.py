import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, Response, status
from src.Usuarios.models import Usuario
from src.Usuarios import services
from sqlalchemy.orm import Session
from src.Usuarios.schemas import AuthUsuarioSchema, UserCreateSchema, UsuarioSchema
from src.Usuarios.auth import (
     create_access_token, 
     ACCESS_TOKEN_EXPIRE_MINUTES, 
     get_current_active_user_from_cookie 
)
from src.database import engine, get_db
from src.models import ModeloBase

from fastapi.middleware.cors import CORSMiddleware
from src.materias.router import router as materias_router
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

load_dotenv()

@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
    yield

app = FastAPI(lifespan=db_creation_lifespan)

origins = [
    "http://localhost:5173", # Puerto de React
]

@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Authentication Demo (API Root)"}

@app.post("/token", response_model=UsuarioSchema)
async def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
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
        secure=False,
        samesite="lax",
        domain="localhost",
        path="/",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )
    
    return user
@app.post("/logout")
async def logout(response: Response):
    """Borra la cookie de autenticación."""
    response.delete_cookie(key="access_token", domain="localhost", path="/")
    return {"status": "success"}

@app.get("/users/me", response_model=UsuarioSchema)
async def read_users_me(
    current_user: UsuarioSchema = Depends(get_current_active_user_from_cookie)
):
    return current_user
    
@app.get("/protected")
async def protected_route(
    current_user: UsuarioSchema = Depends(get_current_active_user_from_cookie)
):
    return {"message": f"Hello {current_user.username}, this is a protected route!"}


@app.post("/register", response_model=AuthUsuarioSchema)
async def register_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    db_user = services.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = services.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = services.create_user(db=db, user=user)
    return new_user

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(materias_router)
from src.Pregunta.router import router as preguntas_router
app.include_router(preguntas_router)
from src.Respuesta.router import router as respuestas_router
app.include_router(respuestas_router)
from src.Opciones.router import router as opciones_router
app.include_router(opciones_router)
from src.PlantillaFormulario.router import router as formulario_router
app.include_router(formulario_router)
from src.Roles.router import router as roles_router
app.include_router(roles_router)
from src.Usuarios.router import router as usuarios_router
app.include_router(usuarios_router)
from src.GrupoPregunta.router import router as grupo_pregunta_router
app.include_router(grupo_pregunta_router)
from src.RespuestasFormulario.router import router as respuestas_formulario_router
app.include_router(respuestas_formulario_router)
from src.Instrumento.router import router as instrumento_router
app.include_router(instrumento_router)
from src.Departamento.router import router as departamento_router
app.include_router(departamento_router)
from src.Carrera.router import router as carrera_router
app.include_router(carrera_router)
from src.PeriodoVinculado.router import router as periodo_router
app.include_router(periodo_router)
from src.UsuarioDepartamento.router import router as usuariodepartamento_router
app.include_router(usuariodepartamento_router)