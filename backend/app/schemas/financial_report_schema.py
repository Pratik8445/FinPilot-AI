from datetime import datetime

from pydantic import BaseModel, ConfigDict


class FinancialReportResponse(BaseModel):
    id: int
    company_id: int
    report_name: str
    report_year: int
    file_path: str
    extracted_text: str | None = None
    
    uploaded_at: datetime

    model_config = ConfigDict(from_attributes=True)