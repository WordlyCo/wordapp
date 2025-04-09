from datetime import datetime
from typing import Optional, List
from .base import BaseEntity


class Word(BaseEntity):
    word: str
    definition: str
    part_of_speech: Optional[str] = None
    difficulty_level: str
    etymology: Optional[str] = None
    usage_notes: Optional[str] = None
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    examples: Optional[List[str]] = None
    synonyms: Optional[List[str]] = None
    antonyms: Optional[List[str]] = None
    tags: Optional[List[str]] = None


class WordUpdate(BaseEntity):
    word: Optional[str] = None
    definition: Optional[str] = None
    part_of_speech: Optional[str] = None
    difficulty_level: Optional[str] = None
    etymology: Optional[str] = None
    usage_notes: Optional[str] = None
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    examples: Optional[List[str]] = None
    synonyms: Optional[List[str]] = None
    antonyms: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    created_at: Optional[datetime] = None


class WordCreate(Word):
    pass


# Word Errors
class WordAlreadyExistsError(Exception):
    pass


class WordNotFoundError(Exception):
    pass
