"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getOrders, Order } from "@/lib/cart";

const PRODUCT_LABELS: Record<string, string> = {
  bracelet: "Бугуйвч",
  necklace: "Зүүлт",
  phone_strap: "Утасны оосор",
};

export default function OrdersListPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  function refresh() {
    // newest first
    setOrders([...getOrders()].reverse());
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            beeb<span className="text-accent">.</span>
          </Link>
          <Link href="/designer" className="text-xs text-muted hover:text-ink">
            ← Дизайнер
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="mb-1 text-2xl font-bold">Миний захиалгууд</h1>
        <p className="mb-6 text-xs text-muted">
          Энэ browser-т хадгалагдсан захиалгууд. Тодорхой захиалга дээр дарж явцыг харна.
        </p>

        {orders.length === 0 ? (
          <div className="rounded-xl border border-line bg-panel p-10 text-center text-sm text-muted">
            Одоогоор захиалга алга.{" "}
            <Link href="/designer" className="text-accent hover:underline">
              Дизайн хийж эхлэх →
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.map((o) => {
              const summary = o.items
                .map(
                  (it) =>
                    `${PRODUCT_LABELS[it.productType] ?? it.productType} (${it.beads.length} шурэг)`,
                )
                .join(", ");
              return (
                <Link
                  key={o.id}
                  href={`/order/${o.id}`}
                  className="flex items-center justify-between gap-4 rounded-lg border border-line bg-panel p-4 transition hover:border-accent"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-ink">
                        {o.id}
                      </span>
                      <span className="text-[10px] text-muted">
                        {formatDate(o.createdAt)}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted">
                      {summary}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted">
                      {o.customer.name} · {o.customer.phone}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-base font-bold text-accent">
                      {o.total.toLocaleString()}₮
                    </span>
                    <span className="text-[10px] text-accent/80">
                      Явцыг харах →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function formatDate(s: string): string {
  try {
    return new Date(s).toLocaleString("mn-MN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
}
