import asyncpg
import os

pool = None 

async def create_pool():
    global pool
    pool = await asyncpg.create_pool(
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT'),
        database=os.getenv('DB_NAME')
    )
    return pool

async def get_pool():
    global pool
    if pool is None:
        pool = await create_pool()
    return pool

async def close_pool(pool):
    await pool.close()