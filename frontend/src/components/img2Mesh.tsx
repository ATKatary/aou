import { useState } from "react";
import { AOUImg } from "./aouImg";
import { img2Mesh } from "../api/aou";

interface ImgTo3DProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    onGenerated?: (response: string) => void
}

export default function Img2Mesh({onGenerated, className, ...props}: ImgTo3DProps) {
    const [img, setImg] = useState<File>()

    // TODO: add a socket connection that continues to call onGenerated as it recieves obj files

    return (
        <div className={`flex column align-center ${className}`} {...props}>
            <AOUImg onUpload={(file) => setImg(file)}/>
            <button onClick={async () => {
                if (img) {
                    const response = URL.createObjectURL(await (await img2Mesh(img)).blob())
                    onGenerated && onGenerated(response)
                }
            }}>Generate</button>
        </div>
    )
}