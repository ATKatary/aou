import { Img } from "../img"
import BaseNode from "./base"
import { nodeDataType } from "../../types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

type MeshNodeProps = JSX.IntrinsicElements["div"] & {
    id: string
    data: nodeDataType
}

export function MeshNode({id,  data: {src, title}, ...props}: MeshNodeProps) {
    return (
        <BaseNode 
            {...props}
            id={id}
            type="mesh"
            title={title}
            sources={["mesh"]}
            className="mesh out"
            style={{minHeight: 120, width: 175}}
            targets={["style", "geometry"]}
        >
            <p className="placeholder" style={{textAlign: "center"}}>Generated Mesh will appear here</p>
            <FontAwesomeIcon icon={"fa-solid fa-circle-play" as IconProp} className="clickable"/>
        </BaseNode>
    )
}

type GeneratedImgNodeProps = JSX.IntrinsicElements["div"] & {
    id: string
    data: nodeDataType
}

export function GeneratedImgNode({id, data: {src, title}, ...props}: GeneratedImgNodeProps) {
    
    return (
        <BaseNode 
            {...props}
            id={id}
            title={title}
            sources={["img"]}
            type="generatedImg"
            className="generatedImg out"
            targets={["style", "geometry"]}
            style={{minHeight: 120, width: 175}}
        >
            <Img src={src} disabled placeholder="Generated image will appear here" style={{textAlign: "center"}}/>
            <FontAwesomeIcon icon={"fa-solid fa-circle-play" as IconProp} className="clickable"/>
        </BaseNode>
    )
}