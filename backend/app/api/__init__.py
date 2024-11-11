from fastapi import APIRouter
from app.api.health import router as health_routes
from app.api.welcome import router as welcome_routes

api_router = APIRouter()
api_router.include_router(welcome_routes)
api_router.include_router(health_routes)
