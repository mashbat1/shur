import { create } from "zustand";
import { BEADS, beadAxialSize, getBead } from "./beads";

export type ProductType = "bracelet" | "necklace" | "phone_strap";

export type StringMaterial = {
  id: string;
  name: string;
  color: string;
  pricePerCm: number;
};

export const STRINGS: StringMaterial[] = [
  { id: "elastic-clear", name: "Уян утас (тунгалаг)", color: "#e8e8e8", pricePerCm: 50 },
  { id: "wire-silver",   name: "Мөнгөн утас",         color: "#bfc1c7", pricePerCm: 120 },
  { id: "leather-brown", name: "Хүрэн арьс",          color: "#5a3820", pricePerCm: 200 },
  { id: "cord-black",    name: "Хар утас",            color: "#1a1a1a", pricePerCm: 80 },
];

export type ViewMode = "alone" | "on_body";
export type Gender = "female" | "male";

export type DesignState = {
  productType: ProductType;
  beads: string[];          // bead ids in order
  stringId: string;
  customLengthCm: number | null; // null = auto from beads
  viewMode: ViewMode;
  gender: Gender;

  setProductType: (t: ProductType) => void;
  addBead: (id: string) => void;
  removeAt: (idx: number) => void;
  moveBead: (from: number, to: number) => void;
  clear: () => void;
  setString: (id: string) => void;
  setLength: (cm: number | null) => void;
  setViewMode: (m: ViewMode) => void;
  setGender: (g: Gender) => void;
};

export const useDesign = create<DesignState>((set) => ({
  productType: "bracelet",
  beads: [],
  stringId: STRINGS[0].id,
  customLengthCm: null,
  viewMode: "alone",
  gender: "female",

  setProductType: (t) => set({ productType: t }),
  addBead: (id) => set((s) => ({ beads: [...s.beads, id] })),
  removeAt: (idx) => set((s) => ({ beads: s.beads.filter((_, i) => i !== idx) })),
  moveBead: (from, to) =>
    set((s) => {
      const arr = [...s.beads];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { beads: arr };
    }),
  clear: () => set({ beads: [] }),
  setString: (id) => set({ stringId: id }),
  setLength: (cm) => set({ customLengthCm: cm }),
  setViewMode: (m) => set({ viewMode: m }),
  setGender: (g) => set({ gender: g }),
}));

export function defaultLengthCm(type: ProductType): number {
  if (type === "bracelet") return 18;
  if (type === "necklace") return 45;
  return 22; // phone_strap
}

export function totalBeadLengthMm(beadIds: string[]): number {
  let total = 0;
  for (const id of beadIds) {
    const b = getBead(id);
    if (b) total += beadAxialSize(b);
  }
  return total;
}

export function totalPrice(
  beadIds: string[],
  stringId: string,
  lengthCm: number,
): number {
  const beadCost = beadIds.reduce((sum, id) => {
    const b = BEADS.find((x) => x.id === id);
    return sum + (b?.price ?? 0);
  }, 0);
  const str = STRINGS.find((s) => s.id === stringId) ?? STRINGS[0];
  const stringCost = Math.round(lengthCm * str.pricePerCm);
  const labor = 5000;
  return beadCost + stringCost + labor;
}
