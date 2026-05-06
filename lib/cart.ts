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

export type RemoteOrderStatus = {
  ok: boolean;
  id?: string;
  createdAt?: string;
  name?: string;
  phone?: string;
  summary?: string;
  total?: number;
  status?: string;
  deliveryDate?: string | null;
  error?: string;
};

export const SHEETS_URL = process.env.NEXT_PUBLIC_SHEETS_URL ?? "";
export const SHEETS_CONFIGURED = SHEETS_URL.length > 0;

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

function shortId(): string {
  // Short, human-shareable ID like BB-AB12CD
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `BB-${stamp}`;
}

export async function placeOrder(
  items: CartItem[],
  customer: Order["customer"],
): Promise<Order> {
  const order: Order = {
    id: shortId(),
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

  // Best-effort sync to Google Sheet (non-blocking failure)
  if (SHEETS_CONFIGURED) {
    try {
      await fetch(SHEETS_URL, {
        method: "POST",
        // Simple request → no preflight; Apps Script reads e.postData.contents
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(order),
      });
    } catch (err) {
      console.error("Sheet sync failed:", err);
    }
  }

  return order;
}

export async function fetchOrderStatus(id: string): Promise<RemoteOrderStatus | null> {
  if (!SHEETS_CONFIGURED) return null;
  try {
    const r = await fetch(`${SHEETS_URL}?id=${encodeURIComponent(id)}`);
    if (!r.ok) return null;
    return (await r.json()) as RemoteOrderStatus;
  } catch (err) {
    console.error("Fetch order status failed:", err);
    return null;
  }
}

export function getLocalOrder(id: string): Order | null {
  return getOrders().find((o) => o.id === id) ?? null;
}
