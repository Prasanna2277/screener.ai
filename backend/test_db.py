from app.db.session import engine

try:
    connection = engine.connect()
    print("DB connected successfully")
    connection.close()
except Exception as e:
    print("DB connection failed:", e)
