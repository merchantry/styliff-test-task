import { Plane, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { createContext, useCallback, useDebugValue, useEffect, useMemo, useRef, useState } from 'react';
import { Vector3, Vector3Tuple } from 'three';
import Ball, { BallProps } from './Ball';
import Box, { BoxProps } from './Box';


const randomNumber = (min: number, max: number): number => {
    let diff = max - min;
    return Math.random() * diff + min;
};

// const distance = (vector1: Vector3, vector2: Vector3): number => {
//     return Math.sqrt(
//         Math.pow(vector1.x - vector2.x, 2)
//         + Math.pow(vector1.y - vector2.y, 2)
//         + Math.pow(vector1.z - vector2.z, 2)
//     );
// };


const calculateBounce = (vector: Vector3, normal: Vector3): Vector3 => {
    let newVector = vector.clone();
    let newNormal = normal.clone();

    let friction: number = 1;
    let elasticity: number = 1;


    let parallel = newNormal.multiplyScalar(-newVector.dot(newNormal) / newNormal.dot(newNormal));
    let perpendicular = newVector.sub(parallel);
    let result = perpendicular.multiplyScalar(friction * 0.25).sub(parallel.multiplyScalar(elasticity * 0.25))


    return result;

};

const numOfBalls = 2;

let velocities: Array<Vector3Tuple> = [
    [3, 0, 0],
    [-1, 0, 0],
];
// for (let i = 0; i < numOfBalls; i++) {
//     velocities.push(
//         [
//             randomNumber(-5, 5),
//             randomNumber(-5, 5),
//             randomNumber(-5, 5),
//         ]
//     );
// }


let positions: Array<Vector3Tuple> = [
    [-4, 1.25, 0],
    [4, -2.5, 0],
];
// for (let i = 0; i < numOfBalls; i++) {
//     positions.push(
//         [
//             randomNumber(-5, 5),
//             randomNumber(-5, 5),
//             randomNumber(-5, 5),
//         ]
//     );
// }

export const VelocityContext = createContext<Array<Vector3Tuple>>(velocities);
const boxProps: BoxProps[] = [];

const numOfBoxes = 10;
const boxSize = 15;

for (let i = 0; i < numOfBoxes; i++) {
    for (let j = 0; j < numOfBoxes; j++) {
        for (let k = 0; k < numOfBoxes; k++) {
            boxProps.push({
                size: boxSize,
                position: [
                    (boxSize * i) - (((numOfBoxes * boxSize) / 2) - boxSize / 2), 
                    (boxSize * j) - (((numOfBoxes * boxSize) / 2) - boxSize / 2), 
                    (boxSize * k) - (((numOfBoxes * boxSize) / 2) - boxSize / 2)
                ]
            });
            
        }
        
    }
}

const getBoxIndex = (length: number): number => {
    return Math.floor((length + ((numOfBoxes * boxSize) / 2)) / boxSize);
};



const Things = () => {
    let radii = [
        2,
        2
    ];

    let [velocitiesNew, setVelocitiesNew] = useState(velocities);

    let updatedPositions: Array<Vector3Tuple> = useMemo(() => {
        return positions;
    }, []);


    const onUpdateCallback = useCallback((position: Vector3Tuple, index: number) => {
        updatedPositions[index] = position;
    }, []);
    const boxes = useMemo(() => {
        return boxProps.map((props, index) => {
            return (
                <Box {...props} key={index}>
                </Box>
            );
        });
    }, []);





    useFrame(() => {

        // console.log(JSON.stringify(updatedPositions));

        // let vector1 = new Vector3().fromArray(updatedPositions[0]);
        // let vector2 = new Vector3().fromArray(updatedPositions[1]);
        let iIndex = getBoxIndex(updatedPositions[0][0]);
        let jIndex = getBoxIndex(updatedPositions[0][1]);
        let kIndex = getBoxIndex(updatedPositions[0][2]);

        console.log(`iIndex ${iIndex}, jIndex ${jIndex}, kIndex ${kIndex}`);


        // if (vector1.distanceTo(vector2) <= radii[0] + radii[1]) {



        //     const bridge = vector1.clone();
        //     const vector1Copy = vector1.clone();
        //     const vector2Copy = vector2.clone();
        //     bridge.sub(vector2Copy);
        //     setVelocitiesNew([calculateBounce(vector1Copy, bridge).toArray(), calculateBounce(vector2Copy, bridge).toArray()]);




        // }
    });

    const props: BallProps[] = [
        {
            radius: 2,
            index: 0,
            initialPosition: [-4, 1.25, 0],
            onUpdateCallback: onUpdateCallback
        }
    ];



    return (
        <VelocityContext.Provider value={velocitiesNew}>
            <Box size={numOfBoxes * boxSize} position={[0, 0, 0]}>
                {boxes}
                {/* <Plane rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} scale={[100, 100, 1]} /> */}
                <Ball {...props[0]} />
                {/* <Ball radius={radii[1]} onUpdateCallback={onUpdateCallback} index={1} initialPosition={positions[1]} /> */}
            </Box>
        </VelocityContext.Provider>
    );
};

export default Things;