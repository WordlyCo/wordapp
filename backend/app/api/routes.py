from fastapi import APIRouter
from app.api.health import router as health_routes
from app.api.welcome import router as welcome_routes
from app.api.users import router as users_routes
from app.api.sentence_stage import router as sentence_stage_routes

api_router = APIRouter()
<<<<<<< HEAD:backend/app/api/routes.py
api_router.include_router(welcome_routes)
api_router.include_router(health_routes)
api_router.include_router(users_routes)
api_router.include_router(sentence_stage_routes)
=======
api_router.include_router(welcome_routes, prefix="/welcome")
api_router.include_router(health_routes, prefix="/health")

api_router.include_router(welcome_routes, prefix="/welcome")
api_router.include_router(health_routes, prefix="/health")
>>>>>>> origin/abdul/auth:backend/app/api/__init__.py
