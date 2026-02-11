from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import Application, Job, User
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse

# Define the prefix in the router itself
router = APIRouter(prefix="/applications", tags=["applications"])

@router.get("/")
def list_applications(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    job_id: int = None,
    user_id: int = None,
    status: str = None
):
    """Get all applications with optional filters"""
    query = db.query(Application)
    
    if job_id:
        query = query.filter(Application.job_id == job_id)
    if user_id:
        query = query.filter(Application.user_id == user_id)
    if status:
        query = query.filter(Application.status == status)
    
    applications = query.offset(skip).limit(limit).all()
    return applications

# Other endpoints remain the same...