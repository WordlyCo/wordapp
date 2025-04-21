"""daily_practice_time_users

Revision ID: 6009e7e92566
Revises: ad371804b586
Create Date: 2025-04-20 18:41:16.456840

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "6009e7e92566"
down_revision: Union[str, None] = "ad371804b586"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "user_preferences",
        sa.Column(
            "daily_practice_time_goal",
            sa.Integer(),
            nullable=False,
            server_default="5",
        ),
    )


def downgrade() -> None:
    op.drop_column("user_preferences", "daily_practice_time_goal")
