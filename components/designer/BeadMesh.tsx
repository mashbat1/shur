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

function buildTassel(
  diameterMm: number,
  lengthMm: number,
): {
  cap: THREE.BufferGeometry;
  strands: { tube: THREE.BufferGeometry }[];
} {
  // A tassel: small bead-cap at top, ~16 thin strands fanning down.
  const capR = (diameterMm / 2) * MM_TO_UNIT * 0.7;
  const capH = capR * 1.4;
  const cap = new THREE.CylinderGeometry(capR * 0.6, capR, capH, 16);
  // place cap so its top is at y=0 (tassel hangs from origin)
  cap.translate(0, -capH / 2, 0);

  const strandLen = lengthMm * MM_TO_UNIT;
  const fanR = (diameterMm / 2) * MM_TO_UNIT;
  const N = 18;
  const strands: { tube: THREE.BufferGeometry }[] = [];
  for (let i = 0; i < N; i++) {
    const angle = (i / N) * Math.PI * 2;
    // pseudo-random radius (deterministic) so the tassel looks slightly uneven
    const jitter = 0.6 + 0.4 * Math.abs(Math.sin(i * 12.9898));
    const ex = Math.cos(angle) * fanR * jitter;
    const ez = Math.sin(angle) * fanR * jitter;
    const yEnd = -capH - strandLen * (0.85 + 0.15 * Math.abs(Math.cos(i * 7.7)));
    const start = new THREE.Vector3(0, -capH, 0);
    const mid = new THREE.Vector3(ex * 0.4, -capH - strandLen * 0.45, ez * 0.4);
    const end = new THREE.Vector3(ex, yEnd, ez);
    const path = new THREE.CatmullRomCurve3([start, mid, end]);
    const tube = new THREE.TubeGeometry(path, 8, capR * 0.04, 4, false);
    strands.push({ tube });
  }
  return { cap, strands };
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
  const tasselData = useMemo(
    () =>
      bead.shape === "tassel"
        ? buildTassel(bead.diameterMm, bead.lengthMm ?? 60)
        : null,
    [bead.shape, bead.diameterMm, bead.lengthMm],
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

      {bead.shape === "tassel" && tasselData && (
        <>
          <mesh geometry={tasselData.cap} material={material} castShadow receiveShadow />
          {tasselData.strands.map((s, i) => (
            <mesh key={i} geometry={s.tube} material={material} castShadow />
          ))}
        </>
      )}
    </group>
  );
}
