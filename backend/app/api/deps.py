from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload.get("sub")   # ✅ FIXED
        role = payload.get("role")

        if user_id is None or role is None:
            raise HTTPException(status_code=401)

    except JWTError:
        raise HTTPException(status_code=401)

    user = db.query(User).filter(User.id == int(user_id)).first()
    if not user:
        raise HTTPException(status_code=401)

    return user




def require_hr(user: User = Depends(get_current_user)):
    if user.role.lower() != "hr":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"HR access required. Your role: {user.role}"
        )
    return user



def require_candidate(user: User = Depends(get_current_user)):
    if user.role != "candidate":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidate access required"
        )
    return user
