"use client";

import { RoundedBox } from "@react-three/drei";
import { ReactNode, useEffect } from "react";
import { useDesign } from "@/lib/designStore";

const JEWELRY_SCALE = 0.1; // bead-system cm -> body-meter conversion

// Phone dimensions (meters)
const PHONE_W = 0.075;  // 7.5cm
const PHONE_H = 0.155;  // 15.5cm
const PHONE_D = 0.009;  // 9mm thickness

// Strap lug (small protrusion above the top-left corner)
const LUG_W = 0.012;
const LUG_H = 0.012;
const LUG_D = PHONE_D;
const LUG_X = -PHONE_W / 2 + LUG_W / 2 + 0.002; // slightly inset from edge
const LUG_Y = PHONE_H / 2 + LUG_H / 2 - 0.002;  // mostly above phone top

// Eyelet ring (the hole the strap passes through)
const EYELET_R = 0.004;       // ring radius
const EYELET_TUBE = 0.0012;   // ring thickness

// Strap anchor = the centre of the eyelet
const ANCHOR: [number, number, number] = [LUG_X, LUG_Y, 0];

type Props = {
  children?: ReactNode;
};

export default function PhoneModel({ children }: Props) {
  const setCurrentAnchor = useDesign((s) => s.setCurrentAnchor);

  useEffect(() => {
    setCurrentAnchor({ x: ANCHOR[0], y: ANCHOR[1], z: ANCHOR[2] });
    return () => setCurrentAnchor(null);
  }, [setCurrentAnchor]);

  return (
    <group>
      {/* Phone body */}
      <RoundedBox
        args={[PHONE_W, PHONE_H, PHONE_D]}
        radius={0.012}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1a1a1f" roughness={0.4} metalness={0.4} />
      </RoundedBox>

      {/* Screen (front face) */}
      <mesh position={[0, 0, PHONE_D / 2 + 0.0001]}>
        <planeGeometry args={[PHONE_W * 0.92, PHONE_H * 0.94]} />
        <meshStandardMaterial
          color="#0a1428"
          emissive="#1a4a7a"
          emissiveIntensity={0.25}
          roughness={0.05}
          metalness={0}
        />
      </mesh>

      {/* Camera dot */}
      <mesh position={[PHONE_W * 0.32, PHONE_H * 0.42, PHONE_D / 2 + 0.0005]}>
        <circleGeometry args={[0.005, 24]} />
        <meshStandardMaterial color="#2a2a30" roughness={0.2} metalness={0.6} />
      </mesh>

      {/* Strap lug — small block protruding above the top-left corner */}
      <RoundedBox
        args={[LUG_W, LUG_H, LUG_D]}
        radius={0.002}
        smoothness={3}
        position={[LUG_X, LUG_Y, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#1a1a1f" roughness={0.4} metalness={0.4} />
      </RoundedBox>

      {/* Eyelet ring — sits on the lug, faces the camera */}
      <mesh position={[LUG_X, LUG_Y, LUG_D / 2 + 0.0005]}>
        <torusGeometry args={[EYELET_R, EYELET_TUBE, 12, 28]} />
        <meshStandardMaterial color="#888" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Mirror eyelet on the back so the strap appears threaded */}
      <mesh position={[LUG_X, LUG_Y, -LUG_D / 2 - 0.0005]}>
        <torusGeometry args={[EYELET_R, EYELET_TUBE, 12, 28]} />
        <meshStandardMaterial color="#888" metalness={0.85} roughness={0.25} />
      </mesh>

      {/* Strap attached at the eyelet, scaled down to bead-system units */}
      <group position={ANCHOR} scale={JEWELRY_SCALE}>
        {children}
      </group>
    </group>
  );
}
