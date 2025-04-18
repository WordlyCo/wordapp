from fastapi import APIRouter, Depends
from app.models.quiz import (
    Quiz,
    QuizCreate,
    QuizRequest,
)
from app.models.base import Response
from app.models.user import User
from app.api.errors import SERVER_ERROR, UNAUTHORIZED, NOT_FOUND
from app.services.quizzes import (
    get_quiz_service,
    QuizService,
)
from app.middleware.auth import get_current_user
from typing import List, Dict, Any

router = APIRouter()


@router.get("/daily-quiz", response_model=Response[List[Dict[str, Any]]])
async def get_daily_words_with_quiz(
    current_user: User | None = Depends(get_current_user),
    quiz_service: QuizService = Depends(get_quiz_service),
) -> Response[List[Dict[str, Any]]]:
    try:
        if not current_user:
            return Response(
                success=False, message="User not found", error_code=UNAUTHORIZED
            )
        quiz = await quiz_service.get_daily_words_with_quizzes(current_user.id)
        if len(quiz) == 0:
            return Response(
                success=False, message="No daily quiz found", error_code=NOT_FOUND
            )
        return Response(
            success=True, message="Daily quiz retrieved successfully", payload=quiz
        )
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)


@router.post("/", response_model=Response[Quiz])
async def create_quiz(
    quiz: QuizCreate, quiz_service: QuizService = Depends(get_quiz_service)
) -> Response[Quiz]:
    try:
        new_quiz = await quiz_service.insert_quiz(quiz)
        return Response(
            success=True, message="Quiz created successfully", payload=new_quiz
        )
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)


@router.get("/", response_model=Response[List[Quiz]])
async def get_random_quizzes_by_word_ids(
    quiz_request: QuizRequest, quiz_service: QuizService = Depends(get_quiz_service)
) -> Response[List[Quiz]]:
    try:
        quizzes = await quiz_service.get_random_quizzes_by_word_ids(
            quiz_request.word_ids
        )
        return Response(
            success=True, message="Quizzes retrieved successfully", payload=quizzes
        )
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)


@router.get("/{word_id}", response_model=Response[Quiz])
async def get_random_quiz_by_word_id(
    word_id: int, quiz_service: QuizService = Depends(get_quiz_service)
) -> Response[Quiz]:
    try:
        quiz = await quiz_service.get_random_quiz_by_word_id(word_id)
        return Response(
            success=True, message="Quiz retrieved successfully", payload=quiz
        )
    except Exception as e:
        return Response(success=False, message=str(e), error_code=SERVER_ERROR)
