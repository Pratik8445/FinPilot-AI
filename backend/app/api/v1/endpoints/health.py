from fastapi import APIRouter

router = APIRouter(
    prefix="/health",
    tags=["Health"],
)


@router.get(
    "",
    summary="Health Check",
    description="Checks whether the API is running successfully.",
)
def health():
    return {
        "status": "healthy",
        "service": "AI Financial Analyst API",
        "version": "1.0.0",
    }