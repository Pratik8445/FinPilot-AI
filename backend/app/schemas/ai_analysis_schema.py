from datetime import datetime

from pydantic import BaseModel, ConfigDict


class AIAnalysisResponse(BaseModel):
    id: int
    report_id: int
    company_overview: str
    revenue_analysis: str
    profitability: str
    risks: str
    investment_recommendation: str
    overall_rating: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)