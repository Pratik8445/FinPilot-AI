from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class FinancialReport(Base):
    __tablename__ = "financial_reports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id"),
        nullable=False
    )

    report_name: Mapped[str] = mapped_column(String(255), nullable=False)

    report_year: Mapped[int] = mapped_column(Integer, nullable=False)

    file_path: Mapped[str] = mapped_column(String(500), nullable=False)

    extracted_text: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )



    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )