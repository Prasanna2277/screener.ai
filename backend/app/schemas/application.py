from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApplicationBase(BaseModel):
    job_id: int
    user_id: int
    resume_path: str
    status: str = "pending"

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    resume_path: Optional[str] = None

class ApplicationResponse(ApplicationBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True  # Replaces orm_mode = True in Pydantic v2