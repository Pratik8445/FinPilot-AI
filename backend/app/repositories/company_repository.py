from sqlalchemy.orm import Session

from app.models.company import Company
from app.schemas.company import CompanyCreate


class CompanyRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, data: CompanyCreate) -> Company:
        company = Company(**data.model_dump())
        self.db.add(company)
        self.db.commit()
        self.db.refresh(company)
        return company

    def get_all(self):
        return self.db.query(Company).all()

    def get_by_id(self, company_id: int):
        return (
            self.db.query(Company)
            .filter(Company.id == company_id)
            .first()
        )

    def update(self, company: Company):
        self.db.commit()
        self.db.refresh(company)
        return company

    def delete(self, company: Company):
        self.db.delete(company)
        self.db.commit()