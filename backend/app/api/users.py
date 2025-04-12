from fastapi import APIRouter, Depends
from typing import List, Optional
from app.middleware.auth import get_current_user
from app.models.list import WordList
from app.models.user import (
    UserRegister,
    UserLogin,
    User,
    UserLoginResponse,
    RefreshTokenRequest,
    UserListCreate,
    UserList,
)
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


router = APIRouter()


@router.get("/me")
async def get_signed_in_user(
    current_user: User = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
) -> Response[User]:
    try:
        user = await user_service.get_user_by_id(current_user.id)
        return Response(
            success=True, message="User retrieved successfully", payload=user
        )
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


@router.post("/lists")
async def create_user_list(
    user_list_data: UserListCreate,
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[UserList]:
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        user_list = await user_service.create_user_list(
            current_user.id, user_list_data.list_id
        )
        return Response(
            success=True,
            message="User list created successfully",
            payload=user_list,
        )
    except Exception as e:
        print(f"Error during user list creation: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not create user list due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.get("/lists")
async def get_user_lists(
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[List[WordList]]:
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        user_lists = await user_service.get_user_lists(current_user.id)
        return Response(
            success=True,
            message="User lists retrieved successfully",
            payload=user_lists,
        )
    except Exception as e:
        print(f"Error during user list retrieval: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not retrieve user lists due to an internal error",
            error_code=SERVER_ERROR,
        )
