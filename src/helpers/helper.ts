import { Vector3, Vector3Tuple } from "three";

export const randomNumber = (min: number, max: number): number => {
    let diff = max - min;
    return Math.random() * diff + min;
};


export const calculateBounce = (vector: Vector3, normal: Vector3): Vector3 => {
    let newVector = vector.clone();
    let newNormal = normal.clone();

    let friction: number = 0.5;
    let elasticity: number = 0.25;


    let parallel = newNormal.multiplyScalar(-newVector.dot(newNormal) / newNormal.dot(newNormal));
    let perpendicular = newVector.sub(parallel);
    let result = perpendicular.multiplyScalar(friction * 0.25).sub(parallel.multiplyScalar(elasticity * 0.25))


    return result;

};
export const getBoxIndex = (length: number, boxSize: number, numOfBoxes: number): number => {
    return Math.floor((length + ((numOfBoxes * boxSize) / 2)) / boxSize);
};

export const getContainingBoxes = (position: Vector3Tuple, radius: number, boxSize: number, numOfBoxes: number): Array<Vector3Tuple> => {
    let containingBoxes: Array<Vector3Tuple> = [
        position.map(axis => getBoxIndex(axis, boxSize, numOfBoxes)) as Vector3Tuple
    ];
    let centre = containingBoxes[0].map((axisIndex, index) => {
        return (axisIndex * boxSize + boxSize / 2) - boxSize * numOfBoxes / 2;
    });
    let edges: Vector3Tuple = [0, 0, 0];

    position.forEach((axis, index) => {

        if (axis + radius >= centre[index] + boxSize / 2) {
            edges[index] = 1;
        } else if (axis - radius <= centre[index] - boxSize / 2) {
            edges[index] = -1;
        }

    });

    edges.forEach((edge, index) => {
        if (edge !== 0) {
            containingBoxes.push(containingBoxes[0].map((centreBoxAxis, centreBoxAxisIndex) => {
                return centreBoxAxisIndex === index ? centreBoxAxis + edge : centreBoxAxis;
            }) as Vector3Tuple);
        }

        if (edges.every((deepEdge, deepIndex) => {
            return deepIndex === index || deepEdge !== 0;
        })) {
            containingBoxes.push(containingBoxes[0].map((centreBoxAxis, centreBoxAxisIndex) => {
                return centreBoxAxisIndex !== index ? centreBoxAxis + edges[centreBoxAxisIndex] : centreBoxAxis;
            }) as Vector3Tuple);
        }
    });

    if (edges.every((edge) => {
        return edge !== 0;
    })) {
        containingBoxes.push(containingBoxes[0].map((centreBoxAxis, centreBoxAxisIndex) => {
            return centreBoxAxis + edges[centreBoxAxisIndex];
        }) as Vector3Tuple);
    }


    return containingBoxes;
}

export const isArrayInArray = (searchArray: Array<any>, parentArray: Array<Array<any>>): boolean => {
    let foundIndex = parentArray.findIndex((array, index) => {
        return array.every((el, i) => {
            return el === searchArray[i];
        })
    });

    return foundIndex !== -1;
};

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