import { useFrame } from '@react-three/fiber';
import React, { useContext, useRef } from 'react';
import { BackSide, FrontSide, Vector3Tuple } from 'three';
import { isArrayInArray } from '../helpers/helper';
import { HighlightedBoxesContext } from './Things';


export interface BoxProps { 
    size: number,
    position: Vector3Tuple,
    boxIndex?: Vector3Tuple,
    children?: any
}


const Box = ({ size, position, boxIndex, children }: BoxProps) => {
    let ref = useRef<THREE.Mesh>();

    const highlightedBoxes = useContext(HighlightedBoxesContext);

    useFrame((state, delta) => {
        if (boxIndex && highlightedBoxes && isArrayInArray(boxIndex, highlightedBoxes)) {
            if (!ref.current.visible) ref.current.visible = true;
        } 
        else {
            ref.current.visible = !boxIndex;
        }
    });



    return (
        <mesh ref={ref} position={position}>
            <boxBufferGeometry attach="geometry" args={[size, size, size]}/>
            <meshStandardMaterial color={children ? '#c99c3a' : '#000000'} side={children ? BackSide : FrontSide} visible={!boxIndex}/** */ wireframe={!children}/>
            {children}
        </mesh>
    );
};

export default Box;