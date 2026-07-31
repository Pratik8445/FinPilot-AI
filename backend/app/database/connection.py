from sqlalchemy import create_engine
from app.models import user
from app.core.config import settings

engine = create_engine(
    settings.database_url,
    echo=settings.debug,
    pool_pre_ping=True,
)