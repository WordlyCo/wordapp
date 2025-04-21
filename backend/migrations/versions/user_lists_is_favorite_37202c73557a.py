"""user_lists_is_favorite

Revision ID: 37202c73557a
Revises: 6009e7e92566
Create Date: 2025-04-20 22:53:21.781444

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "37202c73557a"
down_revision: Union[str, None] = "6009e7e92566"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_lists",
        sa.Column(
            "is_favorite",
            sa.Boolean(),
            nullable=False,
            default=False,
            server_default=sa.false(),
        ),
    )


def downgrade() -> None:
    op.drop_column("user_lists", "is_favorite")
