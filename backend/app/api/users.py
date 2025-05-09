from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.middleware.auth import get_current_user
from app.models.list import WordList
from app.models.user import (
    User,
    UserListCreate,
    UserList,
    WordProgress,
    WordProgressUpdate,
    UserStatsUpdate,
    UserStats,
    FullUserStats,
    UserListAlreadyExistsError,
    UserListUpdate,
    UserListsQueryParams,
    TopFiveUsers,
)
from app.models.word import Word
from app.models.base import Response, PaginatedPayload
from app.services.users import (
    get_user_service,
    UserService,
    UserNotFoundError,
)
from app.api.errors import (
    USER_NOT_FOUND,
    SERVER_ERROR,
    DUPLICATE_INSERTION,
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
    except UserListAlreadyExistsError as e:
        return Response(success=False, message=str(e), error_code=DUPLICATE_INSERTION)
    except Exception as e:
        print(f"Error during user list creation: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not create user list due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.delete("/lists/{list_id}")
async def remove_list_from_user_lists(
    list_id: int,
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[bool]:
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        await user_service.remove_list_from_user_lists(current_user.id, list_id)
        return Response(
            success=True,
            message="List removed from user lists successfully",
        )
    except Exception as e:
        print(f"Error removing list from user lists: {e}")
        return Response(
            success=False,
            message="Could not remove list from user lists due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.get("/lists")
async def get_user_lists(
    filter_by: Optional[str] = Query(None, description="Filter by"),
    search_query: Optional[str] = Query(None, description="Search query"),
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

        user_lists = await user_service.get_user_lists(
            current_user.id,
            filter_by=filter_by,
            search_query=search_query,
        )
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


@router.put("/lists/{list_id}")
async def update_list_favorite_status(
    list_id: int,
    user_list_update: UserListUpdate,
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

        updated_list = await user_service.update_list_favorite_status(
            current_user.id, list_id, user_list_update.is_favorite
        )
        return Response(
            success=True,
            message="List favorite status updated successfully",
            payload=updated_list,
        )
    except Exception as e:
        print(f"Error updating list favorite status: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not update list favorite status due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.put("/progress/words/{word_id}")
async def update_word_progress(
    word_id: int,
    progress_data: WordProgressUpdate,
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[WordProgress]:
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        progress_data.word_id = word_id

        updated_progress = await user_service.update_word_progress(
            current_user.id, progress_data
        )

        return Response(
            success=True,
            message="Word progress updated successfully",
            payload=updated_progress,
        )
    except Exception as e:
        print(f"Error updating word progress: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not update word progress due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.get("/progress/words")
async def get_word_progress(
    page: int = Query(1, ge=1, description="Page number to retrieve"),
    per_page: int = Query(10, ge=1, le=100, description="Number of items per page"),
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[PaginatedPayload[Word]]:
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        paginated_progress = await user_service.get_word_progress(
            current_user.id, page=page, per_page=per_page
        )

        return Response(
            success=True,
            message="Word progress retrieved successfully",
            payload=paginated_progress,
        )
    except Exception as e:
        print(f"Error retrieving word progress: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not retrieve word progress due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.get("/stats")
async def get_user_stats(
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[FullUserStats]:
    """
    Get a user's stats with all the details needed for the frontend.
    Includes diamonds, streak, daily progress, and learning insights.
    """
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        user_stats = await user_service.get_user_stats(current_user.id)
        return Response(
            success=True,
            message="User stats retrieved successfully",
            payload=user_stats,
        )
    except Exception as e:
        print(f"Error retrieving user stats: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not retrieve user stats due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.put("/stats")
async def update_user_stats(
    stats_data: UserStatsUpdate,
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[UserStats]:
    """
    Update a user's stats directly.
    """
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        updated_stats = await user_service.update_user_stats(
            current_user.id, stats_data
        )
        return Response(
            success=True,
            message="User stats updated successfully",
            payload=updated_stats,
        )
    except Exception as e:
        print(f"Error updating user stats: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not update user stats due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.put("/stats/diamonds/{amount}")
async def add_diamonds(
    amount: int,
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response[UserStats]:
    """
    Add diamonds to a user's account.
    """
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        updated_stats = await user_service.increment_diamonds(current_user.id, amount)
        return Response(
            success=True,
            message=f"Added {amount} diamonds successfully",
            payload=updated_stats,
        )
    except Exception as e:
        print(f"Error adding diamonds: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not add diamonds due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.post("/practice-session")
async def record_practice_session(
    practice_time: int,
    session_type: str,
    user_service: UserService = Depends(get_user_service),
    current_user: Optional[User] = Depends(get_current_user),
) -> Response:
    """
    Record a practice session with time spent.
    """
    try:
        if current_user is None:
            return Response(
                success=False,
                message="Authentication required",
                error_code=SERVER_ERROR,
            )

        await user_service.record_practice_session(
            current_user.id, practice_time, session_type
        )

        return Response(
            success=True,
            message="Practice session recorded successfully",
        )
    except Exception as e:
        print(f"Error recording practice session: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not record practice session due to an internal error",
            error_code=SERVER_ERROR,
        )


@router.get("/top-five-users")
async def get_top_five_users(
    user_service: UserService = Depends(get_user_service),
) -> Response[List[TopFiveUsers]]:
    try:
        top_users = await user_service.get_top_five_users()
        return Response(
            success=True,
            message="Top five users retrieved successfully",
            payload=top_users,
        )
    except Exception as e:
        print(f"Error retrieving top five users: {e}")
        import traceback

        print(traceback.format_exc())
        return Response(
            success=False,
            message="Could not retrieve top five users due to an internal error",
            error_code=SERVER_ERROR,
        )
