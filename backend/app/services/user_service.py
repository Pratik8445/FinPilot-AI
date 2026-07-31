from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import Token
from app.schemas.user import UserCreate


class UserService:

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def register(self, data: UserCreate) -> User:
        existing_user = self.repository.get_by_email(data.email)

        if existing_user:
            raise ValueError("Email already registered.")

        user = User(
            name=data.name,
            email=data.email,
            password_hash=hash_password(data.password),
        )

        return self.repository.create(user)

    def login(self, email: str, password: str) -> Token:
        user = self.repository.get_by_email(email)

        if not user:
            raise ValueError("Invalid email or password")

        if not verify_password(password, user.password_hash):
            raise ValueError("Invalid email or password")

        access_token = create_access_token(
            data={"sub": str(user.id)}
        )

        return Token(
            access_token=access_token,
            token_type="bearer",
        )