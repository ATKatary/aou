import { addToLocalStorage, constructUrl } from "../utils"

export async function tryCache<T>(url: string, id: string): Promise<T> {
    const cachedResponse = window.localStorage.getItem(id)
    if (cachedResponse) {
        console.log(`Using cached ${id}`)
        return JSON.parse(cachedResponse) as T
    }
    
    const response = (await (await fetch(constructUrl(url, {id}), {method: "GET", })).json()) as T

    addToLocalStorage(id, JSON.stringify(response))
    return response
}