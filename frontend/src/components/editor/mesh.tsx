import { Mesh } from 'three';
import { TransformControls } from '@react-three/drei';
import { GroupProps, useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

type XMeshProps = GroupProps & {
    color?: string
    objUrl: string
    orbitRef: MutableRefObject<any>
}

export default function XMesh({objUrl, orbitRef, position, ...props}: XMeshProps) {
    const transformRef = useRef<any>()
    const meshRef = useRef<Mesh>(null!)
    const obj = useLoader(OBJLoader, objUrl)

    const [active, setActive] = useState(false);
    // useFrame((state, delta) => (meshRef.current.rotation.y += delta))

    // only runs once this is not a subscriber!
    useEffect(() => {
        if (transformRef.current) {
            const callback = (event: { value: boolean }) => {
                orbitRef.current.enabled = !event.value
            }
            
            transformRef.current?.addEventListener("dragging-changed", callback)
            return () => transformRef.current?.removeEventListener("dragging-changed", callback)
        }
    })
      
    return (
        <group name={`mesh-${objUrl}`}>
            <TransformControls 
                showX={active}
                showY={active}
                showZ={active}
                mode="rotate"
                ref={transformRef}
                position={position}
            >
                <primitive 
                    {...props}
                    castShadow 
                    object={obj}
                    ref={meshRef}          
                    onClick={() => setActive(!active)}
                >
                    <boxGeometry />
                    <meshStandardMaterial attach="material" color={props.color ||"#ffffff"}/>
                    {props.children}
                </primitive>
            </TransformControls>
        </group>
    )
}