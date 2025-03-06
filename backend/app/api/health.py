from fastapi import APIRouter, Depends
from app.config.db import get_pool

router = APIRouter()


@router.get("/health")
async def get_health(db=Depends(get_pool)):
    result = await db.fetchval("SELECT 2")
    if result:
        print("Database fully operational")
    return "All systems operational"
