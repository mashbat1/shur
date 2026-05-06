"use client";

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { ProductType, Gender, useDesign } from "@/lib/designStore";

const MODEL_BY_GENDER: Record<Gender, string> = {
  female: "/models/female.glb",
  male: "/models/male.glb",
};

useGLTF.preload(MODEL_BY_GENDER.female);
useGLTF.preload(MODEL_BY_GENDER.male);

type Props = {
  productType: ProductType;
  gender: Gender;
  children?: ReactNode; // bead curve, anchored to the body
};

// ReadyPlayerMe rigs use these standard bone names (no mixamorig prefix)
const BONE_BY_PRODUCT: Record<ProductType, string> = {
  bracelet: "LeftHand",
  necklace: "Neck",
  phone_strap: "RightHand",
};

// Bead system: 1 cm = 0.1 unit. RPM body: 1 m = 1 unit.
// Convert bead-system units to body meters by 0.1x.
const JEWELRY_SCALE = 0.1;

// Per-product anchor adjustments (world-space offset in meters + local tilt in rad)
type Adjust = {
  offset: [number, number, number];
  tiltX?: number;
};
const PRODUCT_ADJUST: Record<ProductType, Adjust> = {
  bracelet: { offset: [0, 0, 0] },
  // Drop down to collarbone level and slight forward droop
  necklace: { offset: [0, -0.05, 0.02], tiltX: -0.45 },
  phone_strap: { offset: [0, -0.05, 0] },
};

export default function BodyModel({ productType, gender, children }: Props) {
  const url = MODEL_BY_GENDER[gender];
  const { scene } = useGLTF(url);

  // Clone so the cached scene is never mutated when we tweak materials
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const [anchor, setAnchor] = useState<{
    pos: THREE.Vector3;
    quat: THREE.Quaternion;
  } | null>(null);

  // Find the anchor bone for the current product type
  useEffect(() => {
    cloned.updateMatrixWorld(true);
    const target = BONE_BY_PRODUCT[productType];
    let found: THREE.Object3D | null = null;
    cloned.traverse((o) => {
      if (found) return;
      if (o.name === target) found = o;
    });
    // Fallback: substring match
    if (!found) {
      cloned.traverse((o) => {
        if (found) return;
        if (o.name && o.name.toLowerCase().includes(target.toLowerCase())) {
          found = o;
        }
      });
    }
    if (!found) {
      setAnchor(null);
      return;
    }
    const bone = found as THREE.Object3D;
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    bone.getWorldPosition(pos);
    bone.getWorldQuaternion(quat);
    setAnchor({ pos, quat });
  }, [cloned, productType]);

  const adj = PRODUCT_ADJUST[productType];
  const adjPos = anchor
    ? new THREE.Vector3(
        anchor.pos.x + adj.offset[0],
        anchor.pos.y + adj.offset[1],
        anchor.pos.z + adj.offset[2],
      )
    : null;

  const setCurrentAnchor = useDesign((s) => s.setCurrentAnchor);
  const ax = adjPos?.x;
  const ay = adjPos?.y;
  const az = adjPos?.z;
  useEffect(() => {
    if (ax === undefined || ay === undefined || az === undefined) {
      setCurrentAnchor(null);
    } else {
      setCurrentAnchor({ x: ax, y: ay, z: az });
    }
  }, [ax, ay, az, setCurrentAnchor]);

  return (
    <group position={[0, 0, 0]}>
      <primitive object={cloned} />
      {anchor && adjPos && (
        <group position={adjPos} quaternion={anchor.quat}>
          <group rotation={[adj.tiltX ?? 0, 0, 0]} scale={JEWELRY_SCALE}>
            {children}
          </group>
        </group>
      )}
    </group>
  );
}
