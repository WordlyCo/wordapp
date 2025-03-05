from fastapi import FastAPI
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

pool = None 

def init_db(app: FastAPI):
    @app.on_event("startup")
    async def startup_event():
        await create_pool()
        await create_tables()

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

async def create_tables():
    """Executes the schema.sql file to create tables."""
    global pool
    if pool is None:
        await create_pool()
    
    async with pool.acquire() as conn:
        with open("db/schema.sql", "r") as f:
            sql = f.read()
        await conn.execute(sql)
