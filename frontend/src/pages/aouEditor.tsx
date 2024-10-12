import React, { useState } from 'react';
import { dataType } from '../types';
import { useCustomState } from '../utils';
import navData from '../assets/data/nav.json';
import Txt2Mesh from '../components/txt2Mesh';
import Img2Mesh from '../components/img2Mesh';
import AOUCanvas from '../components/aouCanvas';
import Nav, { NavItem } from '../components/nav';
import { AOUControls } from '../components/aouControls';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

interface AOUEditorProps extends React.PropsWithChildren<any> {
}

export default function AOUEditor(props: AOUEditorProps) {
    const [meshes, setMeshes] = useState<string[]>([]);
    const [activeNav, setActiveNav] = useCustomState<dataType>(navData.sections[0] as dataType);
    // all control editing needs to be handled here and it will not know about the changes in the canvas, but that is fine it does not need to. 
    
    return (
        <div id="canvas-container" className='height-100'>
            <AOUCanvas meshes={meshes}/>
            <div id="view-controls" className='flex'>
                <button style={{borderRadius: "40px 0 0 40px", backgroundColor: "var(--primary)"}}>
                    <FontAwesomeIcon icon={"fa-solid fa-check" as IconProp}/> Generate
                </button>
                <button style={{borderRadius: "0 40px 40px 0", backgroundColor: "#fff"}}>
                    Edit
                </button>
            </div>
            <Nav>
                {navData.sections.map((nav) => 
                    <NavItem 
                        href={`/#`} 
                        key={nav.id}
                        icon={nav.icon}
                        style={{width: 150}}
                        onClick={() => setActiveNav(nav)} 
                    >
                        {nav.title}
                    </NavItem>
                )}
            </Nav>
            <AOUControls title={activeNav?.title || ""}>
                {activeNav?.id === 'txt2Mesh' ? <Txt2Mesh onGenerated={(response) => setMeshes([response])}/> : <></>}
                {activeNav?.id === 'img2Mesh' ? <Img2Mesh onGenerated={(response) => setMeshes([response])}/> : <></>}
                <div>
                    <h3>Generated</h3>
                    {/* add previewing of generated mesh here */}
                </div>
            </AOUControls>
        </div>
    )
}