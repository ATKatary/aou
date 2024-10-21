import { createRef, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { img2Base64 } from "../utils";

type ImgProps = JSX.IntrinsicElements["div"] & {
    src?: string
    disabled?: boolean
    placeholder?: string
    imgClassName?: string
    imgStyle?: React.CSSProperties
    onUpload?: (file: File) => void
}

export function Img({src = "", imgClassName, imgStyle, disabled, placeholder, className, style, onUpload, ...props}: ImgProps) {
    const [img, setImg] = useState<string>(src);
    const [name, setName] = useState<string>();

    const inputRef = createRef<HTMLInputElement>();

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files![0]
        if (!file || file?.name === name) return

        setName(file?.name);
        setImg(URL.createObjectURL(file));

        onUpload && onUpload(file)
    }
    
    return (
        <div 
            {...props}
            style={{...style}} 
            onClick={() => !disabled && inputRef.current?.click()}
            className={`img-previewer flex align-center justify-center column pointer ${className || ""}`} 
        >
            {!disabled && <input type="file" accept="image/*" onChange={onChange} hidden ref={inputRef}/>}
            {img? 
                <img src={img} alt="uploaded" style={{...imgStyle}} className={`img ${imgClassName}`}/> 
                : 
                <>
                    {!disabled && <FontAwesomeIcon icon={"fa-upload" as IconProp}/>}
                    <p className="placeholder">{placeholder ||"Upload image"}</p>
                </>
            }
        </div>
    )
}