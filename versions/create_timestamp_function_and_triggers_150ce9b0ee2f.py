"""create_timestamp_function_and_triggers

Revision ID: 150ce9b0ee2f
Revises: 8618367044ea
Create Date: 2024-04-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "150ce9b0ee2f"
down_revision: Union[str, None] = "8618367044ea"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
       NEW.updated_at = CURRENT_TIMESTAMP;
       RETURN NEW;
    END;
    $$ language 'plpgsql';

    CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_user_preferences_timestamp BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_user_stats_timestamp BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_word_categories_timestamp BEFORE UPDATE ON word_categories FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_words_timestamp BEFORE UPDATE ON words FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_user_word_lists_timestamp BEFORE UPDATE ON user_word_lists FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_word_progress_timestamp BEFORE UPDATE ON word_progress FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_achievements_timestamp BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    CREATE TRIGGER update_quiz_items_timestamp BEFORE UPDATE ON quiz_items FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
    """
    )


def downgrade() -> None:
    op.execute(
        """
    DROP TRIGGER IF EXISTS update_quiz_items_timestamp ON quiz_items;
    DROP TRIGGER IF EXISTS update_achievements_timestamp ON achievements;
    DROP TRIGGER IF EXISTS update_word_progress_timestamp ON word_progress;
    DROP TRIGGER IF EXISTS update_user_word_lists_timestamp ON user_word_lists;
    DROP TRIGGER IF EXISTS update_words_timestamp ON words;
    DROP TRIGGER IF EXISTS update_word_categories_timestamp ON word_categories;
    DROP TRIGGER IF EXISTS update_user_stats_timestamp ON user_stats;
    DROP TRIGGER IF EXISTS update_user_preferences_timestamp ON user_preferences;
    DROP TRIGGER IF EXISTS update_users_timestamp ON users;
    
    DROP FUNCTION IF EXISTS update_timestamp();
    """
    )
