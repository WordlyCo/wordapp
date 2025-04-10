"""create_quiz_tables

Revision ID: 6f5bf99521f4
Revises: 931c9f765b12
Create Date: 2024-04-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6f5bf99521f4"
down_revision: Union[str, None] = "931c9f765b12"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
    -- Quiz-related tables
    CREATE TABLE IF NOT EXISTS quiz_items (
        id SERIAL PRIMARY KEY,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        correct_answer TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS quiz_options (
        id SERIAL PRIMARY KEY,
        quiz_item_id INTEGER NOT NULL REFERENCES quiz_items(id) ON DELETE CASCADE,
        option_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS    -- Create indexes for quiz-related tables
 idx_quiz_items_word_id ON quiz_items(word_id);
    CREATE INDEX IF NOT EXISTS idx_quiz_options_quiz_item_id ON quiz_options(quiz_item_id);
    """
    )


def downgrade() -> None:
    op.execute(
        """
    DROP INDEX IF EXISTS idx_quiz_options_quiz_item_id;
    DROP INDEX IF EXISTS idx_quiz_items_word_id;
    DROP TABLE IF EXISTS quiz_options;
    DROP TABLE IF EXISTS quiz_items;
    """
    )
