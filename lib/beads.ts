export type BeadShape =
  | "round"
  | "tube"
  | "cube"
  | "bicone"
  | "disc"
  | "heart"
  | "star"
  | "tassel";

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

  // Сонгодог чулууны нэмэлт хэмжээ + өнгө
  { id: "amber-10",      name: "Хув 10мм",        shape: "round",  color: "#d4a574", diameterMm: 10, price: 1100, roughness: 0.4 },
  { id: "amber-12",      name: "Хув 12мм",        shape: "round",  color: "#b8843e", diameterMm: 12, price: 1500, roughness: 0.4 },
  { id: "pearl-8",       name: "Сувд 8мм",        shape: "round",  color: "#f5f5f0", diameterMm: 8,  price: 1500, roughness: 0.15, metalness: 0.25 },
  { id: "pearl-black",   name: "Хар сувд 8мм",    shape: "round",  color: "#2a2a35", diameterMm: 8,  price: 1800, roughness: 0.18, metalness: 0.4 },
  { id: "pearl-pink",    name: "Ягаан сувд 8мм",  shape: "round",  color: "#f0d4d4", diameterMm: 8,  price: 1600, roughness: 0.18, metalness: 0.3 },
  { id: "jade-8",        name: "Хаш 8мм",         shape: "round",  color: "#5d8a6b", diameterMm: 8,  price: 1200, roughness: 0.3 },
  { id: "jade-12",       name: "Хаш 12мм",        shape: "round",  color: "#4a7058", diameterMm: 12, price: 2000, roughness: 0.3 },
  { id: "onyx-6",        name: "Хар оникс 6мм",   shape: "round",  color: "#0e0e0e", diameterMm: 6,  price: 700,  roughness: 0.18 },
  { id: "onyx-10",       name: "Хар оникс 10мм",  shape: "round",  color: "#0e0e0e", diameterMm: 10, price: 1300, roughness: 0.18 },
  { id: "coral-8",       name: "Шүр 8мм",         shape: "round",  color: "#d6584a", diameterMm: 8,  price: 1400, roughness: 0.45 },
  { id: "amethyst-8",    name: "Аметист",          shape: "round",  color: "#7a4ea3", diameterMm: 8,  price: 1500, roughness: 0.2 },
  { id: "citrine-8",     name: "Цитрин",           shape: "round",  color: "#e8b94a", diameterMm: 8,  price: 1300, roughness: 0.22 },
  { id: "emerald-8",     name: "Маргад 8мм",       shape: "round",  color: "#2e7a4f", diameterMm: 8,  price: 1900, roughness: 0.2 },
  { id: "crystal-clear", name: "Кристалл",         shape: "round",  color: "#e6f0f5", diameterMm: 8,  price: 1100, roughness: 0.05, metalness: 0.1 },
  { id: "moon-8",        name: "Сарны чулуу",      shape: "round",  color: "#b8c5d6", diameterMm: 8,  price: 1500, roughness: 0.2, metalness: 0.15 },
  { id: "tigereye-8",    name: "Барсын нүд",       shape: "round",  color: "#8a5a2b", diameterMm: 8,  price: 1200, roughness: 0.3, metalness: 0.2 },

  // Хэлбэрийн илүү олон сонголт
  { id: "tube-copper",   name: "Зэс труба",        shape: "tube",   color: "#b87333", diameterMm: 4, lengthMm: 10, price: 600, metalness: 0.85, roughness: 0.3 },
  { id: "bicone-blue",   name: "Хөх хошуут",       shape: "bicone", color: "#2a4d8f", diameterMm: 8, price: 800,  roughness: 0.2 },
  { id: "bicone-purple", name: "Ягаан хошуут",     shape: "bicone", color: "#7a3a8a", diameterMm: 8, price: 850,  roughness: 0.2 },
  { id: "bicone-green",  name: "Ногоон хошуут",    shape: "bicone", color: "#3a7a4a", diameterMm: 8, price: 800,  roughness: 0.2 },
  { id: "cube-onyx",     name: "Оникс шоо",        shape: "cube",   color: "#1a1a1a", diameterMm: 7, price: 800,  roughness: 0.25 },
  { id: "cube-pearl",    name: "Сувд шоо",         shape: "cube",   color: "#f0e6d4", diameterMm: 7, price: 1300, roughness: 0.2, metalness: 0.2 },
  { id: "disc-gold",     name: "Алтан хавтгай",   shape: "disc",   color: "#d4af37", diameterMm: 8, lengthMm: 2, price: 900, metalness: 0.85, roughness: 0.2 },
  { id: "disc-wood",     name: "Модон хавтгай",   shape: "disc",   color: "#8a5a2b", diameterMm: 9, lengthMm: 3, price: 400, roughness: 0.7 },
  { id: "wood-walnut",   name: "Хушын мод",        shape: "round",  color: "#5a3a1a", diameterMm: 10, price: 450, roughness: 0.8 },
  { id: "wood-light",    name: "Цайвар мод",       shape: "round",  color: "#c79a6a", diameterMm: 10, price: 450, roughness: 0.8 },

  // Pendants / charms — only for necklaces, hang from the front
  { id: "charm-heart-gold",  name: "Алтан зүрх",   shape: "heart",  color: "#d4af37", diameterMm: 14, price: 3500, metalness: 0.85, roughness: 0.2, pendant: true },
  { id: "charm-heart-rose",  name: "Сарнайн зүрх", shape: "heart",  color: "#c1272d", diameterMm: 14, price: 2500, roughness: 0.3, pendant: true },
  { id: "charm-star-silver", name: "Мөнгөн од",    shape: "star",   color: "#c8c8d0", diameterMm: 14, price: 3000, metalness: 0.85, roughness: 0.25, pendant: true },
  { id: "charm-star-gold",   name: "Алтан од",     shape: "star",   color: "#d4af37", diameterMm: 14, price: 3300, metalness: 0.9,  roughness: 0.2, pendant: true },

  // Цацаг / унжуурга
  { id: "tassel-red",    name: "Улаан цацаг",     shape: "tassel", color: "#c1272d", diameterMm: 14, lengthMm: 60, price: 2000, roughness: 0.7, pendant: true },
  { id: "tassel-gold",   name: "Алтан цацаг",     shape: "tassel", color: "#d4af37", diameterMm: 14, lengthMm: 60, price: 2800, metalness: 0.6, roughness: 0.4, pendant: true },
  { id: "tassel-blue",   name: "Хөх цацаг",       shape: "tassel", color: "#1e3a8a", diameterMm: 14, lengthMm: 60, price: 2000, roughness: 0.7, pendant: true },
  { id: "tassel-cream",  name: "Цэн цацаг",       shape: "tassel", color: "#f5e8c8", diameterMm: 14, lengthMm: 60, price: 1800, roughness: 0.7, pendant: true },
  { id: "tassel-black",  name: "Хар цацаг",       shape: "tassel", color: "#1a1a1a", diameterMm: 14, lengthMm: 60, price: 1900, roughness: 0.6, pendant: true },
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
