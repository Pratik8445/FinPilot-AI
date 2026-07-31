from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.ai_analysis import AIAnalysis
from app.models.financial_report import FinancialReport
from app.repositories.ai_analysis_repository import AIAnalysisRepository
from app.services.groq_service import GroqService


class AIAnalysisService:

    def __init__(self):
        self.repository = AIAnalysisRepository()
        self.groq_service = GroqService()

    def analyze_report(self, db: Session, report_id: int):

        report = (
            db.query(FinancialReport)
            .filter(FinancialReport.id == report_id)
            .first()
        )

        if not report:
            raise HTTPException(
                status_code=404,
                detail="Report not found"
            )

        # Prevent duplicate analysis
        existing = self.repository.get_by_report(db, report_id)

        if existing:
            return existing

        try:
            result = self.groq_service.analyze_financial_report(
            report.extracted_text
            )
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail=f"Groq AI analysis failed: {str(e)}"
            )

        analysis = AIAnalysis(
            report_id=report.id,
            company_overview=result.company_overview,
            revenue_analysis=result.revenue_analysis,
            profitability=result.profitability,
            risks=result.risks,
            investment_recommendation=result.investment_recommendation,
            overall_rating=result.overall_rating,
        )

        return self.repository.create(db, analysis)

    def get_analysis(self, db: Session, report_id: int):

        analysis = self.repository.get_by_report(db, report_id)

        if not analysis:
            raise HTTPException(
                status_code=404,
                detail="Analysis not found"
            )

        return analysis