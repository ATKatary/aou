import MBThumbnail from "../mb/thumbnail";
import { useEffect, useState } from "react";
import { getProject } from "../../api/project";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { mbType, navStateType, projectType } from "../../types";

import "../../assets/css/project.css"; 
import { createMoodboard } from "../../api/moodboard";

type ProjectProps = JSX.IntrinsicElements["section"] & {
}

export default function Project({id, ...props}: ProjectProps) {
    const params = useParams()
    const navigator = useNavigate()
    const [project, setProject] = useState<projectType>()
    
    const uid = params.uid
    
    const init = async () => {
        if (id) {
            setProject(await getProject(id))
        }
    }
    
    useEffect(() => {init()}, [])

    const state = useLocation().state as navStateType
    
    return (
        <section className="flex align-center flex-wrap">
            {project?.mbs?.map((mb, i) => {
                return (
                    <MBThumbnail 
                        key={mb.id}
                        mb={mb as mbType} 
                        to={`/${uid}/mb/${mb.id}`} 
                        className="mb-filled-secondary"
                        state={{id: mb.id, title: mb.title, prevState: state}}
                    >
                        <h3 style={{fontWeight: 550, margin: "0 0 10px 10px"}}>{mb.title}</h3>
                    </MBThumbnail>
                )
            })}

            <MBThumbnail 
                onAdd={async () => {
                    if (!id) return
                    const mb = await createMoodboard(id)
                    const href = `/${uid}/mb/${mb.id}`

                    navigator(href, {state: {id: mb.id, title: mb.title, prevState: state, href: href}})
                }}

                to={""}
                disabled
                className="mb-thumbnail dashed"
            />
        </section>
    )
}