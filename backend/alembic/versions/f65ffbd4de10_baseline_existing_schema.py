"""baseline existing schema

Revision ID: f65ffbd4de10
Revises: a4a11435be00
Create Date: 2026-08-18 16:01:07.534992

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f65ffbd4de10'
down_revision: Union[str, Sequence[str], None] = 'a4a11435be00'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
