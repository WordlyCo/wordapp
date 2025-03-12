from fastapi import APIRouter, Depends
from app.services.practice import PracticeSession, SessionWord

router = APIRouter(
    prefix="/practice",
    tags=["practice"]
)

# Practice session endpoints to be implemented 