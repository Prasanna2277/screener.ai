from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    location = Column(String, nullable =False)
    experience_level = Column(String)

    company_name = Column(String,nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    
    # Relationships
    applications = relationship("Application", back_populates="job")
    creator = relationship("User", back_populates="jobs")