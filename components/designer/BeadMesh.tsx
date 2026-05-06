"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { Bead } from "@/lib/beads";
import { MM_TO_UNIT } from "@/lib/geometry";

type Props = {
  bead: Bead;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

export default function BeadMesh({ bead, position, quaternion }: Props) {
  const r = (bead.diameterMm / 2) * MM_TO_UNIT;
  const len = (bead.lengthMm ?? bead.diameterMm) * MM_TO_UNIT;

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: bead.color,
        roughness: bead.roughness ?? 0.4,
        metalness: bead.metalness ?? 0.0,
      }),
    [bead.color, bead.roughness, bead.metalness],
  );

  // Each bead's local Y axis runs along the string tangent
  return (
    <group position={position} quaternion={quaternion}>
      {bead.shape === "round" && (
        <mesh material={material} castShadow receiveShadow>
          <sphereGeometry args={[r, 32, 24]} />
        </mesh>
      )}

      {bead.shape === "tube" && (
        <mesh material={material} castShadow receiveShadow>
          <cylinderGeometry args={[r, r, len, 24]} />
        </mesh>
      )}

      {bead.shape === "cube" && (
        <mesh material={material} castShadow receiveShadow>
          <boxGeometry args={[r * 1.6, r * 1.6, r * 1.6]} />
        </mesh>
      )}

      {bead.shape === "bicone" && (
        <group>
          <mesh material={material} position={[0, len / 4, 0]} castShadow receiveShadow>
            <coneGeometry args={[r, len / 2, 24]} />
          </mesh>
          <mesh
            material={material}
            position={[0, -len / 4, 0]}
            rotation={[Math.PI, 0, 0]}
            castShadow
            receiveShadow
          >
            <coneGeometry args={[r, len / 2, 24]} />
          </mesh>
        </group>
      )}

      {bead.shape === "disc" && (
        <mesh material={material} castShadow receiveShadow>
          <cylinderGeometry args={[r, r, len, 32]} />
        </mesh>
      )}
    </group>
  );
}
