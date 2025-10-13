import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from jwt.exceptions import InvalidTokenError, DecodeError
import mysql.connector
from mysql.connector import Error

from models.auth_models import UserInDB, TokenData, User
from config import config

# Initialize password hashing
password_hash = PasswordHash.recommended()

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")


class AuthService:
    def __init__(self):
        self.db_config = config.get_db_config()

    def get_db_connection(self):
        """Get database connection"""
        try:
            connection = mysql.connector.connect(**self.db_config)
            return connection
        except Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database connection error: {str(e)}",
            )

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return password_hash.verify(plain_password, hashed_password)

    def get_password_hash(self, password: str) -> str:
        """Hash a password"""
        return password_hash.hash(password)

    def get_user_by_username(self, username: str) -> Optional[UserInDB]:
        """Get user by username from database"""
        connection = None
        try:
            connection = self.get_db_connection()
            cursor = connection.cursor(dictionary=True)

            query = "SELECT * FROM users WHERE username = %s"
            cursor.execute(query, (username,))
            user_data = cursor.fetchone()

            if user_data:
                return UserInDB(**user_data)
            return None

        except Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}",
            )
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def get_user_by_email(self, email: str) -> Optional[UserInDB]:
        """Get user by email from database"""
        connection = None
        try:
            connection = self.get_db_connection()
            cursor = connection.cursor(dictionary=True)

            query = "SELECT * FROM users WHERE email = %s"
            cursor.execute(query, (email,))
            user_data = cursor.fetchone()

            if user_data:
                return UserInDB(**user_data)
            return None

        except Error as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}",
            )
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def create_user(self, username: str, email: str, password: str) -> UserInDB:
        """Create a new user in the database"""
        connection = None
        try:
            # Check if username or email already exists
            if self.get_user_by_username(username):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Username already exists",
                )

            if self.get_user_by_email(email):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered",
                )

            connection = self.get_db_connection()
            cursor = connection.cursor()

            hashed_password = self.get_password_hash(password)

            query = """
                INSERT INTO users (username, email, hashed_password, is_active, created_at)
                VALUES (%s, %s, %s, %s, %s)
            """
            created_at = datetime.now(timezone.utc).isoformat()

            cursor.execute(query, (username, email, hashed_password, True, created_at))
            connection.commit()

            user_id = cursor.lastrowid

            # Return the created user
            return UserInDB(
                id=user_id,
                username=username,
                email=email,
                hashed_password=hashed_password,
                is_active=True,
                created_at=created_at,
            )

        except Error as e:
            if connection:
                connection.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}",
            )
        finally:
            if connection and connection.is_connected():
                cursor.close()
                connection.close()

    def authenticate_user(self, username: str, password: str) -> Optional[UserInDB]:
        """Authenticate user with username/email and password"""
        # Try to get user by username first
        user = self.get_user_by_username(username)

        # If not found, try by email
        if not user:
            user = self.get_user_by_email(username)

        if not user:
            return None

        if not self.verify_password(password, user.hashed_password):
            return None

        return user

    def create_access_token(
        self, data: dict, expires_delta: Optional[timedelta] = None
    ) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=config.JWT_ACCESS_TOKEN_EXPIRE_MINUTES
            )

        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(
            to_encode, config.JWT_SECRET_KEY, algorithm=config.JWT_ALGORITHM
        )
        return encoded_jwt

    async def get_current_user(self, token: str = Depends(oauth2_scheme)) -> User:
        """Get current user from JWT token"""
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            payload = jwt.decode(
                token, config.JWT_SECRET_KEY, algorithms=[config.JWT_ALGORITHM]
            )
            username: str = payload.get("sub")
            if username is None:
                raise credentials_exception
            token_data = TokenData(username=username)
        except (InvalidTokenError, DecodeError, Exception):
            raise credentials_exception

        user = self.get_user_by_username(username=token_data.username)
        if user is None:
            raise credentials_exception

        # Convert to User model (without hashed_password)
        return User(
            id=user.id,
            username=user.username,
            email=user.email,
            is_active=user.is_active,
            created_at=user.created_at,
        )

    async def get_current_active_user(self, current_user: User) -> User:
        """Get current active user"""
        if not current_user.is_active:
            raise HTTPException(status_code=400, detail="Inactive user")
        return current_user


# Create global instance
auth_service = AuthService()


# Export dependency functions for use in routes
async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Dependency to get current user"""
    return await auth_service.get_current_user(token)


async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """Dependency to get current active user"""
    return await auth_service.get_current_active_user(current_user)
