from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jose import JWTError
from app.api.routes import api_router
from app.config.db import lifespan
from app.middleware.auth import AuthError, ExpiredTokenError
from app.config.env import env
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware

app = FastAPI(title="WordApp", lifespan=lifespan)

allowed_origins = [
    "https://wordapp.nverk.me",
    "https://www.wordapp.nverk.me",
]

allowed_hosts = ["wordapp.nverk.me", "www.wordapp.nverk.me"]

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


@app.exception_handler(JWTError)
async def jwt_decode_error_handler(request: Request, exc: JWTError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "message": "Invalid authentication token",
            "error_code": "INVALID_TOKEN",
        },
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.exception_handler(JWTError)
async def jwt_exception_handler(request: Request, exc: JWTError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "message": "Authentication error",
            "error_code": "AUTH_ERROR",
        },
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.exception_handler(ExpiredTokenError)
async def expired_token_handler(request: Request, exc: ExpiredTokenError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "message": "Token has expired",
            "error_code": "TOKEN_EXPIRED",
        },
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.exception_handler(AuthError)
async def auth_error_handler(request: Request, exc: AuthError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"success": False, "message": str(exc), "error_code": "AUTH_ERROR"},
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.get("/")
async def root_redirect():
    return {"message": "WordApp API is running. Access the API at /api/v1"}


app.include_router(api_router, prefix="/api/v1")
