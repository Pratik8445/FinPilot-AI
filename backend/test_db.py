from sqlalchemy import text

from app.database.connection import engine

print("Connecting to database...")

with engine.connect() as connection:
    print("Connected successfully!")

    result = connection.execute(text("SELECT version();"))

    print(result.scalar())

print("Finished")