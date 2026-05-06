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
  const showPendant = pendant && productType === "necklace";

  // Pendant placement: hang from the front-most point of the necklace circle
  const pendantData = useMemo(() => {
    if (!showPendant || !pendant) return null;
    // Our necklace circle is built in the XZ plane with center at origin.
    // Sample t=0.25 to land on +Z (front of the body when facing +Z)
    const front = curve.getPointAt(0.25);
    const chainLengthMm = 25; // 2.5cm cord
    const pendantR = (pendant.diameterMm / 2) * MM_TO_UNIT;
    const pendantPos = new THREE.Vector3(
      front.x,
      front.y - chainLengthMm * MM_TO_UNIT - pendantR,
      front.z,
    );
    return {
      attach: front,
      pos: pendantPos,
      pendant,
      pendantR,
    };
  }, [showPendant, pendant, curve]);

  // Cord/chain geometry from front-of-curve down to pendant
  const cordGeom = useMemo(() => {
    if (!pendantData) return null;
    const path = new THREE.LineCurve3(pendantData.attach, pendantData.pos);
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
