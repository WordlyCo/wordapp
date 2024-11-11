from fastapi import APIRouter
from app.db import create_pool
router = APIRouter()

@router.get("/")
async def get_health():
   

    return "Welcome to WordApp API!"

