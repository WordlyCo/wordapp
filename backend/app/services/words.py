from app.models.word import Word, WordCategory, WordProgress, UserWordList
import uuid
from app.config.db import get_pool
from typing import List, Optional
from fastapi import HTTPException

class WordService:
    pool = None

    async def create(self):
        self.pool = await get_pool()

    async def get_word_by_id(self, id: uuid.UUID) -> Word:
        """Get a word by its ID"""
        query = """ 
            SELECT * FROM words
            WHERE id = $1
        """
        word_record = await self.pool.fetchrow(query, id)
        if word_record is None:
            raise HTTPException(status_code=404, detail="Word not found")
        return Word(**word_record)

    async def get_words_by_category(self, category_id: uuid.UUID) -> List[Word]:
        """Get all words in a specific category"""
        query = """
            SELECT * FROM words
            WHERE category_id = $1
        """
        word_records = await self.pool.fetch(query, category_id)
        return [Word(**record) for record in word_records]

    async def get_word_progress(self, user_id: uuid.UUID, word_id: uuid.UUID) -> WordProgress:
        """Get a user's progress for a specific word"""
        query = """
            SELECT * FROM word_progress
            WHERE user_id = $1 AND word_id = $2
        """
        word_progress_record = await self.pool.fetchrow(query, user_id, word_id)
        if word_progress_record is None:
            raise HTTPException(status_code=404, detail="Word progress not found")
        return WordProgress(**word_progress_record)

    async def update_word_progress(self, user_id: uuid.UUID, word_id: uuid.UUID, success: bool) -> WordProgress:
        """Update a user's progress after practicing a word"""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Get current progress or create new
                query = """
                    INSERT INTO word_progress (user_id, word_id, practice_count, success_count, last_practiced)
                    VALUES ($1, $2, 1, $3, CURRENT_TIMESTAMP)
                    ON CONFLICT (user_id, word_id) DO UPDATE
                    SET practice_count = word_progress.practice_count + 1,
                        success_count = word_progress.success_count + $3,
                        last_practiced = CURRENT_TIMESTAMP,
                        updated_at = CURRENT_TIMESTAMP
                    RETURNING *
                """
                success_count = 1 if success else 0
                progress_record = await conn.fetchrow(query, user_id, word_id, success_count)
                
                # Calculate new mastery score
                mastery_score = (progress_record['success_count'] / progress_record['practice_count']) * 100
                
                # Update mastery score
                update_query = """
                    UPDATE word_progress
                    SET mastery_score = $1,
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = $2 AND word_id = $3
                    RETURNING *
                """
                final_record = await conn.fetchrow(update_query, mastery_score, user_id, word_id)
                
                return WordProgress(**final_record)

    async def get_user_word_lists(self, user_id: uuid.UUID) -> List[UserWordList]:
        """Get all word lists created by a user"""
        query = """
            SELECT * FROM user_word_lists
            WHERE user_id = $1
            ORDER BY created_at DESC
        """
        lists = await self.pool.fetch(query, user_id)
        return [UserWordList(**list_record) for list_record in lists]

    async def create_user_word_list(self, user_id: uuid.UUID, name: str, description: str) -> UserWordList:
        """Create a new word list for a user"""
        query = """
            INSERT INTO user_word_lists (user_id, name, description)
            VALUES ($1, $2, $3)
            RETURNING *
        """
        list_record = await self.pool.fetchrow(query, user_id, name, description)
        return UserWordList(**list_record)

    async def add_word_to_list(self, list_id: uuid.UUID, word_id: uuid.UUID) -> None:
        """Add a word to a user's word list"""
        query = """
            INSERT INTO user_list_words (list_id, word_id)
            VALUES ($1, $2)
            ON CONFLICT (list_id, word_id) DO NOTHING
        """
        await self.pool.execute(query, list_id, word_id)

    async def get_words_by_difficulty(self, difficulty_level: str) -> List[Word]:
        """Get words filtered by difficulty level"""
        query = """
            SELECT * FROM words
            WHERE difficulty_level = $1
            ORDER BY word ASC
        """
        word_records = await self.pool.fetch(query, difficulty_level)
        return [Word(**record) for record in word_records]

    async def get_daily_words(self, user_id: uuid.UUID, count: int) -> List[Word]:
        """Get daily practice words for a user based on their level"""
        # First get user's preferences for difficulty level
        preferences_query = """
            SELECT difficulty_level FROM user_preferences
            WHERE user_id = $1
        """
        preferences = await self.pool.fetchrow(preferences_query, user_id)
        if not preferences:
            raise HTTPException(status_code=404, detail="User preferences not found")

        # Get words that user hasn't practiced recently
        query = """
            WITH user_progress AS (
                SELECT word_id, last_practiced
                FROM word_progress
                WHERE user_id = $1
            )
            SELECT w.*
            FROM words w
            LEFT JOIN user_progress up ON w.id = up.word_id
            WHERE w.difficulty_level = $2
            AND (up.last_practiced IS NULL OR up.last_practiced < CURRENT_DATE)
            ORDER BY RANDOM()
            LIMIT $3
        """
        word_records = await self.pool.fetch(query, user_id, preferences['difficulty_level'], count)
        return [Word(**record) for record in word_records]

    async def search_words(self, query: str) -> List[Word]:
        """Search words by text query"""
        search_query = """
            SELECT * FROM words
            WHERE word ILIKE $1 
            OR definition ILIKE $1
            OR $1 = ANY(synonyms)
            OR $1 = ANY(antonyms)
            ORDER BY word ASC
        """
        search_pattern = f"%{query}%"
        word_records = await self.pool.fetch(search_query, search_pattern)
        return [Word(**record) for record in word_records]

async def get_word_service():
    service = WordService()
    await service.create()
    return service 