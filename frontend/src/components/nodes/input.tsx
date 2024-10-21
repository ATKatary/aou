import { Img } from "../img"
import BaseNode from "./base"
import { nodeDataType } from "../../types"
import { useState, useRef, useEffect } from "react"
import { MBState, useMBStore } from "../stores"
import { useShallow } from "zustand/shallow"
import { img2Base64 } from "../../utils"

const selector = (state: MBState) => ({
    updateNodeData: state.updateNodeData
})

type UploadNodeProps = JSX.IntrinsicElements["div"] & {
    id: string
    data: nodeDataType
}

export const UploadNodeConstructor = (type: "img" | "sketch", sources: string[]) => function UpliadNode ({id, data: {src, title}, ...props}: UploadNodeProps) {
    const {updateNodeData} = useMBStore(useShallow(selector))

    return (
        <BaseNode 
            {...props}
            id={id}
            type={type}
            title={title}
            sources={sources}
        >
            <Img src={src} onUpload={src => img2Base64(src, (url) => updateNodeData(id, {title, src: url}))}/>
        </BaseNode>
    )
}

type TxtNodeProps = JSX.IntrinsicElements["div"] & {
    id: string
    data: nodeDataType
}

export function TxtNode({id, data: {src, title}, ...props}: TxtNodeProps) {
    const [rows, setRows] = useState(1);
    const [text, setText] = useState(src);

    const {updateNodeData} = useMBStore(useShallow(selector))

    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "0";
            const scrollHeight = textAreaRef.current.scrollHeight;
            textAreaRef.current.style.height = `${scrollHeight - 15}px`;
        }
    }, [textAreaRef, text])

    return (
        <BaseNode 
            {...props}
            id={id}
            type="txt"
            title={title}
            sources={["txt"]}
            style={{width: 200}}
        >
            <textarea 
                ref={textAreaRef}
                onKeyUp={event => {
                    if (event.code === "Enter") {
                        setRows(rows + 1)
                    }
                }}
                defaultValue={text}
                onChange={event => {
                    event.preventDefault()
                    event.stopPropagation()
                    setText(event.target.value)
                    updateNodeData(id, {src: event.target.value, title: title})
                }}
                placeholder="Write your prompt here..."
            ></textarea>
        </BaseNode>
    )
}