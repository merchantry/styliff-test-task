import React, { useRef } from 'react';
import { Vector3Tuple } from 'three';


export interface BoxProps { 
    size: number,
    position: Vector3Tuple,
    children?: any
}


const Box = ({ size, position, children }: BoxProps) => {
    let ref = useRef<THREE.Mesh>();



    return (
        <mesh ref={ref} position={position}>
            <boxBufferGeometry attach="geometry" args={[size, size, size]} />
            <meshBasicMaterial color="#00ff00" wireframe={true}/>
            {children}
        </mesh>
    );
};

export default Box;