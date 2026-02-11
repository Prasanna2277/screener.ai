from pydantic import BaseModel


class ResumeCreate(BaseModel):
    filename: str


class ResumeOut(ResumeCreate):
    id: int
    user_id: int

    class Config:
        from_attributes = True
