"""create_achievement_tables

Revision ID: 8618367044ea
Revises: fdcae9ca5fd9
Create Date: 2024-04-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "8618367044ea"
down_revision: Union[str, None] = "fdcae9ca5fd9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
    CREATE TABLE IF NOT EXISTS achievements (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        criteria TEXT NOT NULL,
        points INTEGER NOT NULL,
        icon_url TEXT,
        icon_name TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
        achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
    CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
    """
    )


def downgrade() -> None:
    op.execute(
        """
    DROP INDEX IF EXISTS idx_user_achievements_achievement_id;
    DROP INDEX IF EXISTS idx_user_achievements_user_id;
    DROP TABLE IF EXISTS user_achievements;
    DROP TABLE IF EXISTS achievements;
    """
    )
