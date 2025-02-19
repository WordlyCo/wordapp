from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import api_router
from app.db import init_db
from .api.sentence_sage import router as sentence_sage_router

app = FastAPI(title="WordApp")

# middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(api_router, prefix="")
app.include_router(sentence_sage_router, prefix="/api", tags=["sentence-sage"])

# database initialization
init_db(app) 