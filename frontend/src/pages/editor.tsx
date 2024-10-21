import React, { useState } from 'react';
import { navStateType } from '../types';
import { useCustomState } from '../utils';
import DefaultNav from '../components/nav';
import navData from '../assets/data/nav.json';
import Txt2Mesh from '../components/txt2Mesh';
import Img2Mesh from '../components/img2Mesh';
import XCanvas from '../components/editor/canvas';
import { NavItem } from '../components/nav/utils';
import { Controls } from '../components/editor/controls';

type EditorProps = JSX.IntrinsicElements["div"] & {
}

export default function Editor(props: EditorProps) {
    const [meshes, setMeshes] = useState<string[]>(["./vase.obj"]);
    const [activeNav, setActiveNav] = useCustomState<navStateType>(navData.playground[0] as navStateType);
    // all control editing needs to be handled here and it will not know about the changes in the canvas, but that is fine it does not need to. 
    
    return (
        <div id="canvas-container" className='height-100'>
            <XCanvas meshes={meshes}><></></XCanvas>
            <DefaultNav data={navData.home}>
                <div id='nav-playground-content'>
                {navData.playground.map(({id, icon, ...nav}) => 
                    <NavItem 
                        key={id}
                        icon={icon}
                        state={{id: "playground", ...nav}}
                        style={{width: 150, padding: "10px 20px"}}
                        onClick={() => setActiveNav({id: id, ...nav})}
                    >
                        {nav.title}
                    </NavItem>
                )}
                </div>
            </DefaultNav>
            <Controls title={activeNav?.title || ""}>
                {activeNav?.id === 'txt2Mesh' ? <Txt2Mesh onGenerated={(response) => setMeshes([response])}/> : <></>}
                {activeNav?.id === 'img2Mesh' ? <Img2Mesh onGenerated={(response) => setMeshes([response])}/> : <></>}
                <div>
                    <h3>Generated</h3>
                    {/* add previewing of generated mesh here */}
                </div>
            </Controls>
        </div>
    )
}