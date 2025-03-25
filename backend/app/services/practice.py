from app.models.practice import PracticeSession, SessionWord
import uuid
from app.config.db import get_pool
from fastapi import HTTPException
from typing import List, Optional
from datetime import datetime

class PracticeService:
    pool = None

    async def create(self):
        self.pool = await get_pool()

    async def start_practice_session(self, user_id: uuid.UUID, session_type: str) -> PracticeSession:
        """Start a new practice session"""
        query = """
            INSERT INTO practice_sessions (user_id, session_type, start_time)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING *
        """
        result = await self.pool.fetchrow(query, user_id, session_type)
        return PracticeSession(**result)

    async def end_practice_session(self, session_id: uuid.UUID) -> PracticeSession:
        """End a practice session and calculate results"""
        async with self.pool.acquire() as conn:
            async with conn.transaction():
                # Get session details
                session_query = """
                    SELECT * FROM practice_sessions
                    WHERE id = $1
                """
                session = await conn.fetchrow(session_query, session_id)
                if not session:
                    raise HTTPException(status_code=404, detail="Practice session not found")

                # Calculate session statistics
                stats_query = """
                    SELECT 
                        COUNT(*) as total_questions,
                        SUM(CASE WHEN was_correct THEN 1 ELSE 0 END) as correct_answers,
                        SUM(time_taken) as total_time
                    FROM session_words
                    WHERE session_id = $1
                """
                stats = await conn.fetchrow(stats_query, session_id)

                # Update session with results
                update_query = """
                    UPDATE practice_sessions
                    SET 
                        end_time = CURRENT_TIMESTAMP,
                        total_questions = $1,
                        correct_answers = $2,
                        total_time = $3
                    WHERE id = $4
                    RETURNING *
                """
                result = await conn.fetchrow(
                    update_query,
                    stats['total_questions'],
                    stats['correct_answers'],
                    stats['total_time'],
                    session_id
                )
                return PracticeSession(**result)

    async def record_word_practice(
        self, 
        session_id: uuid.UUID, 
        word_id: uuid.UUID, 
        was_correct: bool, 
        time_taken: int
    ) -> SessionWord:
        """Record a word practice attempt in a session"""
        query = """
            INSERT INTO session_words (
                session_id, word_id, was_correct, time_taken
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *
        """
        result = await self.pool.fetchrow(
            query, session_id, word_id, was_correct, time_taken
        )
        return SessionWord(**result)

    async def get_session_history(self, user_id: uuid.UUID) -> List[PracticeSession]:
        """Get user's practice session history"""
        query = """
            SELECT * FROM practice_sessions
            WHERE user_id = $1
            ORDER BY start_time DESC
        """
        sessions = await self.pool.fetch(query, user_id)
        return [PracticeSession(**session) for session in sessions]

    async def get_session_details(self, session_id: uuid.UUID) -> dict:
        """Get detailed information about a specific practice session"""
        async with self.pool.acquire() as conn:
            # Get session info
            session_query = """
                SELECT * FROM practice_sessions
                WHERE id = $1
            """
            session = await conn.fetchrow(session_query, session_id)
            if not session:
                raise HTTPException(status_code=404, detail="Practice session not found")

            # Get session words with word details
            words_query = """
                SELECT sw.*, w.word, w.definition, w.difficulty_level
                FROM session_words sw
                JOIN words w ON sw.word_id = w.id
                WHERE sw.session_id = $1
                ORDER BY sw.created_at ASC
            """
            words = await conn.fetch(words_query, session_id)

            return {
                "session": PracticeSession(**session),
                "words": [SessionWord(**word) for word in words]
            }

    async def get_user_practice_stats(self, user_id: uuid.UUID) -> dict:
        """Get user's overall practice statistics"""
        query = """
            SELECT 
                COUNT(*) as total_sessions,
                SUM(total_questions) as total_questions,
                SUM(correct_answers) as total_correct,
                SUM(total_time) as total_time,
                AVG(correct_answers::float / NULLIF(total_questions, 0)) as average_accuracy
            FROM practice_sessions
            WHERE user_id = $1
        """
        stats = await self.pool.fetchrow(query, user_id)
        return stats

    async def get_daily_practice_goal_progress(self, user_id: uuid.UUID) -> dict:
        """Get user's progress towards their daily practice goal"""
        async with self.pool.acquire() as conn:
            # Get user's daily goal
            goal_query = """
                SELECT daily_word_goal
                FROM user_preferences
                WHERE user_id = $1
            """
            goal = await conn.fetchrow(goal_query, user_id)
            if not goal:
                raise HTTPException(status_code=404, detail="User preferences not found")

            # Get today's practice count
            today_query = """
                SELECT COUNT(*) as practice_count
                FROM practice_sessions
                WHERE user_id = $1
                AND DATE(start_time) = CURRENT_DATE
            """
            today = await conn.fetchrow(today_query, user_id)

            return {
                "daily_goal": goal['daily_word_goal'],
                "current_count": today['practice_count'],
                "remaining": max(0, goal['daily_word_goal'] - today['practice_count'])
            }

    async def get_recommended_practice_words(self, user_id: uuid.UUID, count: int) -> List[dict]:
        """Get recommended words for practice based on user's progress"""
        query = """
            WITH user_progress AS (
                SELECT word_id, mastery_score, last_practiced
                FROM word_progress
                WHERE user_id = $1
            ),
            word_difficulty AS (
                SELECT w.*, 
                       COALESCE(up.mastery_score, 0) as user_mastery,
                       COALESCE(up.last_practiced, '1970-01-01'::timestamp) as last_practiced
                FROM words w
                LEFT JOIN user_progress up ON w.id = up.word_id
            )
            SELECT *
            FROM word_difficulty
            WHERE user_mastery < 80
            ORDER BY 
                CASE 
                    WHEN last_practiced < CURRENT_TIMESTAMP - INTERVAL '7 days' THEN 0
                    ELSE 1
                END,
                user_mastery ASC,
                RANDOM()
            LIMIT $2
        """
        words = await self.pool.fetch(query, user_id, count)
        return words

async def get_practice_service():
    service = PracticeService()
    await service.create()
    return service 