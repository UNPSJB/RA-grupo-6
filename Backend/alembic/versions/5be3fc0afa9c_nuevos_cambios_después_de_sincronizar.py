"""nuevos cambios después de sincronizar

Revision ID: 5be3fc0afa9c
Revises: d3034a672a61
Create Date: 2025-10-09 22:27:21.841571

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '5be3fc0afa9c'
down_revision: Union[str, Sequence[str], None] = 'd3034a672a61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Dejamos esta función vacía para que no haga nada en la base de datos
    pass

def downgrade() -> None:
    # También la dejamos vacía
    pass