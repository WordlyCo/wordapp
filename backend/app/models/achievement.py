from datetime import datetime
from typing import Optional
from .base import BaseEntity, CamelModel


class Achievement(BaseEntity):
    name: str
    description: Optional[str] = None
    criteria: str
    points: int
    icon_url: Optional[str] = None
    icon_name: Optional[str] = None


class AchievementUpdate(CamelModel):
    name: Optional[str] = None
    description: Optional[str] = None
    criteria: Optional[str] = None
    points: Optional[int] = None
    icon_url: Optional[str] = None
    icon_name: Optional[str] = None


class UserAchievement(CamelModel):
    user_id: int
    achievement_id: int
    achieved_at: datetime
