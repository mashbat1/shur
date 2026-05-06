"use client";

import { useEffect, useMemo, useState } from "react";
import { Bead, BeadShape, getAllBeads } from "@/lib/beads";
import { useDesign } from "@/lib/designStore";

const SHAPE_FILTERS: { id: BeadShape | "all"; label: string }[] = [
  { id: "all", label: "Бүгд" },
  { id: "round", label: "Бөмбөлөг" },
  { id: "tube", label: "Труба" },
  { id: "cube", label: "Шоо" },
  { id: "bicone", label: "Хошуут" },
  { id: "disc", label: "Хавтгай" },
];

export default function BeadPicker() {
  const addBead = useDesign((s) => s.addBead);
  const [query, setQuery] = useState("");
  const [shape, setShape] = useState<BeadShape | "all">("all");
  const [allBeads, setAllBeads] = useState<Bead[]>([]);

  useEffect(() => {
    const refresh = () => setAllBeads(getAllBeads());
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allBeads
      .filter((b) => !b.pendant)
      .filter((b) => {
        if (shape !== "all" && b.shape !== shape) return false;
        if (q && !b.name.toLowerCase().includes(q)) return false;
        return true;
      });
  }, [allBeads, query, shape]);

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <div className="sticky top-0 z-10 border-b border-line bg-panel p-3">
        <h2 className="text-sm font-semibold text-ink">Шурээний каталог</h2>
        <p className="mt-0.5 text-xs text-muted">Дарж нэмнэ</p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Хайх…"
          className="mt-2 w-full rounded-md border border-line bg-bg px-2 py-1.5 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none"
        />
        <div className="mt-2 flex flex-wrap gap-1">
          {SHAPE_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setShape(f.id)}
              className={`rounded-full border px-2 py-0.5 text-[10px] transition ${
                shape === f.id
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line text-muted hover:border-muted hover:text-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-3">
        {filtered.length === 0 && (
          <div className="col-span-2 py-6 text-center text-xs text-muted">
            Олдсонгүй
          </div>
        )}
        {filtered.map((b) => (
          <button
            key={b.id}
            onClick={() => addBead(b.id)}
            className="group flex flex-col items-center gap-1 rounded-lg border border-line bg-bg p-2 text-left transition hover:border-accent"
          >
            <div
              className="h-12 w-12 rounded-full shadow-inner ring-1 ring-black/40"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${lighten(b.color, 0.25)}, ${b.color} 60%, ${darken(b.color, 0.2)})`,
              }}
            />
            <div className="w-full text-center">
              <div className="truncate text-[11px] font-medium text-ink">
                {b.name}
              </div>
              <div className="text-[10px] text-muted">
                {b.price.toLocaleString()}₮
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function clampHex(n: number) {
  return Math.max(0, Math.min(255, Math.round(n)));
}
function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace("#", "");
  const n = parseInt(v.length === 3 ? v.split("").map((c) => c + c).join("") : v, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((x) => clampHex(x).toString(16).padStart(2, "0")).join("");
}
function lighten(hex: string, amt: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r + (255 - r) * amt, g + (255 - g) * amt, b + (255 - b) * amt);
}
function darken(hex: string, amt: number) {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(r * (1 - amt), g * (1 - amt), b * (1 - amt));
}
