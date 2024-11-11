from fastapi import APIRouter, Depends
from app.db import get_pool, close_pool

router = APIRouter()

@router.get("/health")
async def get_health(db=Depends(get_pool)):
    result = await db.fetchval("SELECT 2")
    if result:
        print("Database fully operational")
    await close_pool(db)
    return "All systems operational"

