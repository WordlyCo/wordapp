from typing import List, Optional
from .base import BaseEntity, CamelModel
from enum import Enum


class QuizType(str, Enum):
    MULTIPLE_CHOICE = "multiple_choice"
    TRUE_FALSE = "true_false"
    FILL_IN_THE_BLANK = "fill_in_the_blank"


class Quiz(BaseEntity):
    id: int
    word_id: int
    quiz_type: QuizType
    question: str
    options: List[str]
    correct_options: List[str]


class QuizCreate(CamelModel):
    word_id: Optional[int] = None
    quiz_type: QuizType
    question: str
    options: List[str]
    correct_options: List[str]


class QuizRequest(CamelModel):
    word_ids: List[int]
