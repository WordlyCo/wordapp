from app.config.env import env
from datetime import datetime, timedelta
from typing import Optional
from jwt import JWT, jwk_from_dict
from passlib.context import CryptContext


class JWT_CONFIG:
    def __init__(self):
        self.JWT_SECRET_KEY = env.JWT_SECRET_KEY
        self.JWT_ALGORITHM = env.JWT_ALGORITHM
        self.JWT_EXPIRE_MINUTES = int(env.JWT_EXPIRE_MINUTES)
        self.jwt = JWT()
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.signing_key = jwk_from_dict(
            {
                "kty": "oct",
                "k": self.JWT_SECRET_KEY,
                "alg": self.JWT_ALGORITHM,
            }
        )

    def verify_password_hash(self, plain_password, hashed_password):
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)

    def create_access_token(
        self, data: dict, expires_delta: Optional[timedelta] = None
    ):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=self.JWT_EXPIRE_MINUTES)
        to_encode.update({"exp": int(expire.timestamp())})
        encoded_jwt = self.jwt.encode(
            to_encode, self.signing_key, alg=self.JWT_ALGORITHM
        )
        return encoded_jwt


jwt = JWT_CONFIG()
