import logging


def setup_logger() -> logging.Logger:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )

    return logging.getLogger("ai_financial_analyst")


logger = setup_logger()