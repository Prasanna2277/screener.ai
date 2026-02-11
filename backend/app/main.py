from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.auth import router as auth_router
from app.api.routes import auth, jobs, resumes, applications, admin

app = FastAPI(title="AI Resume Screening")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[ "http://localhost:3000",
        "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth_router)

#app.include_router(auth.router, prefix="/auth")
app.include_router(jobs.router)
app.include_router(resumes.router)
app.include_router(applications.router)
app.include_router(admin.router)


@app.get("/")
def root():
    return {"status": "Backend running"}
