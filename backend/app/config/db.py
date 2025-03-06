from fastapi import FastAPI
import asyncpg
from contextlib import asynccontextmanager
from app.config.env import env

pool = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_pool()
    yield
    await close_pool()


def init_db(app: FastAPI):
    app.lifespan = lifespan


async def create_pool():
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(
            user=env.DB_USER,
            password=env.DB_PASSWORD,
            host=env.DB_HOST,
            port=env.DB_PORT,
            database=env.DB_NAME,
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
