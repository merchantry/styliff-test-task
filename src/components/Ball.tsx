import { useFrame } from '@react-three/fiber';
import React, { useContext, useRef } from 'react';
import { Vector3, Vector3Tuple } from 'three';
import Line from './Line';
import { VelocityContext } from './Things';

const randomInt = (min: number, max: number): number => {
    let diff = max - min;
    return Math.floor(Math.random() * diff) + min;
};

export interface BallProps { 
    radius: number, 
    initialPosition?: Vector3Tuple, 
    index: number, 
    onUpdateCallback: CallableFunction 
}


const Ball = ({ radius, initialPosition = [null, null, null], index, onUpdateCallback }: BallProps) => {
    let ref = useRef<THREE.Mesh>();

    let velocity = useContext(VelocityContext);


    let position = new Vector3(...initialPosition.map(axis => axis ?? randomInt(-5, 5)));

    useFrame((state, delta) => {
        ref.current.position.x += delta * velocity[index][0];
        ref.current.position.y += delta * velocity[index][1];
        ref.current.position.z += delta * velocity[index][2];
        onUpdateCallback(Object.values(ref.current.position), index);
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereBufferGeometry attach="geometry" args={[radius, 50]} />
            <meshStandardMaterial color="#ff0022" />
            <axesHelper args={[10]} />
            <Line start={[0, 0, 0]} end={velocity[index].map((vector) => vector * 5) as Vector3Tuple} />
        </mesh>
    );
};

export default Ball;