from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.config.jwt import jwt
from typing import Optional
from app.api.errors import EXPIRED_TOKEN

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/login")


class AuthError(Exception):
    pass


class InvalidTokenError(AuthError):
    pass


class ExpiredTokenError(AuthError):
    pass


async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> int:
    try:
        user_id = jwt.get_user_id_from_token(token)

        if not jwt.validate_token_type(token, "access"):
            raise InvalidTokenError("Not an access token")

        return int(user_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "message": "Invalid authentication credentials",
                "error": str(e),
                "errorCode": EXPIRED_TOKEN,
            },
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_optional_user_id(
    token: Optional[str] = Depends(oauth2_scheme),
) -> Optional[int]:
    if not token:
        return None

    try:
        user_id = jwt.get_user_id_from_token(token)
        if not jwt.validate_token_type(token, "access"):
            return None
        return int(user_id)
    except Exception:
        return None
