import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import Balls, { BallsProps } from './components/Balls';

export function App() {
    const data: BallsProps = {
        numOfBalls: 20, // Number of balls to spawn
        numOfCells: 10, // Number of cells in the box. More cells == Worse performance
        cellSize: 20, // Size of each cell
        bounceCoolOff: 1000, // Same balls cannot bounce twice in the same period. They need to wait up to bounceCoolOff ms
        maxSpeed: 100, // Maximum speed that can be assigned to each ball per axis
        showCells: false // If you want to visualize containing cells of balls. Hinders performance a lot if set to true. Best used with low ball count to visualize (eg. 15)
    }

    return (
        <Canvas camera={{ position: [150, 150, 150] }}>
            <Stats />
            <pointLight position={[0, 0, 100]} />
            <pointLight position={[0, 100, 0]} />
            <pointLight position={[0, -100, 0]} />
            <Balls {...data} />
            <OrbitControls enableZoom={true} />
        </Canvas>
    );
}