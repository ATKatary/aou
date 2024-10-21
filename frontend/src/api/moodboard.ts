import { tryCache } from "."
import { nodeType, edgeType, mbType, projectType } from "../types"
import { addToLocalStorage, constructUrl } from "../utils"

const url = "http://localhost:8000/api/mb"

export async function getMoodboard(id: string): Promise<mbType> {
    return await tryCache<mbType>(url, id)
}

export async function createMoodboard(pid: string): Promise<mbType> {
    const mb = await (await fetch(constructUrl(`${url}/create`, {pid}), {
        method: "POST", 
        headers: {"Content-Type": "application/json"}
    })).json() as mbType

    const cachedProject = localStorage.getItem(pid)
    if (cachedProject) {    
        const project = JSON.parse(cachedProject) as projectType
        project.mbs.push(mb)
        addToLocalStorage(pid, JSON.stringify(project))
    }

    addToLocalStorage(mb.id, JSON.stringify(mb))
    return mb
}

export async function deleteMoodboard(id: string) {
    const pid = await (await fetch(constructUrl(`${url}/delete`, {id}), {
        method: "DELETE", 
        headers: {"Content-Type": "application/json"}
    })).text()

    const cachedProject = localStorage.getItem(pid)
    if (cachedProject) {    
        const project = JSON.parse(cachedProject) as projectType
        project.mbs = project.mbs.filter((mb) => mb.id !== id)
        addToLocalStorage(pid, JSON.stringify(project))
    }
    localStorage.removeItem(id);
}

export async function editMoodboard(
    id: string, 
    title: string, 

    nodes: nodeType[], 

    deleted_nodes: string[], 
    added_nodes: nodeType[], 

    deleted_edges: string[], 
    added_edges: edgeType[]
): Promise<mbType> {
    const {pid, mb} = await (await fetch(constructUrl(`${url}/edit`, {id, title}), {
        method: "PUT", 
        body: JSON.stringify({
            nodes,
            
            deleted_nodes, 
            added_nodes, 

            deleted_edges,  
            added_edges
        }), 
        headers: {"Content-Type": "application/json"}
    })).json() as {pid: string, mb: mbType}
    
    addToLocalStorage(id, JSON.stringify(mb))

    const cachedProject = localStorage.getItem(pid)
    if (cachedProject) {    
        const project = JSON.parse(cachedProject) as projectType
        project.mbs = project.mbs.map((projectMB) => {
            if (projectMB.id === id) return mb
            return projectMB
        })
        addToLocalStorage(pid, JSON.stringify(project))
    }

    return mb;
}