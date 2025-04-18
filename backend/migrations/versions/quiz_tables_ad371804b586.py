"""quiz_tables

Revision ID: ad371804b586
Revises: 1ba5f0a5ffa0
Create Date: 2025-04-14 17:07:18.659222

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "ad371804b586"
down_revision: Union[str, None] = "1ba5f0a5ffa0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "quizzes",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("word_id", sa.Integer(), nullable=False),
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
        sa.Column("quiz_type", sa.String(length=50), nullable=False),
        sa.Column("question", sa.Text(), nullable=False),
        sa.Column("options", sa.ARRAY(sa.String(length=255)), nullable=False),
        sa.Column("correct_options", sa.ARRAY(sa.String(length=255)), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.ForeignKeyConstraint(["word_id"], ["words.id"], ondelete="CASCADE"),
    )

    op.create_index(
        "idx_quizzes_word_id",
        "quizzes",
        ["word_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_table("quizzes")
    op.drop_index("idx_quizzes_word_id")
