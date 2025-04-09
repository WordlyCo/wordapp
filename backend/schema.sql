-- User-related tables
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_words_learned INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    total_practice_time INTEGER DEFAULT 0,
    average_accuracy REAL DEFAULT 0.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Word-related tables
CREATE TABLE IF NOT EXISTS word_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word VARCHAR(100) UNIQUE NOT NULL,
    definition TEXT NOT NULL,
    part_of_speech VARCHAR(50),
    category_id INTEGER REFERENCES word_categories(id) ON DELETE SET NULL,
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
    etymology TEXT,
    usage_notes TEXT,
    audio_url TEXT,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS word_examples (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    example_sentence TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS word_synonyms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    synonym TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS word_antonyms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    antonym TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS word_tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    tag TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(word_id, tag)
);

-- Quiz-related tables
CREATE TABLE IF NOT EXISTS quiz_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    correct_answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quiz_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quiz_item_id INTEGER NOT NULL REFERENCES quiz_items(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress and lists
CREATE TABLE IF NOT EXISTS user_word_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_list_words (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER NOT NULL REFERENCES user_word_lists(id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(list_id, word_id)
);

CREATE TABLE IF NOT EXISTS word_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    word_id INTEGER NOT NULL REFERENCES words(id) ON DELETE CASCADE,
    recognition_level INTEGER DEFAULT 0,
    usage_level INTEGER DEFAULT 0,
    mastery_score INTEGER DEFAULT 0,
    practice_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    last_practiced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievement system
CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_words_category_id ON words(category_id);
CREATE INDEX IF NOT EXISTS idx_user_word_lists_user_id ON user_word_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_user_list_words_list_id ON user_list_words(list_id);
CREATE INDEX IF NOT EXISTS idx_user_list_words_word_id ON user_list_words(word_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_user_id ON word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_word_progress_word_id ON word_progress(word_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_word_examples_word_id ON word_examples(word_id);
CREATE INDEX IF NOT EXISTS idx_word_synonyms_word_id ON word_synonyms(word_id);
CREATE INDEX IF NOT EXISTS idx_word_antonyms_word_id ON word_antonyms(word_id);
CREATE INDEX IF NOT EXISTS idx_word_tags_word_id ON word_tags(word_id);
CREATE INDEX IF NOT EXISTS idx_quiz_options_quiz_item_id ON quiz_options(quiz_item_id);
CREATE INDEX IF NOT EXISTS idx_quiz_items_word_id ON quiz_items(word_id);

-- Trigger for automatic updated_at timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables with updated_at
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_user_preferences_timestamp BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_user_stats_timestamp BEFORE UPDATE ON user_stats FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_word_categories_timestamp BEFORE UPDATE ON word_categories FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_words_timestamp BEFORE UPDATE ON words FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_user_word_lists_timestamp BEFORE UPDATE ON user_word_lists FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_word_progress_timestamp BEFORE UPDATE ON word_progress FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_achievements_timestamp BEFORE UPDATE ON achievements FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_quiz_items_timestamp BEFORE UPDATE ON quiz_items FOR EACH ROW EXECUTE PROCEDURE update_timestamp();