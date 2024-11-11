from fastapi import APIRouter, Depends
from app.db import get_pool

router = APIRouter()

@router.get("/")
async def get_health(db=Depends(get_pool)):
    return "Welcome to WordApp API!"

