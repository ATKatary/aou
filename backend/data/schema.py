from typing import Optional
from ninja import Schema

class PositionSchema(Schema):
    x: float
    y: float

class DataSchema(Schema):
    src: str 
    title: str

class NodeSchema(Schema):
    id: str
    type: str
    status: str
    data: DataSchema
    position: PositionSchema 

class EdgeSchema(Schema):
    id: str
    source: str 
    target: str
    sourceHandle: str
    targetHandle: str
    