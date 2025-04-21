import asyncpg
from app.config.db import get_pool
from fastapi import Depends
from app.models.quiz import Quiz, QuizCreate
from typing import List, Dict, Any
from app.models.word import Word
from app.models.user import WordProgress


class QuizService:
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool

    async def insert_quiz(self, quiz: QuizCreate) -> Quiz:
        query = """
        INSERT INTO quizzes (word_id, quiz_type, question, options, correct_options)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        """
        values = (
            quiz.word_id,
            quiz.quiz_type,
            quiz.question,
            quiz.options,
            quiz.correct_options,
        )
        try:
            quiz_record = await self.pool.fetchrow(query, *values)
            return Quiz(**quiz_record)
        except Exception as e:
            raise Exception(f"Error inserting quiz: {str(e)}")

    async def get_random_quiz_by_word_id(self, word_id: int) -> Quiz:
        query = """
        SELECT * FROM quizzes WHERE word_id = $1
        ORDER BY RANDOM()
        LIMIT 1
        """
        try:
            quiz_record = await self.pool.fetchrow(query, word_id)
            return Quiz(**quiz_record)
        except Exception as e:
            raise Exception(f"Error fetching random quiz by word_id: {str(e)}")

    async def get_random_quizzes_by_word_ids(self, word_ids: List[int]) -> List[Quiz]:
        query = """
        WITH RandomizedQuizzes AS (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY word_id ORDER BY RANDOM()) as rn
            FROM quizzes
            WHERE word_id = ANY($1)
        )
        SELECT * FROM RandomizedQuizzes
        WHERE rn = 1
        """
        try:
            quizzes = await self.pool.fetch(query, word_ids)
            return [Quiz(**quiz) for quiz in quizzes]
        except Exception as e:
            raise Exception(f"Error fetching random quizzes by word_ids: {str(e)}")

    async def get_daily_words_with_quizzes(self, user_id: int) -> List[Dict[str, Any]]:
        query_word_ids = """
        SELECT w.id
        FROM words w
        JOIN word_progress wp ON w.id = wp.word_id
        JOIN user_lists ul ON ul.list_id = (
            SELECT lw.list_id 
            FROM list_words lw 
            WHERE lw.word_id = w.id
        )
        WHERE wp.user_id = $1
        AND ul.user_id = $1
        AND wp.recognition_mastery_score <= 4  -- THRESHOLD FOR WORDS TO BE PRACTICED
        ORDER BY 
            -- Prioritize words that need review (low mastery but some practice)
            CASE 
                WHEN wp.recognition_mastery_score BETWEEN 1 AND 3 THEN 1
                WHEN wp.recognition_mastery_score < 3 THEN 2
                ELSE 3
            END,
            -- Then by recency (less recently practiced first)
            wp.updated_at ASC
        LIMIT $2;  
        """

        query_words = """
        SELECT * FROM words WHERE id = ANY($1)
        """

        # one random quiz per word using a window function
        query_quizzes = """
        WITH RankedQuizzes AS (
            SELECT *, ROW_NUMBER() OVER (PARTITION BY word_id ORDER BY RANDOM()) as rn
            FROM quizzes
            WHERE word_id = ANY($1)
        )
        SELECT * FROM RankedQuizzes WHERE rn = 1
        """

        # progress information for each word
        query_progress = """
        SELECT * FROM word_progress
        WHERE user_id = $1 AND word_id = ANY($2)
        """

        daily_word_goal_query = """
        SELECT daily_word_goal FROM user_preferences WHERE user_id = $1
        """

        try:
            daily_word_goal_record = await self.pool.fetchrow(
                daily_word_goal_query, user_id
            )
            daily_word_goal = (
                daily_word_goal_record["daily_word_goal"]
                if daily_word_goal_record
                else 5
            )

            word_records = await self.pool.fetch(
                query_word_ids, user_id, daily_word_goal
            )

            word_ids = [record["id"] for record in word_records]

            if not word_ids:
                return []

            words_records = await self.pool.fetch(query_words, word_ids)
            quizzes_records = await self.pool.fetch(query_quizzes, word_ids)
            progress_records = await self.pool.fetch(query_progress, user_id, word_ids)

            quizzes_dict = {}
            for quiz_record in quizzes_records:
                quiz = Quiz(**dict(quiz_record))
                quizzes_dict[quiz.word_id] = quiz

            progress_dict = {}
            for progress_record in progress_records:
                progress = WordProgress(**dict(progress_record))
                progress_dict[progress.word_id] = progress

            words_with_quizzes = []
            for word_record in words_records:
                word_dict = dict(word_record)
                word_id = word_dict["id"]

                quiz = quizzes_dict.get(word_id)
                if quiz:
                    word_dict["quiz"] = quiz.model_dump(
                        by_alias=True, exclude_none=False
                    )
                else:
                    word_dict["quiz"] = None

                progress = progress_dict.get(word_id)
                if progress:
                    word_dict["word_progress"] = progress.model_dump(
                        by_alias=True, exclude_none=False
                    )
                else:
                    word_dict["word_progress"] = None

                word = Word(**word_dict)
                words_with_quizzes.append(
                    word.model_dump(by_alias=True, exclude_none=False)
                )

            return words_with_quizzes
        except Exception as e:
            raise Exception(f"Error fetching daily words with quizzes: {str(e)}")


async def get_quiz_service(
    pool: asyncpg.Pool = Depends(get_pool),
) -> QuizService:
    return QuizService(pool)
