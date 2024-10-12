import React from "react";
import { useState } from "react";
import { AOUImg } from "./aouImg";

interface ImgTo3DProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    onGenerated?: (response: string) => void
}

const img2MeshSocket = new WebSocket("ws://127.0.0.1:8000/ws/img2Mesh/");

export default function Img2Mesh({onGenerated, className, ...props}: ImgTo3DProps) {
    const [img, setImg] = useState<File>()

    img2MeshSocket.onmessage = async ({data}) => {
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
        <div className={`flex column align-center ${className}`} {...props} id="img2mesh-controls">
            <AOUImg onUpload={(file) => setImg(file)}/>
            <button onClick={async () => {
                if (img) {
                    img2MeshSocket.send(await img.arrayBuffer())
                }
            }}>Generate</button>
        </div>
    )
}