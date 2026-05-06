import { ProductType } from "./designStore";

export type Template = {
  id: string;
  name: string;
  description: string;
  productType: ProductType;
  beads: string[];
  pendantId: string | null;
  stringId: string;
  lengthCm: number;
};

export const TEMPLATES: Template[] = [
  {
    id: "classic-pearls",
    name: "Сонгодог сувд",
    description: "Гар уралдсан мэт жигд цагаан сувд + жижиг тусгаар",
    productType: "necklace",
    beads: Array(20)
      .fill(0)
      .flatMap(() => ["pearl-8", "spacer-blk"]),
    pendantId: null,
    stringId: "wire-silver",
    lengthCm: 45,
  },
  {
    id: "amber-bracelet",
    name: "Уламжлалт хуван бугуйвч",
    description: "Бүтэн хуван чулуу — уламжлалт ариун шинж",
    productType: "bracelet",
    beads: Array(11).fill("amber-8"),
    pendantId: null,
    stringId: "elastic-clear",
    lengthCm: 18,
  },
  {
    id: "jade-gold",
    name: "Хаш + алт",
    description: "Хаш чулуу алтан труба, мөнгөн утсаар",
    productType: "bracelet",
    beads: ["jade-10", "tube-gold", "jade-10", "tube-gold", "jade-10", "tube-gold", "jade-10", "tube-gold", "jade-10"],
    pendantId: null,
    stringId: "wire-silver",
    lengthCm: 18,
  },
  {
    id: "rainbow",
    name: "Солонго",
    description: "Олон өнгийн чулуу — баяр баясгалантай",
    productType: "bracelet",
    beads: [
      "garnet-8", "amber-8", "citrine-8", "emerald-8", "turq-8",
      "lapis-8", "amethyst-8", "rose-8", "garnet-8", "amber-8",
    ],
    pendantId: null,
    stringId: "elastic-clear",
    lengthCm: 18,
  },
  {
    id: "black-gold-elegant",
    name: "Хар + алт",
    description: "Хар оникс + алтан хавтгай — хатуу дүр",
    productType: "necklace",
    beads: Array(15)
      .fill(0)
      .flatMap(() => ["onyx-8", "disc-gold", "onyx-8"]),
    pendantId: "charm-heart-gold",
    stringId: "cord-black",
    lengthCm: 45,
  },
  {
    id: "rose-romance",
    name: "Сарнай романтик",
    description: "Сарнайн чулуу + ягаан сувд + сарнайн зүрх",
    productType: "necklace",
    beads: [
      "pearl-pink", "rose-8", "pearl-pink", "rose-8", "pearl-pink",
      "rose-8", "pearl-pink", "rose-8", "pearl-pink", "rose-8",
      "pearl-pink", "rose-8", "pearl-pink", "rose-8", "pearl-pink",
    ],
    pendantId: "charm-heart-rose",
    stringId: "leather-brown",
    lengthCm: 50,
  },
  {
    id: "lapis-statement",
    name: "Лапис статемент",
    description: "Хөх лапис + мөнгөн труба + одтой чимэг",
    productType: "necklace",
    beads: ["lapis-8", "tube-silver", "lapis-8", "tube-silver", "lapis-8", "tube-silver", "lapis-8", "tube-silver", "lapis-8", "tube-silver", "lapis-8", "tube-silver", "lapis-8", "tube-silver", "lapis-8"],
    pendantId: "charm-star-silver",
    stringId: "wire-silver",
    lengthCm: 50,
  },
  {
    id: "wood-zen",
    name: "Модон Zen",
    description: "Хушын мод + цайвар мод — байгалийн хосолсон",
    productType: "bracelet",
    beads: [
      "wood-walnut", "wood-light", "wood-walnut", "wood-light",
      "wood-walnut", "wood-light", "wood-walnut", "wood-light",
      "wood-walnut",
    ],
    pendantId: null,
    stringId: "leather-brown",
    lengthCm: 18,
  },
  {
    id: "tassel-strap",
    name: "Цацагтай оосор",
    description: "Алтан труба + улаан цацаг — амжилт хувийн оосор",
    productType: "phone_strap",
    beads: ["tube-gold", "amber-8", "tube-gold", "amber-8", "tube-gold", "amber-8", "tube-gold"],
    pendantId: "tassel-red",
    stringId: "cord-black",
    lengthCm: 22,
  },
  {
    id: "moonlight",
    name: "Сарны гэрэл",
    description: "Сарны чулуу + кристалл + хөх цацаг",
    productType: "necklace",
    beads: [
      "moon-8", "crystal-clear", "moon-8", "crystal-clear", "moon-8",
      "crystal-clear", "moon-8", "crystal-clear", "moon-8",
      "crystal-clear", "moon-8", "crystal-clear", "moon-8",
    ],
    pendantId: "tassel-blue",
    stringId: "wire-silver",
    lengthCm: 50,
  },
  {
    id: "tigereye-strong",
    name: "Барсын нүд",
    description: "Эрэгтэйчүүдэд зориулсан хүчтэй дүр",
    productType: "bracelet",
    beads: Array(11).fill("tigereye-8"),
    pendantId: null,
    stringId: "leather-brown",
    lengthCm: 19,
  },
  {
    id: "pastel-pearls",
    name: "Pastel сувд",
    description: "Цэн + ягаан сувд + жижиг харын тусгаар",
    productType: "necklace",
    beads: [
      "pearl-8", "pearl-pink", "spacer-blk", "pearl-8", "pearl-pink", "spacer-blk",
      "pearl-8", "pearl-pink", "spacer-blk", "pearl-8", "pearl-pink", "spacer-blk",
      "pearl-8", "pearl-pink", "spacer-blk", "pearl-8", "pearl-pink",
    ],
    pendantId: "tassel-cream",
    stringId: "wire-silver",
    lengthCm: 45,
  },
];
