from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(String, nullable=False)  # hr | candidate
    hashed_password = Column(String, nullable=False)


    # ✅ HR → Jobs
    jobs = relationship("Job", back_populates="creator")

    # ✅ Candidate → Applications
    applications = relationship(
        "Application",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    # ✅ Candidate → Resumes
    resumes = relationship("Resume", back_populates="candidate")