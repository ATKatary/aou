import { Img } from "./img";
import { useState } from "react";
// import { img2Mesh } from "../api/user";

type Img2MeshProps = JSX.IntrinsicElements["div"] & {
    onGenerated?: (response: string) => void
}

export default function Img2Mesh({onGenerated, className, ...props}: Img2MeshProps) {
    const [img, setImg] = useState<File>()

    return (
        <div className={`flex column align-center ${className}`} {...props} id="img2mesh-controls">
            <Img onUpload={(file) => setImg(file)}/>
            <button onClick={async () => {
                if (img) {
                    // const response = URL.createObjectURL(await (await img2Mesh(img)).blob())
                    // onGenerated && onGenerated(response)
                }
            }}>Generate</button>
        </div>
    )
}