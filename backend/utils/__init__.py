import logging
from pathlib import Path
from http import HTTPStatus
from django.db import models
from django.core.exceptions import ValidationError

ALPHABET_SIZE = 26
BASE_DIR = Path(__file__).resolve().parent

WARN = "warn"
INFO = "info"
ERROR = "error"
FILE = "[utils]"
logger = logging.getLogger('django')

def report(message: str, mode: str = INFO, debug: bool = False):    
    if mode == INFO: logger.info(message)
    if mode == WARN: logger.warn(message)
    if mode == ERROR: logger.debug(message, exc_info=debug)

def get(model: models.Model, id: str):
    try:
        return model.objects.get(id=id).json()
    except model.DoesNotExist:
        return {"error": f"{model.__name__} does not exist", "status": HTTPStatus.NOT_FOUND}
    except ValidationError:
        return {"error": f"Invalid {model.__name__} id", "status": HTTPStatus.BAD_REQUEST}