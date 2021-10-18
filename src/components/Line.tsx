import React, { useRef, useLayoutEffect } from "react";
import { Mesh, Vector3, Vector3Tuple } from "three";


const Line = ({ start, end, color = 'hotpink' }: { start: Vector3Tuple, end: Vector3Tuple, color?: string }) =>  {
    const ref = useRef<any>()
    useLayoutEffect(() => {
        ref.current.geometry.setFromPoints([start, end].map((point) => new Vector3(...point)))
    }, [start, end])
    return (
        <line ref={ref}>
            <bufferGeometry />
            <lineBasicMaterial color={color} />
        </line>
    )
};

export default Line;