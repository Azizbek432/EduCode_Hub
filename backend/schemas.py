from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr 
    password: str = Field(..., min_length=8, max_length=72)

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None



class CourseCreate(BaseModel):
    title: str = Field(..., min_length=5)
    description: str
    difficulty: str  

class CourseResponse(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str

    class Config:
        from_attributes = True

class CodeRequest(BaseModel):
    code: str
    language: str = "python"

class CodeResponse(BaseModel):
    output: str
    error: bool
    returncode: int