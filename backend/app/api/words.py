from fastapi import APIRouter, Depends
from app.services.words import (
    get_word_service,
    WordService,
    WordAlreadyExistsError,
    WordNotFoundError,
)
from app.models.word import (
    Word,
    WordUpdate,
)
from app.models.base import Response
from app.api.errors import DUPLICATE_INSERTION, SERVER_ERROR, NOT_FOUND
from typing import List

router = APIRouter()


@router.get("/", response_model=Response[List[Word]])
async def get_all_words(
    word_service: WordService = Depends(get_word_service),
) -> Response[List[Word]]:
    try:
        words = await word_service.get_all_words()
        return Response(
            success=True, message="Words retrieved successfully", payload=words
        )
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)


@router.post("/", response_model=Response[Word])
async def insert_word(
    word: Word, word_service: WordService = Depends(get_word_service)
) -> Response[Word]:
    try:
        new_word = await word_service.insert_word(word)
        return Response(
            success=True, message="Word added successfully", payload=new_word
        )
    except WordAlreadyExistsError as e:
        return Response(success=False, message=str(e), error_code=DUPLICATE_INSERTION)
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)


@router.get("/{word_id}", response_model=Response[Word])
async def get_word_by_id(
    word_id: int, word_service: WordService = Depends(get_word_service)
) -> Response[Word]:
    try:
        word = await word_service.get_word_by_id(word_id)
        return Response(
            success=True, message="Word retrieved successfully", payload=word
        )
    except WordNotFoundError as e:
        return Response(success=False, message=str(e), error_code=NOT_FOUND)
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)


@router.patch("/{word_id}", response_model=Response[Word])
async def update_word(
    word_id: int,
    word_update: WordUpdate,
    word_service: WordService = Depends(get_word_service),
) -> Response[Word]:
    try:
        updated_word = await word_service.update_word(word_id, word_update)
        return Response(
            success=True, message="Word updated successfully", payload=updated_word
        )
    except WordNotFoundError as e:
        return Response(success=False, message=str(e), error_code=NOT_FOUND)
    except ValueError as e:
        return Response(success=False, message=str(e), error_code=DUPLICATE_INSERTION)
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)
