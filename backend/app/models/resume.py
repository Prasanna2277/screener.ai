from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    file_path = Column(String, nullable=False)

    candidate_id = Column(Integer, ForeignKey("users.id"))

    # MUST match User.resumes
    candidate = relationship("User", back_populates="resumes")
