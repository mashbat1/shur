"use client";

import Link from "next/link";
import LanguageToggle from "@/components/LanguageToggle";
import { useI18n } from "@/lib/i18n";

export default function HomePage() {
  const { t } = useI18n();
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <div className="text-lg font-bold tracking-tight">
          beeb<span className="text-accent">.</span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <a href="#how" className="hidden hover:text-ink sm:block">
            {t("nav_how")}
          </a>
          <a href="#products" className="hidden hover:text-ink sm:block">
            {t("nav_products")}
          </a>
          <LanguageToggle />
          <Link
            href="/designer"
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-black hover:brightness-110"
          >
            {t("open_designer")}
          </Link>
        </nav>
      </header>

      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="max-w-3xl text-center">
          <div className="mb-3 inline-block rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-wider text-muted">
            {t("brand_tagline")}
          </div>
          <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {t("hero_l1")}
            <br />
            <span className="text-accent">{t("hero_l2")}</span>
            <br />
            {t("hero_l3")}
          </h1>
          <p className="mb-8 text-base text-muted md:text-lg">{t("hero_sub")}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/designer"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-110"
            >
              {t("cta_start")}
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-muted"
            >
              {t("cta_more")}
            </a>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-line px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold">
            {t("how_title")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: t("step1_title"), d: t("step1_desc") },
              { n: "2", t: t("step2_title"), d: t("step2_desc") },
              { n: "3", t: t("step3_title"), d: t("step3_desc") },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-line bg-panel p-6"
              >
                <div className="mb-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-sm font-bold text-accent">
                  {s.n}
                </div>
                <h3 className="mb-1 text-lg font-semibold">{s.t}</h3>
                <p className="text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="products" className="border-t border-line px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold">
            {t("products_title")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { t: t("prod_bracelet"), d: t("prod_bracelet_desc") },
              { t: t("prod_necklace"), d: t("prod_necklace_desc") },
              { t: t("prod_strap"),    d: t("prod_strap_desc") },
            ].map((p) => (
              <div
                key={p.t}
                className="rounded-xl border border-line bg-panel p-6"
              >
                <h3 className="mb-1 text-lg font-semibold">{p.t}</h3>
                <p className="text-sm text-muted">{p.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/designer"
              className="inline-block rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-110"
            >
              {t("cta_design")}
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} beeb. {t("footer_line")}
      </footer>
    </main>
  );
}
