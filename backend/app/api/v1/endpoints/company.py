from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.models.user import User
from app.database.session import get_db
from app.repositories.company_repository import CompanyRepository
from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
)
from app.services.company_service import CompanyService

router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


@router.post(
    "",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_company(
    company_data: CompanyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repository = CompanyRepository(db)
    service = CompanyService(repository)

    return service.create(company_data)


@router.get(
    "",
    response_model=list[CompanyResponse],
)
def get_companies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repository = CompanyRepository(db)
    service = CompanyService(repository)

    return service.get_all()


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
)
def get_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repository = CompanyRepository(db)
    service = CompanyService(repository)

    try:
        return service.get_by_id(company_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.put(
    "/{company_id}",
    response_model=CompanyResponse,
)
def update_company(
    company_id: int,
    company_data: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repository = CompanyRepository(db)
    service = CompanyService(repository)

    try:
        return service.update(company_id, company_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.delete(
    "/{company_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_company(
    company_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    repository = CompanyRepository(db)
    service = CompanyService(repository)

    try:
        service.delete(company_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )