import os
from dotenv import load_dotenv

load_dotenv()


class Env:
    def __init__(self):
        # Database
        self.DATABASE_URL = os.getenv("DATABASE_URL")
        self.DB_USER = os.getenv("DB_USER")
        self.DB_PASSWORD = os.getenv("DB_PASSWORD")
        self.DB_HOST = os.getenv("DB_HOST")
        self.DB_PORT = os.getenv("DB_PORT")
        self.DB_NAME = os.getenv("DB_NAME")
        self.ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS")

        # JWT
        self.JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
        self.JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
        self.JWT_EXPIRE_MINUTES = os.getenv("JWT_EXPIRE_MINUTES")

        # OpenAI
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

        # Debug
        self.DEBUG = os.getenv("DEBUG")


env = Env()
