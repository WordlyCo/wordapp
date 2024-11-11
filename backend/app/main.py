from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router
from app.db import create_pool, close_pool

app = FastAPI(title="WordApp")
pool = None #pool is used for Database connection, pass pool to each endpoint as a dependency 

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # needs specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
#on startup, the pool connection to the database will start
@app.on_event("startup")
async def startup():
    global pool
    pool = await create_pool()
    print("Database pool created:", pool)
    
@app.on_event("shutdown")
async def shutdown():
    await close_pool(pool)


# Includes API router
app.include_router(api_router, prefix="")
