import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Things from './components/Things';

export function App() {



    return (
        <Canvas camera={{ position: [150, 150, 150] }}>
            <Stats />
            <pointLight position={[0, 0, 100]} />
            <pointLight position={[0, 100, 0]} />
            <pointLight position={[0, -100, 0]} />
            <Things />
            <OrbitControls enableZoom={true}/>
        </Canvas>
    );
}