"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import {
  useDesign,
  STRINGS,
  defaultLengthCm,
} from "@/lib/designStore";
import BeadsOnCurve from "./BeadsOnCurve";
import BodyModel from "./BodyModel";
import { Suspense } from "react";

export default function Canvas3D() {
  const { productType, beads, stringId, customLengthCm, viewMode, gender } =
    useDesign();
  const lengthCm = customLengthCm ?? defaultLengthCm(productType);
  const stringMat = STRINGS.find((s) => s.id === stringId) ?? STRINGS[0];

  const onBody = viewMode === "on_body";

  // Two camera setups: design-only (close-in) vs body view (full body)
  const camDistance = onBody ? 2.6 : Math.max(0.6, lengthCm / 30);
  const camHeight = onBody ? 1.4 : camDistance * 0.6;
  const target: [number, number, number] = onBody ? [0, 1.0, 0] : [0, 0, 0];

  const beadGroup = (
    <BeadsOnCurve
      productType={productType}
      beads={beads}
      stringColor={stringMat.color}
      lengthCm={lengthCm}
    />
  );

  return (
    <Canvas
      shadows
      camera={{ position: [camDistance, camHeight, camDistance], fov: 40 }}
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

      {onBody ? (
        <Suspense fallback={null}>
          <BodyModel productType={productType} gender={gender}>
            {beadGroup}
          </BodyModel>
        </Suspense>
      ) : (
        beadGroup
      )}

      <ContactShadows
        position={[0, onBody ? 0 : -camDistance * 0.5, 0]}
        opacity={0.45}
        scale={onBody ? 4 : camDistance * 4}
        blur={2.5}
        far={onBody ? 3 : camDistance * 2}
      />

      <OrbitControls
        makeDefault
        enableDamping
        target={target}
        autoRotate={!onBody && beads.length > 0}
        autoRotateSpeed={0.6}
        minDistance={onBody ? 1 : camDistance * 0.4}
        maxDistance={onBody ? 6 : camDistance * 4}
      />
    </Canvas>
  );
}
