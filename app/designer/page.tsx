"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import BeadPicker from "@/components/designer/BeadPicker";
import DesignControls from "@/components/designer/DesignControls";
import Timeline from "@/components/designer/Timeline";

const Canvas3D = dynamic(() => import("@/components/designer/Canvas3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-sm text-muted">
      3D ачаалж байна…
    </div>
  ),
});

export default function DesignerPage() {
  return (
    <div className="flex h-screen w-screen flex-col bg-bg">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          beeb<span className="text-accent">.</span>
        </Link>
        <div className="text-xs text-muted">
          Хулганаар эргүүлж, скроллоор томруул
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[260px_1fr_280px] overflow-hidden">
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

      <footer className="h-20 border-t border-line bg-panel">
        <Timeline />
      </footer>
    </div>
  );
}
