from fastapi import APIRouter, Depends
from app.config.jwt import jwt
from app.dependencies.auth import get_current_user_id

from app.models.user import UserRegister, UserLogin, User, UserLoginResponse
from app.models.base import Response
from app.services.users import (
    get_user_service,
    UserService,
    UserNotFoundError,
    UserAlreadyExistsError,
)
from app.api.errors import (
    USER_NOT_FOUND,
    USERNAME_TAKEN,
    EMAIL_TAKEN,
    INVALID_CREDENTIALS,
    SERVER_ERROR,
)

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_current_user(
    current_user_id: int = Depends(get_current_user_id),
    user_service: UserService = Depends(get_user_service),
) -> Response[User]:
    try:
        user = await user_service.get_user_by_id(current_user_id)
        return Response(success=True, message="User retrieved successfully", data=user)
    except UserNotFoundError:
        return Response(
            success=False, message="User not found", error_code=USER_NOT_FOUND
        )
    except Exception as e:
        print(f"Error fetching user /me: {e}")
        return Response(
            success=False,
            message="An unexpected error occurred",
            error_code=SERVER_ERROR,
        )


@router.post("/register")
async def register_user(
    user_data: UserRegister, user_service: UserService = Depends(get_user_service)
) -> Response[UserLoginResponse]:
    try:
        password_hash = jwt.generate_password_hash(user_data.password)
        new_user = await user_service.create_user(user_data, password_hash)
        jwt_payload = {
            "email": new_user.email,
            "created_at": (
                new_user.created_at.isoformat() if new_user.created_at else None
            ),
            "type": "access",
        }
        token = jwt.create_user_access_token(new_user.id, jwt_payload)
        refresh_token = jwt.create_user_refresh_token(new_user.id, jwt_payload)
        return Response(
            success=True,
            message="Registered successfully",
            data=UserLoginResponse(
                token=token, refresh_token=refresh_token, user=new_user
            ),
        )
    except UserAlreadyExistsError as e:
        error_message = str(e)
        error_code = SERVER_ERROR
        if "email" in error_message:
            error_code = EMAIL_TAKEN
        elif "username" in error_message:
            error_code = USERNAME_TAKEN
        return Response(success=False, message=error_message, error_code=error_code)
    except Exception as e:
        print(f"Error during user registration: {e}")
        return Response(
            success=False,
            message="Could not register user due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.post("/login")
async def login_user(
    user_data: UserLogin, user_service: UserService = Depends(get_user_service)
) -> Response[UserLoginResponse]:
    try:
        user, password_hash = await user_service.get_user_by_email(user_data.email)

        password_verified = jwt.verify_password_hash(user_data.password, password_hash)
        if not password_verified:
            return Response(
                success=False,
                message="Invalid credentials",
                error_code=INVALID_CREDENTIALS,
            )

        try:
            user_id = user.id
            jwt_payload = {
                "email": user.email,
                "created_at": user.created_at.isoformat() if user.created_at else None,
                "type": "access",
            }
            token = jwt.create_user_access_token(user_id, jwt_payload)
            refresh_token = jwt.create_user_refresh_token(user_id, jwt_payload)

            return Response(
                success=True,
                message="Login successful",
                data=UserLoginResponse(
                    token=token, refresh_token=refresh_token, user=user
                ),
            )
        except Exception as e:
            print(f"Error during token generation: {e}")
            return Response(
                success=False,
                message="Could not process login due to an internal error",
                error_code=SERVER_ERROR,
            )

    except UserNotFoundError:
        return Response(
            success=False,
            message="Invalid credentials",
            error_code=INVALID_CREDENTIALS,
        )
    except Exception as e:
        print(f"Error during login process: {e}")
        return Response(
            success=False,
            message="An unexpected error occurred during login",
            error_code=SERVER_ERROR,
        )


@router.post("/refresh-token")
async def refresh_token(
    refresh_token: str, user_service: UserService = Depends(get_user_service)
) -> Response[UserLoginResponse]:
    try:
        if not jwt.validate_token_type(refresh_token, "refresh"):
            return Response(
                success=False,
                message="Invalid refresh token",
                error_code=INVALID_CREDENTIALS,
            )
        payload = jwt.decode_token(refresh_token)
        user_id = payload.get("sub")
        if not user_id:
            return Response(
                success=False,
                message="Invalid refresh token",
                error_code=INVALID_CREDENTIALS,
            )
        user = await user_service.get_user_by_id(int(user_id))
        if not user:
            return Response(
                success=False,
                message="User not found",
                error_code=USER_NOT_FOUND,
            )
        jwt_payload = {
            "email": user.email,
            "created_at": user.created_at.isoformat() if user.created_at else None,
            "type": "access",
        }
        token = jwt.create_user_access_token(user_id, jwt_payload)
        return Response(
            success=True,
            message="Token refreshed successfully",
            data=UserLoginResponse(token=token, refresh_token=refresh_token, user=user),
        )
    except Exception as e:
        print(f"Error during token refresh: {e}")
        return Response(
            success=False,
            message="Could not refresh token due to an internal error",
            error_code=SERVER_ERROR,
        )
