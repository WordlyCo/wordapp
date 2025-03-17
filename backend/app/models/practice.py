from pydantic import BaseModel
from datetime import datetime
import uuid
from enum import Enum
from typing import List

from .word import BaseEntity, Word


class SessionType(str, Enum):
    QUIZ = "QUIZ"
    FLASHCARD = "FLASHCARD"
    WRITING = "WRITING"
    LISTENING = "LISTENING"


class SessionWord(BaseEntity, Word):
    was_correct: bool
    time_taken: float


class PracticeSession(BaseEntity):
    user_id: uuid.UUID
    session_type: SessionType
    start_time: datetime
    end_time: datetime
    total_questions: int
    correct_answers: int
    session_words: List[SessionWord] 