import { tryCache } from "."
import { projectType } from "../types"
import { addToLocalStorage, constructUrl } from "../utils"

const url = "http://localhost:8000/api/proj"

export async function getProject(id: string): Promise<projectType> {
    return await tryCache<projectType>(url, id)
}

export async function createProject(uid: string): Promise<projectType> {
    const project = await (await fetch(constructUrl(`${url}/create`, {uid}), {
        method: "POST", 
        headers: {"Content-Type": "application/json"}
    })).json() as projectType

    addToLocalStorage(project.id, JSON.stringify(project))
    return project
}

export async function deleteProject(id: string) {
    await fetch(constructUrl(`${url}/delete`, {id}), {
        method: "DELETE", 
        headers: {"Content-Type": "application/json"}
    })

    localStorage.removeItem(id);
}

export async function editProject(id: string, title: string) {
    await fetch(constructUrl(`${url}/edit`, {id, title}), {
        method: "PUT", 
        headers: {"Content-Type": "application/json"}
    })

    const cachedProject = localStorage.getItem(id)
    if (cachedProject) {    
        const project = JSON.parse(cachedProject) as projectType
        project.title = title
        addToLocalStorage(id, JSON.stringify(project))
    }
}