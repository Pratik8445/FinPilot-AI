from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "AI Financial Analyst"
    app_version: str = "1.0.0"
    debug: bool = True

    host: str = "127.0.0.1"
    port: int = 8000

    database_url: str = ""
    secret_key: str = ""
    groq_api_key: str = ""
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    groq_api_key: str
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()