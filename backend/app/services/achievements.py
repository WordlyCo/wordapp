from app.models.achievement import Achievement, UserAchievement
import uuid
from app.config.db import get_pool
from fastapi import HTTPException
from typing import List, Optional
from datetime import datetime

class AchievementService:
    pool = None

    async def create(self):
        self.pool = await get_pool()

    async def get_achievement_by_id(self, achievement_id: uuid.UUID) -> Achievement:
        """Get achievement by ID"""
        query = """
            SELECT * FROM achievements
            WHERE id = $1
        """
        achievement = await self.pool.fetchrow(query, achievement_id)
        if not achievement:
            raise HTTPException(status_code=404, detail="Achievement not found")
        return Achievement(**achievement)

    async def get_all_achievements(self) -> List[Achievement]:
        """Get all available achievements"""
        query = """
            SELECT * FROM achievements
            ORDER BY points ASC
        """
        achievements = await self.pool.fetch(query)
        return [Achievement(**achievement) for achievement in achievements]

    async def get_user_achievements(self, user_id: uuid.UUID) -> List[UserAchievement]:
        """Get all achievements earned by a user"""
        query = """
            SELECT ua.*, a.name, a.description, a.points, a.icon_url, a.icon_name
            FROM user_achievements ua
            JOIN achievements a ON ua.achievement_id = a.id
            WHERE ua.user_id = $1
            ORDER BY ua.achieved_at DESC
        """
        achievements = await self.pool.fetch(query, user_id)
        return [UserAchievement(**achievement) for achievement in achievements]

    async def award_achievement(self, user_id: uuid.UUID, achievement_id: uuid.UUID) -> UserAchievement:
        """Award an achievement to a user"""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Check if user already has the achievement
                check_query = """
                    SELECT * FROM user_achievements
                    WHERE user_id = $1 AND achievement_id = $2
                """
                existing = await conn.fetchrow(check_query, user_id, achievement_id)
                if existing:
                    return UserAchievement(**existing)

                # Award the achievement
                query = """
                    INSERT INTO user_achievements (user_id, achievement_id, achieved_at)
                    VALUES ($1, $2, CURRENT_TIMESTAMP)
                    RETURNING *
                """
                result = await conn.fetchrow(query, user_id, achievement_id)
                return UserAchievement(**result)

    async def check_word_achievements(self, user_id: uuid.UUID, total_words: int) -> List[UserAchievement]:
        """Check and award word-related achievements"""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Get word-related achievements
                query = """
                    SELECT * FROM achievements
                    WHERE criteria LIKE '%words%'
                """
                achievements = await conn.fetch(query)
                
                new_achievements = []
                for achievement in achievements:
                    # Check if user already has this achievement
                    check_query = """
                        SELECT * FROM user_achievements
                        WHERE user_id = $1 AND achievement_id = $2
                    """
                    existing = await conn.fetchrow(check_query, user_id, achievement['id'])
                    
                    if not existing:
                        # Award the achievement
                        award_query = """
                            INSERT INTO user_achievements (user_id, achievement_id, achieved_at)
                            VALUES ($1, $2, CURRENT_TIMESTAMP)
                            RETURNING *
                        """
                        result = await conn.fetchrow(award_query, user_id, achievement['id'])
                        new_achievements.append(UserAchievement(**result))
                
                return new_achievements

    async def check_streak_achievements(self, user_id: uuid.UUID, current_streak: int) -> List[UserAchievement]:
        """Check and award streak-related achievements"""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Get streak-related achievements
                query = """
                    SELECT * FROM achievements
                    WHERE criteria LIKE '%streak%'
                """
                achievements = await conn.fetch(query)
                
                new_achievements = []
                for achievement in achievements:
                    # Check if user already has this achievement
                    check_query = """
                        SELECT * FROM user_achievements
                        WHERE user_id = $1 AND achievement_id = $2
                    """
                    existing = await conn.fetchrow(check_query, user_id, achievement['id'])
                    
                    if not existing:
                        # Award the achievement
                        award_query = """
                            INSERT INTO user_achievements (user_id, achievement_id, achieved_at)
                            VALUES ($1, $2, CURRENT_TIMESTAMP)
                            RETURNING *
                        """
                        result = await conn.fetchrow(award_query, user_id, achievement['id'])
                        new_achievements.append(UserAchievement(**result))
                
                return new_achievements

    async def check_accuracy_achievements(self, user_id: uuid.UUID, accuracy: float) -> List[UserAchievement]:
        """Check and award accuracy-related achievements"""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Get accuracy-related achievements
                query = """
                    SELECT * FROM achievements
                    WHERE criteria LIKE '%accuracy%'
                """
                achievements = await conn.fetch(query)
                
                new_achievements = []
                for achievement in achievements:
                    # Check if user already has this achievement
                    check_query = """
                        SELECT * FROM user_achievements
                        WHERE user_id = $1 AND achievement_id = $2
                    """
                    existing = await conn.fetchrow(check_query, user_id, achievement['id'])
                    
                    if not existing:
                        # Award the achievement
                        award_query = """
                            INSERT INTO user_achievements (user_id, achievement_id, achieved_at)
                            VALUES ($1, $2, CURRENT_TIMESTAMP)
                            RETURNING *
                        """
                        result = await conn.fetchrow(award_query, user_id, achievement['id'])
                        new_achievements.append(UserAchievement(**result))
                
                return new_achievements

    async def get_user_achievement_progress(self, user_id: uuid.UUID) -> List[dict]:
        """Get user's progress towards all achievements"""
        query = """
            WITH user_achievements AS (
                SELECT achievement_id
                FROM user_achievements
                WHERE user_id = $1
            )
            SELECT 
                a.*,
                CASE 
                    WHEN ua.achievement_id IS NOT NULL THEN true
                    ELSE false
                END as earned
            FROM achievements a
            LEFT JOIN user_achievements ua ON a.id = ua.achievement_id
            ORDER BY a.points ASC
        """
        results = await self.pool.fetch(query, user_id)
        return results

async def get_achievement_service():
    service = AchievementService()
    await service.create()
    return service 