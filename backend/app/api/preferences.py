from fastapi import APIRouter, Depends, HTTPException
from app.services.preferences import PreferencesService, get_preferences_service
from app.models.users import UserPreferences, UserStats
from typing import Optional
import uuid

router = APIRouter(prefix="/preferences", tags=["preferences"])

@router.get("/{user_id}", response_model=UserPreferences)
async def get_user_preferences(
    user_id: uuid.UUID,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Get user preferences"""
    return await preferences_service.get_user_preferences(user_id)

@router.put("/{user_id}", response_model=UserPreferences)
async def update_user_preferences(
    user_id: uuid.UUID,
    preferences: UserPreferences,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Update user preferences"""
    return await preferences_service.update_user_preferences(user_id, preferences)

@router.get("/{user_id}/stats", response_model=UserStats)
async def get_user_stats(
    user_id: uuid.UUID,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Get user statistics"""
    return await preferences_service.get_user_stats(user_id)

@router.put("/{user_id}/stats", response_model=UserStats)
async def update_user_stats(
    user_id: uuid.UUID,
    stats: UserStats,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Update user statistics"""
    return await preferences_service.update_user_stats(user_id, stats)

@router.put("/{user_id}/daily-goal")
async def update_daily_goal(
    user_id: uuid.UUID,
    goal: int,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Update user's daily word goal"""
    return await preferences_service.update_daily_word_goal(user_id, goal)

@router.put("/{user_id}/difficulty")
async def update_difficulty(
    user_id: uuid.UUID,
    level: str,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Update user's difficulty level"""
    return await preferences_service.update_difficulty_level(user_id, level)

@router.put("/{user_id}/notifications")
async def update_notifications(
    user_id: uuid.UUID,
    enabled: bool,
    notification_type: str,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Update user's notification settings"""
    return await preferences_service.update_notification_settings(user_id, enabled, notification_type)

@router.put("/{user_id}/theme")
async def update_theme(
    user_id: uuid.UUID,
    theme: str,
    preferences_service: PreferencesService = Depends(get_preferences_service)
):
    """Update user's theme preference"""
    return await preferences_service.update_theme(user_id, theme) 