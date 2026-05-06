"use client";

import { useDesign } from "@/lib/designStore";
import { getBead } from "@/lib/beads";

export default function Timeline() {
  const beads = useDesign((s) => s.beads);
  const removeAt = useDesign((s) => s.removeAt);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Угсралтын дараалал
        </h3>
        <span className="text-xs text-muted">{beads.length} ширхэг</span>
      </div>

      {beads.length === 0 ? (
        <div className="flex flex-1 items-center justify-center text-xs text-muted">
          Зүүн талаас шурээ дарж нэмнэ үү
        </div>
      ) : (
        <div className="flex flex-1 items-center gap-1.5 overflow-x-auto px-4 py-3">
          {beads.map((id, i) => {
            const b = getBead(id);
            if (!b) return null;
            return (
              <button
                key={`${i}-${id}`}
                onClick={() => removeAt(i)}
                title={`${b.name} — устгах`}
                className="group relative flex-shrink-0"
              >
                <span
                  className="block h-7 w-7 rounded-full ring-1 ring-black/40 transition group-hover:ring-2 group-hover:ring-red-400"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${b.color}dd, ${b.color})`,
                  }}
                />
                <span className="pointer-events-none absolute inset-0 hidden items-center justify-center text-[10px] font-bold text-white group-hover:flex">
                  ✕
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
