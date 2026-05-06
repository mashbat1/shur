"use client";

import Link from "next/link";
import { TEMPLATES, Template } from "@/lib/templates";
import { getBead } from "@/lib/beads";
import { STRINGS, totalPrice } from "@/lib/designStore";
import { encodeDesign } from "@/lib/share";

const PRODUCT_LABELS: Record<string, string> = {
  bracelet: "Бугуйвч",
  necklace: "Зүүлт",
  phone_strap: "Утасны оосор",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            beeb<span className="text-accent">.</span>
          </Link>
          <Link href="/designer" className="text-xs text-muted hover:text-ink">
            ← Дизайнер
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-1 text-2xl font-bold">Бэлэн загварууд</h1>
        <p className="mb-8 text-sm text-muted">
          Дуртайгаа сонгож, өөрийнхөөрөө засаарай.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TEMPLATES.map((tpl) => (
            <TemplateCard key={tpl.id} tpl={tpl} />
          ))}
        </div>
      </div>
    </main>
  );
}

function TemplateCard({ tpl }: { tpl: Template }) {
  const beads = tpl.beads.map((id) => getBead(id)).filter(Boolean);
  const stringMat = STRINGS.find((s) => s.id === tpl.stringId);
  const pendant = tpl.pendantId ? getBead(tpl.pendantId) : null;
  const price = totalPrice(tpl.beads, tpl.stringId, tpl.lengthCm, tpl.pendantId);

  // Build the share-link hash so clicking goes straight to the designer with this design loaded
  const hash = encodeDesign({
    t: tpl.productType,
    b: tpl.beads,
    p: tpl.pendantId,
    s: tpl.stringId,
    l: tpl.lengthCm,
  });

  return (
    <Link
      href={`/designer#${hash}`}
      className="group flex flex-col gap-3 rounded-xl border border-line bg-panel p-4 transition hover:border-accent"
    >
      <div className="flex flex-wrap items-center gap-1 rounded-md bg-bg p-3">
        {beads.slice(0, 24).map((b, i) => (
          <span
            key={i}
            title={b!.name}
            className="block h-5 w-5 flex-shrink-0 rounded-full ring-1 ring-black/40"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${b!.color}dd, ${b!.color})`,
            }}
          />
        ))}
        {beads.length > 24 && (
          <span className="text-[10px] text-muted">+{beads.length - 24}</span>
        )}
        {pendant && (
          <span
            title={pendant.name}
            className="ml-1 block h-6 w-6 flex-shrink-0 rounded-full ring-2 ring-accent/60"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${pendant.color}dd, ${pendant.color})`,
            }}
          />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-line px-2 py-0.5 text-[10px] uppercase tracking-wide text-muted">
            {PRODUCT_LABELS[tpl.productType] ?? tpl.productType}
          </span>
          <span className="text-[10px] text-muted">
            {tpl.lengthCm}см · {stringMat?.name ?? ""}
          </span>
        </div>
        <h3 className="mt-2 text-sm font-semibold text-ink group-hover:text-accent">
          {tpl.name}
        </h3>
        <p className="mt-1 text-xs text-muted">{tpl.description}</p>
      </div>

      <div className="flex items-baseline justify-between border-t border-line pt-3">
        <span className="text-[10px] uppercase tracking-wide text-muted">
          Үнэ
        </span>
        <span className="text-base font-bold text-accent">
          {price.toLocaleString()}₮
        </span>
      </div>
    </Link>
  );
}
