from pydantic import BaseModel

from app.schemas.ai_analysis_schema import AIAnalysisResponse
from app.schemas.financial_report_schema import FinancialReportResponse


class ReportAnalysisResponse(BaseModel):
    report: FinancialReportResponse
    analysis: AIAnalysisResponse