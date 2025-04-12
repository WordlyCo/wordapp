from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.services.users import get_user_service, UserService
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


class AuthError(Exception):
    pass


class InvalidTokenError(AuthError):
    pass


class ExpiredTokenError(AuthError):
    pass


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    user_service: UserService = Depends(get_user_service),
):
    try:
        token = credentials.credentials
        logger.info(f"Received token (first 15 chars): {token[:15]}...")

        try:
            header = jwt.get_unverified_claims(token)
            logger.info(f"JWT Header: {header}")
        except Exception as header_error:
            logger.error(f"Error decoding JWT header: {header_error}")

        payload = jwt.decode(
            token,
            key=None,
            options={
                "verify_signature": False,
            },
        )

        if payload:
            logger.info(f"JWT issuer: {payload.get('iss')}")
            logger.info(f"JWT subject: {payload.get('sub')}")
            logger.info(f"JWT audience: {payload.get('aud', 'not specified')}")
            logger.info(f"JWT expiration: {payload.get('exp')}")

        clerk_id = payload.get("sub")
        if clerk_id is None:
            logger.error("No subject (clerk_id) found in token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: No user identifier found",
            )

        logger.info(f"Looking up user with clerk_id: {clerk_id}")
        user = await user_service.get_user_by_clerk_id(clerk_id)

        if user is None:
            logger.error(f"User with clerk_id {clerk_id} not found in database")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        logger.info(f"Found user: {user.id}, {user.username}")
        return user

    except JWTError as e:
        logger.error(f"JWT Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid token: {str(e)}"
        )
    except Exception as e:
        logger.error(f"Authentication error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )
