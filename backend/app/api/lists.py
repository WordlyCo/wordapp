from fastapi import APIRouter, Depends, Query
from app.models.list import (
    WordListCategory,
    WordListCategoryCreate,
    WordList,
    WordListBrief,
    WordListCreate,
)
from app.services.words import WordNotFoundError
from app.models.base import Response, PaginatedPayload
from app.api.errors import DUPLICATE_INSERTION, SERVER_ERROR, NOT_FOUND
from app.services.lists import (
    ListService,
    get_list_service,
    CategoryNotFoundError,
    CategoryAlreadyExistsError,
    ListAlreadyExistsError,
    ListWordAlreadyExistsError,
    ListNotFoundError,
)

router = APIRouter()


@router.get("/categories", response_model=Response[PaginatedPayload[WordListCategory]])
async def get_all_categories(
    list_service: ListService = Depends(get_list_service),
    page: int = Query(1, ge=1, description="Page number to retrieve"),
    per_page: int = Query(10, ge=1, le=100, description="Number of items per page"),
) -> Response[PaginatedPayload[WordListCategory]]:
    """Retrieve a paginated list of all available word list categories."""
    try:
        paginated_categories = await list_service.get_all_categories(
            page=page, per_page=per_page
        )
        return Response(
            success=True,
            message="Categories retrieved successfully",
            payload=paginated_categories,
        )
    except Exception as e:
        print(f"API error getting categories (page {page}): {e}")
        return Response(
            success=False,
            message="An unexpected error occurred retrieving categories",
            error_code=SERVER_ERROR,
        )


@router.post("/categories", response_model=Response[WordListCategory])
async def create_category(
    category: WordListCategoryCreate,
    list_service: ListService = Depends(get_list_service),
) -> Response[WordListCategory]:
    """Create a new word list category."""
    try:
        new_category = await list_service.create_category(category)
        return Response(
            success=True,
            message="Category created successfully",
            payload=new_category,
        )
    except CategoryAlreadyExistsError as e:
        return Response(success=False, message=str(e), error_code=DUPLICATE_INSERTION)
    except Exception as e:
        print(f"API error creating category: {e}")
        return Response(
            success=False,
            message="An unexpected error occurred",
            error_code=SERVER_ERROR,
        )


@router.get("/categories/{category_id}", response_model=Response[WordListCategory])
async def get_category_by_id(
    category_id: int, list_service: ListService = Depends(get_list_service)
) -> Response[WordListCategory]:
    """Get detailed information about a specific word list category."""
    try:
        category = await list_service.get_category_by_id(category_id)
        return Response(
            success=True,
            message="Category retrieved successfully",
            payload=category,
        )
    except CategoryNotFoundError:
        return Response(
            success=False, message="Category not found", error_code=NOT_FOUND
        )
    except Exception as e:
        print(f"API error getting category {category_id}: {e}")
        return Response(
            success=False,
            message="An unexpected error occurred",
            error_code=SERVER_ERROR,
        )


@router.get(
    "/by-category/{category_id}",
    response_model=Response[PaginatedPayload[WordListBrief]],
)
async def get_lists_in_category(
    category_id: int,
    list_service: ListService = Depends(get_list_service),
    page: int = Query(1, ge=1, description="Page number to retrieve"),
    per_page: int = Query(10, ge=1, le=100, description="Number of items per page"),
) -> Response[PaginatedPayload[WordListBrief]]:
    """Retrieve a paginated list of word lists belonging to a specific category."""
    try:
        await list_service.get_category_by_id(category_id)
        paginated_lists = await list_service.get_lists_by_category(
            category_id=category_id, page=page, per_page=per_page
        )
        return Response(
            success=True,
            message="Lists retrieved successfully",
            payload=paginated_lists,
        )
    except CategoryNotFoundError:
        return Response(
            success=False, message="Category not found", error_code=NOT_FOUND
        )
    except Exception as e:
        print(f"API error getting lists for category {category_id} (page {page}): {e}")
        return Response(
            success=False,
            message="An unexpected error occurred retrieving lists",
            error_code=SERVER_ERROR,
        )


@router.post("/", response_model=Response[WordList])
async def insert_list(
    list_data: WordListCreate,
    list_service: ListService = Depends(get_list_service),
) -> Response[WordList]:
    """Create a new word list."""
    try:
        new_list = await list_service.insert_list(list_data)
        return Response(
            success=True, message="List created successfully", payload=new_list
        )
    except ListAlreadyExistsError as e:
        return Response(success=False, message=str(e), error_code=DUPLICATE_INSERTION)
    except Exception as e:
        print(f"API error creating list: {e}")
        return Response(
            success=False,
            message="An unexpected error occurred",
            error_code=SERVER_ERROR,
        )


@router.get("/{list_id}", response_model=Response[WordList])
async def get_list_by_id(
    list_id: int, list_service: ListService = Depends(get_list_service)
) -> Response[WordList]:
    """Get detailed information about a specific word list, including its words."""
    try:
        word_list = await list_service.get_full_list(list_id)
        return Response(
            success=True, message="List retrieved successfully", payload=word_list
        )
    except ListNotFoundError:
        return Response(success=False, message="List not found", error_code=NOT_FOUND)
    except Exception as e:
        print(f"API error getting list {list_id}: {e}")
        return Response(
            success=False,
            message="An unexpected error occurred",
            error_code=SERVER_ERROR,
        )


@router.post("/{list_id}/words/{word_id}", response_model=Response[None])
async def insert_list_word(
    list_id: int,
    word_id: int,
    list_service: ListService = Depends(get_list_service),
) -> Response[None]:
    """Add a word to an existing word list."""
    try:
        await list_service.insert_list_word(list_id=list_id, word_id=word_id)
        return Response(success=True, message="Word added to list successfully")
    except ListNotFoundError:
        return Response(success=False, message="List not found", error_code=NOT_FOUND)
    except WordNotFoundError:
        return Response(success=False, message="Word not found", error_code=NOT_FOUND)
    except ListWordAlreadyExistsError as e:
        return Response(success=False, message=str(e), error_code=DUPLICATE_INSERTION)
    except Exception as e:
        print(f"API error adding word {word_id} to list {list_id}: {e}")
        return Response(
            success=False,
            message="An unexpected error occurred",
            error_code=SERVER_ERROR,
        )


@router.get("/", response_model=Response[PaginatedPayload[WordList]])
async def get_all_lists(
    list_service: ListService = Depends(get_list_service),
    page: int = Query(1, ge=1, description="Page number to retrieve"),
    per_page: int = Query(10, ge=1, le=100, description="Number of items per page"),
) -> Response[PaginatedPayload[WordList]]:
    """Retrieve a paginated list of all available word lists."""
    try:
        paginated_lists = await list_service.get_all_lists(page=page, per_page=per_page)
        return Response(
            success=True,
            message="Lists retrieved successfully",
            payload=paginated_lists,
        )
    except Exception as e:
        print(f"API error getting lists (page {page}): {e}")
        return Response(
            success=False,
            message="An unexpected error occurred retrieving lists",
            error_code=SERVER_ERROR,
        )
