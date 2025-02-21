from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

class BaseEntity(BaseModel):
    id: str
    createdAt: datetime
    updatedAt: datetime

class UserPreferences(BaseEntity):
    userId: str
    dailyWordGoal: int
    difficultyLevel: str  # or an Enum if you define it in Python
    notificationEnabled: bool
    notificationType: str  # or an Enum
    theme: str  # or an Enum

class UserStats(BaseEntity):
    userId: str
    totalWordsLearned: int
    currentStreak: int
    longestStreak: int
    totalPracticeTime: int
    averageAccuracy: float

class User(BaseEntity):
    email: EmailStr
    username: str
    passwordHash: str
    preferences: UserPreferences
    stats: UserStats

# Word Category
class WordCategory(BaseEntity):
    icon: Optional[str] = None  # Assuming icon is a URL or some reference
    name: str
    description: str
    category: str
    difficulty_level: str  # Enum in frontend
    words: List["Word"]

# Word Model
class Word(BaseEntity):
    word: str
    definition: str
    difficulty_level: str
    part_of_speech: str
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
    word_progress: Optional["WordProgress"]

# Word Progress Tracking
class WordProgress(BaseEntity):
    user_id: UUID
    word_id: UUID
    recognition_level: int
    usage_level: int
    mastery_score: float
    practice_count: int
    success_count: int
    last_practiced: datetime

# User Word List
class UserWordList(BaseEntity):
    user_id: UUID
    name: str
    description: str
    words: List[Word]

# Achievements
class Achievement(BaseEntity):
    name: str
    description: str
    criteria: str
    points: int
    icon_url: Optional[str] = None
    icon_name: Optional[str] = None

class UserAchievement(BaseEntity):
    user_id: UUID
    achievement_id: UUID
    achieved_at: datetime

# Practice Sessions
class PracticeSession(BaseEntity):
    user_id: UUID
    session_type: str  # Enum from frontend
    start_time: datetime
    end_time: datetime
    total_questions: int
    correct_answers: int
    session_words: List["SessionWord"]

class SessionWord(BaseEntity):
    was_correct: bool
    time_taken: float