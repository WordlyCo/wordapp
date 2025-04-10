"""create_word_tables

Revision ID: 931c9f765b12
Revises: b3c27f450b20
Create Date: 2024-04-07

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "931c9f765b12"
down_revision: Union[str, None] = "b3c27f450b20"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute(
        """
    CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        icon_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS words (
        id SERIAL PRIMARY KEY,
        word VARCHAR(100) UNIQUE NOT NULL,
        definition TEXT NOT NULL,
        part_of_speech VARCHAR(50),
        difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        etymology TEXT,
        usage_notes TEXT,
        audio_url TEXT,
        image_url TEXT,
        examples TEXT[] DEFAULT '{}',
        synonyms TEXT[] DEFAULT '{}',
        antonyms TEXT[] DEFAULT '{}',
        tags TEXT[] DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS word_lists (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        category_id INTEGER REFERENCES categories(id),
        difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
        is_curated BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(name)
    );

    CREATE TABLE IF NOT EXISTS word_list_words (
        word_list_id INTEGER REFERENCES word_lists(id) ON DELETE CASCADE,
        word_id INTEGER REFERENCES words(id) ON DELETE CASCADE,
        display_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (word_list_id, word_id)
    );

    CREATE TABLE IF NOT EXISTS word_list_categories (
        word_list_id INTEGER REFERENCES word_lists(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
        PRIMARY KEY (word_list_id, category_id)
    );
    
    CREATE INDEX IF NOT EXISTS idx_word_list_words_word_list_id ON word_list_words(word_list_id);
    CREATE INDEX IF NOT EXISTS idx_word_list_words_word_id ON word_list_words(word_id);
    CREATE INDEX IF NOT EXISTS idx_word_list_categories_word_list_id ON word_list_categories(word_list_id);
    CREATE INDEX IF NOT EXISTS idx_word_list_categories_category_id ON word_list_categories(category_id);
    CREATE INDEX IF NOT EXISTS idx_word_lists_category_id ON word_lists(category_id);
    CREATE INDEX IF NOT EXISTS idx_words_tags ON words USING GIN (tags);
    """
    )


def downgrade() -> None:
    op.execute(
        """
    DROP INDEX IF EXISTS idx_word_list_categories_category_id;
    DROP INDEX IF EXISTS idx_word_list_categories_word_list_id;
    DROP INDEX IF EXISTS idx_word_list_words_word_id;
    DROP INDEX IF EXISTS idx_word_list_words_word_list_id;
    DROP INDEX IF EXISTS idx_words_tags;
    DROP INDEX IF EXISTS idx_word_lists_category_id;
    
    DROP TABLE IF EXISTS word_list_categories;
    DROP TABLE IF EXISTS word_list_words;
    DROP TABLE IF EXISTS word_lists;
    DROP TABLE IF EXISTS words;
    """
    )
