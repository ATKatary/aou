"""
Playground api
"""
from utils import get
from aou_api import api
from playground.models import Playground

@api.get("/playground")
def get_playground(request, id: str):
    return get(Playground, id)