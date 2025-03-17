from pydantic import BaseModel
from datetime import datetime
import uuid
from typing import Optional

from .word import BaseEntity


class Achievement(BaseEntity):
    name: str
    description: str
    criteria: str
    points: int
    icon_url: Optional[str] = None
    icon_name: Optional[str] = None


class UserAchievement(BaseEntity):
    user_id: uuid.UUID
    achievement_id: uuid.UUID
    achieved_at: datetime 