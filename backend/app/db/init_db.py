"""
Database initialization script.
Run this to create all database tables.
"""
import sys
import os

# Add the parent directory to the path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.base import Base
from app.db.session import engine
from app.models.user import User
from app.models.job import Job
from app.models.application import Application

def init_db():
    """Initialize the database by creating all tables."""
    print("Creating database tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    init_db()