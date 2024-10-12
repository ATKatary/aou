import React from "react";
import { useState } from "react";
import { AOUImg } from "./aouImg";

interface Txt2MeshProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    onGenerated?: (response: string) => void
}

const txt2MeshSocket = new WebSocket("ws://127.0.0.1:8000/ws/txt2Mesh/");

export default function Txt2Mesh({onGenerated, className, ...props}: Txt2MeshProps) {
    const [prompt, setPrompt] = useState<string>()

    txt2MeshSocket.onmessage = async ({data}) => {
        switch (typeof data) {
            case "string": 
                console.log(data)
                break
            default: 
                const response = URL.createObjectURL(data)
                onGenerated && onGenerated(response)
                break;
        }
    }
    // TODO: add a socket connection that continues to call onGenerated as it recieves obj files

    return (
        <div className={`flex column align-center ${className}`} {...props} id="txt2mesh-controls">
            <textarea onChange={(event) => setPrompt(event.target.value)} placeholder={"write your prompt here..."}>{prompt}</textarea>
            <button onClick={async () => {
                if (prompt) {
                    txt2MeshSocket.send(prompt)
                }
            }}>Generate</button>
        </div>
    )
}