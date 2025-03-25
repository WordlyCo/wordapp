from app.models.users import UserPreferences, UserStats
import uuid
from app.config.db import get_pool
from fastapi import HTTPException
from typing import Optional

class PreferencesService:
    pool = None

    async def create(self):
        self.pool = await get_pool()

    async def get_user_preferences(self, user_id: uuid.UUID) -> UserPreferences:
        """Get user preferences by user ID"""
        query = """
            SELECT * FROM user_preferences
            WHERE user_id = $1
        """
        preferences = await self.pool.fetchrow(query, user_id)
        if not preferences:
            raise HTTPException(status_code=404, detail="User preferences not found")
        return UserPreferences(**preferences)

    async def update_user_preferences(self, user_id: uuid.UUID, preferences: UserPreferences) -> UserPreferences:
        """Update user preferences"""
        query = """
            INSERT INTO user_preferences (
                user_id, daily_word_goal, difficulty_level,
                notification_enabled, notification_type, theme
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id) DO UPDATE
            SET daily_word_goal = EXCLUDED.daily_word_goal,
                difficulty_level = EXCLUDED.difficulty_level,
                notification_enabled = EXCLUDED.notification_enabled,
                notification_type = EXCLUDED.notification_type,
                theme = EXCLUDED.theme,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        """
        result = await self.pool.fetchrow(
            query,
            user_id,
            preferences.daily_word_goal,
            preferences.difficulty_level,
            preferences.notification_enabled,
            preferences.notification_type,
            preferences.theme
        )
        return UserPreferences(**result)

    async def get_user_stats(self, user_id: uuid.UUID) -> UserStats:
        """Get user statistics by user ID"""
        query = """
            SELECT * FROM user_stats
            WHERE user_id = $1
        """
        stats = await self.pool.fetchrow(query, user_id)
        if not stats:
            raise HTTPException(status_code=404, detail="User stats not found")
        return UserStats(**stats)

    async def update_user_stats(self, user_id: uuid.UUID, stats: UserStats) -> UserStats:
        """Update user statistics"""
        query = """
            INSERT INTO user_stats (
                user_id, total_words_learned, current_streak,
                longest_streak, total_practice_time, average_accuracy
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (user_id) DO UPDATE
            SET total_words_learned = EXCLUDED.total_words_learned,
                current_streak = EXCLUDED.current_streak,
                longest_streak = EXCLUDED.longest_streak,
                total_practice_time = EXCLUDED.total_practice_time,
                average_accuracy = EXCLUDED.average_accuracy,
                updated_at = CURRENT_TIMESTAMP
            RETURNING *
        """
        result = await self.pool.fetchrow(
            query,
            user_id,
            stats.total_words_learned,
            stats.current_streak,
            stats.longest_streak,
            stats.total_practice_time,
            stats.average_accuracy
        )
        return UserStats(**result)

    async def update_daily_word_goal(self, user_id: uuid.UUID, goal: int) -> UserPreferences:
        """Update user's daily word goal"""
        query = """
            UPDATE user_preferences
            SET daily_word_goal = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $2
            RETURNING *
        """
        result = await self.pool.fetchrow(query, goal, user_id)
        if not result:
            raise HTTPException(status_code=404, detail="User preferences not found")
        return UserPreferences(**result)

    async def update_difficulty_level(self, user_id: uuid.UUID, level: str) -> UserPreferences:
        """Update user's difficulty level preference"""
        query = """
            UPDATE user_preferences
            SET difficulty_level = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $2
            RETURNING *
        """
        result = await self.pool.fetchrow(query, level, user_id)
        if not result:
            raise HTTPException(status_code=404, detail="User preferences not found")
        return UserPreferences(**result)

    async def update_notification_settings(self, user_id: uuid.UUID, enabled: bool, notification_type: str) -> UserPreferences:
        """Update user's notification settings"""
        query = """
            UPDATE user_preferences
            SET notification_enabled = $1,
                notification_type = $2,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $3
            RETURNING *
        """
        result = await self.pool.fetchrow(query, enabled, notification_type, user_id)
        if not result:
            raise HTTPException(status_code=404, detail="User preferences not found")
        return UserPreferences(**result)

    async def update_theme(self, user_id: uuid.UUID, theme: str) -> UserPreferences:
        """Update user's theme preference"""
        query = """
            UPDATE user_preferences
            SET theme = $1,
                updated_at = CURRENT_TIMESTAMP
            WHERE user_id = $2
            RETURNING *
        """
        result = await self.pool.fetchrow(query, theme, user_id)
        if not result:
            raise HTTPException(status_code=404, detail="User preferences not found")
        return UserPreferences(**result)

async def get_preferences_service():
    service = PreferencesService()
    await service.create()
    return service
