from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.financial_report_schema import FinancialReportResponse
from app.services.financial_report_service import FinancialReportService

from app.core.security import get_current_user
from app.models.user import User
router = APIRouter(prefix="/reports", tags=["Financial Reports"])

service = FinancialReportService()


@router.post(
    "/upload",
    response_model=FinancialReportResponse,
    status_code=201,
)
def upload_report(
    company_id: int = Form(...),
    report_year: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.upload_report(
        db=db,
        company_id=company_id,
        report_year=report_year,
        file=file,
    )


@router.get("/", response_model=list[FinancialReportResponse])
def get_reports(db: Session = Depends(get_db)):
    return service.get_all_reports(db)


@router.get("/{report_id}", response_model=FinancialReportResponse)
def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_report(db, report_id)


@router.delete("/{report_id}")
def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service.delete_report(db, report_id)

    return {"message": "Report deleted successfully"}