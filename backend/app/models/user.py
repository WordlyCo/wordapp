from pydantic import EmailStr, BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from .base import BaseEntity, CamelModel

# User Stats


class UserStats(BaseModel):
    id: Optional[int] = None
    user_id: int
    diamonds: int = 0
    total_words_learned: int = 0
    current_streak: int = 0
    longest_streak: int = 0
    total_practice_time: int = 0
    average_accuracy: float = 0.0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserStatsUpdate(BaseModel):
    diamonds: Optional[int] = None
    total_words_learned: Optional[int] = None
    current_streak: Optional[int] = None
    longest_streak: Optional[int] = None
    total_practice_time: Optional[int] = None
    average_accuracy: Optional[float] = None


class DailyProgress(BaseModel):
    wordsPracticed: int = 0
    dailyWordGoal: int = 10
    practiceTime: int = 0
    dailyPracticeTimeGoal: int = 5


class LearningInsights(BaseModel):
    wordsMastered: int = 0
    accuracy: float = 0.0


class FullUserStats(BaseModel):
    diamonds: int = 0
    streak: int = 0
    lastActive: Optional[datetime] = None
    dailyProgress: DailyProgress
    learningInsights: LearningInsights


# User Preferences


class UserPreferences(BaseEntity):
    user_id: int
    daily_word_goal: int = 10
    daily_practice_time_goal: int = 5
    difficulty_level: str
    notifications_enabled: bool = True
    time_zone: str = "America/Los_Angeles"
    theme: str = "light"


class UserPreferencesUpdate(CamelModel):
    daily_word_goal: Optional[int] = None
    daily_practice_time_goal: Optional[int] = None
    difficulty_level: Optional[str] = None
    notifications_enabled: Optional[bool] = None
    time_zone: Optional[str] = None
    theme: Optional[str] = None


class User(BaseEntity):
    id: int
    clerk_id: str
    username: str
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    bio: Optional[str] = None
    user_stats: Optional[FullUserStats] = None
    preferences: Optional[UserPreferences] = None
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    clerk_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_picture_url: Optional[str] = None
    bio: Optional[str] = None
    time_zone: Optional[str] = "America/Los_Angeles"
    theme: Optional[str] = "dark"


class UserRegister(CamelModel):
    username: str
    email: EmailStr
    clerk_id: str
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
    profile_picture_url: Optional[str] = None
    bio: Optional[str] = None
    preferences: Optional[UserPreferencesUpdate] = None


class LoginRequest(CamelModel):
    username: str
    password: str


class RefreshTokenRequest(CamelModel):
    refresh_token: str


# User Lists


class UserList(BaseEntity):
    user_id: int
    list_id: int


class UserListCreate(CamelModel):
    list_id: int


# User Progress


class WordProgress(BaseEntity):
    user_id: int
    word_id: int
    recognition_mastery_score: int = 0
    usage_mastery_score: int = 0
    practice_count: int = 0
    success_count: int = 0
    last_practiced: Optional[datetime] = None
    number_of_times_to_practice: int = 5


class WordProgressUpdate(CamelModel):
    word_id: int
    recognition_mastery_score: Optional[int] = None
    usage_mastery_score: Optional[int] = None
    practice_count: Optional[int] = None
    success_count: Optional[int] = None
    last_practiced: Optional[datetime] = None
    number_of_times_to_practice: Optional[int] = None


class UserListUpdate(CamelModel):
    is_favorite: Optional[bool] = None


class UserListsQueryParams(CamelModel):
    search_query: Optional[str] = None
    filter_by: Optional[str] = None


class TopFiveUsers(CamelModel):
    id: int
    username: str
    profile_picture_url: Optional[str] = None
    total_words_learned: int
    total_practice_time: int
    total_diamonds: int
    total_streak: int
    last_active: Optional[datetime] = None


# User Errors


class UserNotFoundError(Exception):
    pass


class UserAlreadyExistsError(Exception):
    pass


class UserListAlreadyExistsError(Exception):
    pass


class UserListNotFoundError(Exception):
    pass
