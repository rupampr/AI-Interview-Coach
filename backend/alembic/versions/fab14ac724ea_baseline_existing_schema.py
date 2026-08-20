"""baseline existing schema

Revision ID: fab14ac724ea
Revises: f65ffbd4de10
Create Date: 2026-08-18 16:01:15.108393

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'fab14ac724ea'
down_revision: Union[str, Sequence[str], None] = 'f65ffbd4de10'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
