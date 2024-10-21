import { useEffect, useState } from 'react';
import DefaultNav from "../components/nav";
import { useShallow } from 'zustand/shallow';
import { useParams } from "react-router-dom";
import navData from '../assets/data/nav.json';
import { MBState, useMBStore } from "../components/stores";
import projects from "../assets/data/projects.json"
import { nodeTypes, XNodeToolbar } from "../components/nodes";

import { 
    MiniMap, 
    Controls, 
    ReactFlow, 
    Background, 
    BackgroundVariant,
} from "@xyflow/react";
import { mbType, nodeType } from '../types';
import { editMoodboard, getMoodboard } from '../api/moodboard';

type MBProps = JSX.IntrinsicElements["div"] & {
}

const proOptions = { hideAttribution: true }; 

const selector = (state: MBState) => ({
    init: state.init,
    title: state.title,
    nodes: state.nodes,
    edges: state.edges,

    addedNodes: state.addedNodes,
    deletedNodes: state.deletedNodes,

    addedEdges: state.addedEdges,
    deletedEdges: state.deletedEdges,

    addNode: state.addNode,
    onConnect: state.onConnect,
    onNodesDelete: state.onNodesDelete,
    onNodesChange: state.onNodesChange,
    onEdgesChange: state.onEdgesChange,
    onEdgesDelete: state.onEdgesDelete,
    isValidConnection: state.isValidConnection
})

export default function MB({id, ...props}: MBProps) {
    const params = useParams()
    const mbId = params.mbId
    const uid = params.uid
    const socket = new WebSocket(`ws://localhost:8000/ws/user/${uid}`)

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data)
    }
    
    const [mb, setMB] = useState<mbType>()

    const {
        init,
        title,
        nodes,
        edges,

        addedNodes, 
        deletedNodes,

        addedEdges,
        deletedEdges,

        addNode,
        onConnect,
        onNodesDelete,
        onNodesChange,
        onEdgesChange,
        onEdgesDelete,
        isValidConnection
    } = useMBStore(useShallow(selector));

    const initMB = async () => {
        if (mbId) {
            const mb = await getMoodboard(mbId)

            setMB(mb)
            init(mb)
        }
    }

    useEffect(() => {initMB()}, [])
    
    return (
        <div id={id} {...props} className="height-100 width-100">
            <DefaultNav data={navData.home} style={{zIndex: 1}}/>
            
            <ReactFlow 
                nodes={nodes} 
                edges={edges}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                selectNodesOnDrag={false}
                className="validationflow"

                onNodesDelete={onNodesDelete}
                onEdgesDelete={onEdgesDelete}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                isValidConnection={isValidConnection}
            >
                <MiniMap />
                <Controls />
                <Background variant={BackgroundVariant.Dots} />
            </ReactFlow>
            
            <button 
                className='mb-save-btn'
                onClick={async () => {
                    if (!mbId) return
                    
                    let updatedNodes = nodes
                    .filter((n) => !addedNodes.find((a) => a.id == n.id))
                    .map((n) => ({...n, status: "ready"})) as nodeType[]
                    
                    const cachedNodes = localStorage.getItem(mbId)
                    if (cachedNodes) {
                        const prevNodes = JSON.parse(cachedNodes) as mbType
                        updatedNodes = updatedNodes.filter((n) => !prevNodes.nodes.find((p) => (
                            p.id == n.id && 
                            p.data.src == n.data.src && 
                            p.data.title == n.data.title && 
                            p.position.x == n.position.x && 
                            p.position.y == n.position.y 
                        )))
                    }
                    
                    if (addedNodes.length === 0 && deletedNodes.length === 0 && addedEdges.length === 0 && deletedEdges.length === 0 && updatedNodes.length === 0) return
                    const editedMB = await editMoodboard(mbId, title, updatedNodes, deletedNodes, addedNodes, deletedEdges, addedEdges)

                    init(editedMB)
                }}
            >
                Save
            </button>
            <XNodeToolbar />
        </div>
    )
}
