from fastapi import APIRouter, Depends
from app.services.achievements import Achievement, UserAchievement

router = APIRouter(
    prefix="/achievements",
    tags=["achievements"]
)

# Achievement endpoints to be implemented 