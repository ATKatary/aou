import { useState } from "react";
// import { txt2Mesh } from "../api/user";

type Txt2MeshProps = JSX.IntrinsicElements["div"] & {
    onGenerated?: (response: string) => void
}

export default function Txt2Mesh({onGenerated, className, ...props}: Txt2MeshProps) {
    const [prompt, setPrompt] = useState<string>()

    return (
        <div className={`flex column align-center ${className}`} {...props} id="txt2mesh-controls">
            <textarea onChange={(event) => setPrompt(event.target.value)} placeholder={"write your prompt here..."}>{prompt}</textarea>
            <button onClick={async () => {
                if (prompt) {
                    // const response = URL.createObjectURL(await (await txt2Mesh(prompt)).blob())
                    // onGenerated && onGenerated(response)
                }
            }}>Generate</button>
        </div>
    )
}