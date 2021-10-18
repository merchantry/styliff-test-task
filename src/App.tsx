import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { Vector3 } from 'three';
import Things from './components/Things';

export function App() {



    return (
        <Canvas camera={{ position: [2, 0, 20] }}>
            <Stats />
            <pointLight position={[5, 7, 6]} />
            <Things />
            <OrbitControls enableZoom={true}/>
        </Canvas>
    );
}