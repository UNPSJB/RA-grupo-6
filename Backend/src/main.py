import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi import FastAPI
from src.database import engine
from src.models import ModeloBase   

from src.Materia.router import router as materia_router
from fastapi.middleware.cors import CORSMiddleware
from src.materias.router import router as materias_router

app = FastAPI()

# Configurar CORS para permitir requests desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL de tu frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(materia_router)

# Asociamos los routers a nuestra app
app.include_router(materias_router)

# Example: app.include_router(personas_router)

