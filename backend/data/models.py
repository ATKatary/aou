"""
Data models
"""
from typing import override
from django.db import models
from utils import ALPHABET_SIZE
from utils.models.base import BaseModel

class Data(BaseModel):
    src = models.TextField()
    title = models.CharField(max_length=ALPHABET_SIZE, default="Unnamed Playground")

    @override
    def json(self):
        return {
            "src": self.src,
            "title": self.title,
        }

NODE_TYPES = {
    "img": "image", 
    "txt": "text", 
    "mes": "mesh", 
    "remesh": "re-mesh", 
    "sketch": "sketch", 
    "segment": "segment", 
    "texture": "texture",
    "playground": "playground", 
    "generatedImg": "generated image"
}

NODE_STATUSES = {
    "done": "done", 
    "ready": "ready", 
    "error": "error", 
    "static": "static",
    "running": "running", 
    "pending": "pending"
}

class Node(BaseModel):
    data = models.ForeignKey(Data, on_delete=models.CASCADE)
    position = models.JSONField()

    type = models.CharField(max_length=ALPHABET_SIZE, choices=NODE_TYPES)
    status = models.CharField(max_length=ALPHABET_SIZE, choices=NODE_STATUSES, default="ready")

    @override
    def json(self):
        return {
            "id": self.id,
            "type": self.type,
            "status": self.status,
            "data": self.data.json(),
            "position": self.position,
        }

class Edge(BaseModel):
    source = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="source")
    target = models.ForeignKey(Node, on_delete=models.CASCADE, related_name="target")

    sourceHandle = models.CharField(max_length=ALPHABET_SIZE)
    targetHandle = models.CharField(max_length=ALPHABET_SIZE)

    @override
    def json(self):
        return {
            "id": self.id,
            "source": self.source.id,
            "target": self.target.id,
            "sourceHandle": self.sourceHandle,
            "targetHandle": self.targetHandle
        }