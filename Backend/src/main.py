import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src.models import ModeloBase

# importamos los routers desde nuestros modulos
from fastapi.middleware.cors import CORSMiddleware
from src.Materias.router import router as materias_router
# from src.GrupoCuadro.models import GrupoCuadro


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

#Route de Dictados
from src.Dictados.router import router as dictados_router
app.include_router(dictados_router)

#Route de GrupoCuadro
from src.GrupoCuadro.router import router as grupo_cuadro_router
app.include_router(grupo_cuadro_router)

