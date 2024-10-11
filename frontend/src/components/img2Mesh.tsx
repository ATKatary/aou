import { useState } from "react";
import { AOUImg } from "./aouImg";
import { img2Mesh } from "../api/aou";

interface ImgTo3DProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    onGenerated?: () => void
}

export default function Img2Mesh({onGenerated, className, ...props}: ImgTo3DProps) {
    const [img, setImg] = useState<File>()

    return (
        <div className={`flex column align-center ${className}`} {...props}>
            <AOUImg onUpload={(file) => setImg(file)}/>
            <button onClick={async () => {
                // TODO: use generate api to generate mesh from image
                // figure out either how to get glb or gltf 
                if (img) {
                    const response = await (await img2Mesh(img)).json()
                    console.log(response)
                    onGenerated && onGenerated()
                }
            }}>Generate</button>
        </div>
    )
}