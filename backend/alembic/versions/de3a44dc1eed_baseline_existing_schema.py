"""baseline existing schema

Revision ID: de3a44dc1eed
Revises: fab14ac724ea
Create Date: 2026-08-19 04:49:06.949808

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'de3a44dc1eed'
down_revision: Union[str, Sequence[str], None] = 'fab14ac724ea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
