"""progress_tables

Revision ID: d50113ea1ac4
Revises: 665f8b67e8d0
Create Date: 2025-04-08 16:39:12.773143

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "d50113ea1ac4"
down_revision: Union[str, None] = "665f8b67e8d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "word_progress",
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("word_id", sa.Integer(), nullable=False),
        sa.Column("recognition_level", sa.Integer(), nullable=False),
        sa.Column("usage_level", sa.Integer(), nullable=False),
        sa.Column("mastery_score", sa.Integer(), nullable=False),
        sa.Column("practice_count", sa.Integer(), nullable=False),
        sa.Column(
            "number_of_times_to_practice",
            sa.Integer(),
            nullable=False,
            server_default="5",
        ),
        sa.Column("success_count", sa.Integer(), nullable=False),
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
        sa.PrimaryKeyConstraint("user_id", "word_id"),
        sa.CheckConstraint("number_of_times_to_practice >= 0"),
    )


def downgrade() -> None:
    op.drop_table("word_progress")
