import { useFrame } from '@react-three/fiber';
import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Vector3, Vector3Tuple } from 'three';
import { calculateBounce, getArrayWithRadnomVectors, getContainingBoxes, randomNumber } from '../helpers/helper';
import Ball, { BallProps } from './Ball';
import Box, { BoxProps } from './Box';



const numOfBalls = 100;
const numOfBoxes = 10;
const boxSize = 15;
const bounceCoolOff = 3000;
const maxLimit = (numOfBoxes * boxSize) / 2;
const minLimit = -maxLimit;



export const VelocityContext = createContext<Array<Vector3Tuple>>(null);
export const HighlightedBoxesContext = createContext<Array<Vector3Tuple>>(null);



const Things = () => {

    let [velocities, setVelocities] = useState(getArrayWithRadnomVectors(numOfBalls, -50, 50));
    let [highlightedBoxes, setHighlightedBoxes] = useState<Array<Vector3Tuple>>(null);


    const onUpdateCallback = useCallback((position: Vector3Tuple, index: number) => {
        updatedPositions[index] = position;
    }, []);


    let updatedPositions: Array<Vector3Tuple> = useMemo(() => getArrayWithRadnomVectors(numOfBalls, minLimit + 5, maxLimit - 5), []);


    

    // const boxProps: BoxProps[] = useMemo(() => {
    //     let boxProps: BoxProps[] = [];
    //     for (let i = 0; i < numOfBoxes; i++) {
    //         for (let j = 0; j < numOfBoxes; j++) {
    //             for (let k = 0; k < numOfBoxes; k++) {
    //                 boxProps.push({
    //                     size: boxSize,
    //                     position: [
    //                         (boxSize * i) - (((numOfBoxes * boxSize) / 2) - boxSize / 2),
    //                         (boxSize * j) - (((numOfBoxes * boxSize) / 2) - boxSize / 2),
    //                         (boxSize * k) - (((numOfBoxes * boxSize) / 2) - boxSize / 2)
    //                     ],
    //                     boxIndex: [i, j, k]
    //                 });

    //             }

    //         }
    //     }

    //     return boxProps;
    // }, [highlightedBoxes]);

    // const boxes = useMemo(() => {
    //     return boxProps.map((props, index) => {
    //         return (
    //             <Box {...props} key={index}>
    //             </Box>
    //         );
    //     });
    // }, []);

    const ballProps: BallProps[] = useMemo(() => {
        let ballProps: BallProps[] = [];
        for (let i = 0; i < numOfBalls; i++) {
            ballProps.push(
                {
                    mass: randomNumber(1, 5),
                    index: i,
                    initialPosition: updatedPositions[i],
                    onUpdateCallback: onUpdateCallback
                }
            );
        }
        return ballProps;
    }, []);

    const balls = useMemo(() => {
        return ballProps.map((ballProp) => {
            return (<Ball {...ballProp} key={ballProp.index} />);
        })
    }, []);

    
    const [lastBounceUpdate, setLastBounceUpdate] = useState(Date.now());
    const [recordedBounces, setRecorderBounces] = useState<{ [key: string]: boolean }>({});





    useFrame(() => {

        if (lastBounceUpdate + bounceCoolOff <= Date.now()) {
            setRecorderBounces({});
            setLastBounceUpdate(Date.now());
        }


        let newVelocities = velocities;
        let contBoxes: Array<Vector3Tuple> = [];
        let ballContainingBoxes;
        const ballsInCellsHashTable: {
            [key: string]: Array<number>
        } = {};


        ballProps.forEach((props, index) => {

            updatedPositions[index].forEach((axis, axisIndex) => {
                if (axis - ballProps[index].mass <= minLimit) {
                    newVelocities[index][axisIndex] = Math.abs(newVelocities[index][axisIndex]);
                }

                if (axis + ballProps[index].mass >= maxLimit) {
                    newVelocities[index][axisIndex] = -Math.abs(newVelocities[index][axisIndex]);
                }
            });
            ballContainingBoxes = getContainingBoxes(updatedPositions[index], props.mass, boxSize, numOfBoxes);
            contBoxes = contBoxes.concat(ballContainingBoxes);

            ballContainingBoxes.forEach((cell, cellIndex) => {
                let hashTableKey = JSON.stringify(cell);
                if (!ballsInCellsHashTable.hasOwnProperty(hashTableKey)) {

                    ballsInCellsHashTable[hashTableKey] = [index] as Array<number>;

                } else {


                    ballsInCellsHashTable[hashTableKey].forEach((ballIndex) => {
                        if (props.index !== ballIndex) {
                            let vector1 = new Vector3().fromArray(updatedPositions[props.index]);
                            let vector2 = new Vector3().fromArray(updatedPositions[ballIndex]);
                            let alreadyBounced = 
                                recordedBounces.hasOwnProperty(JSON.stringify([props.index, ballIndex])) 
                                && recordedBounces.hasOwnProperty(JSON.stringify([ballIndex, props.index]));

                            if (vector1.distanceTo(vector2) <= props.mass + ballProps[ballIndex].mass && !alreadyBounced) {
                                setRecorderBounces(recordedBounces => {
                                    recordedBounces[JSON.stringify([props.index, ballIndex])] = true;
                                    recordedBounces[JSON.stringify([ballIndex, props.index])] = true;
                                    return recordedBounces;
                                })

                                const bridge = vector1.clone();
                                const vector1Copy = vector1.clone();
                                const vector2Copy = vector2.clone();
                                bridge.sub(vector2Copy);
                                newVelocities[props.index] = calculateBounce(vector1Copy, bridge).toArray();
                                newVelocities[ballIndex] = calculateBounce(vector2Copy, bridge).toArray();


                            }
                        }

                    });


                    ballsInCellsHashTable[hashTableKey].push(index as number);

                }
            });

        });
        setVelocities(newVelocities);
        setHighlightedBoxes(contBoxes);


    });



    return (
        <VelocityContext.Provider value={velocities}>
            <HighlightedBoxesContext.Provider value={highlightedBoxes}>
                <Box size={numOfBoxes * boxSize} position={[0, 0, 0]}>
                    {/* {boxes} */}
                    {balls}
                </Box>
            </HighlightedBoxesContext.Provider>
        </VelocityContext.Provider>
    );
};

export default Things;