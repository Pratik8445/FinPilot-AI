from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    ticker: Mapped[str] = mapped_column(String(20), unique=True, nullable=False)
    sector: Mapped[str] = mapped_column(String(100), nullable=False)