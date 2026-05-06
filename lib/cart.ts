import { ProductType } from "./designStore";

export type CartItem = {
  id: string;
  productType: ProductType;
  beads: string[];
  pendantId: string | null;
  stringId: string;
  lengthCm: number;
  price: number;
  createdAt: string;
};

const CART_KEY = "beeb.cart";
const ORDERS_KEY = "beeb.orders";

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  customer: { name: string; phone: string; address: string };
  status: "pending" | "paid" | "making" | "shipped" | "done";
  createdAt: string;
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new StorageEvent("storage", { key }));
}

export function getCart(): CartItem[] {
  return read<CartItem[]>(CART_KEY, []);
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  cart.push(item);
  write(CART_KEY, cart);
}

export function removeFromCart(id: string): void {
  write(CART_KEY, getCart().filter((i) => i.id !== id));
}

export function clearCart(): void {
  write(CART_KEY, []);
}

export function getOrders(): Order[] {
  return read<Order[]>(ORDERS_KEY, []);
}

export function placeOrder(
  items: CartItem[],
  customer: Order["customer"],
): Order {
  const order: Order = {
    id: `o_${Date.now()}`,
    items,
    total: items.reduce((s, i) => s + i.price, 0),
    customer,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  const all = getOrders();
  all.push(order);
  write(ORDERS_KEY, all);
  clearCart();
  return order;
}
