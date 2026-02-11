from pydantic import BaseModel

from pydantic import BaseModel

class JobCreate(BaseModel):
    title: str
    description: str
    location: str
    experience_level: str
    company_name: str




class JobOut(JobCreate):
    id: int

    class Config:
        from_attributes = True
