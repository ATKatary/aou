import { mbType } from "../../types";
import { MiniMap, ReactFlow } from "@xyflow/react";
import dummyData from "../../assets/data/projects.json";

import "../../assets/css/mb.css";
import { Link, LinkProps } from "react-router-dom";
import { nodeTypes } from "../nodes";

type MBThumbnailProps = (LinkProps |  JSX.IntrinsicElements["div"]) & {
    mb?: mbType
    disabled?: boolean
    onAdd?: () => void
}

export default function MBThumbnail({mb, onAdd, disabled, className, ...props}: MBThumbnailProps) {
    return (
        disabled ? 
            <div 
                className={`mb-thumbnail ${className}`} 
                {...props as JSX.IntrinsicElements["div"]}
            >
                <MBEmbedding {...props} mb={mb} onAdd={onAdd}/>
            </div>
            :
            <Link 
                {...props as LinkProps}
                className={`mb-thumbnail ${className}`} 
            >
                <MBEmbedding {...props} mb={mb} onAdd={onAdd} />
            </Link>
    )
}

function MBEmbedding({mb, onAdd, children}: MBThumbnailProps) {
    return (
        <>
            <ReactFlow 
                maxZoom={0.5}
                minZoom={0.5}

                draggable={false}
                panOnDrag={false}
                nodesDraggable={false}
                nodesFocusable={false}
                edgesFocusable={false}
                nodesConnectable={false}

                nodeTypes={nodeTypes}
                nodes={mb?.nodes || []} 
                className="validationflow"
                proOptions={{ hideAttribution: true }}
            >
            </ReactFlow>
            {onAdd && <button onClick={onAdd}>+</button>}
            {children}
        </>
    )
}