from app.models.users import UserCreate, UserUpdate
import uuid
from app.config.jwt import jwt
from app.config.db import get_pool


class UserService:
    pool = None

    async def create(self):
        self.pool = await get_pool()

    async def get_user_by_username(self, username: str):
        query = "SELECT * FROM users WHERE username = $1"
        user = await self.pool.fetchrow(query, username)
        return user

    async def get_user_by_email(self, email: str):
        query = "SELECT * FROM users WHERE email = $1"
        user = await self.pool.fetchrow(query, email)
        return user

    async def get_user_by_id(self, id: uuid.UUID):
        query = "SELECT * FROM users WHERE id = $1"
        user = await self.pool.fetchrow(query, id)
        return user

    async def create_user(self, user: UserCreate, password_hash: str):
        query = """
            INSERT INTO users (email, username, password_hash) 
            VALUES ($1, $2, $3) 
            RETURNING id, email, username, created_at, updated_at
        """
        user_record = await self.pool.fetchrow(
            query, user.email, user.username, password_hash
        )
        return user_record

    async def update_user(self, id: uuid.UUID, user: UserUpdate):
        update_fields = []
        params = []
        param_index = 1
        if user.email is not None:
            update_fields.append("email = $1")
            params.append(user.email)
            param_index += 1
        if user.username is not None:
            update_fields.append("username = $1")
            params.append(user.username)
            param_index += 1

        if user.password is not None:
            hashed_password = jwt.get_password_hash(user.password)
            update_fields.append("password_hash = $1")
            params.append(hashed_password)
            param_index += 1

        query = f"""
            UPDATE users SET {', '.join(update_fields)}
            WHERE id = ${id}
            RETURNING id, email, username, created_at, updated_at
        """
        user_record = await self.pool.fetchrow(query, *params)
        return user_record

    async def delete_user(self, id: uuid.UUID):
        query = "DELETE FROM users WHERE id = $1"
        await self.pool.execute(query, id)


async def get_user_service():
    service = UserService()
    await service.create()
    return service
