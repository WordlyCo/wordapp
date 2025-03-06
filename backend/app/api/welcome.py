from fastapi import APIRouter, Depends
from app.config.db import get_pool

router = APIRouter()


@router.get("/")
async def get_welcome(db=Depends(get_pool)):
    return "Welcome to WordApp API!"
