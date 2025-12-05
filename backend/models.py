from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: str
    email: EmailStr
    name: str
    picture: Optional[str] = None
    created_at: datetime
    last_login: datetime

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class TokenData(BaseModel):
    email: Optional[str] = None
    sub: Optional[str] = None
    access_token: Optional[str] = None

class GoogleTokens(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_uri: str
    client_id: str
    client_secret: str
    scopes: list[str]

class AuthResponse(BaseModel):
    success: bool
    message: str
    redirect_url: Optional[str] = None
