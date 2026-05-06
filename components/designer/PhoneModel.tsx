"use client";

import { RoundedBox } from "@react-three/drei";
import { ReactNode, useEffect } from "react";
import { useDesign } from "@/lib/designStore";

const JEWELRY_SCALE = 0.1; // bead-system cm -> body-meter conversion

// Phone dimensions (meters)
const PHONE_W = 0.075;  // 7.5cm
const PHONE_H = 0.155;  // 15.5cm
const PHONE_D = 0.009;  // 9mm thickness

// Strap hole anchor: top-left corner, slightly above the body
const ANCHOR: [number, number, number] = [
  -PHONE_W / 2 + 0.005,
  PHONE_H / 2 + 0.005,
  0,
];

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

      {/* Screen */}
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

      {/* Strap hole (a small ring at top-left corner) */}
      <mesh
        position={[
          -PHONE_W / 2 + 0.005,
          PHONE_H / 2 - 0.004,
          0,
        ]}
        rotation={[0, 0, 0]}
      >
        <torusGeometry args={[0.0025, 0.0008, 8, 16]} />
        <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Strap attached at anchor, scaled down to bead-system units */}
      <group position={ANCHOR} scale={JEWELRY_SCALE}>
        {children}
      </group>
    </group>
  );
}
