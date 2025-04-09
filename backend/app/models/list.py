from .base import BaseEntity, CamelModel
from typing import Optional, List
from datetime import datetime
from app.models.word import Word


class WordList(BaseEntity):
    name: str
    description: Optional[str] = None
    category_id: Optional[int] = None
    difficulty_level: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    words: Optional[List[Word]] = None


class WordListUpdate(CamelModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    difficulty_level: Optional[str] = None
    word_ids: Optional[List[int]] = None


class WordListCreate(WordList):
    words: Optional[List[Word]] = []


class WordListWord(CamelModel):
    list_id: int
    word_id: int


class WordListCategory(BaseEntity):
    name: str
    description: Optional[str] = None
    difficulty_level: str
    icon_url: Optional[str] = None
    accent_color: Optional[str] = None


class WordListCategoryCreate(CamelModel):
    name: str
    description: Optional[str] = None
    difficulty_level: str
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
    category_id: Optional[int] = None
    difficulty_level: Optional[str] = None
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
