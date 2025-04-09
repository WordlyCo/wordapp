from app.config.db import get_pool
from app.models.base import PaginatedPayload, PageInfo
from app.models.list import (
    WordList,
    WordListCategory,
    WordListBrief,
    WordListCategoryCreate,
    ListAlreadyExistsError,
    ListWordAlreadyExistsError,
    ListNotFoundError,
    CategoryNotFoundError,
    CategoryAlreadyExistsError,
    WordListCreate,
)
from app.models.word import WordNotFoundError, Word
from app.services.words import WordService, get_word_service
import asyncpg
from typing import List
from fastapi import Depends
import json
import math


class ListService:
    def __init__(self, pool: asyncpg.Pool, word_service: WordService):
        self.pool = pool
        self.word_service = word_service

    async def insert_list(self, list: WordListCreate) -> WordList:
        try:
            list_data = None
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    list_data = await conn.fetchrow(
                        """
                        INSERT INTO lists (name, description, category_id, difficulty_level) 
                        VALUES ($1, $2, $3, $4)
                        RETURNING *
                        """,
                        list.name,
                        list.description,
                        list.category_id,
                        list.difficulty_level,
                    )
            existing_word_ids: List[int] = []
            new_words: List[Word] = []

            for word in list.words:
                try:
                    db_word = await self.word_service.get_word_by_word(word.word)
                    existing_word_ids.append(db_word.id)
                except WordNotFoundError:
                    new_words.append(word)

            for word_id in set(existing_word_ids):
                await self.insert_list_word(list_data["id"], word_id)

            for word in set(new_words):
                new_word = await self.word_service.insert_word(word)
                await self.insert_list_word(list_data["id"], new_word.id)

            return WordList(**list_data)
        except asyncpg.UniqueViolationError:
            raise ListAlreadyExistsError("List already exists")
        except Exception as e:
            raise Exception(f"Error inserting list: {str(e)}")

    async def insert_list_word(self, list_id: int, word_id: int) -> None:
        try:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    await conn.execute(
                        "INSERT INTO list_words (list_id, word_id) VALUES ($1, $2)",
                        list_id,
                        word_id,
                    )
        except asyncpg.NoDataFoundError:
            raise WordNotFoundError("Word not found")
        except asyncpg.UniqueViolationError:
            raise ListWordAlreadyExistsError("List word already exists")
        except Exception as e:
            raise Exception(f"Error inserting list word: {str(e)}")

    async def get_full_list(self, list_id: int) -> WordList:
        try:
            async with self.pool.acquire() as conn:
                list_data = await conn.fetchrow(
                    """
                    SELECT 
                        lists.*,
                        json_agg(json_build_object(
                                'id', words.id, 
                                'word', words.word, 
                                'definition', words.definition, 
                                'part_of_speech', words.part_of_speech,
                                'difficulty_level', words.difficulty_level,
                                'examples',  words.examples, 
                                'synonyms', words.synonyms,
                                'antonyms', words.antonyms,
                                'tags', words.tags,
                                'etymology', words.etymology,
                                'usage_notes', words.usage_notes,
                                'image_url', words.image_url, 
                                'audio_url', words.audio_url,
                                'created_at', words.created_at,
                                'updated_at', words.updated_at
                                ) 
                            ) FILTER (WHERE words.id IS NOT NULL) as words
                    FROM lists
                    LEFT JOIN list_words ON lists.id = list_words.list_id
                    LEFT JOIN words ON list_words.word_id = words.id
                    WHERE lists.id = $1
                    GROUP BY lists.id
                    """,
                    list_id,
                )

                if list_data is None:
                    raise ListNotFoundError(f"Word list with ID {list_id} not found")

                words_list = []
                words_json_string = list_data["words"]
                if words_json_string:
                    words_list_data = json.loads(words_json_string)
                    words_list = words_list_data

                return WordList(
                    id=list_data["id"],
                    name=list_data["name"],
                    description=list_data["description"],
                    category_id=list_data.get("category_id"),
                    difficulty_level=list_data.get("difficulty_level"),
                    owner_id=list_data.get("owner_id"),
                    created_at=list_data["created_at"],
                    updated_at=list_data["updated_at"],
                    words=words_list,
                )
        except ListNotFoundError as e:
            raise e
        except Exception as e:
            print(f"Database error getting full list {list_id}: {e}")
            raise Exception(f"Error getting full list details: {str(e)}")

    async def get_lists_brief_by_user(self, user_id: int) -> List[WordListBrief]:
        try:
            async with self.pool.acquire() as conn:
                lists_data = await conn.fetch(
                    """
                    SELECT 
                        lists.*
                    FROM lists
                    LEFT JOIN user_lists ON lists.id = user_lists.list_id
                    WHERE user_lists.user_id = $1
                    GROUP BY lists.id
                    """,
                    user_id,
                )
                return [WordListBrief(**list_data) for list_data in lists_data]
        except Exception as e:
            raise Exception(f"Error getting lists by user: {str(e)}")

    async def get_lists_by_category(
        self, category_id: int, page: int = 1, per_page: int = 10
    ) -> PaginatedPayload[WordListBrief]:
        offset = (page - 1) * per_page

        items_query = """
            SELECT id, name, description, category_id, difficulty_level, created_at, updated_at 
            FROM lists 
            WHERE category_id = $1
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
        """

        count_query = "SELECT COUNT(*) FROM lists WHERE category_id = $1"

        try:
            async with self.pool.acquire() as conn:
                total_items_record = await conn.fetchrow(count_query, category_id)
                total_items = total_items_record["count"] if total_items_record else 0

                if total_items > 0:
                    list_records = await conn.fetch(
                        items_query, category_id, per_page, offset
                    )
                    items = [WordListBrief(**record) for record in list_records]
                else:
                    items = []

                total_pages = math.ceil(total_items / per_page) if per_page > 0 else 0

                page_info = PageInfo(
                    page=page,
                    per_page=per_page,
                    total_items=total_items,
                    total_pages=total_pages,
                )

                return PaginatedPayload[WordListBrief](items=items, page_info=page_info)

        except Exception as e:
            print(
                f"Database error getting lists for category {category_id} (page {page}): {e}"
            )
            raise Exception(
                f"Error retrieving lists for category {category_id}: {str(e)}"
            )

    # Category functions
    async def create_category(
        self, category: WordListCategoryCreate
    ) -> WordListCategory:
        try:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    category_data = await conn.fetchrow(
                        """
                        INSERT INTO categories (name, description, difficulty_level, icon_url, accent_color) 
                        VALUES ($1, $2, $3, $4, $5)
                        RETURNING *
                        """,
                        category.name,
                        category.description,
                        category.difficulty_level,
                        category.icon_url,
                        category.accent_color,
                    )
                    return WordListCategory(**category_data)
        except asyncpg.UniqueViolationError:
            raise CategoryAlreadyExistsError("Category already exists")
        except Exception as e:
            raise e

    async def get_category_by_id(self, category_id: int) -> WordListCategory:
        try:
            async with self.pool.acquire() as conn:
                category_data = await conn.fetchrow(
                    "SELECT * FROM categories WHERE id = $1", category_id
                )
                if category_data is None:
                    raise CategoryNotFoundError(
                        f"Category with ID {category_id} not found"
                    )

                return WordListCategory(**category_data)
        except Exception as e:
            if isinstance(e, CategoryNotFoundError):
                raise e
            raise Exception(f"Error getting category: {str(e)}")

    async def get_all_categories(
        self, page: int = 1, per_page: int = 10
    ) -> PaginatedPayload[WordListCategory]:
        offset = (page - 1) * per_page

        items_query = """
            SELECT * FROM categories 
            ORDER BY name ASC
            LIMIT $1 OFFSET $2
        """

        count_query = "SELECT COUNT(*) FROM categories"

        try:
            async with self.pool.acquire() as conn:
                total_items_record = await conn.fetchrow(count_query)
                total_items = total_items_record["count"] if total_items_record else 0

                if total_items > 0:
                    categories_data = await conn.fetch(items_query, per_page, offset)
                    items = [
                        WordListCategory(**category) for category in categories_data
                    ]
                else:
                    items = []

                total_pages = math.ceil(total_items / per_page) if per_page > 0 else 0

                page_info = PageInfo(
                    page=page,
                    per_page=per_page,
                    total_items=total_items,
                    total_pages=total_pages,
                )

                return PaginatedPayload[WordListCategory](
                    items=items, page_info=page_info
                )

        except Exception as e:
            print(f"Database error getting all categories (page {page}): {e}")
            raise Exception(f"Error getting all categories: {str(e)}")


async def get_list_service(
    pool: asyncpg.Pool = Depends(get_pool),
    word_service: WordService = Depends(get_word_service),
) -> ListService:
    service = ListService(pool=pool, word_service=word_service)
    return service
