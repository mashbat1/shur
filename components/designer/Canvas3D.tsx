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
import PhoneModel from "./PhoneModel";

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
    envPreset,
  } = useDesign();
  const lengthCm = customLengthCm ?? defaultLengthCm(productType);
  const stringMat = STRINGS.find((s) => s.id === stringId) ?? STRINGS[0];

  const onBody = viewMode === "on_body";
  const onPhone = onBody && productType === "phone_strap";

  // Camera config (per view):
  //  - phone view : close-up on the phone, ~30cm away
  //  - body view  : portrait — higher target so the model fills the frame
  //                 (necklace gets a slightly higher target to show the neck)
  //  - alone view : scaled to the design's own size
  let camDistance: number;
  let camHeight: number;
  let target: [number, number, number];

  if (onPhone) {
    camDistance = 0.35;
    camHeight = 0;
    target = [0, 0, 0];
  } else if (onBody) {
    // RPM avatar in T-pose: feet y=0.13, hips 1.04, neck 1.47, head 1.56,
    // hands at y=1.44 ±0.65. Pull back enough to fit feet → head + arm width.
    camDistance = 2.2;
    if (productType === "necklace") {
      camHeight = 1.05;
      target = [0, 0.95, 0];
    } else if (productType === "bracelet") {
      camHeight = 1.0;
      target = [0, 0.9, 0];
    } else {
      camHeight = 1.0;
      target = [0, 0.85, 0];
    }
  } else {
    camDistance = Math.max(0.6, lengthCm / 30);
    camHeight = camDistance * 0.6;
    target = [0, 0, 0];
  }

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

      <Environment preset={envPreset} />

      {onPhone ? (
        <PhoneModel>{beadGroup}</PhoneModel>
      ) : onBody ? (
        <Suspense fallback={null}>
          <BodyModel productType={productType} gender={gender}>
            {beadGroup}
          </BodyModel>
        </Suspense>
      ) : (
        beadGroup
      )}

      {onBody && !onPhone && (
        <mesh position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <circleGeometry args={[1.2, 48]} />
          <meshStandardMaterial
            color="#1f1f25"
            roughness={0.85}
            metalness={0}
          />
        </mesh>
      )}

      <ContactShadows
        position={[0, onPhone ? -0.13 : onBody ? 0 : -camDistance * 0.5, 0]}
        opacity={onPhone ? 0.6 : 0.55}
        scale={onPhone ? 0.4 : onBody ? 3 : camDistance * 4}
        blur={2.5}
        far={onPhone ? 0.3 : onBody ? 2 : camDistance * 2}
      />

      <CameraRig
        onBody={onBody}
        fitTarget={target}
        fitPos={[camDistance, camHeight, camDistance]}
        minDist={onPhone ? 0.15 : onBody ? 0.3 : camDistance * 0.4}
        maxDist={onPhone ? 1 : onBody ? 6 : camDistance * 4}
      />
    </Canvas>
  );
}

function CameraRig({
  onBody,
  fitTarget,
  fitPos,
  minDist,
  maxDist,
}: {
  onBody: boolean;
  fitTarget: [number, number, number];
  fitPos: [number, number, number];
  minDist: number;
  maxDist: number;
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
        camera.position.set(a.x + 0.25, a.y + 0.05, a.z + 0.25);
      } else {
        ctrl.target.set(...fitTarget);
        camera.position.set(...fitPos);
      }
      ctrl.update();
    }
    window.addEventListener("zoom-preset", handler);
    return () => window.removeEventListener("zoom-preset", handler);
  }, [camera, onBody, fitTarget, fitPos, currentAnchor]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      target={new THREE.Vector3(...fitTarget)}
      autoRotate={!onBody && beads.length > 0}
      autoRotateSpeed={0.6}
      minDistance={minDist}
      maxDistance={maxDist}
    />
  );
}
