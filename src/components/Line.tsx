import React, { useRef, useLayoutEffect } from "react";
import { Vector3, Vector3Tuple } from "three";

interface LineProps { 
    start: Vector3Tuple, 
    end: Vector3Tuple, 
    color?: string 
}

const Line = ({ start, end, color = 'hotpink' }: LineProps) =>  {
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