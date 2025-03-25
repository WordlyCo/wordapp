from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta
import uuid
from app.models.users import (
    UserCreate,
    UserResponse,
    UserUpdate,
    Token,
    TokenData,
    LoginRequest,
)
from app.config.jwt import jwt
from app.services.users import get_user_service, UserService

router = APIRouter(prefix="/users", tags=["users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/users/token")


async def authenticate_user(username: str, password: str, user_service: UserService):
    user = await user_service.get_user_by_username(username)
    if not user:
        return False
    if not jwt.verify_password_hash(password, user["password_hash"]):
        return False
    return user


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    user_service: UserService = Depends(get_user_service),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        try:
            payload = jwt.jwt.decode(token, jwt.signing_key, algorithms=[jwt.JWT_ALGORITHM])
        except Exception as jwt_error:
            error_msg = str(jwt_error)
            if "expired" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token has expired. Please log in again.",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=f"Invalid token format: {error_msg}",
                    headers={"WWW-Authenticate": "Bearer"},
                )

        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except HTTPException:
        raise
    except Exception as e:
        error_detail = f"Authentication error: {str(e)}"
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=error_detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

    user = await user_service.get_user_by_username(token_data.username)
    if user is None:
        raise credentials_exception
    return user


@router.post(
    "/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
async def create_user(
    user: UserCreate, user_service: UserService = Depends(get_user_service)
):
    # Check if user already exists
    existing_user = await user_service.get_user_by_username(user.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered",
        )

    existing_email = await user_service.get_user_by_email(user.email)
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )

    # Create new user
    password_hash = jwt.get_password_hash(user.password)
    user_record = await user_service.create_user(user, password_hash)

    return UserResponse(
        id=user_record["id"],
        email=user_record["email"],
        username=user_record["username"],
        created_at=user_record["created_at"],
        updated_at=user_record["updated_at"],
    )


@router.post("/token", response_model=Token, summary="Get access token")
async def login_for_access_token(
    credentials: LoginRequest, user_service: UserService = Depends(get_user_service)
):
    user = await authenticate_user(
        credentials.username, credentials.password, user_service
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=jwt.JWT_EXPIRE_MINUTES)
    access_token = jwt.create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": jwt.JWT_EXPIRE_MINUTES * 60,  # in seconds
        "user_id": str(user["id"]),
        "username": user["username"],
    }


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user=Depends(get_current_user)):
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        username=current_user["username"],
        created_at=current_user["created_at"],
        updated_at=current_user["updated_at"],
    )


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: uuid.UUID, user_service: UserService = Depends(get_user_service)
):
    user = await user_service.get_user_by_id(user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return UserResponse(
        id=user["id"],
        email=user["email"],
        username=user["username"],
        created_at=user["created_at"],
        updated_at=user["updated_at"],
    )


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: uuid.UUID,
    user_update: UserUpdate,
    current_user=Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    # Ensure the current user can only update their own profile
    if str(current_user["id"]) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this user",
        )

    # Handle password hashing if provided
    if user_update.password:
        user_update.password = jwt.get_password_hash(user_update.password)

    # Update the user
    updated_user = await user_service.update_user(user_id, user_update)

    return UserResponse(
        id=updated_user["id"],
        email=updated_user["email"],
        username=updated_user["username"],
        created_at=updated_user["created_at"],
        updated_at=updated_user["updated_at"],
    )


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(
    user_id: uuid.UUID,
    current_user=Depends(get_current_user),
    user_service: UserService = Depends(get_user_service),
):
    # Ensure the current user can only delete their own account
    if str(current_user["id"]) != str(user_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this user",
        )

    await user_service.delete_user(user_id)

    return None
