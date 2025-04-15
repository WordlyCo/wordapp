from fastapi import APIRouter
from app.api.users import router as users_routes
from app.api.lists import router as lists_routes
from app.api.words import router as words_routes
from app.api.quizzes import router as quizzes_routes
from app.api.webhooks.clerk import router as clerk_webhooks_routes

api_router = APIRouter()

api_router.include_router(users_routes, prefix="/users", tags=["Users"])
api_router.include_router(lists_routes, prefix="/lists", tags=["Lists"])
api_router.include_router(words_routes, prefix="/words", tags=["Words"])
api_router.include_router(quizzes_routes, prefix="/quizzes", tags=["Quizzes"])
api_router.include_router(clerk_webhooks_routes, prefix="/webhooks", tags=["Webhooks"])
