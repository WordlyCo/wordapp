from typing import Optional
from pydantic import Field
from pydantic_settings import BaseSettings


class Env(BaseSettings):
    database_url: Optional[str] = Field(default=None, env="DATABASE_URL")
    env: str = Field(default="development", env="ENV")
    openai_api_key: str = Field(default="", env="OPENAI_API_KEY")
    clerk_webhook_secret: Optional[str] = Field(
        default=None, env="CLERK_WEBHOOK_SECRET"
    )
    clerk_jwks_url: Optional[str] = Field(default=None, env="CLERK_JWKS_URL")
    clerk_issuer: Optional[str] = Field(default=None, env="CLERK_ISSUER")
    allowed_hosts: str = Field(default="", env="ALLOWED_HOSTS")
    allowed_origins: str = Field(default="", env="ALLOWED_ORIGINS")

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "allow"

    def is_development(self) -> bool:
        return self.env.lower() == "development"

    def is_production(self) -> bool:
        return self.env.lower() == "production"

    def get_allowed_hosts(self) -> list[str]:
        return [host.strip() for host in self.allowed_hosts.split(",") if host.strip()]

    def get_allowed_origins(self) -> list[str]:
        return [
            origin.strip()
            for origin in self.allowed_origins.split(",")
            if origin.strip()
        ]


env = Env()
