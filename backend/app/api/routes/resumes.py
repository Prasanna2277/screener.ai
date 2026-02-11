from fastapi import APIRouter, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.resume import Resume
from app.api.deps import get_current_user

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload")
def upload_resume(file: UploadFile,
                  db: Session = Depends(get_db),
                  user=Depends(get_current_user)):
    if user.role != "candidate":
        raise HTTPException(status_code=403)
    path = f"uploads/{file.filename}"
    with open(path, "wb") as f:
        f.write(file.file.read())
    resume = Resume(file_path=path, candidate_id=user.id)
    db.add(resume)
    db.commit()
    return {"msg": "Resume uploaded"}
