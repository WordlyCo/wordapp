from fastapi import APIRouter, Depends, HTTPException
from app.services.practice import PracticeService, get_practice_service
from app.models.practice import PracticeSession, SessionWord
from typing import List, Optional
import uuid

router = APIRouter(prefix="/practice", tags=["practice"])

@router.post("/session", response_model=PracticeSession)
async def start_session(
    user_id: uuid.UUID,
    session_type: str,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """Start a new practice session"""
    return await practice_service.start_practice_session(user_id, session_type)

@router.post("/session/{session_id}/end", response_model=PracticeSession)
async def end_session(
    session_id: uuid.UUID,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """End a practice session"""
    return await practice_service.end_practice_session(session_id)

@router.post("/session/{session_id}/word", response_model=SessionWord)
async def record_word_practice(
    session_id: uuid.UUID,
    word_id: uuid.UUID,
    was_correct: bool,
    time_taken: int,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """Record a word practice attempt"""
    return await practice_service.record_word_practice(
        session_id, word_id, was_correct, time_taken
    )

@router.get("/user/{user_id}/history", response_model=List[PracticeSession])
async def get_session_history(
    user_id: uuid.UUID,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """Get user's practice session history"""
    return await practice_service.get_session_history(user_id)

@router.get("/session/{session_id}", response_model=dict)
async def get_session_details(
    session_id: uuid.UUID,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """Get detailed information about a practice session"""
    return await practice_service.get_session_details(session_id)

@router.get("/user/{user_id}/stats")
async def get_user_practice_stats(
    user_id: uuid.UUID,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """Get user's overall practice statistics"""
    return await practice_service.get_user_practice_stats(user_id)

@router.get("/user/{user_id}/daily-progress")
async def get_daily_progress(
    user_id: uuid.UUID,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """Get user's progress towards daily practice goal"""
    return await practice_service.get_daily_practice_goal_progress(user_id)

@router.get("/user/{user_id}/recommended")
async def get_recommended_words(
    user_id: uuid.UUID,
    count: int = 10,
    practice_service: PracticeService = Depends(get_practice_service)
):
    """Get recommended words for practice"""
    return await practice_service.get_recommended_practice_words(user_id, count) 