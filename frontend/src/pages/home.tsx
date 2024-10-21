import { useEffect, useState } from "react";
import { userType } from "../types";
import { getUser } from "../api/user";
import DefaultNav from "../components/nav";
import Project from "../components/project";
import { useParams } from "react-router-dom";
import Projects from "../components/projects";
import navData from '../assets/data/nav.json';
import { NavCrumbs } from "../components/nav/utils";

import "../assets/css/home.css";     
import "../assets/css/project.css"; 

type HomeProps = JSX.IntrinsicElements["div"] & {
    projects?: boolean
}

export default function Home({projects, ...props}: HomeProps) {
    const params = useParams()
    const [userData, setUserData] = useState<userType>()

    const init = async () => {
        if (params.uid) {
            setUserData(await getUser(params.uid))
        }
    }

    useEffect(() => {init()}, [])

    return (
        <>
            <DefaultNav data={navData.home}/>

            <div id="home-content">
                <NavCrumbs />
                <section>{/* actions */}</section>

                {projects && <Projects projects={userData?.projects}/>}
                {params.projectId && <Project id={params.projectId}/>}
            </div>
        </>
    )
}