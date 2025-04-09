from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from jwt.exceptions import JWTException, JWTDecodeError
from app.api.routes import api_router
from app.config.db import lifespan
from app.dependencies.auth import AuthError, InvalidTokenError, ExpiredTokenError

app = FastAPI(title="WordApp", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify actual origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(JWTDecodeError)
async def jwt_decode_error_handler(request: Request, exc: JWTDecodeError):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={
            "success": False,
            "message": "Invalid authentication token",
            "error_code": "INVALID_TOKEN",
        },
        headers={"WWW-Authenticate": "Bearer"},
    )


@app.exception_handler(JWTException)
async def jwt_exception_handler(request: Request, exc: JWTException):
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


# Include API routes
app.include_router(api_router, prefix="/api")
