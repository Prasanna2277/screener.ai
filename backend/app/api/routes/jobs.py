from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.job import Job
from app.schemas.job import JobCreate
from app.api.deps import require_hr

router = APIRouter(tags=["Jobs"])


@router.get("/jobs")
def list_jobs(db: Session = Depends(get_db)):
    return db.query(Job).all()


@router.post("/jobs")
def create_job(
    job: JobCreate,
    current_user=Depends(require_hr),
    db: Session = Depends(get_db),
):
    db_job = Job(
        title=job.title,
        description=job.description,
        location=job.location,
        experience_level=job.experience_level,
        company_name=job.company_name,
        created_by=current_user.id
    )

    db.add(db_job)
    db.commit()
    db.refresh(db_job)

    return {
        "message": "Job created successfully",
        "job_id": db_job.id,
    }
