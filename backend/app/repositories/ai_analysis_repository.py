from sqlalchemy.orm import Session

from app.models.ai_analysis import AIAnalysis


class AIAnalysisRepository:

    def create(self, db: Session, analysis: AIAnalysis):
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis

    def get_by_report(self, db: Session, report_id: int):
        return (
            db.query(AIAnalysis)
            .filter(AIAnalysis.report_id == report_id)
            .first()
        )
    def get_by_id(self, db: Session, analysis_id: int):
        return (
            db.query(AIAnalysis)
            .filter(AIAnalysis.id == analysis_id)
            .first()
        )