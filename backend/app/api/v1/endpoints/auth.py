from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import Token
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register User",
    description="Creates a new user account.",
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = UserService(repository)

    try:
        return service.register(user_data)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.post(
    "/login",
    response_model=Token,
    summary="Login User",
    description="Authenticates a user and returns a JWT access token.",
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    repository = UserRepository(db)
    service = UserService(repository)

    try:
        return service.login(
            email=form_data.username,
            password=form_data.password,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Current User",
    description="Returns the authenticated user's profile.",
)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user