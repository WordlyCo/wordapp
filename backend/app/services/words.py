from app.config.db import get_pool
from app.models.word import Word, WordUpdate, WordAlreadyExistsError, WordNotFoundError
import asyncpg
from typing import List
from fastapi import Depends


class WordService:
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool

    async def insert_word(self, word: Word) -> Word:
        try:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    db_word = await conn.fetchrow(
                        """
                    INSERT INTO words (
                    word, 
                    definition, 
                    part_of_speech,
                    difficulty_level,
                    examples,
                    synonyms,
                    antonyms,
                    tags,
                    etymology,
                    usage_notes,
                    audio_url,
                    image_url
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING *
                    """,
                        word.word,
                        word.definition,
                        word.part_of_speech,
                        word.difficulty_level,
                        word.examples or [],
                        word.synonyms or [],
                        word.antonyms or [],
                        word.tags or [],
                        word.etymology,
                        word.usage_notes,
                        word.audio_url,
                        word.image_url,
                    )
                    return Word(**db_word)
        except asyncpg.UniqueViolationError:
            raise WordAlreadyExistsError("Word already exists in the database")
        except Exception as e:
            raise e

    async def update_word(self, word_id: int, word_update: WordUpdate) -> Word:
        update_fields = word_update.model_dump(exclude_unset=True)
        if not update_fields:
            return await self.get_word_by_id(word_id)

        set_clauses = []
        values = []
        i = 1
        for field, value in update_fields.items():
            set_clauses.append(f"{field} = ${i}")
            values.append(value)
            i += 1

        values.append(word_id)
        query = f"""
            UPDATE words
            SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${i}
            RETURNING *
            """

        try:
            async with self.pool.acquire() as conn:
                updated_word_data = await conn.fetchrow(query, *values)
                if updated_word_data is None:
                    raise WordNotFoundError(f"Word with ID {word_id} not found")
                return Word(**updated_word_data)
        except asyncpg.IntegrityConstraintViolationError as e:
            raise ValueError(f"Update failed due to constraint violation: {e}")
        except Exception as e:
            print(f"Error updating word {word_id}: {e}")
            raise Exception(f"Error updating word: {str(e)}")

    async def get_word_by_id(self, word_id: int) -> Word:
        try:
            async with self.pool.acquire() as conn:
                word_data = await conn.fetchrow(
                    "SELECT * FROM words WHERE id = $1", word_id
                )
                if word_data is None:
                    raise WordNotFoundError(f"Word with ID {word_id} not found")

                return Word(**word_data)
        except Exception as e:
            raise e

    async def get_word_by_word(self, word: str) -> Word:
        try:
            async with self.pool.acquire() as conn:
                word_data = await conn.fetchrow(
                    "SELECT * FROM words WHERE word = $1", word
                )
                if word_data is None:
                    raise WordNotFoundError(f"Word {word} not found")
                return Word(**word_data)
        except Exception as e:
            raise e

    async def get_all_words(self) -> List[Word]:
        try:
            async with self.pool.acquire() as conn:
                words_data = await conn.fetch("SELECT * FROM words")
                return [Word(**word) for word in words_data]
        except Exception as e:
            raise Exception(f"Error getting all words: {str(e)}")


async def get_word_service(pool: asyncpg.Pool = Depends(get_pool)) -> WordService:
    service = WordService(pool=pool)
    return service
