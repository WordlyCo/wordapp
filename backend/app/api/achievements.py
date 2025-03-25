from fastapi import APIRouter, Depends, HTTPException
from app.services.achievements import AchievementService, get_achievement_service
from app.models.achievement import Achievement, UserAchievement
from typing import List
import uuid

router = APIRouter(prefix="/achievements", tags=["achievements"])

@router.get("/{achievement_id}", response_model=Achievement)
async def get_achievement(
    achievement_id: uuid.UUID,
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Get achievement by ID"""
    return await achievement_service.get_achievement_by_id(achievement_id)

@router.get("/", response_model=List[Achievement])
async def get_all_achievements(
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Get all available achievements"""
    return await achievement_service.get_all_achievements()

@router.get("/user/{user_id}", response_model=List[UserAchievement])
async def get_user_achievements(
    user_id: uuid.UUID,
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Get all achievements earned by a user"""
    return await achievement_service.get_user_achievements(user_id)

@router.post("/user/{user_id}/award/{achievement_id}")
async def award_achievement(
    user_id: uuid.UUID,
    achievement_id: uuid.UUID,
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Award an achievement to a user"""
    return await achievement_service.award_achievement(user_id, achievement_id)

@router.get("/user/{user_id}/progress")
async def get_achievement_progress(
    user_id: uuid.UUID,
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Get user's progress towards all achievements"""
    return await achievement_service.get_user_achievement_progress(user_id)

@router.post("/user/{user_id}/check/words")
async def check_word_achievements(
    user_id: uuid.UUID,
    total_words: int,
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Check and award word-related achievements"""
    return await achievement_service.check_word_achievements(user_id, total_words)

@router.post("/user/{user_id}/check/streaks")
async def check_streak_achievements(
    user_id: uuid.UUID,
    current_streak: int,
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Check and award streak-related achievements"""
    return await achievement_service.check_streak_achievements(user_id, current_streak)

@router.post("/user/{user_id}/check/accuracy")
async def check_accuracy_achievements(
    user_id: uuid.UUID,
    accuracy: float,
    achievement_service: AchievementService = Depends(get_achievement_service)
):
    """Check and award accuracy-related achievements"""
    return await achievement_service.check_accuracy_achievements(user_id, accuracy) 