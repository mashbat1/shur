"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useDesign,
  STRINGS,
  defaultLengthCm,
  totalPrice,
  ProductType,
  Gender,
  EnvPreset,
} from "@/lib/designStore";
import { PENDANT_BEADS } from "@/lib/beads";
import { addToCart } from "@/lib/cart";
import { downloadCanvasPng, encodeDesign } from "@/lib/share";

const PRODUCT_LABELS: Record<ProductType, string> = {
  bracelet: "Бугуйвч",
  necklace: "Зүүлт",
  phone_strap: "Утасны оосор",
};

const GENDER_LABELS: Record<Gender, string> = {
  female: "Эмэгтэй",
  male: "Эрэгтэй",
};

const ENV_LABELS: Record<EnvPreset, string> = {
  studio: "Студи",
  city: "Хот",
  sunset: "Үдэш",
  apartment: "Орон сууц",
  warehouse: "Агуулах",
  park: "Парк",
};

export default function DesignControls() {
  const router = useRouter();
  const {
    productType,
    setProductType,
    stringId,
    setString,
    customLengthCm,
    setLength,
    beads,
    pendantId,
    setPendant,
    clear,
    viewMode,
    setViewMode,
    gender,
    setGender,
    envPreset,
    setEnvPreset,
  } = useDesign();

  const lengthCm = customLengthCm ?? defaultLengthCm(productType);
  const price = totalPrice(beads, stringId, lengthCm, pendantId);

  const [shareMsg, setShareMsg] = useState<string | null>(null);

  async function handleShare() {
    const hash = encodeDesign({
      t: productType,
      b: beads,
      p: pendantId,
      s: stringId,
      l: customLengthCm ?? undefined,
    });
    const url = `${window.location.origin}/designer#${hash}`;
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg("Линк хууллаа ✓");
    } catch {
      setShareMsg(url);
    }
    setTimeout(() => setShareMsg(null), 2500);
  }

  function handleAddToCart() {
    addToCart({
      id: `d_${Date.now()}`,
      productType,
      beads: [...beads],
      pendantId: pendantId ?? null,
      stringId,
      lengthCm,
      price,
      createdAt: new Date().toISOString(),
    });
    router.push("/cart");
  }

  // Reset pendant when switching away from necklace
  useEffect(() => {
    if (productType !== "necklace" && pendantId) setPendant(null);
  }, [productType, pendantId, setPendant]);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-y-auto p-4">
      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
          Бүтээгдэхүүн
        </label>
        <div className="grid grid-cols-3 gap-1">
          {(Object.keys(PRODUCT_LABELS) as ProductType[]).map((t) => (
            <button
              key={t}
              onClick={() => setProductType(t)}
              className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
                productType === t
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line bg-bg text-ink hover:border-muted"
              }`}
            >
              {PRODUCT_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
          Утас
        </label>
        <div className="space-y-1">
          {STRINGS.map((s) => (
            <button
              key={s.id}
              onClick={() => setString(s.id)}
              className={`flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition ${
                stringId === s.id
                  ? "border-accent bg-accent/10"
                  : "border-line bg-bg hover:border-muted"
              }`}
            >
              <span
                className="h-3 w-3 rounded-full ring-1 ring-black/30"
                style={{ background: s.color }}
              />
              <span className="flex-1 text-ink">{s.name}</span>
              <span className="text-muted">{s.pricePerCm}₮/см</span>
            </button>
          ))}
        </div>
      </div>

      {productType === "necklace" && (
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
            Зүүлтийн чимэг
          </label>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => setPendant(null)}
              className={`rounded-md border px-2 py-2 text-[11px] transition ${
                !pendantId
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line bg-bg text-ink hover:border-muted"
              }`}
            >
              Чимэггүй
            </button>
            {PENDANT_BEADS.map((c) => (
              <button
                key={c.id}
                onClick={() => setPendant(c.id)}
                title={`${c.name} — ${c.price.toLocaleString()}₮`}
                className={`flex flex-col items-center gap-0.5 rounded-md border px-1 py-1.5 transition ${
                  pendantId === c.id
                    ? "border-accent bg-accent/10"
                    : "border-line bg-bg hover:border-muted"
                }`}
              >
                <span
                  className="h-5 w-5 rounded-full ring-1 ring-black/30"
                  style={{ background: c.color }}
                />
                <span className="truncate text-[10px] text-ink">{c.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
          Харах горим
        </label>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setViewMode("alone")}
            className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
              viewMode === "alone"
                ? "border-accent bg-accent/10 text-accent"
                : "border-line bg-bg text-ink hover:border-muted"
            }`}
          >
            Зөвхөн загвар
          </button>
          <button
            onClick={() => setViewMode("on_body")}
            className={`rounded-md border px-2 py-2 text-xs font-medium transition ${
              viewMode === "on_body"
                ? "border-accent bg-accent/10 text-accent"
                : "border-line bg-bg text-ink hover:border-muted"
            }`}
          >
            Бие дээр
          </button>
        </div>
        {viewMode === "on_body" && (
          <>
            <div className="mt-2 grid grid-cols-2 gap-1">
              {(Object.keys(GENDER_LABELS) as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`rounded-md border px-2 py-1.5 text-[11px] transition ${
                    gender === g
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-line bg-bg text-ink hover:border-muted"
                  }`}
                >
                  {GENDER_LABELS[g]}
                </button>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-1">
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("zoom-preset", { detail: "fit" }),
                  )
                }
                className="rounded-md border border-line bg-bg px-2 py-1.5 text-[11px] text-ink transition hover:border-muted"
              >
                Бүтэн биеэр
              </button>
              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("zoom-preset", { detail: "close" }),
                  )
                }
                className="rounded-md border border-line bg-bg px-2 py-1.5 text-[11px] text-ink transition hover:border-muted"
              >
                Ойрхон
              </button>
            </div>
          </>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-muted">
          Орчны гэрэлтүүлэг
        </label>
        <select
          value={envPreset}
          onChange={(e) => setEnvPreset(e.target.value as EnvPreset)}
          className="w-full rounded-md border border-line bg-bg px-2 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
        >
          {(Object.keys(ENV_LABELS) as EnvPreset[]).map((p) => (
            <option key={p} value={p}>
              {ENV_LABELS[p]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-muted">
            Урт
          </label>
          <span className="text-sm font-semibold text-ink">{lengthCm}см</span>
        </div>
        <input
          type="range"
          min={productType === "bracelet" ? 14 : productType === "necklace" ? 35 : 15}
          max={productType === "bracelet" ? 22 : productType === "necklace" ? 65 : 30}
          step={0.5}
          value={lengthCm}
          onChange={(e) => setLength(parseFloat(e.target.value))}
          className="w-full accent-accent"
        />
        <button
          onClick={() => setLength(null)}
          className="mt-1 text-[11px] text-muted underline-offset-2 hover:text-accent hover:underline"
        >
          анхны хэмжээ
        </button>
      </div>

      <div className="grid grid-cols-2 gap-1">
        <button
          onClick={() => downloadCanvasPng()}
          disabled={beads.length === 0}
          className="rounded-md border border-line py-2 text-[11px] font-medium text-ink transition hover:border-muted disabled:opacity-40"
        >
          📷 Зураг татах
        </button>
        <button
          onClick={handleShare}
          disabled={beads.length === 0}
          className="rounded-md border border-line py-2 text-[11px] font-medium text-ink transition hover:border-muted disabled:opacity-40"
        >
          🔗 Линк хуваалцах
        </button>
      </div>
      {shareMsg && (
        <div className="rounded-md bg-accent/15 px-2 py-1 text-center text-[11px] text-accent">
          {shareMsg}
        </div>
      )}

      <div className="mt-auto rounded-lg border border-line bg-bg p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wide text-muted">Нийт</span>
          <span className="text-2xl font-bold text-accent">
            {price.toLocaleString()}₮
          </span>
        </div>
        <div className="mt-1 text-[11px] text-muted">
          {beads.length} ширхэг шурэг
          {pendantId ? " + чимэг" : ""} + утас + ажлын хөлс
        </div>

        <div className="mt-3 flex gap-2">
          <button
            onClick={clear}
            disabled={beads.length === 0}
            className="flex-1 rounded-md border border-line py-2 text-xs font-medium text-ink transition hover:border-muted disabled:opacity-40"
          >
            Цэвэрлэх
          </button>
          <button
            onClick={handleAddToCart}
            disabled={beads.length === 0}
            className="flex-1 rounded-md bg-accent py-2 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-40"
          >
            Сагсанд хийх
          </button>
        </div>
      </div>
    </div>
  );
}
