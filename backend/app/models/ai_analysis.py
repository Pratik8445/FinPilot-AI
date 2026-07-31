from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class AIAnalysis(Base):
    __tablename__ = "ai_analysis"

    id: Mapped[int] = mapped_column(primary_key=True)

    report_id: Mapped[int] = mapped_column(
        ForeignKey("financial_reports.id"),
        unique=True,
        nullable=False,
    )

    company_overview: Mapped[str] = mapped_column(Text)

    revenue_analysis: Mapped[str] = mapped_column(Text)

    profitability: Mapped[str] = mapped_column(Text)

    risks: Mapped[str] = mapped_column(Text)

    investment_recommendation: Mapped[str] = mapped_column(Text)

    overall_rating: Mapped[str] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
    )