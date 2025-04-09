from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class Env(BaseSettings):
    jwt_secret_key: str = Field(default="supersecretkey", env="JWT_SECRET_KEY")
    jwt_algorithm: str = Field(default="HS256", env="JWT_ALGORITHM")
    jwt_expire_minutes: int = Field(default=30, env="JWT_EXPIRE_MINUTES")
    refresh_token_expire_days: int = Field(default=7, env="REFRESH_TOKEN_EXPIRE_DAYS")
    database_url: Optional[str] = Field(default=None, env="DATABASE_URL")
    env: str = Field(default="development", env="ENV")
    openai_api_key: str = Field(default="", env="OPENAI_API_KEY")

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"

    def is_development(self) -> bool:
        return self.env.lower() == "development"

    def is_production(self) -> bool:
        return self.env.lower() == "production"


env = Env()
