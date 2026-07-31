from pydantic import BaseModel, Field


class GroqAnalysisResult(BaseModel):
    company_overview: str
    revenue_analysis: str
    profitability: str
    risks: str
    investment_recommendation: str
    overall_rating: int = Field(ge=1, le=10)