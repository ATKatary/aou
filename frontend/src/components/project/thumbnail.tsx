import { navStateType, projectType } from "../../types";
  
import { Link, LinkProps, useParams } from "react-router-dom";
import MBThumbnail from "../mb/thumbnail";

type ProjectThumbnailProps = LinkProps & {
    onAdd?: () => void
    mbClassName?: string
    state?: navStateType
    project?: projectType
    mbStyle?: React.CSSProperties
}

export function ProjectThumbnail({project, className, mbStyle, mbClassName, onAdd, ...props}: ProjectThumbnailProps) {
    const params = useParams()
    const uid = params.uid
    
    return (
        <Link className={`project-thumbnail ${className}`} {...props}>
            <div className="project-thumbnail-mbs">
                {Array(4).fill(0).map((_, i) => {
                    return (
                        <MBThumbnail 
                            key={i}
                            to={`#`}
                            disabled
                            mb={project?.mbs[i]} 
                            className={`${mbClassName}`}
                            style={{...mbStyle, width: "50%", height: "calc(50% - 25px)"}}
                        />
                    )
                })}

                {onAdd && <button onClick={onAdd}>+</button>}
            </div>

            {props.children}
        </Link>
    )
}