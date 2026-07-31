from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logger import logger
from app.database.base import Base
from app.database.session import engine

# Import all models so SQLAlchemy creates their tables
from app.models.user import User
from app.models.company import Company
from app.models.financial_report import FinancialReport
from app.models.ai_analysis import AIAnalysis


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup
    Base.metadata.create_all(bind=engine)

    logger.info("Application Started")

    yield

    logger.info("Application Shutdown")


app = FastAPI(
    title=settings.app_name,
    description="""
AI-powered backend that analyzes company financial reports using Groq LLM.

## Features

- JWT Authentication
- Company Management
- Financial Report Upload
- PDF Text Extraction
- AI Financial Analysis
- PostgreSQL Database
- Repository-Service Architecture
""",
    version=settings.app_version,
    lifespan=lifespan,
)

# CORS — allow the React dev server to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register global exception handlers
register_exception_handlers(app)

# Register API routes
app.include_router(api_router)


@app.get(
    "/",
    tags=["Root"],
    summary="Welcome",
    description="Returns a welcome message.",
)
def root():
    return {
        "message": f"Welcome to {settings.app_name}"
    }