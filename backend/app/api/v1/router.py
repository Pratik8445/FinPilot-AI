from fastapi import APIRouter
from app.api.v1.endpoints.financial_report import router as financial_report_router
from app.api.v1.endpoints import auth, health
from app.api.v1.endpoints import auth, company, health
from app.api.v1.endpoints.ai_analysis import router as ai_analysis_router
from app.api.v1.endpoints.health import router as health_router
api_router = APIRouter(prefix="/api/v1")

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(company.router)
api_router.include_router(financial_report_router)
api_router.include_router(ai_analysis_router)
api_router.include_router(health_router)