import { createRef, useState } from "react";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface AOUImgProps extends React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>> {
    onUpload?: (file: File) => void 
}

export function AOUImg({className, style, onUpload, ...props}: AOUImgProps) {
    const [img, setImg] = useState<string>();
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
            onClick={() => inputRef.current?.click()}
            className={`aou-img-previewer flex align-center justify-center column pointer ${className || ""}`} 
        >
            <input type="file" accept="image/*" onChange={onChange} hidden ref={inputRef}/>
            {img? 
                <img src={img} alt="uploaded"/> 
                : 
                <>
                    <FontAwesomeIcon icon={"fa-upload" as IconProp}/>
                    <p>Upload image</p>
                </>
            }
        </div>
    )
}