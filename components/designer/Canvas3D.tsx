"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useMemo } from "react";
import {
  useDesign,
  STRINGS,
  defaultLengthCm,
} from "@/lib/designStore";
import { getBead } from "@/lib/beads";
import { buildStringCurve, placeBeads } from "@/lib/geometry";
import BeadMesh from "./BeadMesh";
import StringTube from "./StringTube";

export default function Canvas3D() {
  const { productType, beads, stringId, customLengthCm } = useDesign();
  const lengthCm = customLengthCm ?? defaultLengthCm(productType);
  const stringMat = STRINGS.find((s) => s.id === stringId) ?? STRINGS[0];

  const curve = useMemo(
    () => buildStringCurve(productType, lengthCm),
    [productType, lengthCm],
  );

  const placements = useMemo(
    () => placeBeads(beads, curve, productType),
    [beads, curve, productType],
  );

  // Camera distance scales with the design size
  const camDistance = Math.max(0.6, lengthCm / 30);

  return (
    <Canvas
      shadows
      camera={{ position: [camDistance, camDistance * 0.6, camDistance], fov: 40 }}
      dpr={[1, 2]}
    >
      <color attach="background" args={["#0f0f12"]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2, 3, 2]}
        intensity={1.1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-2, 1, -2]} intensity={0.4} />

      <Environment preset="studio" />

      <StringTube curve={curve} color={stringMat.color} />

      {placements.map((p) => {
        const bead = getBead(p.beadId);
        if (!bead) return null;
        return (
          <BeadMesh
            key={`${p.index}-${p.beadId}`}
            bead={bead}
            position={p.position}
            quaternion={p.quaternion}
          />
        );
      })}

      <ContactShadows
        position={[0, -camDistance * 0.5, 0]}
        opacity={0.45}
        scale={camDistance * 4}
        blur={2.5}
        far={camDistance * 2}
      />

      <OrbitControls
        makeDefault
        enableDamping
        autoRotate={beads.length > 0}
        autoRotateSpeed={0.6}
        minDistance={camDistance * 0.4}
        maxDistance={camDistance * 4}
      />
    </Canvas>
  );
}
