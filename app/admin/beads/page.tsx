"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Bead,
  BEADS,
  BeadShape,
  getAdminBeads,
  writeAdminBeads,
} from "@/lib/beads";

const SHAPES: BeadShape[] = ["round", "tube", "cube", "bicone", "disc", "heart", "star"];

const EMPTY: Bead = {
  id: "",
  name: "",
  shape: "round",
  color: "#888888",
  diameterMm: 8,
  price: 500,
};

export default function AdminBeadsPage() {
  const [admin, setAdmin] = useState<Bead[]>([]);
  const [draft, setDraft] = useState<Bead>({ ...EMPTY });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setAdmin(getAdminBeads());
  }, []);

  function persist(next: Bead[]) {
    writeAdminBeads(next);
    setAdmin(next);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.id.trim() || !draft.name.trim()) return;
    const idTaken = BEADS.some((b) => b.id === draft.id) && !editingId;
    if (idTaken) {
      alert("Энэ ID-тай үндсэн шурэг бий — өөр ID сонго.");
      return;
    }
    const next = editingId
      ? admin.map((b) => (b.id === editingId ? draft : b))
      : [...admin, draft];
    persist(next);
    setDraft({ ...EMPTY });
    setEditingId(null);
  }

  function handleEdit(b: Bead) {
    setDraft({ ...b });
    setEditingId(b.id);
  }

  function handleDelete(id: string) {
    if (!confirm("Энэ шурэг устгах уу?")) return;
    persist(admin.filter((b) => b.id !== id));
    if (editingId === id) {
      setDraft({ ...EMPTY });
      setEditingId(null);
    }
  }

  function handleCancel() {
    setDraft({ ...EMPTY });
    setEditingId(null);
  }

  return (
    <main className="min-h-screen bg-bg">
      <header className="border-b border-line px-6 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-lg font-bold tracking-tight">
            beeb<span className="text-accent">.</span>{" "}
            <span className="ml-2 text-xs font-normal text-muted">admin</span>
          </Link>
          <Link href="/designer" className="text-xs text-muted hover:text-ink">
            ← Дизайнер
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-1 text-2xl font-bold">Шурээний удирдлага</h1>
        <p className="mb-6 text-xs text-muted">
          Үндсэн каталог + энд нэмсэн шурэг (зөвхөн энэ browser-т хадгалагдана).
        </p>

        <div className="grid gap-8 md:grid-cols-[1fr_360px]">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Үндсэн каталог ({BEADS.length})
            </h2>
            <div className="mb-8 grid grid-cols-2 gap-2 lg:grid-cols-3">
              {BEADS.map((b) => (
                <BeadRow key={b.id} bead={b} readOnly />
              ))}
            </div>

            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">
              Нэмэлт шурэг ({admin.length})
            </h2>
            {admin.length === 0 ? (
              <div className="rounded-md border border-line bg-panel p-4 text-xs text-muted">
                Одоогоор нэмэгдсэн шурэг алга. Баруун талын маягтаар нэм.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {admin.map((b) => (
                  <BeadRow
                    key={b.id}
                    bead={b}
                    onEdit={() => handleEdit(b)}
                    onDelete={() => handleDelete(b.id)}
                  />
                ))}
              </div>
            )}
          </section>

          <form
            onSubmit={handleSave}
            className="h-fit space-y-3 rounded-xl border border-line bg-panel p-5"
          >
            <h2 className="text-sm font-semibold">
              {editingId ? "Шурэг засах" : "Шинэ шурэг нэмэх"}
            </h2>

            <Field label="ID (англиар, өвөрмөц)">
              <input
                required
                disabled={!!editingId}
                value={draft.id}
                onChange={(e) =>
                  setDraft({ ...draft, id: e.target.value.trim().toLowerCase().replace(/\s+/g, "-") })
                }
                placeholder="жишээ: jade-12"
                className="input"
              />
            </Field>

            <Field label="Нэр">
              <input
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Хаш 12мм"
                className="input"
              />
            </Field>

            <Field label="Хэлбэр">
              <select
                value={draft.shape}
                onChange={(e) =>
                  setDraft({ ...draft, shape: e.target.value as BeadShape })
                }
                className="input"
              >
                {SHAPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Өнгө">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft.color}
                  onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                  className="h-9 w-12 cursor-pointer rounded border border-line bg-bg"
                />
                <input
                  value={draft.color}
                  onChange={(e) => setDraft({ ...draft, color: e.target.value })}
                  className="input"
                />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Диаметр (мм)">
                <input
                  type="number"
                  min={2}
                  max={30}
                  step={0.5}
                  value={draft.diameterMm}
                  onChange={(e) =>
                    setDraft({ ...draft, diameterMm: parseFloat(e.target.value) })
                  }
                  className="input"
                />
              </Field>
              <Field label="Урт (мм, заавал биш)">
                <input
                  type="number"
                  min={1}
                  max={50}
                  step={0.5}
                  value={draft.lengthMm ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      lengthMm: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="input"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Field label="Хатуу (0–1)">
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={draft.roughness ?? 0.4}
                  onChange={(e) =>
                    setDraft({ ...draft, roughness: parseFloat(e.target.value) })
                  }
                  className="input"
                />
              </Field>
              <Field label="Метал (0–1)">
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={draft.metalness ?? 0}
                  onChange={(e) =>
                    setDraft({ ...draft, metalness: parseFloat(e.target.value) })
                  }
                  className="input"
                />
              </Field>
            </div>

            <Field label="Үнэ (₮)">
              <input
                required
                type="number"
                min={0}
                step={100}
                value={draft.price}
                onChange={(e) =>
                  setDraft({ ...draft, price: parseInt(e.target.value, 10) })
                }
                className="input"
              />
            </Field>

            <label className="flex items-center gap-2 text-xs text-ink">
              <input
                type="checkbox"
                checked={!!draft.pendant}
                onChange={(e) => setDraft({ ...draft, pendant: e.target.checked })}
              />
              Зүүлтийн чимэг (pendant)
            </label>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-md bg-accent py-2 text-xs font-bold text-black transition hover:brightness-110"
              >
                {editingId ? "Хадгалах" : "Нэмэх"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-md border border-line px-3 py-2 text-xs text-ink hover:border-muted"
                >
                  Болих
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid var(--line, #2a2a2e);
          background: var(--bg, #0f0f12);
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: var(--ink, #fff);
          outline: none;
        }
        .input:focus {
          border-color: var(--accent, #ffd54a);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] uppercase tracking-wide text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function BeadRow({
  bead,
  readOnly,
  onEdit,
  onDelete,
}: {
  bead: Bead;
  readOnly?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-line bg-panel p-2">
      <span
        className="h-7 w-7 flex-shrink-0 rounded-full ring-1 ring-black/40"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${bead.color}dd, ${bead.color})`,
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] font-medium text-ink">{bead.name}</div>
        <div className="truncate text-[10px] text-muted">
          {bead.shape} · {bead.price.toLocaleString()}₮
          {bead.pendant ? " · чимэг" : ""}
        </div>
      </div>
      {!readOnly && (
        <div className="flex flex-col gap-1">
          <button
            onClick={onEdit}
            className="text-[10px] text-accent hover:underline"
          >
            Засах
          </button>
          <button
            onClick={onDelete}
            className="text-[10px] text-muted hover:text-red-400"
          >
            Устгах
          </button>
        </div>
      )}
    </div>
  );
}
