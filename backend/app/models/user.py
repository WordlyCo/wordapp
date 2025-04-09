from pydantic import EmailStr
from typing import Optional, List
from datetime import datetime
from .base import BaseEntity, CamelModel


class User(BaseEntity):
    id: int
    username: str
    email: EmailStr
    first_name: Optional[str]
    last_name: Optional[str]


class UserRegister(CamelModel):
    username: str
    email: EmailStr
    password: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserLogin(CamelModel):
    email: str
    password: str


class UserLoginResponse(CamelModel):
    token: str
    refresh_token: str
    user: User


class UserUpdate(CamelModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class LoginRequest(CamelModel):
    username: str
    password: str


# User Lists


class UserList(BaseEntity):
    user_id: int
    name: str
    description: Optional[str] = None
    words: Optional[List[int]] = None


class UserListUpdate(CamelModel):
    name: Optional[str] = None
    description: Optional[str] = None


# User Stats


class UserStats(BaseEntity):
    user_id: int
    total_words_learned: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    total_practice_time: int = 0
    average_accuracy: float = 0.0
    diamonds: int = 0


class UserStatsUpdate(CamelModel):
    total_words_learned: Optional[int] = None
    current_streak: Optional[int] = None
    longest_streak: Optional[int] = None
    total_practice_time: Optional[int] = None
    average_accuracy: Optional[float] = None
    diamonds: Optional[int] = None


# User Preferences


class UserPreferences(BaseEntity):
    user_id: int
    daily_word_goal: int = 10
    difficulty_level: str
    notifications_enabled: bool = True
    time_zone: str = "America/Los_Angeles"
    theme: str = "light"


class UserPreferencesUpdate(CamelModel):
    daily_word_goal: Optional[int] = None
    difficulty_level: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    time_zone: Optional[str] = None
    theme: Optional[str] = None


# User Progress


class WordProgress(BaseEntity):
    user_id: int
    word_id: int
    recognition_level: int = 0
    usage_level: int = 0
    mastery_score: int = 0
    practice_count: int = 0
    success_count: int = 0
    last_practiced: datetime
    number_of_times_to_practice: int = 5


class WordProgressUpdate(CamelModel):
    recognition_level: Optional[int] = None
    usage_level: Optional[int] = None
    mastery_score: Optional[int] = None
    practice_count: Optional[int] = None
    success_count: Optional[int] = None
    last_practiced: Optional[datetime] = None
    number_of_times_to_practice: Optional[int] = None


# User Errors


class UserNotFoundError(Exception):
    pass


class UserAlreadyExistsError(Exception):
    pass
