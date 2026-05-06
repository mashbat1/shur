import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Beeb — 3D шурээний дизайнер",
  description:
    "Өөрөө бугуйвч, зүүлт, утасны оосрыг 3D загвараар угсарч, бүх талаас нь харж захиал.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mn">
      <body className="bg-bg text-ink antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
