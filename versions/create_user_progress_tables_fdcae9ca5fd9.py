"""create_user_progress_tables

Revision ID: fdcae9ca5fd9
Revises: b3c27f450b20
Create Date: 2024-04-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "fdcae9ca5fd9"
down_revision: Union[str, None] = "b3c27f450b20"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
    CREATE TABLE IF NOT EXISTS user_word_list_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_list_id INTEGER NOT NULL REFERENCES word_lists(id) ON DELETE CASCADE,
        is_favorite BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, word_list_id)
    );

    CREATE TABLE IF NOT EXISTS word_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
        familiarity_level INTEGER NOT NULL DEFAULT 0 CHECK (familiarity_level BETWEEN 0 AND 5),
        next_review_date TIMESTAMP,
        last_reviewed_at TIMESTAMP,
        times_reviewed INTEGER NOT NULL DEFAULT 0,
        times_correct INTEGER NOT NULL DEFAULT 0,
        note TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, word_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_user_word_list_subscriptions_user_id ON user_word_list_subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_word_list_subscriptions_word_list_id ON user_word_list_subscriptions(word_list_id);
    CREATE INDEX IF NOT EXISTS idx_word_progress_user_id ON word_progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_word_progress_word_id ON word_progress(word_id);
    CREATE INDEX IF NOT EXISTS idx_word_progress_next_review_date ON word_progress(next_review_date);
    CREATE INDEX IF NOT EXISTS idx_word_progress_familiarity_level ON word_progress(familiarity_level);
    """
    )


def downgrade() -> None:
    op.execute(
        """
    DROP INDEX IF EXISTS idx_word_progress_familiarity_level;
    DROP INDEX IF EXISTS idx_word_progress_next_review_date;
    DROP INDEX IF EXISTS idx_word_progress_word_id;
    DROP INDEX IF EXISTS idx_word_progress_user_id;
    DROP INDEX IF EXISTS idx_user_word_list_subscriptions_word_list_id;
    DROP INDEX IF EXISTS idx_user_word_list_subscriptions_user_id;
    
    DROP TABLE IF EXISTS word_progress;
    DROP TABLE IF EXISTS user_word_list_subscriptions;
    """
    )
