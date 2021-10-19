import { Vector3, Vector3Tuple } from "three";

export const randomNumber = (min: number, max: number): number => {
    let diff = max - min;
    return Math.random() * diff + min;
};

/**
 * Calaculate the bounce vector from given vector, normal of collision object and mass of ball
 * @param vector ball position vector
 * @param normal collision object normal
 * @param mass ball mass
 * @returns Vector3
 */
export const calculateBallBounceVector = (vector: Vector3, normal: Vector3, mass: number): Vector3 => {
    let newVector = vector.clone();
    let newNormal = normal.clone();

    const friction: number = 4 / mass;          // Friction and elasticity constants can be 
    const elasticity: number = 0.7 / mass;      // further manipulated to refine bouncing physics of balls


    let parallel = newNormal.multiplyScalar(-newVector.dot(newNormal) / newNormal.dot(newNormal));
    let perpendicular = newVector.sub(parallel);
    let result = perpendicular.multiplyScalar(friction * 0.25).sub(parallel.multiplyScalar(elasticity * 0.25))


    return result;

};

/**
 * Get a 1-dimensional index of cell
 * @param length 1-dimensional position parameter
 * @param cellSize size of each cell
 * @param numOfCells total number of cells in one dimension
 * @returns number
 */
export const getCellIndex = (length: number, cellSize: number, numOfCells: number): number => {
    return Math.floor((length + ((numOfCells * cellSize) / 2)) / cellSize);
};

/**
 * Get 1-dimensional position from cell index and environment size
 * @param index 1-dimensional position parameter
 * @param cellSize size of each cell
 * @param numOfCells total number of cells in one dimension
 * @returns number
 */
 export const getCellPosition = (index: number, cellSize: number, numOfCells: number): number => {
    return (cellSize * index) - (((numOfCells * cellSize) / 2) - cellSize / 2);
};




/**
 * Array of cell indices which contain the object at the given position and with radius. Can return a max of 8 cells
 * @param position 3-dimensional position
 * @param radius Radius/Mass of object. Used to get neighbouring cells if the object touches their edges
 * @param cellSize size of each cell
 * @param numOfCells total number of cells in one dimension
 * @returns Array<Vector3Tuple>
 */
export const getBallContainingCells = (position: Vector3Tuple, radius: number, cellSize: number, numOfCells: number): Array<Vector3Tuple> => {
    let containingCells: Array<Vector3Tuple> = [
        position.map(axis => getCellIndex(axis, cellSize, numOfCells)) as Vector3Tuple
    ];
    let center = containingCells[0].map((axisIndex, index) => {
        return (axisIndex * cellSize + cellSize / 2) - cellSize * numOfCells / 2;
    });
    // Edges the ball is touching [x: (-1|1|0), y: (-1|1|0), z: (-1|1|0)] 
    let edges: Vector3Tuple = [0, 0, 0];

    position.forEach((axis, index) => {

        if (axis + radius >= center[index] + cellSize / 2) {
            edges[index] = 1;
        } else if (axis - radius <= center[index] - cellSize / 2) {
            edges[index] = -1;
        }

    });

    edges.forEach((edge, index) => {
        if (edge !== 0) {
            containingCells.push(containingCells[0].map((centerCellAxis, centerCellAxisIndex) => {
                return centerCellAxisIndex === index ? centerCellAxis + edge : centerCellAxis;
            }) as Vector3Tuple);
        }

        if (edges.every((deepEdge, deepIndex) => {
            return deepIndex === index || deepEdge !== 0;
        })) {
            containingCells.push(containingCells[0].map((centerCellAxis, centerCellAxisIndex) => {
                return centerCellAxisIndex !== index ? centerCellAxis + edges[centerCellAxisIndex] : centerCellAxis;
            }) as Vector3Tuple);
        }
    });

    if (edges.every((edge) => {
        return edge !== 0;
    })) {
        containingCells.push(containingCells[0].map((centerCellAxis, centerCellAxisIndex) => {
            return centerCellAxis + edges[centerCellAxisIndex];
        }) as Vector3Tuple);
    }

    // numOfContainingCells === numOfTouchedEdges ^ 2 


    return containingCells;
}


/**
 * Checks if parent array contains search array
 * 
 * @param searchArray array to look for
 * @param parentArray search in this array
 * @returns boolean
 */
export const isArrayInArray = (searchArray: Array<any>, parentArray: Array<Array<any>>): boolean => {
    let foundIndex = parentArray.findIndex((array, index) => {
        return array.every((el, i) => {
            return el === searchArray[i];
        })
    });

    return foundIndex !== -1;
};


/**
 * Get an array with random vector tuples. Provide lenght of array and min & max axis values
 * @param length length of the returned array
 * @param minAxis minimum axis value
 * @param maxAxis maximum axis value
 * @returns Array<Vector3Tuple>
 */
export const getArrayWithRadnomVectors = (length: number, minAxis: number, maxAxis: number): Array<Vector3Tuple> => {
    let array: Array<Vector3Tuple> = [];
    for (let i = 0; i < length; i++) {
        array.push(
            [
                randomNumber(minAxis, maxAxis),
                randomNumber(minAxis, maxAxis),
                randomNumber(minAxis, maxAxis),
            ]
        );
    }
    return array;
};