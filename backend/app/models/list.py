from .base import BaseEntity, CamelModel
from typing import Optional, List
from datetime import datetime
from app.models.word import Word, WordCreate


class WordList(BaseEntity):
    name: str
    description: Optional[str] = None
    categories: Optional[List[str]] = None
    difficulty_level: Optional[str] = None
    icon_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    words: Optional[List[Word]] = None
    word_count: Optional[int] = None
    in_users_bank: Optional[bool] = None
    is_favorite: Optional[bool] = None


class WordListUpdate(CamelModel):
    name: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    word_ids: Optional[List[int]] = None
    category_ids: Optional[List[int]] = None


class WordListCreate(WordList):
    words: Optional[List[WordCreate]] = None


class WordListWord(CamelModel):
    list_id: int
    word_id: int


class WordListCategory(BaseEntity):
    name: str
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    icon_url: Optional[str] = None
    icon_name: Optional[str] = None
    accent_color: Optional[str] = None


class WordListCategoryCreate(CamelModel):
    name: str
    description: Optional[str] = None
    difficulty_level: Optional[str] = "beginner"
    icon_name: Optional[str] = None
    icon_url: Optional[str] = None
    accent_color: Optional[str] = None


class WordListCategoryUpdate(CamelModel):
    name: Optional[str] = None
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    icon_url: Optional[str] = None
    accent_color: Optional[str] = None


class WordListBrief(CamelModel):
    id: int
    name: str
    description: Optional[str] = None
    difficulty_level: Optional[str] = None
    icon_name: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# List Errors


class ListAlreadyExistsError(Exception):
    pass


class ListWordAlreadyExistsError(Exception):
    pass


class ListNotFoundError(Exception):
    pass


class CategoryNotFoundError(Exception):
    pass


class CategoryAlreadyExistsError(Exception):
    pass
