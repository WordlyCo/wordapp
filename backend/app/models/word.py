from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import uuid
from enum import Enum


class DifficultyLevel(str, Enum):
    BEGINNER = "BEGINNER"
    INTERMEDIATE = "INTERMEDIATE"
    ADVANCED = "ADVANCED"
    EXPERT = "EXPERT"


class PartOfSpeech(str, Enum):
    NOUN = "NOUN"
    VERB = "VERB"
    ADJECTIVE = "ADJECTIVE"
    ADVERB = "ADVERB"
    PRONOUN = "PRONOUN"
    PREPOSITION = "PREPOSITION"
    CONJUNCTION = "CONJUNCTION"
    INTERJECTION = "INTERJECTION"


class BaseEntity(BaseModel):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class Word(BaseEntity):
    word: str
    definition: str
    difficulty_level: DifficultyLevel
    part_of_speech: PartOfSpeech
    example_sentences: List[str]
    synonyms: List[str]
    antonyms: List[str]
    etymology: Optional[str] = None
    usage_notes: Optional[str] = None
    tags: List[str]
    audio_url: Optional[str] = None
    image_url: Optional[str] = None
    options: List[str]
    correct_answer: str


class WordCategory(BaseEntity):
    name: str
    description: str
    category: str
    difficulty_level: DifficultyLevel
    icon: Optional[str] = None


class WordProgress(BaseEntity):
    user_id: uuid.UUID
    word_id: uuid.UUID
    recognition_level: int
    usage_level: int
    mastery_score: float
    practice_count: int
    success_count: int
    last_practiced: datetime


class UserWordList(BaseEntity):
    user_id: uuid.UUID
    name: str
    description: str
    words: List[uuid.UUID]  # Reference to Word IDs 