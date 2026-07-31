from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.ai_analysis_schema import AIAnalysisResponse
from app.services.ai_analysis_service import AIAnalysisService
from app.core.security import get_current_user
from app.models.user import User

router = APIRouter(
    prefix="/analysis",
    tags=["AI Analysis"],
)

service = AIAnalysisService()


@router.post("/{report_id}", response_model=AIAnalysisResponse)
def analyze_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.analyze_report(db, report_id)


@router.get("/{report_id}", response_model=AIAnalysisResponse)
def get_analysis(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_analysis(db, report_id)