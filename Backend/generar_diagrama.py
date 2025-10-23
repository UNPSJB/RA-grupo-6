# generar_diagrama.py

from sqlalchemy import create_engine
from sqlalchemy_schemadisplay import create_schema_graph
from src.models import ModeloBase

from src.Instrumento import models
from src.Pregunta import models
from src.Usuarios import models
from src.Respuesta import models
from src.PlantillaFormulario import models
from src.Materias import models
from src.RespuestasFormulario import models
from src.Opciones import models
from src.Roles import models
DATABASE_URL = "sqlite:///mi-db-sqlite.db" 
engine = create_engine(DATABASE_URL)

graph = create_schema_graph(
    engine=engine,
    metadata=ModeloBase.metadata,
    show_datatypes=True,
    show_indexes=True,
    rankdir='LR',
    concentrate=False
)

output_file = 'diagrama_db.png'
graph.write_png(output_file)

print(f"Diagrama '{output_file}' generado con éxito")