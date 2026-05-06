import { create } from "zustand";
import { BEADS, beadAxialSize, getBead } from "./beads";

export type ProductType = "bracelet" | "necklace" | "phone_strap";
export type ViewMode = "alone" | "on_body";
export type Gender = "female" | "male";

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

type Snapshot = {
  beads: string[];
  pendantId: string | null;
};

const HISTORY_LIMIT = 50;

export type DesignState = {
  productType: ProductType;
  beads: string[];
  pendantId: string | null;
  stringId: string;
  customLengthCm: number | null;
  viewMode: ViewMode;
  gender: Gender;
  past: Snapshot[];
  future: Snapshot[];
  currentAnchor: { x: number; y: number; z: number } | null;

  setCurrentAnchor: (a: { x: number; y: number; z: number } | null) => void;
  setProductType: (t: ProductType) => void;
  addBead: (id: string) => void;
  removeAt: (idx: number) => void;
  moveBead: (from: number, to: number) => void;
  clear: () => void;
  mirror: () => void;
  setString: (id: string) => void;
  setLength: (cm: number | null) => void;
  setViewMode: (m: ViewMode) => void;
  setGender: (g: Gender) => void;
  setPendant: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  loadDesign: (d: Partial<Pick<DesignState, "productType" | "beads" | "pendantId" | "stringId" | "customLengthCm">>) => void;
};

function snapshot(s: DesignState): Snapshot {
  return { beads: [...s.beads], pendantId: s.pendantId };
}

function pushHistory(state: DesignState): Pick<DesignState, "past" | "future"> {
  const next = [...state.past, snapshot(state)];
  if (next.length > HISTORY_LIMIT) next.shift();
  return { past: next, future: [] };
}

export const useDesign = create<DesignState>((set, get) => ({
  productType: "bracelet",
  beads: [],
  pendantId: null,
  stringId: STRINGS[0].id,
  customLengthCm: null,
  viewMode: "alone",
  gender: "female",
  past: [],
  future: [],
  currentAnchor: null,

  setCurrentAnchor: (a) => set({ currentAnchor: a }),
  setProductType: (t) => set({ productType: t }),

  addBead: (id) =>
    set((s) => ({ ...pushHistory(s), beads: [...s.beads, id] })),

  removeAt: (idx) =>
    set((s) => ({
      ...pushHistory(s),
      beads: s.beads.filter((_, i) => i !== idx),
    })),

  moveBead: (from, to) =>
    set((s) => {
      const arr = [...s.beads];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
      return { ...pushHistory(s), beads: arr };
    }),

  clear: () => set((s) => ({ ...pushHistory(s), beads: [], pendantId: null })),

  mirror: () =>
    set((s) => {
      if (s.beads.length < 2) return s;
      const reversed = [...s.beads].reverse().slice(1); // avoid duplicating last bead
      return { ...pushHistory(s), beads: [...s.beads, ...reversed] };
    }),

  setString: (id) => set({ stringId: id }),
  setLength: (cm) => set({ customLengthCm: cm }),
  setViewMode: (m) => set({ viewMode: m }),
  setGender: (g) => set({ gender: g }),

  setPendant: (id) =>
    set((s) => ({ ...pushHistory(s), pendantId: id })),

  undo: () =>
    set((s) => {
      if (s.past.length === 0) return s;
      const prev = s.past[s.past.length - 1];
      return {
        past: s.past.slice(0, -1),
        future: [snapshot(s), ...s.future],
        beads: prev.beads,
        pendantId: prev.pendantId,
      };
    }),

  redo: () =>
    set((s) => {
      if (s.future.length === 0) return s;
      const next = s.future[0];
      return {
        past: [...s.past, snapshot(s)],
        future: s.future.slice(1),
        beads: next.beads,
        pendantId: next.pendantId,
      };
    }),

  loadDesign: (d) =>
    set((s) => ({
      productType: d.productType ?? s.productType,
      beads: d.beads ?? s.beads,
      pendantId: d.pendantId ?? null,
      stringId: d.stringId ?? s.stringId,
      customLengthCm: d.customLengthCm ?? null,
      past: [],
      future: [],
    })),
}));

export function defaultLengthCm(type: ProductType): number {
  if (type === "bracelet") return 18;
  if (type === "necklace") return 45;
  return 22;
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
  pendantId?: string | null,
): number {
  const beadCost = beadIds.reduce((sum, id) => {
    const b = BEADS.find((x) => x.id === id);
    return sum + (b?.price ?? 0);
  }, 0);
  const pendantCost = pendantId
    ? BEADS.find((x) => x.id === pendantId)?.price ?? 0
    : 0;
  const str = STRINGS.find((s) => s.id === stringId) ?? STRINGS[0];
  const stringCost = Math.round(lengthCm * str.pricePerCm);
  const labor = 5000;
  return beadCost + pendantCost + stringCost + labor;
}
