"""word_tables

Revision ID: 665f8b67e8d0
Revises: a9057b0f2597
Create Date: 2025-04-08 02:07:15.396416

"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "665f8b67e8d0"
down_revision: Union[str, None] = "a9057b0f2597"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "categories",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("difficulty_level", sa.String(length=20), nullable=False),
        sa.Column("icon_url", sa.Text(), nullable=True),
        sa.Column("icon_name", sa.String(length=100), nullable=True),
        sa.Column("accent_color", sa.String(length=20), nullable=True),
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
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )

    op.create_index(
        "idx_categories_name",
        "categories",
        ["name"],
        unique=True,
    )

    op.create_table(
        "words",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("word", sa.String(length=100), nullable=False),
        sa.Column("definition", sa.Text(), nullable=False),
        sa.Column("part_of_speech", sa.String(length=50), nullable=True),
        sa.Column("difficulty_level", sa.String(length=20), nullable=False),
        sa.Column("etymology", sa.Text(), nullable=True),
        sa.Column("usage_notes", sa.Text(), nullable=True),
        sa.Column("audio_url", sa.Text(), nullable=True),
        sa.Column("image_url", sa.Text(), nullable=True),
        sa.Column("examples", sa.ARRAY(sa.Text()), nullable=True),
        sa.Column("synonyms", sa.ARRAY(sa.Text()), nullable=True),
        sa.Column("antonyms", sa.ARRAY(sa.Text()), nullable=True),
        sa.Column("tags", sa.ARRAY(sa.Text()), nullable=True),
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
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("word"),
    )

    op.create_index(
        "idx_words_word",
        "words",
        ["word"],
        unique=True,
    )

    op.create_table(
        "lists",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=100), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("difficulty_level", sa.String(length=20), nullable=False),
        sa.Column("icon_name", sa.String(length=100), nullable=True),
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
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_table(
        "list_words",
        sa.Column("list_id", sa.Integer(), nullable=False),
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
        sa.PrimaryKeyConstraint("list_id", "word_id"),
        sa.ForeignKeyConstraint(["list_id"], ["lists.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["word_id"], ["words.id"], ondelete="CASCADE"),
    )

    op.create_index(
        "idx_list_words_list_id",
        "list_words",
        ["list_id"],
        unique=False,
    )

    op.create_index(
        "idx_list_words_word_id",
        "list_words",
        ["word_id"],
        unique=False,
    )

    op.create_table(
        "list_categories",
        sa.Column("list_id", sa.Integer(), nullable=False),
        sa.Column("category_id", sa.Integer(), nullable=False),
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
        sa.PrimaryKeyConstraint("list_id", "category_id"),
        sa.ForeignKeyConstraint(["list_id"], ["lists.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["category_id"], ["categories.id"], ondelete="CASCADE"),
    )

    op.create_index(
        "idx_list_categories_list_id",
        "list_categories",
        ["list_id"],
        unique=False,
    )

    op.create_index(
        "idx_list_categories_category_id",
        "list_categories",
        ["category_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index("idx_list_categories_category_id")
    op.drop_index("idx_list_categories_list_id")
    op.drop_index("idx_list_words_word_id")
    op.drop_index("idx_list_words_list_id")
    op.drop_index("idx_words_tags")
    op.drop_index("idx_lists_category_id")
    op.drop_table("list_categories")
    op.drop_table("list_words")
    op.drop_table("lists")
    op.drop_table("words")
    op.drop_table("categories")
