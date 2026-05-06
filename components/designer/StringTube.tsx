"use client";

import * as THREE from "three";
import { useMemo } from "react";

type Props = {
  curve: THREE.Curve<THREE.Vector3>;
  color: string;
  radius?: number;
};

export default function StringTube({ curve, color, radius = 0.004 }: Props) {
  const geom = useMemo(() => {
    const isClosed =
      curve instanceof THREE.CatmullRomCurve3 ? curve.closed : false;
    return new THREE.TubeGeometry(curve, 200, radius, 8, isClosed);
  }, [curve, radius]);

  return (
    <mesh geometry={geom}>
      <meshStandardMaterial color={color} roughness={0.6} metalness={0.0} />
    </mesh>
  );
}
