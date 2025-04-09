from fastapi import APIRouter
from app.api.users import router as users_routes
from app.api.sentence_stage import router as sentence_stage_routes
from app.api.words import router as words_routes
from app.api.lists import router as lists_routes


api_router = APIRouter()
api_router.include_router(users_routes)
api_router.include_router(sentence_stage_routes)
api_router.include_router(words_routes)
api_router.include_router(lists_routes)
