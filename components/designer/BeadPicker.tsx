"use client";

import { BEADS } from "@/lib/beads";
import { useDesign } from "@/lib/designStore";

export default function BeadPicker() {
  const addBead = useDesign((s) => s.addBead);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-3">
        <h2 className="text-sm font-semibold text-ink">Шурээний каталог</h2>
        <p className="mt-0.5 text-xs text-muted">Дарж нэмнэ</p>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2 overflow-y-auto p-3">
        {BEADS.map((b) => (
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
