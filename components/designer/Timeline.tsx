"use client";

import { useState } from "react";
import { useDesign } from "@/lib/designStore";
import { getBead } from "@/lib/beads";

export default function Timeline() {
  const beads = useDesign((s) => s.beads);
  const removeAt = useDesign((s) => s.removeAt);
  const moveBead = useDesign((s) => s.moveBead);
  const mirror = useDesign((s) => s.mirror);
  const duplicate = useDesign((s) => s.duplicate);
  const fillPattern = useDesign((s) => s.fillPattern);
  const undo = useDesign((s) => s.undo);
  const redo = useDesign((s) => s.redo);
  const past = useDesign((s) => s.past);
  const future = useDesign((s) => s.future);

  const [draggingFrom, setDraggingFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-muted">
          Угсралтын дараалал
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={past.length === 0}
            title="Буцаах (Ctrl+Z)"
            className="rounded border border-line px-2 py-0.5 text-xs text-ink transition hover:border-muted disabled:opacity-30"
          >
            ↶
          </button>
          <button
            onClick={redo}
            disabled={future.length === 0}
            title="Дахих (Ctrl+Y)"
            className="rounded border border-line px-2 py-0.5 text-xs text-ink transition hover:border-muted disabled:opacity-30"
          >
            ↷
          </button>
          <button
            onClick={mirror}
            disabled={beads.length < 2}
            title="Дарааллыг толин эсрэг хуулах"
            className="rounded border border-line px-2 py-0.5 text-xs text-ink transition hover:border-muted disabled:opacity-30"
          >
            ⇋ Толь
          </button>
          <button
            onClick={duplicate}
            disabled={beads.length === 0}
            title="Одоогийн дарааллыг 2 дахин үржүүлэх"
            className="rounded border border-line px-2 py-0.5 text-xs text-ink transition hover:border-muted disabled:opacity-30"
          >
            ×2 Давтах
          </button>
          <button
            onClick={fillPattern}
            disabled={beads.length === 0}
            title="Уртаар дүүртэл хэв маягийг давтах"
            className="rounded border border-line px-2 py-0.5 text-xs text-ink transition hover:border-muted disabled:opacity-30"
          >
            ⇣ Дүүргэх
          </button>
          <span className="text-xs text-muted">{beads.length} ширхэг</span>
        </div>
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
            const isDragging = draggingFrom === i;
            const isDropTarget = dragOver === i && draggingFrom !== null && draggingFrom !== i;
            return (
              <div
                key={`${i}-${id}`}
                draggable
                onDragStart={() => setDraggingFrom(i)}
                onDragEnd={() => {
                  setDraggingFrom(null);
                  setDragOver(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(i);
                }}
                onDragLeave={() => {
                  if (dragOver === i) setDragOver(null);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggingFrom !== null && draggingFrom !== i) {
                    moveBead(draggingFrom, i);
                  }
                  setDraggingFrom(null);
                  setDragOver(null);
                }}
                className={`group relative flex-shrink-0 cursor-grab transition ${
                  isDragging ? "opacity-30" : ""
                } ${isDropTarget ? "scale-110" : ""}`}
              >
                <button
                  onClick={() => removeAt(i)}
                  title={`${b.name} — устгах`}
                  className="block"
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
