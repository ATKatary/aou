import React from 'react';
import { dataType } from '../types';
import { useCustomState } from '../utils';
import ImgTo3D from '../components/imgTo3D';
import navData from '../assets/data/nav.json';
import AOUCanvas from '../components/aouCanvas';
import Nav, { NavItem } from '../components/nav';
import { AOUControls } from '../components/aouControls';

interface AOUEditorProps extends React.PropsWithChildren<any> {
}

export default function AOUEditor(props: AOUEditorProps) {
    const meshes = [0]
    const [activeNav, setActiveNav] = useCustomState<dataType>(navData.sections[0] as dataType);
    // all control editing needs to be handled here and it will not know about the changes in the canvas, but that is fine it does not need to. 
    
    return (
        <div id="canvas-container" className='height-100'>
            <AOUCanvas meshes={meshes}/>
            <div id="view-controls"></div>
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
                {activeNav?.id === 'imageTo3D' ? <ImgTo3D /> : <></>}
                <div>
                    <h3>Generated</h3>
                    {/* add previewing of generated mesh here */}
                </div>
            </AOUControls>
        </div>
    )
}