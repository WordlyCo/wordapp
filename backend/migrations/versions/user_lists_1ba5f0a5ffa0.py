"""user_lists

Revision ID: 1ba5f0a5ffa0
Revises: d50113ea1ac4
Create Date: 2025-04-10 18:40:05.058576

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "1ba5f0a5ffa0"
down_revision: Union[str, None] = "d50113ea1ac4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "user_lists",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("list_id", sa.Integer(), nullable=False),
        sa.Column(
            "created_at", sa.DateTime(), nullable=False, server_default=sa.func.now()
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            nullable=False,
            server_default=sa.func.now(),
            onupdate=sa.func.now(),
        ),
        sa.PrimaryKeyConstraint("user_id", "list_id"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["list_id"], ["lists.id"], ondelete="CASCADE"),
    )

    op.create_index(
        "idx_user_lists_user_id",
        "user_lists",
        ["user_id"],
        unique=False,
    )

    op.create_index(
        "idx_user_lists_list_id",
        "user_lists",
        ["list_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_table("user_lists")
    op.drop_index("idx_user_lists_user_id")
    op.drop_index("idx_user_lists_list_id")
