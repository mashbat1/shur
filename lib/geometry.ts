import * as THREE from "three";
import { Bead, beadAxialSize, getBead } from "./beads";
import { ProductType } from "./designStore";

const MM_TO_UNIT = 0.01; // 1mm = 0.01 three.js units (10mm = 0.1u)

export function mm(n: number): number {
  return n * MM_TO_UNIT;
}

/**
 * Build a curve (closed for bracelet/necklace, open for phone strap)
 * sized to the requested length in cm.
 */
export function buildStringCurve(
  type: ProductType,
  lengthCm: number,
): THREE.Curve<THREE.Vector3> {
  const lengthU = lengthCm * 10 * MM_TO_UNIT; // cm → mm → units

  if (type === "phone_strap") {
    // Open hanging loop. Both ends start close together (as if both
    // threaded through the same hole) and droop down in the middle.
    const halfL = lengthU / 2;
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-halfL * 0.04, halfL * 0.05, 0),
        new THREE.Vector3(-halfL * 0.55, -halfL * 0.15, 0),
        new THREE.Vector3(0, -halfL * 0.55, 0),
        new THREE.Vector3(halfL * 0.55, -halfL * 0.15, 0),
        new THREE.Vector3(halfL * 0.04, halfL * 0.05, 0),
      ],
      false,
      "catmullrom",
      0.5,
    );
  }

  // Bracelet / necklace: closed circle of correct circumference
  const radius = lengthU / (2 * Math.PI);
  const segments = 64;
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
}

export type BeadPlacement = {
  beadId: string;
  index: number;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
};

/**
 * Distribute beads along the curve, accounting for each bead's axial size.
 */
export function placeBeads(
  beadIds: string[],
  curve: THREE.Curve<THREE.Vector3>,
  type: ProductType,
): BeadPlacement[] {
  if (beadIds.length === 0) return [];

  const isClosed =
    curve instanceof THREE.CatmullRomCurve3 ? curve.closed : false;
  const curveLen = curve.getLength();

  const sizes = beadIds.map((id) => {
    const b = getBead(id);
    return b ? beadAxialSize(b) * MM_TO_UNIT : 0.08;
  });
  const totalNeeded = sizes.reduce((a, b) => a + b, 0);

  // Scale beads to fit if they overflow (visual fallback)
  const scale = totalNeeded > curveLen ? curveLen / totalNeeded : 1;

  // Walk the curve placing each bead at its center
  let cursor = 0;
  const placements: BeadPlacement[] = [];
  for (let i = 0; i < beadIds.length; i++) {
    const half = (sizes[i] * scale) / 2;
    cursor += half;
    let t = cursor / curveLen;
    if (isClosed) t = ((t % 1) + 1) % 1;
    else t = Math.min(Math.max(t, 0), 1);

    const position = curve.getPointAt(t);
    const tangent = curve.getTangentAt(t).normalize();

    // Orient bead so its local +Y axis aligns with the tangent
    const up = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(up, tangent);

    placements.push({ beadId: beadIds[i], index: i, position, quaternion });
    cursor += half;
  }
  return placements;
}

/**
 * Compute total axial mm of all beads (used to suggest a length).
 */
export function suggestLengthCm(beadIds: string[]): number {
  let mmTotal = 0;
  for (const id of beadIds) {
    const b = getBead(id);
    if (b) mmTotal += beadAxialSize(b);
  }
  return Math.max(8, Math.round(mmTotal / 10));
}

export { MM_TO_UNIT };
