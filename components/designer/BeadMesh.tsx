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

function buildHeartGeometry(size: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const x = 0;
  const y = 0;
  shape.moveTo(x + 0.0, y + 0.5);
  shape.bezierCurveTo(x + 0.0, y + 0.5, x - 0.6, y + 1.1, x - 1.0, y + 0.5);
  shape.bezierCurveTo(x - 1.4, y - 0.1, x - 0.7, y - 0.7, x + 0.0, y - 1.0);
  shape.bezierCurveTo(x + 0.7, y - 0.7, x + 1.4, y - 0.1, x + 1.0, y + 0.5);
  shape.bezierCurveTo(x + 0.6, y + 1.1, x + 0.0, y + 0.5, x + 0.0, y + 0.5);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.3,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.08,
    bevelThickness: 0.08,
    curveSegments: 16,
  });
  geo.center();
  geo.scale(size, size, size);
  return geo;
}

function buildStarGeometry(size: number): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const points = 5;
  const outer = 1.0;
  const inner = 0.45;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.25,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    curveSegments: 8,
  });
  geo.center();
  geo.scale(size, size, size);
  return geo;
}

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

  const heartGeo = useMemo(
    () => (bead.shape === "heart" ? buildHeartGeometry(r) : null),
    [bead.shape, r],
  );
  const starGeo = useMemo(
    () => (bead.shape === "star" ? buildStarGeometry(r) : null),
    [bead.shape, r],
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

      {bead.shape === "heart" && heartGeo && (
        <mesh geometry={heartGeo} material={material} castShadow receiveShadow />
      )}

      {bead.shape === "star" && starGeo && (
        <mesh geometry={starGeo} material={material} castShadow receiveShadow />
      )}
    </group>
  );
}
