export type edgeType = {
    id: string
    source: string
    target: string  
    sourceHandle: string
    targetHandle: string
}

export type nodeType = {
    id: string
    data: nodeDataType
    position: { x: number, y: number }
    status: "ready" | "done" | "error" | "running" | "pending" | "static"
    type: "img" | "sketch" | "txt" | "mesh" | "generatedImg" | "segment" | "playground" | "remesh" | "texture"
}

export type nodeDataType = {
    src: string
    title: string
}