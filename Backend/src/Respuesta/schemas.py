from pydantic import BaseModel
class RespuestaBase(BaseModel):
    texto: str | None = None  # para respuestas abiertas
    opcion_id: int | None = None  # para respuestas cerradas
    pregunta_id: int

class RespuestaCreate(RespuestaBase):
    pass

class RespuestaUpdate(RespuestaBase):
    pass

class RespuestaDelete(BaseModel):
    id: int

class Respuesta(RespuestaBase):
    id: int

    model_config = {
        "from_attributes": True
    }