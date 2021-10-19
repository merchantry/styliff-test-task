import { useFrame } from '@react-three/fiber';
import React, { createContext, useCallback, useMemo, useState } from 'react';
import { Vector3, Vector3Tuple } from 'three';
import { calculateBallBounceVector, getArrayWithRadnomVectors, getBallContainingCells, randomNumber } from '../helpers/helper';
import Ball, { BallProps } from './Ball';
import Box, { BoxProps } from './Box';
import Line from './Line';




export interface BallsProps {
    numOfBalls: number,
    numOfCells: number,
    cellSize: number,
    bounceCoolOff: number,
    maxSpeed: number,
    showCells?: boolean
}



export const VelocityContext = createContext<Array<Vector3Tuple>>(null);
export const HighlightedBoxesContext = createContext<Array<Vector3Tuple>>(null);



const Balls = ({ numOfBalls, numOfCells, cellSize, bounceCoolOff, maxSpeed, showCells = false }: BallsProps) => {

    const maxLimit = (numOfCells * cellSize) / 2;
    const minLimit = -maxLimit;

    let [velocities, setVelocities] = useState(getArrayWithRadnomVectors(numOfBalls, -maxSpeed, maxSpeed));
    let [highlightedBoxes, setHighlightedBoxes] = useState<Array<Vector3Tuple>>(null);


    const onUpdateCallback = useCallback((position: Vector3Tuple, index: number) => {
        updatedPositions[index] = position;
    }, []);


    let updatedPositions: Array<Vector3Tuple> = useMemo(() => getArrayWithRadnomVectors(numOfBalls, minLimit + 5, maxLimit - 5), []);




    const boxProps: BoxProps[] = useMemo(() => {
        let boxProps: BoxProps[] = [];
        for (let i = 0; i < numOfCells; i++) {
            for (let j = 0; j < numOfCells; j++) {
                for (let k = 0; k < numOfCells; k++) {
                    boxProps.push({
                        size: cellSize,
                        position: [
                            (cellSize * i) - (((numOfCells * cellSize) / 2) - cellSize / 2),
                            (cellSize * j) - (((numOfCells * cellSize) / 2) - cellSize / 2),
                            (cellSize * k) - (((numOfCells * cellSize) / 2) - cellSize / 2)
                        ],
                        boxIndex: [i, j, k]
                    });

                }

            }
        }

        return boxProps;
    }, [highlightedBoxes]);

    const cells = useMemo(() => {
        return boxProps.map((props, index) => {
            return (
                <Box {...props} key={index}>
                </Box>
            );
        });
    }, []);

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
        let busyCells: Array<Vector3Tuple> = [];
        let ballContainingCells: Array<Vector3Tuple>;

        const ballsInCellsHashTable: {
            [key: string]: Array<number>
            //  "[1, 2, 4]": [20, 1, 30, 41...]
            //  cell index: ball indices
        } = {};


        ballProps.forEach((props, index) => {

            updatedPositions[index].forEach((axis, axisIndex) => {
                if (axis - ballProps[index].mass <= minLimit) { // At bottom of x, y or z side of box
                    newVelocities[index][axisIndex] = Math.abs(newVelocities[index][axisIndex]);
                }

                if (axis + ballProps[index].mass >= maxLimit) { // At top of x, y or z side of box
                    newVelocities[index][axisIndex] = -Math.abs(newVelocities[index][axisIndex]);
                }
            });
            ballContainingCells = getBallContainingCells(updatedPositions[index], props.mass, cellSize, numOfCells);
            busyCells = busyCells.concat(ballContainingCells);

            ballContainingCells.forEach((cell, cellIndex) => {
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
                                newVelocities[props.index] = calculateBallBounceVector(vector1Copy, bridge, props.mass).toArray();
                                newVelocities[ballIndex] = calculateBallBounceVector(vector2Copy, bridge, ballProps[ballIndex].mass).toArray();


                            }
                        }

                    });


                    ballsInCellsHashTable[hashTableKey].push(index as number);

                }
            });

        });
        setVelocities(newVelocities);
        setHighlightedBoxes(busyCells);


    });

    const centerLines = useMemo(() => {
        return (
            <>
                <Line start={[minLimit, 0, 0]} end={[maxLimit, 0, 0]} />
                <Line start={[0, minLimit, 0]} end={[0, maxLimit, 0]} />
                <Line start={[0, 0, minLimit]} end={[0, 0, maxLimit]} />
            </>
        );
    }, []);



    return (
        <VelocityContext.Provider value={velocities}>
            <HighlightedBoxesContext.Provider value={highlightedBoxes}>
                <Box size={numOfCells * cellSize} position={[0, 0, 0]}>
                    {showCells && cells}
                    {centerLines}
                    {balls}
                </Box>
            </HighlightedBoxesContext.Provider>
        </VelocityContext.Provider>
    );
};

export default Balls;