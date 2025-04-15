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
from app.services.quizzes import QuizService, get_quiz_service
import asyncpg
from typing import List
from fastapi import Depends
import json
import math


class ListService:
    def __init__(
        self,
        pool: asyncpg.Pool,
        word_service: WordService,
        quiz_service: QuizService,
    ):
        self.pool = pool
        self.word_service = word_service
        self.quiz_service = quiz_service

    async def get_list_by_id(self, list_id: int) -> WordList:
        try:
            async with self.pool.acquire() as conn:
                list_data = await conn.fetchrow(
                    "SELECT * FROM lists WHERE id = $1", list_id
                )
                return WordList(
                    id=list_data["id"],
                    name=list_data["name"],
                    description=list_data["description"],
                    difficulty_level=list_data["difficulty_level"],
                    icon_name=list_data["icon_name"],
                    created_at=list_data["created_at"],
                    updated_at=list_data["updated_at"],
                )
        except Exception as e:
            raise Exception(f"Error getting list by ID: {str(e)}")

    async def insert_list(self, list: WordListCreate) -> WordList:
        try:
            list_data = None
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    list_data = await conn.fetchrow(
                        """
                        INSERT INTO lists (name, description, difficulty_level, icon_name) 
                        VALUES ($1, $2, $3, $4)
                        RETURNING *
                        """,
                        list.name,
                        list.description,
                        list.difficulty_level,
                        list.icon_name,
                    )

            # Collect existing categories and identify new ones to create
            existing_categories_names: List[str] = []
            new_categories_names: List[str] = []

            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    for category in list.categories:
                        try:
                            db_category = await conn.fetchrow(
                                "SELECT * FROM categories WHERE name = $1", category
                            )
                            if db_category is None:
                                new_categories_names.append(category)
                            else:
                                existing_categories_names.append(db_category["name"])
                        except Exception as e:
                            new_categories_names.append(category)

            for category_name in new_categories_names:
                try:
                    new_category = await self.create_category(
                        WordListCategoryCreate(name=category_name)
                    )
                    existing_categories_names.append(new_category.name)
                except Exception as e:
                    continue

            if existing_categories_names:
                async with self.pool.acquire() as conn:
                    async with conn.transaction():
                        for category_name in existing_categories_names:
                            try:
                                category_record = await conn.fetchrow(
                                    "SELECT id FROM categories WHERE name = $1",
                                    category_name,
                                )

                                if category_record:
                                    await conn.execute(
                                        "INSERT INTO list_categories (list_id, category_id) VALUES ($1, $2)",
                                        list_data["id"],
                                        category_record["id"],
                                    )
                            except Exception as e:
                                continue

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

            for word in new_words:
                try:
                    new_word = await self.word_service.insert_word(word)
                    await self.insert_list_word(list_data["id"], new_word.id)
                    for quiz in word.quizzes:
                        quiz.word_id = new_word.id
                        await self.quiz_service.insert_quiz(quiz)
                except Exception as e:
                    print(f"Error inserting word {word.word}: {str(e)}")
                    continue

            final_list = await self.get_full_list(list_data["id"])

            return final_list
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

                categories_data = await conn.fetch(
                    """
                    SELECT DISTINCT categories.name
                    FROM list_categories
                    JOIN categories ON list_categories.category_id = categories.id
                    WHERE list_categories.list_id = $1
                    """,
                    list_id,
                )

                categories_list = [category["name"] for category in categories_data]

                words_list = []
                words_json_string = list_data["words"]
                if words_json_string:
                    words_list_data = json.loads(words_json_string)
                    words_list = words_list_data

                return WordList(
                    id=list_data["id"],
                    name=list_data["name"],
                    description=list_data["description"],
                    difficulty_level=list_data.get("difficulty_level"),
                    created_at=list_data["created_at"],
                    updated_at=list_data["updated_at"],
                    icon_name=list_data.get("icon_name"),
                    words=words_list,
                    categories=categories_list,
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
            SELECT id, name, description, difficulty_level, icon_name, created_at, updated_at 
            FROM lists 
            ORDER BY name ASC
            LIMIT $2 OFFSET $3
        """

        count_query = "SELECT COUNT(*) FROM lists"

        try:
            async with self.pool.acquire() as conn:
                total_items_record = await conn.fetchrow(count_query)
                total_items = total_items_record["count"] if total_items_record else 0

                if total_items > 0:
                    list_records = await conn.fetch(items_query, per_page, offset)
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

    async def create_category(
        self, category: WordListCategoryCreate
    ) -> WordListCategory:
        try:
            async with self.pool.acquire() as conn:
                async with conn.transaction():
                    category_data = await conn.fetchrow(
                        """
                        INSERT INTO categories (name, description, difficulty_level, icon_url, icon_name, accent_color) 
                        VALUES ($1, $2, $3, $4, $5, $6)
                        RETURNING *
                        """,
                        category.name,
                        category.description,
                        category.difficulty_level,
                        category.icon_url,
                        category.icon_name,
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

    async def get_all_lists(
        self, page: int = 1, per_page: int = 10
    ) -> PaginatedPayload[WordList]:
        offset = (page - 1) * per_page

        items_query = """
            SELECT 
                lists.*,
                COUNT(list_words.word_id) as word_count
            FROM lists
            LEFT JOIN list_words ON lists.id = list_words.list_id
            GROUP BY lists.id
            ORDER BY name ASC
            LIMIT $1 OFFSET $2
        """

        count_query = "SELECT COUNT(*) FROM lists"

        try:
            async with self.pool.acquire() as conn:
                total_items_record = await conn.fetchrow(count_query)
                total_items = total_items_record["count"] if total_items_record else 0

                if total_items > 0:
                    lists_data = await conn.fetch(items_query, per_page, offset)
                    items = []

                    for list_data in lists_data:
                        categories_data = await conn.fetch(
                            """
                            SELECT DISTINCT categories.name
                            FROM list_categories
                            JOIN categories ON list_categories.category_id = categories.id
                            WHERE list_categories.list_id = $1
                            """,
                            list_data["id"],
                        )

                        categories_list = [
                            category["name"] for category in categories_data
                        ]

                        items.append(
                            WordList(
                                id=list_data["id"],
                                name=list_data["name"],
                                description=list_data["description"],
                                difficulty_level=list_data["difficulty_level"],
                                icon_name=list_data["icon_name"],
                                word_count=list_data["word_count"],
                                categories=categories_list,
                            )
                        )
                else:
                    items = []

                total_pages = math.ceil(total_items / per_page) if per_page > 0 else 0

                page_info = PageInfo(
                    page=page,
                    per_page=per_page,
                    total_items=total_items,
                    total_pages=total_pages,
                )

                return PaginatedPayload[WordList](items=items, page_info=page_info)

        except Exception as e:
            print(f"Database error getting all lists (page {page}): {e}")
            raise Exception(f"Error getting all lists: {str(e)}")


async def get_list_service(
    pool: asyncpg.Pool = Depends(get_pool),
    word_service: WordService = Depends(get_word_service),
    quiz_service: QuizService = Depends(get_quiz_service),
) -> ListService:
    service = ListService(
        pool=pool, word_service=word_service, quiz_service=quiz_service
    )
    return service
