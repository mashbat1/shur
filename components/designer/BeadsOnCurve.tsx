"use client";

import * as THREE from "three";
import { useMemo } from "react";
import { getBead } from "@/lib/beads";
import { buildStringCurve, placeBeads } from "@/lib/geometry";
import { ProductType } from "@/lib/designStore";
import BeadMesh from "./BeadMesh";
import StringTube from "./StringTube";

type Props = {
  productType: ProductType;
  beads: string[];
  stringColor: string;
  lengthCm: number;
};

export default function BeadsOnCurve({
  productType,
  beads,
  stringColor,
  lengthCm,
}: Props) {
  const curve = useMemo(
    () => buildStringCurve(productType, lengthCm),
    [productType, lengthCm],
  );

  const placements = useMemo(
    () => placeBeads(beads, curve, productType),
    [beads, curve, productType],
  );

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
    </group>
  );
}
