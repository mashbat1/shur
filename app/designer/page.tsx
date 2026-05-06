"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import BeadPicker from "@/components/designer/BeadPicker";
import DesignControls from "@/components/designer/DesignControls";
import Timeline from "@/components/designer/Timeline";
import LanguageToggle from "@/components/LanguageToggle";
import { useDesign } from "@/lib/designStore";
import { decodeDesign } from "@/lib/share";
import { getCart, getOrders } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

const Canvas3D = dynamic(() => import("@/components/designer/Canvas3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted">
      3D ачаалж байна…
    </div>
  ),
});

export default function DesignerPage() {
  const { t } = useI18n();
  const loadDesign = useDesign((s) => s.loadDesign);
  const undo = useDesign((s) => s.undo);
  const redo = useDesign((s) => s.redo);

  const [cartCount, setCartCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [mobilePanel, setMobilePanel] = useState<"none" | "picker" | "controls">(
    "none",
  );

  // Load shared design from URL hash on mount
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;
    const d = decodeDesign(hash);
    if (d) {
      loadDesign({
        productType: d.t,
        beads: d.b,
        pendantId: d.p ?? null,
        stringId: d.s,
        customLengthCm: d.l ?? null,
      });
    }
  }, [loadDesign]);

  // Cart + order badges
  useEffect(() => {
    const refresh = () => {
      setCartCount(getCart().length);
      setOrderCount(getOrders().length);
    };
    refresh();
    window.addEventListener("storage", refresh);
    return () => window.removeEventListener("storage", refresh);
  }, []);

  // Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey;
      if (!meta) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.key.toLowerCase() === "z" && e.shiftKey) ||
        e.key.toLowerCase() === "y"
      ) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [undo, redo]);

  return (
    <div className="flex h-screen w-screen flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          beeb<span className="text-accent">.</span>
        </Link>
        <div className="hidden text-xs text-muted md:block">
          {t("rotate_hint")}
        </div>
        <div className="flex items-center gap-2">
          <LanguageToggle />
          {orderCount > 0 && (
            <Link
              href="/orders"
              className="relative rounded-md border border-line px-2.5 py-1 text-xs text-ink hover:border-muted"
            >
              📦 Захиалгууд
              <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-black">
                {orderCount}
              </span>
            </Link>
          )}
          <Link
            href="/cart"
            className="relative rounded-md border border-line px-2.5 py-1 text-xs text-ink hover:border-muted"
          >
            🛒 {t("cart")}
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold text-black">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Desktop layout */}
      <div className="hidden flex-1 grid-cols-[260px_1fr_300px] overflow-hidden md:grid">
        <aside className="border-r border-line bg-panel">
          <BeadPicker />
        </aside>

        <main className="relative overflow-hidden">
          <div className="absolute inset-0">
            <Canvas3D />
          </div>
        </main>

        <aside className="border-l border-line bg-panel">
          <DesignControls />
        </aside>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-1 flex-col overflow-hidden md:hidden">
        <main className="relative flex-1 overflow-hidden">
          <div className="absolute inset-0">
            <Canvas3D />
          </div>
        </main>
        <div className="grid grid-cols-2 border-t border-line">
          <button
            onClick={() => setMobilePanel("picker")}
            className="border-r border-line bg-panel py-2 text-xs font-medium text-ink"
          >
            Шурээ нэмэх
          </button>
          <button
            onClick={() => setMobilePanel("controls")}
            className="bg-panel py-2 text-xs font-medium text-ink"
          >
            Тохиргоо
          </button>
        </div>
      </div>

      <footer className="hidden h-20 border-t border-line bg-panel md:block">
        <Timeline />
      </footer>

      <div className="md:hidden">
        <div className="h-20 border-t border-line bg-panel">
          <Timeline />
        </div>
      </div>

      {/* Mobile drawer */}
      {mobilePanel !== "none" && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobilePanel("none")}
        >
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] rounded-t-2xl border-t border-line bg-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-4 py-2">
              <span className="text-sm font-semibold">
                {mobilePanel === "picker" ? "Шурээний каталог" : "Тохиргоо"}
              </span>
              <button
                onClick={() => setMobilePanel("none")}
                className="text-xl text-muted hover:text-ink"
              >
                ×
              </button>
            </div>
            <div className="h-[70vh] overflow-y-auto">
              {mobilePanel === "picker" ? <BeadPicker /> : <DesignControls />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
