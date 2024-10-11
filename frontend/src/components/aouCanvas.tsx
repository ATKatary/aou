import AOUMesh from "./aouMesh";
import { ThemeContext } from "..";
import { useContext, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls, Plane, SoftShadows } from "@react-three/drei";

interface AOUCanvasProps extends React.PropsWithChildren<any> {
    meshes: string[] // placeholder for now to test state management, actual will be a meshDataType[]
}
export default function AOUCanvas({meshes, ...props}: AOUCanvasProps) {
    const orbitRef = useRef<any>();
    const theme = useContext(ThemeContext)?.theme

    // all mesh editing happened here and parent will not know! when the mesh updates, we need to update our local mesh as well 
    // resolving conflicts as necessary
    
    return (
        <Canvas 
            shadows 
            className='canvas height-100' 
            camera={{position: [-3, 2.5, 4], fov: 75}}
        >
            <SoftShadows/>
            <ContactShadows blur={3}/>
            <ambientLight intensity={1}/>
            <OrbitControls maxDistance={9} ref={orbitRef}/>
            <directionalLight castShadow intensity={1} position={[0, 2, 2]} />
            <gridHelper args={[10, 10, "0x444", "#fff"]} position={[0, -0.05, 0]}/>
            <color attach="background" args={[theme?.bg['secondary'] || '#f0f0f0']} />
            <fog attach={"fog"} color={theme?.bg['secondary'] || '#f0f0f0'} near={0} far={20}/>
            
            <group>
                {meshes.map((mesh, i) => {
                    return (
                        <AOUMesh objUrl={mesh} orbitRef={orbitRef} key={mesh} position={[i*1.5, 0.5, 0]}/>
                    )
                })}
                <Plane receiveShadow position={[0, -0.1, 0]} args={[1000, 1000]} rotation={[-Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial attach="material" color={theme?.bg['primary'] || '#ffffff'}/>
                </Plane>
            </group>
        </Canvas>
    )
}