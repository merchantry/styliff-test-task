import { useFrame } from '@react-three/fiber';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Vector3Tuple } from 'three';
import { FullBoxContext } from './Things';


export interface BoxProps { 
    size: number,
    position: Vector3Tuple,
    boxIndex?: Vector3Tuple,
    children?: any
}


const Box = ({ size, position, boxIndex, children }: BoxProps) => {
    let ref = useRef<THREE.Mesh>();

    const fullBoxContext = useContext(FullBoxContext);
    let isFull = 
    // false;
    (fullBoxContext && boxIndex) ? fullBoxContext.every((axis, i) => {
        return axis && axis === boxIndex[i];
    }) : false;




    return (
        <mesh ref={ref} position={position}>
            <boxBufferGeometry attach="geometry" args={[size, size, size]} />
            <meshBasicMaterial color="#00ff00" wireframe={true} visible={isFull}/>
            {children}
        </mesh>
    );
};

export default Box;