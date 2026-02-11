from fastapi import APIRouter, Depends
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/hr")
def hr_dashboard(current_user: User = Depends(get_current_user)):
    return {"message": "Admin access granted"}
