from fastapi import APIRouter, Depends, HTTPException
from app.services.words import WordService, get_word_service
from app.models.word import Word, WordCategory, WordProgress, UserWordList
import uuid
from typing import List

router = APIRouter(
    prefix="/words",
    tags=["words"]
)

@router.get("/{word_id}", response_model=Word)
async def get_word(
    word_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Get a word by ID"""
    return await word_service.get_word_by_id(word_id)

@router.get("/category/{category_id}", response_model=List[Word])
async def get_words_by_category(
    category_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Get all words in a category"""
    return await word_service.get_words_by_category(category_id)

@router.get("/difficulty/{level}", response_model=List[Word])
async def get_words_by_difficulty(
    level: str,
    word_service: WordService = Depends(get_word_service)
):
    """Get words by difficulty level"""
    return await word_service.get_words_by_difficulty(level)

@router.get("/daily", response_model=List[Word])
async def get_daily_words(
    user_id: uuid.UUID,
    count: int = 10,
    word_service: WordService = Depends(get_word_service)
):
    """Get daily practice words"""
    return await word_service.get_daily_words(user_id, count)

@router.get("/search", response_model=List[Word])
async def search_words(
    query: str,
    word_service: WordService = Depends(get_word_service)
):
    """Search words"""
    return await word_service.search_words(query)

@router.get("/progress/{word_id}", response_model=WordProgress)
async def get_word_progress(
    word_id: uuid.UUID,
    user_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Get user's progress for a specific word"""
    return await word_service.get_word_progress(user_id, word_id)

@router.post("/progress/{word_id}")
async def update_word_progress(
    word_id: uuid.UUID,
    user_id: uuid.UUID,
    success: bool,
    word_service: WordService = Depends(get_word_service)
):
    """Update user's progress for a word"""
    return await word_service.update_word_progress(user_id, word_id, success)

@router.get("/lists", response_model=List[UserWordList])
async def get_user_word_lists(
    user_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Get all word lists for a user"""
    return await word_service.get_user_word_lists(user_id)

@router.post("/lists", response_model=UserWordList)
async def create_word_list(
    user_id: uuid.UUID,
    name: str,
    description: str,
    word_service: WordService = Depends(get_word_service)
):
    """Create a new word list"""
    return await word_service.create_user_word_list(user_id, name, description)

@router.post("/lists/{list_id}/words/{word_id}")
async def add_word_to_list(
    list_id: uuid.UUID,
    word_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Add a word to a list"""
    return await word_service.add_word_to_list(list_id, word_id) 