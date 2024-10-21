import { create } from "zustand";
import { edgeType, mbType, nodeDataType, nodeType } from "../../types";
import { Node, Edge, Connection, applyEdgeChanges, EdgeChange, applyNodeChanges, NodeChange, addEdge } from "@xyflow/react";

export interface MBState {
    id: string;
    title: string;
    nodes: Node[];
    edges: Edge[];

    addedNodes: nodeType[];
    deletedNodes: string[];

    addedEdges: edgeType[];
    deletedEdges: string[];

    active?: string;
    setActive: (active?: string) => void;

    init: (mb: mbType) => void;
    addNode: (node: Node) => void;
    onConnect: (conn: Connection) => void;
    onEdgesDelete: (edges: Edge[]) => void;
    onNodesDelete: (nodes: Node[]) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    isValidConnection: (edge: Edge | Connection) => boolean;

    updateNodeData: (id: string, data: nodeDataType) => void;
}

export const useMBStore = create<MBState>((set, get) => ({
    id: "",
    title: "",
    nodes: [],
    edges: [],

    addedNodes: [],
    deletedNodes: [],

    addedEdges: [],
    deletedEdges: [],

    init: (mb: mbType) => {
        set({
            id: mb.id,
            edges: mb.edges,
            title: mb.title,
            nodes: mb.nodes,
        });
    },

    setActive: (active?: string) => {
        set({active});
    },

    addNode: (node: Node) => {
        const state = get()

        set({
            nodes: [...state.nodes, node],
            addedNodes: [...state.addedNodes, {...node, status: "ready"} as nodeType],
        });
    },

    onNodesChange: (changes: NodeChange[]) => {
        const state = get()
        set({
            nodes: applyNodeChanges(changes, state.nodes),
            addedNodes: applyNodeChanges(changes, state.addedNodes) as nodeType[],
        });
    },

    onNodesDelete: (nodes: Node[]) => {
        const state = get()
        let addedNodes = [...state.addedNodes]
        let deletedNodes = [...state.deletedNodes]

        nodes.forEach((node) => {
            if (hasNode(addedNodes, node)) {
                addedNodes = removeNode(addedNodes, node) as nodeType[]
            } else deletedNodes.push(node.id)
        })
        
        set({ 
            addedNodes: addedNodes,
            deletedNodes: deletedNodes,
        });
    },

    onEdgesChange: (changes: EdgeChange[]) => {
        const state = get()

        set({
            edges: applyEdgeChanges(changes, state.edges),
            addedEdges: applyEdgeChanges(changes, state.addedEdges) as edgeType[],
        });
    },

    onConnect: (conn: Connection) => {
        const state = get()

        set({ 
            edges: addEdge(conn, state.edges),
            addedEdges: [...state.addedEdges, {...conn, id: "edge"} as edgeType]
        });
    },

    onEdgesDelete: (edges: Edge[]) => {
        const state = get()
        let addedEdges = [...state.addedEdges]
        let deletedEdges = [...state.deletedEdges]

        edges.forEach((edge) => {
            if (hasEdge(addedEdges, edge as Edge)) {
                addedEdges = removeEdge(addedEdges, edge as Edge) as edgeType[]
            } else deletedEdges.push(edge.id)
        })
        
        set({ 
            addedEdges: addedEdges,
            deletedEdges: deletedEdges,
        });
    },

    isValidConnection: (edge: Edge | Connection) => {
        if (!edge.sourceHandle) return false

        const state = get()
        if (hasEdge(state.edges as edgeType[], edge as Edge)) return false

        switch (edge.targetHandle) {
            case "style":
                if (["txt", "img", "sketch"].includes(edge.sourceHandle)) return true
                break

            case "geometry":
                const targetNode = state.nodes.find((node) => node.id === edge.target);
                if (!targetNode) return false

                const geoConns = state.edges.filter((edge) => edge.target === targetNode.id && edge.targetHandle === "geometry")
                if (geoConns.length > 0 && geoConns[0].source !== edge.source) return false

                if (["txt", "img", "sketch"].includes(edge.sourceHandle)) return true
                break
            
            case "mesh":
                if (["mesh"].includes(edge.sourceHandle)) return true
                break
            default: break
        }

        return false
    },

    updateNodeData: (id, data: nodeDataType) => {
        const state = get()
        
        set({
            nodes: updateNodeData(state.nodes as nodeType[], id, data),
            addedNodes: updateNodeData(state.addedNodes as nodeType[], id, data)
        })
    }
}))

function hasNode(nodes: nodeType[], node: Node) {
    return nodes.find((n) => 
        n.id == node.id
    )
}

function removeNode(nodes: nodeType[], node: Node) {
    return nodes.filter((n) => 
        n.id != node.id
    )
}

function updateNodeData(nodes: nodeType[], id: string, data: nodeDataType) {
    return nodes.map((node) => {
        if (node.id === id) {
            return {...node, data}
        }
        return node
    })
}

function hasEdge(edges: edgeType[], edge: Edge) {
    return edges.find((e) => 
        e.source === edge.source && e.target === edge.target && e.targetHandle === edge.targetHandle && e.sourceHandle === edge.sourceHandle
    )
}

function removeEdge(edges: edgeType[], edge: Edge) {
    return edges.filter((e) => 
        e.source !== edge.source || e.target !== edge.target || e.targetHandle !== edge.targetHandle || e.sourceHandle !== edge.sourceHandle
    )
}