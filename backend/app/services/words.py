from app.models.word import Word, WordCategory, WordProgress, UserWordList
import uuid
from app.config.db import get_pool

class WordService:
    pool = None

    async def create(self):
        self.pool = await get_pool()

    async def get_word_by_id(self, id: uuid.UUID):
        """Get a word by its ID"""
        pass

    async def get_words_by_category(self, category_id: uuid.UUID):
        """Get all words in a specific category"""
        pass

    async def get_word_progress(self, user_id: uuid.UUID, word_id: uuid.UUID):
        """Get a user's progress for a specific word"""
        pass

    async def update_word_progress(self, user_id: uuid.UUID, word_id: uuid.UUID, success: bool):
        """Update a user's progress after practicing a word"""
        pass

    async def get_user_word_lists(self, user_id: uuid.UUID):
        """Get all word lists created by a user"""
        pass

    async def create_user_word_list(self, user_id: uuid.UUID, name: str, description: str):
        """Create a new word list for a user"""
        pass

    async def add_word_to_list(self, list_id: uuid.UUID, word_id: uuid.UUID):
        """Add a word to a user's word list"""
        pass

    async def get_words_by_difficulty(self, difficulty_level: str):
        """Get words filtered by difficulty level"""
        pass

    async def get_daily_words(self, user_id: uuid.UUID, count: int):
        """Get daily practice words for a user based on their level"""
        pass

    async def search_words(self, query: str):
        """Search words by text query"""
        pass

async def get_word_service():
    service = WordService()
    await service.create()
    return service 