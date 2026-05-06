import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <div className="text-lg font-bold tracking-tight">
          beeb<span className="text-accent">.</span>
        </div>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <a href="#how" className="hover:text-ink">Хэрхэн ажилладаг</a>
          <a href="#products" className="hover:text-ink">Бүтээгдэхүүн</a>
          <Link
            href="/designer"
            className="rounded-md bg-accent px-3 py-1.5 text-xs font-bold text-black hover:brightness-110"
          >
            Дизайнер нээх
          </Link>
        </nav>
      </header>

      <section className="flex flex-1 items-center justify-center px-6">
        <div className="max-w-3xl text-center">
          <div className="mb-3 inline-block rounded-full border border-line px-3 py-1 text-[11px] uppercase tracking-wider text-muted">
            Гар урлал × 3D дизайнер
          </div>
          <h1 className="mb-4 text-5xl font-bold leading-tight tracking-tight md:text-6xl">
            Өөрөө угсар.
            <br />
            <span className="text-accent">Бүх талаас нь хар.</span>
            <br />
            Захиал.
          </h1>
          <p className="mb-8 text-lg text-muted">
            Шурээ сонго, утсанд хатга, 3D загвараар эргүүлж хараад өөрийн гэсэн
            бугуйвч, зүүлт, утасны оосор бүтээ.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/designer"
              className="rounded-lg bg-accent px-6 py-3 text-sm font-bold text-black transition hover:brightness-110"
            >
              Эхлэх →
            </Link>
            <a
              href="#how"
              className="rounded-lg border border-line px-6 py-3 text-sm font-medium text-ink transition hover:border-muted"
            >
              Илүү ихийг үзэх
            </a>
          </div>
        </div>
      </section>

      <section id="how" className="border-t border-line px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold">
            Хэрхэн ажилладаг вэ?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Шурээ сонго",
                d: "Олон төрлийн чулуу, өнгө, хэлбэрээс өөрийн дуртайг сонго.",
              },
              {
                n: "2",
                t: "3D-д угсар",
                d: "Дарах болгонд шурэг утсанд орж, 3D загвар бодит цагаар шинэчлэгдэнэ.",
              },
              {
                n: "3",
                t: "Эргүүлж хараад захиал",
                d: "Бүх талаас нь шалгаад сэтгэл хангалуун болсныхоо дараа захиалга өг.",
              },
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

      <section id="products" className="border-t border-line px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-3xl font-bold">Бүтээгдэхүүн</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { t: "Бугуйвч", d: "14–22см, уян эсвэл утсан" },
              { t: "Зүүлт", d: "35–65см, янз бүрийн утсаар" },
              { t: "Утасны оосор", d: "15–30см, гар уралдан хийсэн" },
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
              Дизайн хийж эхлэх
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line px-6 py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} beeb. Гараар хийсэн гоо сайхан.
      </footer>
    </main>
  );
}
