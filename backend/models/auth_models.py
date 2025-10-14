from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserBase(BaseModel):
    """Base user model with common fields"""

    username: str = Field(..., min_length=3, max_length=50, description="Username")
    email: EmailStr = Field(..., description="User email address")


class UserCreate(UserBase):
    """Model for user registration"""

    password: str = Field(
        ...,
        min_length=6,
        max_length=100,
        description="User password (min 6 characters)",
    )


class User(UserBase):
    """Model for user response (without password)"""

    id: int
    is_active: bool = True
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserInDB(User):
    """User model including hashed password for database operations"""

    hashed_password: str


class Token(BaseModel):
    """Model for JWT token response"""

    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class TokenData(BaseModel):
    """Model for token validation data"""

    username: Optional[str] = None
