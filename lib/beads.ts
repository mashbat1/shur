export type BeadShape = "round" | "tube" | "cube" | "bicone" | "disc" | "heart" | "star";

export type Bead = {
  id: string;
  name: string;
  shape: BeadShape;
  color: string;
  diameterMm: number;
  lengthMm?: number;
  price: number;
  metalness?: number;
  roughness?: number;
  pendant?: boolean; // hangs from the front of a necklace
};

export const BEADS: Bead[] = [
  { id: "amber-8",     name: "Хув 8мм",      shape: "round",  color: "#d4a574", diameterMm: 8,  price: 800,  roughness: 0.4 },
  { id: "ivory-8",     name: "Цэн 8мм",      shape: "round",  color: "#f0e6d2", diameterMm: 8,  price: 700,  roughness: 0.5 },
  { id: "onyx-8",      name: "Хар оникс 8мм", shape: "round",  color: "#1a1a1a", diameterMm: 8,  price: 1000, roughness: 0.2 },
  { id: "jade-10",     name: "Хаш 10мм",     shape: "round",  color: "#5d8a6b", diameterMm: 10, price: 1500, roughness: 0.3 },
  { id: "pearl-6",     name: "Сувд 6мм",     shape: "round",  color: "#f5f5f0", diameterMm: 6,  price: 1200, roughness: 0.15, metalness: 0.2 },
  { id: "garnet-8",    name: "Бадмаараг 8мм", shape: "round",  color: "#7a1f24", diameterMm: 8,  price: 1300, roughness: 0.25 },
  { id: "lapis-8",     name: "Хөх лапис 8мм", shape: "round",  color: "#1e3a8a", diameterMm: 8,  price: 1400, roughness: 0.3 },
  { id: "turq-8",      name: "Бирюз 8мм",    shape: "round",  color: "#2a9d8f", diameterMm: 8,  price: 1100, roughness: 0.4 },
  { id: "rose-8",      name: "Сарнайн чулуу", shape: "round",  color: "#e9a4b1", diameterMm: 8,  price: 900,  roughness: 0.3 },
  { id: "tube-silver", name: "Мөнгөн труба",  shape: "tube",   color: "#c8c8d0", diameterMm: 4, lengthMm: 10, price: 600, metalness: 0.85, roughness: 0.25 },
  { id: "tube-gold",   name: "Алтан труба",   shape: "tube",   color: "#d4af37", diameterMm: 4, lengthMm: 10, price: 700, metalness: 0.9, roughness: 0.2 },
  { id: "cube-wood",   name: "Модон шоо",    shape: "cube",   color: "#6b4423", diameterMm: 8,  price: 500,  roughness: 0.8 },
  { id: "bicone-red",  name: "Улаан хошуут",  shape: "bicone", color: "#c1272d", diameterMm: 8,  price: 800,  roughness: 0.2 },
  { id: "disc-shell",  name: "Дун чулуу",     shape: "disc",   color: "#fff8e7", diameterMm: 10, lengthMm: 3,  price: 600,  roughness: 0.4 },
  { id: "spacer-blk",  name: "Хар тусгаар",   shape: "disc",   color: "#0a0a0a", diameterMm: 6,  lengthMm: 2,  price: 300,  roughness: 0.3 },
  // Pendants / charms — only for necklaces, hang from the front
  { id: "charm-heart-gold", name: "Алтан зүрх", shape: "heart", color: "#d4af37", diameterMm: 14, price: 3500, metalness: 0.85, roughness: 0.2, pendant: true },
  { id: "charm-heart-rose", name: "Сарнайн зүрх", shape: "heart", color: "#c1272d", diameterMm: 14, price: 2500, roughness: 0.3, pendant: true },
  { id: "charm-star-silver", name: "Мөнгөн од",   shape: "star",  color: "#c8c8d0", diameterMm: 14, price: 3000, metalness: 0.85, roughness: 0.25, pendant: true },
  { id: "charm-star-gold",   name: "Алтан од",    shape: "star",  color: "#d4af37", diameterMm: 14, price: 3300, metalness: 0.9, roughness: 0.2, pendant: true },
];

const ADMIN_KEY = "beeb.adminBeads";

function readAdminBeads(): Bead[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ADMIN_KEY);
    return raw ? (JSON.parse(raw) as Bead[]) : [];
  } catch {
    return [];
  }
}

export function writeAdminBeads(beads: Bead[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ADMIN_KEY, JSON.stringify(beads));
  window.dispatchEvent(new StorageEvent("storage", { key: ADMIN_KEY }));
}

export function getAdminBeads(): Bead[] {
  return readAdminBeads();
}

// All beads = built-in + admin-added (admin can override by id)
export function getAllBeads(): Bead[] {
  const admin = readAdminBeads();
  const adminIds = new Set(admin.map((b) => b.id));
  return [...BEADS.filter((b) => !adminIds.has(b.id)), ...admin];
}

export const CATALOG_BEADS = BEADS.filter((b) => !b.pendant);
export const PENDANT_BEADS = BEADS.filter((b) => b.pendant);

export function getBead(id: string): Bead | undefined {
  const built = BEADS.find((b) => b.id === id);
  if (built) return built;
  if (typeof window === "undefined") return undefined;
  return readAdminBeads().find((b) => b.id === id);
}

export function beadAxialSize(b: Bead): number {
  if (b.shape === "tube" || b.shape === "disc") return b.lengthMm ?? b.diameterMm;
  return b.diameterMm;
}
