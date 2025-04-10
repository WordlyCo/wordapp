"""create_user_tables

Revision ID: b3c27f450b20
Revises: 8618367044ea
Create Date: 2024-04-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b3c27f450b20"
down_revision: Union[str, None] = "8618367044ea"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_preferences (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        daily_word_goal INTEGER NOT NULL DEFAULT 10,
        difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,
        notification_type VARCHAR(20) NOT NULL DEFAULT 'push',
        theme VARCHAR(20) NOT NULL DEFAULT 'light',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_stats (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        total_words_learned INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        total_practice_time INTEGER DEFAULT 0,
        average_accuracy REAL DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
    """
    )


def downgrade() -> None:
    op.execute(
        """
    DROP INDEX IF EXISTS idx_user_stats_user_id;
    DROP INDEX IF EXISTS idx_user_preferences_user_id;
    DROP TABLE IF EXISTS user_stats;
    DROP TABLE IF EXISTS user_preferences;
    DROP TABLE IF EXISTS users;
    """
    )
