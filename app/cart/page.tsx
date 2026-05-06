"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  CartItem,
  Order,
  getCart,
  removeFromCart,
  placeOrder,
} from "@/lib/cart";
import { getBead } from "@/lib/beads";
import { STRINGS } from "@/lib/designStore";

const PRODUCT_LABELS: Record<string, string> = {
  bracelet: "Бугуйвч",
  necklace: "Зүүлт",
  phone_strap: "Утасны оосор",
};

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [confirmed, setConfirmed] = useState<Order | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "" });

  useEffect(() => {
    setCart(getCart());
    const onStorage = () => setCart(getCart());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function handleRemove(id: string) {
    removeFromCart(id);
    setCart(getCart());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return;
    const order = placeOrder(cart, form);
    setConfirmed(order);
    setCart([]);
  }

  const total = cart.reduce((s, i) => s + i.price, 0);

  if (confirmed) {
    return (
      <main className="mx-auto max-w-xl px-6 py-16">
        <div className="rounded-xl border border-line bg-panel p-8 text-center">
          <div className="mb-4 text-5xl">✓</div>
          <h1 className="mb-2 text-2xl font-bold">Захиалга баталгаажлаа</h1>
          <p className="mb-1 text-sm text-muted">
            Захиалгын дугаар: <span className="font-mono text-ink">{confirmed.id}</span>
          </p>
          <p className="mb-6 text-sm text-muted">
            Нийт: <span className="font-bold text-accent">{confirmed.total.toLocaleString()}₮</span>
          </p>
          <p className="mb-6 text-xs text-muted">
            Бид удахгүй <span className="text-ink">{confirmed.customer.phone}</span> утсаар холбогдоно.
          </p>
          <Link
            href="/designer"
            className="inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black hover:brightness-110"
          >
            Шинэ загвар хийх
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            beeb<span className="text-accent">.</span>
          </Link>
          <Link href="/designer" className="text-xs text-muted hover:text-ink">
            ← Дизайнер руу буцах
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-bold">Сагс</h1>

        {cart.length === 0 ? (
          <div className="rounded-xl border border-line bg-panel p-10 text-center text-sm text-muted">
            Сагс хоосон байна.{" "}
            <Link href="/designer" className="text-accent hover:underline">
              Дизайн хийж эхлэх →
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-[1fr_360px]">
            <div className="space-y-3">
              {cart.map((it) => {
                const str = STRINGS.find((s) => s.id === it.stringId);
                const pendant = it.pendantId ? getBead(it.pendantId) : null;
                return (
                  <div
                    key={it.id}
                    className="flex items-start gap-4 rounded-lg border border-line bg-panel p-4"
                  >
                    <div className="flex flex-wrap gap-1">
                      {it.beads.slice(0, 12).map((id, i) => {
                        const b = getBead(id);
                        if (!b) return null;
                        return (
                          <span
                            key={i}
                            title={b.name}
                            className="block h-5 w-5 rounded-full ring-1 ring-black/40"
                            style={{
                              background: `radial-gradient(circle at 30% 30%, ${b.color}dd, ${b.color})`,
                            }}
                          />
                        );
                      })}
                      {it.beads.length > 12 && (
                        <span className="text-[10px] text-muted">
                          +{it.beads.length - 12}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold">
                        {PRODUCT_LABELS[it.productType] ?? it.productType}
                      </div>
                      <div className="text-xs text-muted">
                        {it.beads.length} шурэг · {it.lengthCm}см ·{" "}
                        {str?.name ?? it.stringId}
                        {pendant ? ` · ${pendant.name}` : ""}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-accent">
                        {it.price.toLocaleString()}₮
                      </div>
                      <button
                        onClick={() => handleRemove(it.id)}
                        className="mt-1 text-[11px] text-muted hover:text-red-400"
                      >
                        Устгах
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <form
              onSubmit={handleSubmit}
              className="h-fit space-y-3 rounded-xl border border-line bg-panel p-5"
            >
              <h2 className="text-sm font-semibold">Захиалгын мэдээлэл</h2>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Нэр"
                className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Утасны дугаар"
                className="w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <textarea
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Хүргэлтийн хаяг"
                rows={3}
                className="w-full resize-none rounded-md border border-line bg-bg px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none"
              />
              <div className="flex items-baseline justify-between border-t border-line pt-3">
                <span className="text-xs uppercase tracking-wide text-muted">
                  Нийт
                </span>
                <span className="text-xl font-bold text-accent">
                  {total.toLocaleString()}₮
                </span>
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-accent py-2.5 text-sm font-bold text-black transition hover:brightness-110"
              >
                Захиалга өгөх
              </button>
              <p className="text-[10px] text-muted">
                * Туршилтын горим — бодит төлбөр аваагүй
              </p>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
