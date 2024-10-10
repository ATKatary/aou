import { useState } from "react";
import { AOUImg } from "./aouImg";

interface ImgTo3DProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    onGenerated?: () => void
}

export default function ImgTo3D({onGenerated, className, ...props}: ImgTo3DProps) {
    const [img, setImg] = useState<File>()

    return (
        <div className={`flex column align-center ${className}`} {...props}>
            <AOUImg onUpload={(file) => setImg(file)}/>
            <button onClick={() => {
                // TODO: use generate api to generate mesh from image
                // figure out either how to get glb or gltf 
                onGenerated && onGenerated()
            }}>Generate</button>
        </div>
    )
}