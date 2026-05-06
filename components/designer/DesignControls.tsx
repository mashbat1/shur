"use client";

import {
  useDesign,
  STRINGS,
  defaultLengthCm,
  totalPrice,
  ProductType,
} from "@/lib/designStore";

const PRODUCT_LABELS: Record<ProductType, string> = {
  bracelet: "Бугуйвч",
  necklace: "Зүүлт",
  phone_strap: "Утасны оосор",
};

export default function DesignControls() {
  const {
    productType,
    setProductType,
    stringId,
    setString,
    customLengthCm,
    setLength,
    beads,
    clear,
  } = useDesign();

  const lengthCm = customLengthCm ?? defaultLengthCm(productType);
  const price = totalPrice(beads, stringId, lengthCm);

  return (
    <div className="flex h-full flex-col gap-4 p-4">
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

      <div className="mt-auto rounded-lg border border-line bg-bg p-3">
        <div className="flex items-baseline justify-between">
          <span className="text-xs uppercase tracking-wide text-muted">Нийт</span>
          <span className="text-2xl font-bold text-accent">
            {price.toLocaleString()}₮
          </span>
        </div>
        <div className="mt-1 text-[11px] text-muted">
          {beads.length} ширхэг шурэг + утас + ажлын хөлс
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
