from app.models.company import Company
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import CompanyCreate, CompanyUpdate


class CompanyService:
    def __init__(self, repository: CompanyRepository):
        self.repository = repository

    def create(self, data: CompanyCreate) -> Company:
        return self.repository.create(data)

    def get_all(self):
        return self.repository.get_all()

    def get_by_id(self, company_id: int):
        company = self.repository.get_by_id(company_id)

        if not company:
            raise ValueError("Company not found.")

        return company

    def update(
        self,
        company_id: int,
        data: CompanyUpdate,
    ) -> Company:
        company = self.get_by_id(company_id)

        company.name = data.name
        company.ticker = data.ticker
        company.sector = data.sector

        return self.repository.update(company)

    def delete(self, company_id: int):
        company = self.get_by_id(company_id)
        self.repository.delete(company)