import asyncpg
from app.models.user import UserCreate, UserUpdate
from app.config.db import get_pool
from fastapi import Depends
from app.models.user import User, UserList
from app.services.lists import ListService, get_list_service
from app.models.list import WordList
from typing import List


class UserNotFoundError(Exception):
    pass


class UserAlreadyExistsError(Exception):
    pass


class UserService:
    def __init__(self, pool: asyncpg.Pool, list_service: ListService):
        self.pool = pool
        self.list_service = list_service

    async def get_user_by_username(self, username: str) -> User:
        query = "SELECT * FROM users WHERE username = $1"
        try:
            user_record = await self.pool.fetchrow(query, username)
            if user_record is None:
                raise UserNotFoundError(f"User with username '{username}' not found")
            return User(**user_record)
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by username: {str(e)}")

    async def get_user_by_email(self, email: str) -> tuple[User, str]:
        query = "SELECT * FROM users WHERE email = $1"
        try:
            user_record = await self.pool.fetchrow(query, email)
            if user_record is None:
                raise UserNotFoundError(f"User with email '{email}' not found")
            user = User(
                id=user_record["id"],
                username=user_record["username"],
                email=user_record["email"],
                first_name=user_record["first_name"],
                last_name=user_record["last_name"],
                created_at=user_record["created_at"],
                updated_at=user_record["updated_at"],
            )
            return user, user_record["password_hash"]
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by email: {str(e)}")

    async def get_user_by_id(self, user_id: int) -> User:
        query = "SELECT * FROM users WHERE id = $1"
        try:
            user_record = await self.pool.fetchrow(query, user_id)
            if user_record is None:
                raise UserNotFoundError(f"User with ID {user_id} not found")
            return User(**user_record)
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by ID: {str(e)}")

    async def get_user_by_clerk_id(self, clerk_id: str) -> User:
        query = "SELECT * FROM users WHERE clerk_id = $1"
        try:
            user_record = await self.pool.fetchrow(query, clerk_id)
            if user_record is None:
                raise UserNotFoundError(f"User with Clerk ID {clerk_id} not found")
            return User(**user_record)
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error fetching user by Clerk ID: {str(e)}")

    async def create_user(self, user: UserCreate) -> User:
        query = """
            INSERT INTO users (email, username, clerk_id) 
            VALUES ($1, $2, $3) 
            RETURNING id, email, username, clerk_id, created_at, updated_at
        """
        try:
            user_record = await self.pool.fetchrow(
                query,
                user.email,
                user.username,
                user.clerk_id,
            )
            if user_record is None:
                raise Exception("Failed to create user record.")
            return User(**user_record)
        except asyncpg.UniqueViolationError as e:
            if "users_email_key" in str(e):
                raise UserAlreadyExistsError(
                    f"User with email '{user.email}' already exists"
                )
            elif "users_username_key" in str(e):
                raise UserAlreadyExistsError(
                    f"User with username '{user.username}' already exists"
                )
            else:
                raise UserAlreadyExistsError(
                    f"User creation failed due to unique constraint: {e}"
                )
        except Exception as e:
            raise Exception(f"Error creating user: {str(e)}")

    async def update_user(self, user_id: int, user_update_data: UserUpdate) -> User:
        update_fields = user_update_data.model_dump(exclude_unset=True)

        if not update_fields:
            return await self.get_user_by_id(user_id)

        params = []
        set_clauses = []
        param_index = 1

        for field, value in update_fields.items():
            if field in [
                "email",
                "username",
                "first_name",
                "last_name",
            ]:
                set_clauses.append(f"{field} = ${param_index}")
                params.append(value)
                param_index += 1

        params.append(user_id)

        query = f"""
            UPDATE users
            SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ${param_index}
            RETURNING id, email, username, first_name, last_name, created_at, updated_at
        """
        try:
            user_record = await self.pool.fetchrow(query, *params)
            if user_record is None:
                raise UserNotFoundError(f"User with ID {user_id} not found for update")
            return User(**user_record)
        except asyncpg.UniqueViolationError as e:
            if "users_email_key" in str(e):
                raise UserAlreadyExistsError(
                    f"Cannot update: email '{user_update_data.email}' already exists for another user."
                )
            elif "users_username_key" in str(e):
                raise UserAlreadyExistsError(
                    f"Cannot update: username '{user_update_data.username}' already exists for another user."
                )
            else:
                raise UserAlreadyExistsError(
                    f"Update failed due to unique constraint: {e}"
                )
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error updating user with ID {user_id}: {str(e)}")

    async def delete_user(self, user_id: int) -> bool:
        query = "DELETE FROM users WHERE id = $1"
        try:
            result = await self.pool.execute(query, user_id)
            if result == "DELETE 0":
                raise UserNotFoundError(
                    f"User with ID {user_id} not found for deletion"
                )
            return True
        except Exception as e:
            if isinstance(e, UserNotFoundError):
                raise e
            raise Exception(f"Error deleting user with ID {user_id}: {str(e)}")

    async def create_user_list(self, user_id: int, list_id: int) -> UserList:
        query = """
            INSERT INTO user_lists (user_id, list_id)
            VALUES ($1, $2)
            RETURNING user_id, list_id, created_at, updated_at
        """
        try:
            user_list_record = await self.pool.fetchrow(query, user_id, list_id)
            if user_list_record is None:
                raise Exception("Failed to create user list record.")
            return UserList(**user_list_record)
        except Exception as e:
            raise Exception(f"Error creating user list: {str(e)}")

    async def get_user_lists(self, user_id: int) -> List[WordList]:
        query = """
            SELECT list_id
            FROM user_lists
            WHERE user_id = $1
        """
        try:
            user_list_ids = await self.pool.fetch(query, user_id)

            user_lists = []
            for record in user_list_ids:
                user_list = await self.list_service.get_list_by_id(record["list_id"])
                user_lists.append(user_list)
            return user_lists
        except Exception as e:
            raise Exception(f"Error fetching user lists: {str(e)}")


async def get_user_service(
    pool: asyncpg.Pool = Depends(get_pool),
    list_service: ListService = Depends(get_list_service),
) -> UserService:
    service = UserService(pool=pool, list_service=list_service)
    return service
