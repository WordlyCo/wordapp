"""users

Revision ID: 3c1b453b9bcf
Revises:
Create Date: 2025-03-06

"""

from typing import Sequence, Union
import os
from pathlib import Path

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "3c1b453b9bcf"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Read and execute the schema.sql file from migrations directory
    schema_path = Path(__file__).parents[1].parent / "schema.sql"
    print(f"Looking for schema at: {schema_path}")

    with open(schema_path, "r") as schema_file:
        schema_sql = schema_file.read()

    op.execute(schema_sql)


def downgrade() -> None:
    op.execute(
        """
    DROP TABLE IF EXISTS 
        session_words,
        practice_sessions,
        user_achievements,
        achievements,
        word_progress,
        user_list_words,
        user_word_lists,
        words,
        word_categories,
        user_stats,
        user_preferences,
        users
    CASCADE;
    """
    )
