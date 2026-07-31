from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from app.core.logger import logger


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(ValueError)
    async def value_error_handler(
        request: Request,
        exc: ValueError,
    ):
        logger.error(f"ValueError: {exc}")

        return JSONResponse(
            status_code=400,
            content={
                "success": False,
                "message": str(exc),
            },
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(
        request: Request,
        exc: HTTPException,
    ):
        logger.error(f"HTTPException: {exc.detail}")

        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "message": exc.detail,
            },
        )

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ):
        logger.exception("Unhandled exception")

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error",
            },
        )