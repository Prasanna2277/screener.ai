from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.schemas.auth import LoginRequest
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/auth/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role,
    )
    db.add(new_user)
    db.commit()
    return {"message": "registered"}

@router.post("/auth/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(
        data={
            "sub": str(user.id),   # ✅ MUST be string
            "role": user.role
        }
    )

    return {
        "access_token": access_token,   # ✅ RETURN THE TOKEN
        "token_type": "bearer",
        "role": user.role
    }

#@router.post("/auth/login")
#def login(data: LoginRequest, db: Session = Depends(get_db)):
 #   user = db.query(User).filter(User.email == data.email).first()
#
 #   if not user or not verify_password(data.password, user.hashed_password):
  #      raise HTTPException(status_code=401, detail="Invalid credentials")

   # token = create_access_token({
    #    "sub": str(user.id),
     #   "role": user.role
    #})

    #return {
     #   "access_token": token,
      #  "token_type": "bearer",
       # "role": user.role
    #}
