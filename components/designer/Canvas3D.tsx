"use client";

import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import * as THREE from "three";
import {
  useDesign,
  STRINGS,
  defaultLengthCm,
} from "@/lib/designStore";
import BeadsOnCurve from "./BeadsOnCurve";
import BodyModel from "./BodyModel";

export type CameraPreset = "fit" | "close";

export default function Canvas3D() {
  const {
    productType,
    beads,
    stringId,
    customLengthCm,
    viewMode,
    gender,
    pendantId,
  } = useDesign();
  const lengthCm = customLengthCm ?? defaultLengthCm(productType);
  const stringMat = STRINGS.find((s) => s.id === stringId) ?? STRINGS[0];

  const onBody = viewMode === "on_body";

  const camDistance = onBody ? 2.6 : Math.max(0.6, lengthCm / 30);
  const camHeight = onBody ? 1.4 : camDistance * 0.6;
  const target: [number, number, number] = onBody ? [0, 1.0, 0] : [0, 0, 0];

  const beadGroup = (
    <BeadsOnCurve
      productType={productType}
      beads={beads}
      stringColor={stringMat.color}
      lengthCm={lengthCm}
      pendantId={pendantId}
    />
  );

  return (
    <Canvas
      shadows
      camera={{ position: [camDistance, camHeight, camDistance], fov: 40 }}
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
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

      <CameraRig onBody={onBody} fitTarget={target} fitDistance={camDistance} />
    </Canvas>
  );
}

function CameraRig({
  onBody,
  fitTarget,
  fitDistance,
}: {
  onBody: boolean;
  fitTarget: [number, number, number];
  fitDistance: number;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const beads = useDesign((s) => s.beads);
  const currentAnchor = useDesign((s) => s.currentAnchor);

  useEffect(() => {
    function handler(e: Event) {
      const detail = (e as CustomEvent<CameraPreset>).detail;
      const ctrl = controlsRef.current;
      if (!ctrl) return;

      if (detail === "close" && onBody && currentAnchor) {
        const a = currentAnchor;
        ctrl.target.set(a.x, a.y, a.z);
        camera.position.set(a.x + 0.3, a.y + 0.05, a.z + 0.3);
      } else {
        ctrl.target.set(...fitTarget);
        if (onBody) {
          camera.position.set(fitDistance, 1.4, fitDistance);
        } else {
          camera.position.set(fitDistance, fitDistance * 0.6, fitDistance);
        }
      }
      ctrl.update();
    }
    window.addEventListener("zoom-preset", handler);
    return () => window.removeEventListener("zoom-preset", handler);
  }, [camera, onBody, fitTarget, fitDistance, currentAnchor]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      target={new THREE.Vector3(...fitTarget)}
      autoRotate={!onBody && beads.length > 0}
      autoRotateSpeed={0.6}
      minDistance={onBody ? 0.3 : fitDistance * 0.4}
      maxDistance={onBody ? 6 : fitDistance * 4}
    />
  );
}
