from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from app.api.routes import api_router
from app.config.db import lifespan
from app.config.env import env
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
import os

app = FastAPI(title="WordApp", lifespan=lifespan)

static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

allowed_origins = env.get_allowed_origins() or [
    "https://wordapp.nverk.me",
]

allowed_hosts = env.get_allowed_hosts() or ["wordapp.nverk.me"]

if env.is_development():
    allowed_origins.extend(
        [
            "http://localhost:3000",
            "http://localhost:8000",
            "http://127.0.0.1:3000",
            "http://127.0.0.1:8000",
        ]
    )
    allowed_hosts.extend(["localhost", "127.0.0.1"])


class HTTPSRedirectMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.headers.get("X-Forwarded-Proto") == "http":
            url = request.url.replace(scheme="https")
            return JSONResponse(
                status_code=status.HTTP_307_TEMPORARY_REDIRECT,
                content={"detail": "Redirecting to HTTPS"},
                headers={"Location": str(url)},
            )
        return await call_next(request)


if env.is_production():
    app.add_middleware(HTTPSRedirectMiddleware)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=allowed_hosts)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Authorization", "Content-Type", "Accept", "Origin", "User-Agent"],
)


@app.get("/", response_class=HTMLResponse)
async def root():
    with open(os.path.join(static_dir, "index.html"), "r") as f:
        return HTMLResponse(content=f.read())


@app.get("/privacy-policy", response_class=HTMLResponse)
async def privacy_policy():
    with open(os.path.join(static_dir, "privacy-policy.html"), "r") as f:
        return HTMLResponse(content=f.read())


app.include_router(api_router, prefix="/api/v1")
