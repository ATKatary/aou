import { Handle, HandleProps, HandleType, Position } from "@xyflow/react";
import { useState } from "react";
import { useMBStore } from "../stores";
import { generateUUID } from "three/src/math/MathUtils";
import { useShallow } from "zustand/shallow";

type BaseNodeProps = JSX.IntrinsicElements["div"] & {
    id: string
    title: string
    sources?: string[]
    targets?: string[]
    type: "txt" | "img" | "sketch" | "mesh" | "generatedImg"
}
export default function BaseNode({id, type, title, targets = [], sources = [], children, className, style, ...props}: BaseNodeProps) {
    const {active, setActive} = useMBStore(useShallow((state) => ({
        active: state.active,
        setActive: state.setActive
    })));

    const [currTitle, setCurrTitle] = useState<string>(title);

    return (
        <div 
            onClick={() => active !== id && setActive(id)}
            className={`node ${active === id ? "active" : ""} ${className}`} 
            style={{...style, backgroundColor: `var(--node-color-${type})`}}
        >
            <BaseHandle 
                type="target"
                handles={targets}
                position={Position.Left}
            />
            <input value={currTitle} className="node-title" onChange={event => setCurrTitle(event.target.value)}/>
            {children}
            <BaseHandle 
                type="source"
                handles={sources}
                position={Position.Right}
            />
        </div>
    )
}

type BaseHandleProps = HandleProps & {
    handles: string[]
}
function BaseHandle({type, position, handles, className, style, ...props}: BaseHandleProps) {
    return (
        <>
            {handles?.map((handle, i) => {
                const id = generateUUID();
                const top = ((i + 1) * 100) / (handles.length + 1);

                return (
                    <Handle
                        {...props}

                        key={id}
                        type={type}
                        id={handle}
                        position={position}
                        className={`node-handle ${className}`}
                        style={{top: `${top}%`, width: 10, height: 10, ...style}}
                    >
                        {type === "target" && <p>{handle}</p>}
                    </Handle>
                )
            })}
        </>
    )
}