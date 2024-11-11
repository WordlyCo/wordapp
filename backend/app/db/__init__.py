from fastapi import FastAPI
import asyncpg
import os

pool = None 

def init_db(app: FastAPI):
    @app.on_event("startup")
    async def startup_event():
        await create_pool()

    @app.on_event("shutdown")
    async def shutdown_event():
        await close_pool()

async def create_pool():
    global pool
    if pool is None:
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
        await create_pool()
    return pool

async def close_pool():
    global pool
    if pool is not None:
        await pool.close()
        pool = None