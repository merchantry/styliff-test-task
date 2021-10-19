import { useFrame } from '@react-three/fiber';
import React, { useContext, useMemo, useRef, useState } from 'react';
import { Vector3, Vector3Tuple } from 'three';
import { randomNumber } from '../helpers/helper';
import { VelocityContext } from './Balls';


export interface BallProps { 
    mass: number, 
    initialPosition?: Vector3Tuple, 
    index: number, 
    onUpdateCallback: CallableFunction 
}
const colors = [
    '#dd3333',
    '#33dd33',
    '#3333dd',
];


const Ball = ({ mass, initialPosition = [null, null, null], index, onUpdateCallback }: BallProps) => {
    let ref = useRef<THREE.Mesh>();

    let velocity: Array<Vector3Tuple> = useContext(VelocityContext);
    let position = useMemo(() => new Vector3(...initialPosition.map(axis => axis ?? randomNumber(-5, 5))), []);

    const [colorIndex, setColorIndex] = useState<number>(Math.floor(randomNumber(0, colors.length)));
    const changeColor = () => {
        if (colorIndex === colors.length - 1) {
            setColorIndex(0);
        } else {
            setColorIndex(colorIndex => colorIndex + 1);
        }
    }

    useFrame((state, delta) => {
        ref.current.position.x += delta * velocity[index][0];
        ref.current.position.y += delta * velocity[index][1];
        ref.current.position.z += delta * velocity[index][2];
        onUpdateCallback(ref.current.position.toArray(), index);
    });

    return (
        <mesh ref={ref} position={position} onClick={changeColor}>
            <sphereBufferGeometry attach="geometry" args={[mass, 50]} />
            <meshStandardMaterial color={colors[colorIndex]}/>
        </mesh>
    );
};

export default Ball;