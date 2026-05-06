"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { getBead } from "@/lib/beads";
import { buildStringCurve, placeBeads, MM_TO_UNIT } from "@/lib/geometry";
import { ProductType } from "@/lib/designStore";
import BeadMesh from "./BeadMesh";
import StringTube from "./StringTube";

type Props = {
  productType: ProductType;
  beads: string[];
  stringColor: string;
  lengthCm: number;
  pendantId?: string | null;
};

export default function BeadsOnCurve({
  productType,
  beads,
  stringColor,
  lengthCm,
  pendantId,
}: Props) {
  const curve = useMemo(
    () => buildStringCurve(productType, lengthCm),
    [productType, lengthCm],
  );

  const placements = useMemo(
    () => placeBeads(beads, curve, productType),
    [beads, curve, productType],
  );

  const pendant = pendantId ? getBead(pendantId) : null;
  const showPendant = !!pendant;

  // Pendant placement
  //   necklace : t=0.25 → +Z (front of the body)
  //   strap    : t=0.5  → bottom of the U loop
  //   bracelet : t=0.25 → visible side of the loop, short cord
  const pendantData = useMemo(() => {
    if (!showPendant || !pendant) return null;
    const t =
      productType === "phone_strap" ? 0.5 : 0.25;
    const attach = curve.getPointAt(t);
    const chainLengthMm =
      productType === "phone_strap"
        ? 12
        : productType === "bracelet"
        ? 8
        : 25;
    const chainEnd = new THREE.Vector3(
      attach.x,
      attach.y - chainLengthMm * MM_TO_UNIT,
      attach.z,
    );
    // Tassels & similar hanging shapes attach at their TOP (origin = top).
    // Other pendants are centered, so drop them a further bead-radius.
    const isHanging = pendant.shape === "tassel";
    const pendantR = (pendant.diameterMm / 2) * MM_TO_UNIT;
    const pendantPos = isHanging
      ? chainEnd
      : new THREE.Vector3(chainEnd.x, chainEnd.y - pendantR, chainEnd.z);
    return {
      attach,
      chainEnd,
      pos: pendantPos,
      pendant,
    };
  }, [showPendant, pendant, curve, productType]);

  // Cord/chain geometry from front-of-curve down to chain end
  const cordGeom = useMemo(() => {
    if (!pendantData) return null;
    const path = new THREE.LineCurve3(pendantData.attach, pendantData.chainEnd);
    return new THREE.TubeGeometry(path, 8, 0.002, 6, false);
  }, [pendantData]);

  return (
    <group>
      <StringTube curve={curve} color={stringColor} />
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

      {pendantData && cordGeom && (
        <>
          <mesh geometry={cordGeom}>
            <meshStandardMaterial color={stringColor} roughness={0.6} />
          </mesh>
          <BeadMesh
            bead={pendantData.pendant}
            position={pendantData.pos}
            quaternion={new THREE.Quaternion()}
          />
        </>
      )}
    </group>
  );
}
