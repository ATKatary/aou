import { Mesh, Object3D } from 'three';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { MeshProps, useThree } from '@react-three/fiber'
import { useDrag } from 'react-use-gesture'
import { TransformControls } from '@react-three/drei';

const { List } = require('immutable');

interface AOUMeshProps extends React.PropsWithChildren<MeshProps> {
    color?: string
    orbitRef: MutableRefObject<any>
}

export default function AOUMesh({orbitRef, position, ...props}: AOUMeshProps) {
    const transformRef = useRef<any>()
    const meshRef = useRef<Mesh>(null!)

    const [active, setActive] = useState(false);
    // useFrame((state, delta) => (meshRef.current.rotation.y += delta))

    // only runs once this is not a subscriber!
    useEffect(() => {
        if (transformRef.current) {
            const callback = (event: { value: boolean }) => {
                orbitRef.current.enabled = !event.value
            }
            
            transformRef.current.addEventListener("dragging-changed", callback)
            return () => transformRef.current.removeEventListener("dragging-changed", callback)
        }
    })
      
    return (
        <TransformControls 
            showX={active}
            showY={active}
            showZ={active}
            ref={transformRef}
            position={position}
        >
            <mesh
                {...props}
                castShadow 
                ref={meshRef}
                onClick={() => setActive(!active)}
            >
                <boxGeometry />
                <meshStandardMaterial attach="material" color={props.color ||"#ffffff"}/>
                {props.children}
            </mesh>
        </TransformControls>
    )
}