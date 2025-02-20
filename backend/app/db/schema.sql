-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Words Table
CREATE TABLE IF NOT EXISTS words (
    word_id SERIAL PRIMARY KEY,
    word VARCHAR(100) UNIQUE NOT NULL,
    definition TEXT NOT NULL,
    difficulty_level INT DEFAULT 1
);

-- User Progress Table
CREATE TABLE IF NOT EXISTS user_words (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    word_id INT REFERENCES words(word_id) ON DELETE CASCADE,
    proficiency_level INT DEFAULT 0,
    last_reviewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, word_id)
);

-- Leaderboard Table
CREATE TABLE IF NOT EXISTS leaderboard (
    leaderboard_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    total_score INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    score INT NOT NULL,
    session_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Friends Table
CREATE TABLE IF NOT EXISTS friends (
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    friend_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    status VARCHAR(20) CHECK (status IN ('pending', 'accepted', 'blocked')),
    PRIMARY KEY (user_id, friend_id)
);
