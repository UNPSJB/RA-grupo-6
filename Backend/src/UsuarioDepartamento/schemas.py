
from __future__ import annotations
from pydantic import BaseModel, field_validator

from pydantic import BaseModel, ConfigDict
from datetime import date
from typing import Optional


class UsuarioBase(BaseModel):
    """Esquema mínimo para mostrar info de Usuario."""
    id: int
    nombre: str
    apellido: str
    legajo: int
    
    model_config = ConfigDict(from_attributes=True)

class DepartamentoBase(BaseModel):
    """Esquema mínimo para mostrar info de Departamento."""
    id: int
    nombre: str

    model_config = ConfigDict(from_attributes=True)



class UsuarioDepartamentoBase(BaseModel):
    """Campos base compartidos por todos los schemas."""
    fecha_desde: date
    fecha_hasta: Optional[date] = None
    usuario_id: int
    departamento_id: int

class UsuarioDepartamentoCreate(UsuarioDepartamentoBase):
    """Esquema para la creación. Los IDs son obligatorios."""
    pass 

class UsuarioDepartamentoUpdate(BaseModel):
    """Esquema para la actualización. Todos los campos son opcionales."""
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    departamento_id: Optional[int] = None

class UsuarioDepartamentoRead(UsuarioDepartamentoBase):
    """
    Esquema para leer los datos (Respuesta de la API).
    Incluye el ID y los objetos anidados de Usuario y Departamento.
    """
    id: int
    
    usuario: UsuarioBase
    departamento: DepartamentoBase

    model_config = ConfigDict(from_attributes=True)