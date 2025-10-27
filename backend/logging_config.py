"""Centralized logging configuration for ManagePetro backend.

This module configures the Python stdlib logging based on the LOG_LEVEL
environment variable. Importing and calling `configure_logging()` early in
application startup ensures all modules inherit the configured handlers.
"""

import logging
from config import config


def configure_logging():
    level_name = getattr(config, "LOG_LEVEL", "INFO")
    level = getattr(logging, level_name, logging.INFO)

    # Basic configuration - keep it simple and portable
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )


__all__ = ["configure_logging"]
