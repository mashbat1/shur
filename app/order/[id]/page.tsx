"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  fetchOrderStatus,
  getLocalOrder,
  Order,
  RemoteOrderStatus,
  SHEETS_CONFIGURED,
} from "@/lib/cart";

const STATUS_STEPS: { key: string; label: string }[] = [
  { key: "Хүлээгдэж буй",  label: "Хүлээгдэж байна" },
  { key: "Хүлээж авсан",   label: "Хүлээж авсан" },
  { key: "Эхэлсэн",        label: "Хийгдэж байна" },
  { key: "Хүргэлтэд",      label: "Хүргэлтэд гарсан" },
  { key: "Хүргэгдсэн",     label: "Хүргэгдсэн" },
];

export default function OrderTrackingPage({
  params,
}: {
  params: { id: string };
}) {
  const [remote, setRemote] = useState<RemoteOrderStatus | null>(null);
  const [local, setLocal] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setLocal(getLocalOrder(params.id));
    const r = await fetchOrderStatus(params.id);
    setRemote(r);
    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  const status = remote?.status ?? (local ? "Хүлээгдэж буй" : null);
  const currentStepIdx = STATUS_STEPS.findIndex((s) => s.key === status);
  const isCancelled = status === "Цуцалсан";

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            beeb<span className="text-accent">.</span>
          </Link>
          <Link href="/designer" className="text-xs text-muted hover:text-ink">
            ← Дизайнер
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-wide text-muted">
            Захиалгын дугаар
          </p>
          <h1 className="font-mono text-3xl font-bold">{params.id}</h1>
        </div>

        {loading ? (
          <div className="rounded-xl border border-line bg-panel p-8 text-center text-sm text-muted">
            Уншиж байна…
          </div>
        ) : !local && !remote?.ok ? (
          <div className="rounded-xl border border-line bg-panel p-8 text-center">
            <div className="mb-2 text-3xl">🔍</div>
            <h2 className="mb-2 text-lg font-semibold">Захиалга олдсонгүй</h2>
            <p className="mb-4 text-xs text-muted">
              {remote?.error ?? "Энэ ID-тай захиалга байхгүй эсвэл өөр browser/төхөөрөмжид хадгалагдсан."}
            </p>
            <Link
              href="/designer"
              className="text-xs text-accent hover:underline"
            >
              Шинэ загвар хийх →
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Status timeline */}
            <div className="rounded-xl border border-line bg-panel p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
                  Явц
                </h2>
                <button
                  onClick={load}
                  className="rounded-md border border-line px-2 py-1 text-[11px] text-muted hover:border-muted hover:text-ink"
                >
                  ↻ Шинэчлэх
                </button>
              </div>

              {isCancelled ? (
                <div className="rounded-md bg-red-500/10 p-4 text-center text-sm text-red-400">
                  Захиалга цуцлагдсан
                </div>
              ) : (
                <ol className="space-y-3">
                  {STATUS_STEPS.map((step, i) => {
                    const done = currentStepIdx >= 0 && i <= currentStepIdx;
                    const active = i === currentStepIdx;
                    return (
                      <li key={step.key} className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border text-[11px] font-bold transition ${
                            done
                              ? "border-accent bg-accent text-black"
                              : "border-line text-muted"
                          }`}
                        >
                          {done ? "✓" : i + 1}
                        </span>
                        <span
                          className={`text-sm ${
                            active
                              ? "font-semibold text-accent"
                              : done
                              ? "text-ink"
                              : "text-muted"
                          }`}
                        >
                          {step.label}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}

              {remote?.deliveryDate && (
                <div className="mt-5 rounded-md bg-accent/10 p-3 text-center text-xs text-accent">
                  Хүргэх огноо: <strong>{remote.deliveryDate}</strong>
                </div>
              )}
            </div>

            {/* Order details */}
            <div className="rounded-xl border border-line bg-panel p-6">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
                Дэлгэрэнгүй
              </h2>
              <dl className="space-y-2 text-xs">
                <Row label="Огноо">
                  {remote?.createdAt ?? formatLocalDate(local?.createdAt)}
                </Row>
                <Row label="Нэр">
                  {remote?.name ?? local?.customer.name ?? "—"}
                </Row>
                <Row label="Утас">
                  {remote?.phone ?? local?.customer.phone ?? "—"}
                </Row>
                <Row label="Бүтээгдэхүүн">
                  {remote?.summary ?? localSummary(local) ?? "—"}
                </Row>
                <Row label="Нийт ₮">
                  <span className="font-bold text-accent">
                    {(remote?.total ?? local?.total ?? 0).toLocaleString()}₮
                  </span>
                </Row>
              </dl>
            </div>

            {!SHEETS_CONFIGURED && (
              <div className="rounded-md border border-yellow-500/30 bg-yellow-500/10 p-3 text-[11px] text-yellow-400">
                ⚠ Google Sheets холбогдоогүй — Бодит явцыг харахын тулд{" "}
                <code>SHEETS_SETUP.md</code> зааврыг дагаарай.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line/50 py-1.5 last:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right text-ink">{children}</dd>
    </div>
  );
}

function formatLocalDate(s?: string): string {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("mn-MN");
  } catch {
    return s;
  }
}

function localSummary(o: Order | null): string | null {
  if (!o) return null;
  return o.items
    .map((it) => `${it.productType} (${it.beads.length} шурэг, ${it.lengthCm}см)`)
    .join("; ");
}
