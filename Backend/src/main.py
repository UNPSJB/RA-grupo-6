import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv

from fastapi import FastAPI, Depends, HTTPException, status
from src.Usuarios import services
from sqlalchemy.orm import Session
from src.Usuarios.schemas import User, UserCreate, Usuario
from src.Usuarios.auth import (
     create_access_token, get_current_active_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from src.database import engine, get_db
from src.models import ModeloBase

from fastapi.middleware.cors import CORSMiddleware
from src.materias.router import router as materias_router
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta



load_dotenv()

ENV = os.getenv("ENV")
ROOT_PATH = os.getenv(f"ROOT_PATH_{ENV.upper()}")
@asynccontextmanager
async def db_creation_lifespan(app: FastAPI):
    ModeloBase.metadata.create_all(bind=engine)
    yield

app = FastAPI(root_path=ROOT_PATH, lifespan=db_creation_lifespan)




origins = [
    "http://localhost:5173", # para recibir requests desde app React (puerto: 5173)
]




@app.get("/")
async def root():
    return {"message": "Welcome to FastAPI Authentication Demo"}

@app.post("/token")
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Authenticate user and return access token."""
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
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=Usuario)
async def read_users_me(current_user: Usuario = Depends(get_current_active_user)):
    """Get current user information."""
    return current_user
    
@app.get("/protected")
async def protected_route(current_user: Usuario = Depends(get_current_active_user)):
    return {"message": f"Hello {current_user.full_name}, this is a protected route!"}



@app.post("/register", response_model=User)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user."""
    db_user = services.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    db_user = services.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = services.create_user(db=db, user=user)
    return Usuario(
        id=new_user.id,
        email=new_user.email,
        nombre=new_user.nombre,
        apellido=new_user.apellido,
        legajo=new_user.legajo,
        disabled=not new_user.is_active,
        roles=[role.nombre for role in new_user.roles]
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Asociamos los routers a nuestra app
app.include_router(materias_router)

# Example: app.include_router(personas_router)

#Router de Preguntas
from src.Pregunta.router import router as preguntas_router
app.include_router(preguntas_router)
#Route de Respuestas
from src.Respuesta.router import router as respuestas_router
app.include_router(respuestas_router)
#Route de Opciones 
from src.Opciones.router import router as opciones_router
app.include_router(opciones_router)
#Router de Formularios
from src.PlantillaFormulario.router import router as formulario_router
app.include_router(formulario_router)

#Route de Rol
from src.Roles.router import router as roles_router
app.include_router(roles_router)

#Route de Usuario
from src.Usuarios.router import router as usuarios_router
app.include_router(usuarios_router)

#Route de Grupo de pregunta
from src.GrupoPregunta.router import router as grupo_pregunta_router
app.include_router(grupo_pregunta_router)

#Route de Respuestas Formulario
from src.RespuestasFormulario.router import router as respuestas_formulario_router
app.include_router(respuestas_formulario_router)

#Route de Instrumentos
from src.Instrumento.router import router as instrumento_router
app.include_router(instrumento_router)

#Route de Departamentos
from src.Departamento.router import router as departamento_router
app.include_router(departamento_router)

#Route de Carreras
from src.Carrera.router import router as carrera_router
app.include_router(carrera_router)

#Route de PeriodosVinculados
from src.PeriodoVinculado.router import router as periodo_router
app.include_router(periodo_router)

#Route de UsuarioDepartamento
from src.UsuarioDepartamento.router import router as usuariodepartamento_router
app.include_router(usuariodepartamento_router)
