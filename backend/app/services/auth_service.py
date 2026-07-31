from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from backend.app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
)


class AuthService:

    def register(
        self,
        db: Session,
        user_data: UserRegister,
    ) -> User:

        existing_user = (
            db.query(User)
            .filter(User.email == user_data.email)
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user = User(
            name=user_data.name,
            email=user_data.email,
            password=hash_password(user_data.password),
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return user

    def login(
        self,
        db: Session,
        user_data: UserLogin,
    ) -> TokenResponse:

        user = (
            db.query(User)
            .filter(User.email == user_data.email)
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not verify_password(
            user_data.password,
            user.password,
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        access_token = create_access_token(
            data={
                "sub": str(user.id)
            }
        )

        return TokenResponse(
            access_token=access_token,
            token_type="bearer",
        )