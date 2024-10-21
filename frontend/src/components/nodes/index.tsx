import { TxtNode, UploadNodeConstructor } from "./input"
import { MeshNode, GeneratedImgNode } from "./output"
import nodeData from "../../assets/data/nodes.json"

import "../../assets/css/nodes.css"
import { useMBStore } from "../stores"
import { useShallow } from "zustand/shallow"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export const nodeTypes = {
    // input nodes 
    sketch: UploadNodeConstructor("sketch", ["sketch"]), 
    img: UploadNodeConstructor("img", ["img"]), 
    txt: TxtNode,

    // output nodes
    mesh: MeshNode,
    generatedImg: GeneratedImgNode

    // editor nodes
    // remesh: RemeshNode
    // texture: TextureNode
    // segment: SegmentNode

    // multi-mesh nodes 
    // playground: PlaygroundNode
}

type XNodeToolbarProps = JSX.IntrinsicElements["div"] & {
    
}

export function XNodeToolbar({...props}: XNodeToolbarProps) {
    const {nodes, addNode} = useMBStore(useShallow((state) => ({
        nodes: state.nodes,
        addNode: state.addNode
    }))
)
    return (
        <div className="node-toolbar">
            {Object.entries(nodeData).map(([type, node]) => {
                const id = `${type}-${nodes.filter(node => node.type === type).length}`

                return (
                    <button 
                        disabled={node.disabled}
                        key={`${type}-create-btn`}
                        className={`icon-button ${node.disabled ? "disabled" : ""}`} 
                        onClick={() => addNode({id: id, type, position: {x: window.window.innerWidth / 2, y: 0}, data: {title: node.tooltip, src: ""}})}
                    >
                        <FontAwesomeIcon key={type} icon={node.icon as IconProp} />
                        <span className="tooltip">{node.tooltip}</span>
                    </button>
                )
            })}
        </div>
    )
}