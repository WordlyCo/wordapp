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
    """Get a specific word by ID"""
    pass

@router.get("/category/{category_id}", response_model=List[Word])
async def get_words_in_category(
    category_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Get all words in a category"""
    pass

@router.get("/difficulty/{level}", response_model=List[Word])
async def get_words_by_difficulty(
    level: str,
    word_service: WordService = Depends(get_word_service)
):
    """Get words by difficulty level"""
    pass

@router.get("/daily", response_model=List[Word])
async def get_daily_words(
    count: int = 10,
    word_service: WordService = Depends(get_word_service)
):
    """Get daily practice words"""
    pass

@router.get("/search", response_model=List[Word])
async def search_words(
    query: str,
    word_service: WordService = Depends(get_word_service)
):
    """Search for words"""
    pass

@router.get("/progress/{word_id}", response_model=WordProgress)
async def get_word_progress(
    word_id: uuid.UUID,
    user_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Get user's progress for a specific word"""
    pass

@router.post("/progress/{word_id}")
async def update_word_progress(
    word_id: uuid.UUID,
    user_id: uuid.UUID,
    success: bool,
    word_service: WordService = Depends(get_word_service)
):
    """Update progress after practicing a word"""
    pass

@router.get("/lists", response_model=List[UserWordList])
async def get_user_word_lists(
    user_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Get all word lists for a user"""
    pass

@router.post("/lists", response_model=UserWordList)
async def create_word_list(
    user_id: uuid.UUID,
    name: str,
    description: str,
    word_service: WordService = Depends(get_word_service)
):
    """Create a new word list"""
    pass

@router.post("/lists/{list_id}/words/{word_id}")
async def add_word_to_list(
    list_id: uuid.UUID,
    word_id: uuid.UUID,
    word_service: WordService = Depends(get_word_service)
):
    """Add a word to a user's list"""
    pass 