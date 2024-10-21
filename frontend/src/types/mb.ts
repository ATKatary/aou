import { nodeType, edgeType } from "."

export type mbType = {
    id: string
    title: string
    nodes: nodeType[]
    edges: edgeType[]
}