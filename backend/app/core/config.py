import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:root@localhost:5432/postgres",
    )

    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60


settings = Settings()

# 👇 THIS IS WHAT YOUR OTHER FILES EXPECT
DATABASE_URL = settings.DATABASE_URL

print("CONFIG LOADED, DB =", DATABASE_URL)
