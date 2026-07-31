from sqlalchemy.orm import Session

from app.models.financial_report import FinancialReport


class FinancialReportRepository:

    def create(self, db: Session, report: FinancialReport):
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

    def get_all(self, db: Session):
        return db.query(FinancialReport).all()

    def get_by_id(self, db: Session, report_id: int):
        return (
            db.query(FinancialReport)
            .filter(FinancialReport.id == report_id)
            .first()
        )

    def delete(self, db: Session, report: FinancialReport):
        db.delete(report)
        db.commit()