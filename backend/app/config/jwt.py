from app.config.env import env
from datetime import datetime, timedelta, UTC
from typing import Optional, Dict, Any, Union
from jwt import JWT, jwk_from_dict
from jwt.exceptions import JWTException, JWTDecodeError
from passlib.context import CryptContext
import logging

logger = logging.getLogger(__name__)


class JWT_CONFIG:
    def __init__(self):
        self.jwt_secret_key = env.jwt_secret_key
        self.jwt_algorithm = env.jwt_algorithm
        self.jwt_expire_minutes = int(env.jwt_expire_minutes)
        self.refresh_token_expire_days = env.refresh_token_expire_days
        self.jwt = JWT()
        self.decode = self.jwt.decode
        self.encode = self.jwt.encode
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.signing_key = jwk_from_dict(
            {
                "kty": "oct",
                "k": self.jwt_secret_key,
                "alg": self.jwt_algorithm,
            }
        )

    def verify_password_hash(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        try:
            return self.pwd_context.verify(plain_password, hashed_password)
        except Exception as e:
            logger.error(f"Error verifying password: {str(e)}")
            return False

    def generate_password_hash(self, password: str) -> str:
        """Generate password hash"""
        return self.pwd_context.hash(password)

    def create_access_token(
        self, data: Dict[str, Any], expires_delta: Optional[timedelta] = None
    ) -> str:
        to_encode = data.copy()

        if expires_delta:
            expire = datetime.now(UTC) + expires_delta
        else:
            expire = datetime.now(UTC) + timedelta(minutes=self.jwt_expire_minutes)

        to_encode.update(
            {
                "exp": int(expire.timestamp()),
                "iat": int(datetime.now(UTC).timestamp()),
                "type": "access",
            }
        )

        try:
            encoded_jwt = self.jwt.encode(
                to_encode, self.signing_key, alg=self.jwt_algorithm
            )
            return encoded_jwt
        except Exception as e:
            logger.error(f"Error creating access token: {str(e)}")
            raise

    def create_refresh_token(self, data: Dict[str, Any]) -> str:
        to_encode = data.copy()
        expire = datetime.now(UTC) + timedelta(days=self.refresh_token_expire_days)
        to_encode.update(
            {
                "exp": int(expire.timestamp()),
                "iat": int(datetime.now(UTC).timestamp()),
                "type": "refresh",
            }
        )

        try:
            encoded_jwt = self.jwt.encode(
                to_encode, self.signing_key, alg=self.jwt_algorithm
            )
            return encoded_jwt
        except Exception as e:
            logger.error(f"Error creating refresh token: {str(e)}")
            raise

    def decode_token(self, token: str) -> Dict[str, Any]:
        try:
            payload = self.jwt.decode(
                token, self.signing_key, algorithms=[self.jwt_algorithm]
            )
            return payload
        except JWTDecodeError as e:
            logger.error(f"JWT decode error: {str(e)}")
            raise
        except JWTException as e:
            logger.error(f"JWT exception: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error decoding token: {str(e)}")
            raise

    # New methods for user token handling

    def create_user_access_token(
        self,
        user_id: Union[str, int],
        additional_data: Optional[Dict[str, Any]] = None,
        expires_delta: Optional[timedelta] = None,
    ) -> str:
        """
        Create an access token with user ID embedded in it

        Args:
            user_id: The user's unique identifier
            additional_data: Optional additional data to include in the token
            expires_delta: Optional custom expiration time

        Returns:
            The encoded JWT token as a string
        """
        data = {"sub": str(user_id)}

        # Add any additional data
        if additional_data:
            data.update(additional_data)

        return self.create_access_token(data=data, expires_delta=expires_delta)

    def create_user_refresh_token(
        self, user_id: Union[str, int], additional_data: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Create a refresh token with user ID embedded in it

        Args:
            user_id: The user's unique identifier
            additional_data: Optional additional data to include in the token

        Returns:
            The encoded JWT refresh token as a string
        """
        data = {"sub": str(user_id)}

        # Add any additional data
        if additional_data:
            data.update(additional_data)

        return self.create_refresh_token(data=data)

    def get_user_id_from_token(self, token: str) -> Union[str, int]:
        """
        Extract the user ID from a token

        Args:
            token: The JWT token

        Returns:
            The user ID extracted from the token

        Raises:
            ValueError: If the token does not contain a user ID
            Other exceptions: From decode_token method
        """
        try:
            payload = self.decode_token(token)
            user_id = payload.get("sub")
            if not user_id:
                raise ValueError("Token does not contain a user ID")
            return user_id
        except Exception as e:
            logger.error(f"Error extracting user ID from token: {str(e)}")
            raise

    def validate_token_type(self, token: str, expected_type: str) -> bool:
        """
        Validate that a token is of the expected type (access or refresh)

        Args:
            token: The JWT token
            expected_type: The expected token type ("access" or "refresh")

        Returns:
            True if the token is of the expected type, False otherwise
        """
        try:
            payload = self.decode_token(token)
            token_type = payload.get("type")
            return token_type == expected_type
        except Exception:
            return False


jwt = JWT_CONFIG()
