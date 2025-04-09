import asyncpg
from app.models.user import UserRegister, UserUpdate
from app.config.jwt import jwt
from app.config.db import get_pool
from fastapi import Depends
from app.models.user import User


class UserNotFoundError(Exception):
    pass


class UserAlreadyExistsError(Exception):
    pass


class UserService:
    def __init__(self, pool: asyncpg.Pool):
        self.pool = pool

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

    async def create_user(self, user: UserRegister, password_hash: str) -> User:
        query = """
            INSERT INTO users (email, username, password_hash, first_name, last_name) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id, email, username, first_name, last_name, created_at, updated_at
        """
        try:
            user_record = await self.pool.fetchrow(
                query,
                user.email,
                user.username,
                password_hash,
                user.first_name,
                user.last_name,
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

        new_password = update_fields.pop("password", None)

        if not update_fields and new_password is None:
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

        if new_password is not None:
            hashed_password = jwt.get_password_hash(new_password)
            set_clauses.append(f"password_hash = ${param_index}")
            params.append(hashed_password)
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


async def get_user_service(pool: asyncpg.Pool = Depends(get_pool)) -> UserService:
    service = UserService(pool=pool)
    return service
