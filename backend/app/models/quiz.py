from typing import Optional
from .base import CamelModel


class QuizOption(CamelModel):
    quiz_item_id: int
    option_text: str


class QuizItem(CamelModel):
    word_id: int
    correct_answer: str


class QuizItemUpdate(CamelModel):
    word_id: Optional[int] = None
    correct_answer: Optional[str] = None
