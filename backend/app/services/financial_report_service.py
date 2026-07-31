import os
import shutil
from pathlib import Path

import fitz
from fastapi import HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.models.company import Company
from app.models.financial_report import FinancialReport
from app.repositories.financial_report_repository import (
    FinancialReportRepository,
)


class FinancialReportService:

    def __init__(self):
        self.repository = FinancialReportRepository()

    def upload_report(
        self,
        db: Session,
        company_id: int,
        report_year: int,
        file: UploadFile,
    ):
        # Check company exists
        company = (
            db.query(Company)
            .filter(Company.id == company_id)
            .first()
        )

        if not company:
            raise HTTPException(
                status_code=404,
                detail="Company not found",
            )

        # Create uploads directory safely
        upload_dir = Path("uploads")

        # If a file named "uploads" exists, delete it
        if upload_dir.exists() and not upload_dir.is_dir():
            upload_dir.unlink()

        upload_dir.mkdir(parents=True, exist_ok=True)

        # Save uploaded PDF
        file_path = upload_dir / file.filename

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text from PDF
        try:
            pdf = fitz.open(str(file_path))

            extracted_text = ""

            for page in pdf:
                extracted_text += page.get_text()

            pdf.close()

        except Exception:
            if file_path.exists():
                file_path.unlink()

            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file.",
            )

        # Save report in database
        report = FinancialReport(
            company_id=company_id,
            report_name=file.filename,
            report_year=report_year,
            file_path=str(file_path),
            extracted_text=extracted_text,
        )

        saved_report = self.repository.create(db, report)

        # AI Analysis
        from app.services.ai_analysis_service import AIAnalysisService

        ai_service = AIAnalysisService()

        ai_service.analyze_report(
            db=db,
            report_id=saved_report.id,
        )

        return saved_report

    def get_all_reports(self, db: Session):
        return self.repository.get_all(db)

    def get_report(self, db: Session, report_id: int):
        report = self.repository.get_by_id(db, report_id)

        if not report:
            raise HTTPException(
                status_code=404,
                detail="Report not found",
            )

        return report

    def delete_report(self, db: Session, report_id: int):
        report = self.get_report(db, report_id)

        file_path = Path(report.file_path)

        if file_path.exists():
            file_path.unlink()

        self.repository.delete(db, report)