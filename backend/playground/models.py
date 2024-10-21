"""
Playground models
"""
from typing import override
from django.db import models
from data.models import Data
from utils.models.perm import PermModel

class Playground(PermModel):
    meshes = models.ManyToManyField(Data, related_name="meshes", blank=True)

    @override
    def json(self):
        return {
            "id": self.id,
            "title": self.title,
            "meshes": [mesh.json() for mesh in self.meshes.all()]
        }
