"""user_preferences_profile_color

Revision ID: 91725e7254c0
Revises: 37202c73557a
Create Date: 2025-05-01 12:44:17.553136

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "91725e7254c0"
down_revision: Union[str, None] = "37202c73557a"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_preferences",
        sa.Column("profile_background_color", sa.String(length=20), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("user_preferences", "profile_background_color")
