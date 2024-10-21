"""
Moodboard api
"""
from utils import get
from aou_api import api
from http import HTTPStatus
from project.models import Project
from moodboard.models import Moodboard
from data.schema import NodeSchema, EdgeSchema

@api.get("/mb")
def get_moodboard(request, id: str):
    return get(Moodboard, id)

@api.post("/mb/create")
def create_moodboard(request, pid: str):
    try:
        project = Project.objects.get(id=pid)
        owner = project.owner
    except Project.DoesNotExist:
        return {"error": "Project does not exist", "status": HTTPStatus.FORBIDDEN}
    
    moodboard = Moodboard.objects.create(owner=owner, title="New Moodboard")
    project.moodboards.add(moodboard)

    moodboard.save()
    project.save()

    return moodboard.json()

@api.put("/mb/edit")
def edit_moodboard(request, 
    
    id: str, 
    title: str = None, 

    nodes: list[NodeSchema] = None,

    deleted_nodes: list[str] = None, 
    added_nodes: list[NodeSchema] = None, 

    added_edges: list[EdgeSchema] = None, 
    deleted_edges: list[str] = None
):
    try:
        moodboard = Moodboard.objects.get(id=id)
        pid = Project.objects.get(moodboards__id=id).id
        if title is not None:
            moodboard.title = title
        
        if nodes is not None:
            moodboard.update_nodes(nodes)
            
        if added_nodes is not None:
            nodes_map = moodboard.add_nodes(added_nodes)

            if added_edges is not None:
                moodboard.add_edges(added_edges, nodes_map)

        if deleted_nodes is not None:
            moodboard.nodes.remove(*deleted_nodes)

        if deleted_edges is not None:
            moodboard.edges.remove(*deleted_edges)

        moodboard.save()
    except Moodboard.DoesNotExist:
        return {"error": "Moodboard does not exist", "status": HTTPStatus.FORBIDDEN}
    except Project.DoesNotExist:
        return {"error": "Project does not exist", "status": HTTPStatus.FORBIDDEN}
    
    return {"pid": pid, "mb": moodboard.json()}

@api.delete("/mb/delete")
def delete_moodboard(request, id: str):
    try:
        pid = Project.objects.get(moodboards__id=id).id
        moodboard = Moodboard.objects.get(id=id)
        moodboard.delete()
    except Moodboard.DoesNotExist:
        return {"error": "Moodboard does not exist", "status": HTTPStatus.FORBIDDEN}
    except Project.DoesNotExist:
        return {"error": "Project does not exist", "status": HTTPStatus.FORBIDDEN}
    
    return pid