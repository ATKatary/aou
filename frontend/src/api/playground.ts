import { constructUrl } from "../utils"
import { playgroundType } from "../types"
import { tryCache } from "."

const url = "http://localhost:8000/api/playground"

export async function getPlayground(id: string): Promise<playgroundType> {
    return await tryCache<playgroundType>(url, id)
}