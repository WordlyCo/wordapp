from fastapi import APIRouter, Depends, HTTPException
from app.models.user import UserCreate, UserUpdate, UserPreferencesUpdate
from app.services.users import get_user_service, UserService, UserAlreadyExistsError
import logging
from pydantic import BaseModel, EmailStr
from typing import List, Optional


logger = logging.getLogger("clerk_webhook")
logger.setLevel(logging.INFO)

router = APIRouter()


class EmailAddress(BaseModel):
    email_address: EmailStr


class CreatedData(BaseModel):
    id: str
    email_addresses: List[EmailAddress]
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    username: Optional[str]


class UpdatedData(BaseModel):
    id: str
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    username: Optional[str] = ""
    profile_image_url: Optional[str] = ""


class DeletedData(BaseModel):
    id: str


class ClerkCreatedPayload(BaseModel):
    data: CreatedData


class ClerkUpdatedPayload(BaseModel):
    data: UpdatedData


class ClerkDeletedPayload(BaseModel):
    data: DeletedData


@router.post("/clerk/user-created")
async def on_user_created(
    payload: ClerkCreatedPayload,
    user_service: UserService = Depends(get_user_service),
):
    try:
        data = payload.data
        logger.info(f"User data from Clerk: {data}")

        email_addresses = data.email_addresses
        email = None
        if email_addresses and len(email_addresses) > 0:
            email = email_addresses[0].email_address

        first_name = data.first_name
        last_name = data.last_name
        username = data.username

        db_user = UserCreate(
            clerk_id=data.id,
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
        )

        try:
            created_user = await user_service.create_user(db_user)
            return {
                "status": "success",
                "message": "User created",
                "user_id": created_user.id,
            }
        except UserAlreadyExistsError as e:
            raise HTTPException(status_code=400, detail="User already exists")
        except Exception as e:
            print("ERROR: ", e)
            raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        print("ERROR: ", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clerk/user-updated")
async def on_user_updated(
    payload: ClerkUpdatedPayload,
    user_service: UserService = Depends(get_user_service),
):
    try:
        data = payload.data

        user_update = UserUpdate(
            first_name=data.first_name,
            last_name=data.last_name,
            username=data.username,
            profile_picture_url=data.profile_image_url,
            preferences=UserPreferencesUpdate(
                theme=data.preferences.theme,
                difficulty_level=data.preferences.difficulty_level,
                daily_word_goal=data.preferences.daily_word_goal,
                notifications_enabled=data.preferences.notifications_enabled,
                time_zone=data.preferences.time_zone,
            ),
        )

        await user_service.update_user_by_clerk_id(data.id, user_update)
        return {
            "status": "success",
            "message": "User updated",
        }
    except Exception as e:
        print("ERROR: ", e)
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/clerk/user-deleted")
async def on_user_deleted(
    payload: ClerkDeletedPayload,
    user_service: UserService = Depends(get_user_service),
):
    try:
        data = payload.data
        await user_service.delete_user_by_clerk_id(data.id)
        return {
            "status": "success",
            "message": "User deleted",
        }
    except Exception as e:
        print("ERROR: ", e)
        raise HTTPException(status_code=500, detail=str(e))
