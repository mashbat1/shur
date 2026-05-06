"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type Locale = "mn" | "en";

const STORAGE_KEY = "beeb.locale";

const DICT = {
  // Nav / common
  brand_tagline:        { mn: "Гар урлал × 3D дизайнер",          en: "Handmade × 3D designer" },
  open_designer:        { mn: "Дизайнер нээх",                     en: "Open designer" },
  back_to_designer:     { mn: "← Дизайнер руу буцах",              en: "← Back to designer" },
  cart:                 { mn: "Сагс",                              en: "Cart" },
  templates:            { mn: "Бэлэн загвар",                      en: "Templates" },

  // Home page
  hero_l1:              { mn: "Өөрөө угсар.",                       en: "Build it yourself." },
  hero_l2:              { mn: "Бүх талаас нь хар.",                en: "See every angle." },
  hero_l3:              { mn: "Захиал.",                            en: "Order it." },
  hero_sub:             { mn: "Шурээ сонго, утсанд хатга, 3D загвараар эргүүлж хараад өөрийн гэсэн бугуйвч, зүүлт, утасны оосор бүтээ.", en: "Pick beads, string them, rotate the 3D model from every side, and create your own bracelet, necklace, or phone strap." },
  cta_start:            { mn: "Эхлэх →",                           en: "Get started →" },
  cta_more:             { mn: "Илүү ихийг үзэх",                  en: "Learn more" },
  nav_how:              { mn: "Хэрхэн ажилладаг",                  en: "How it works" },
  nav_products:         { mn: "Бүтээгдэхүүн",                     en: "Products" },
  how_title:            { mn: "Хэрхэн ажилладаг вэ?",             en: "How does it work?" },
  step1_title:          { mn: "Шурээ сонго",                      en: "Pick beads" },
  step1_desc:           { mn: "Олон төрлийн чулуу, өнгө, хэлбэрээс өөрийн дуртайг сонго.", en: "Choose from many stones, colors, and shapes." },
  step2_title:          { mn: "3D-д угсар",                        en: "Build in 3D" },
  step2_desc:           { mn: "Дарах болгонд шурэг утсанд орж, 3D загвар бодит цагаар шинэчлэгдэнэ.", en: "Each click adds a bead and the 3D model updates instantly." },
  step3_title:          { mn: "Эргүүлж хараад захиал",            en: "Rotate, then order" },
  step3_desc:           { mn: "Бүх талаас нь шалгаад сэтгэл хангалуун болсныхоо дараа захиалга өг.", en: "Inspect from every angle, then place your order when you're happy." },
  products_title:       { mn: "Бүтээгдэхүүн",                     en: "Products" },
  prod_bracelet:        { mn: "Бугуйвч",                            en: "Bracelet" },
  prod_bracelet_desc:   { mn: "14–22см, уян эсвэл утсан",          en: "14–22cm, elastic or strung" },
  prod_necklace:        { mn: "Зүүлт",                             en: "Necklace" },
  prod_necklace_desc:   { mn: "35–65см, янз бүрийн утсаар",       en: "35–65cm, in various cords" },
  prod_strap:           { mn: "Утасны оосор",                     en: "Phone strap" },
  prod_strap_desc:      { mn: "15–30см, гар уралдан хийсэн",       en: "15–30cm, fully handmade" },
  cta_design:           { mn: "Дизайн хийж эхлэх",                 en: "Start designing" },
  footer_line:          { mn: "Гараар хийсэн гоо сайхан.",         en: "Beauty, handmade." },

  // Designer hint
  rotate_hint:          { mn: "Хулганаар эргүүлж, скроллоор томруул", en: "Drag to rotate, scroll to zoom" },
} as const;

export type DictKey = keyof typeof DICT;

const Ctx = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (k: DictKey) => string;
}>({
  locale: "mn",
  setLocale: () => {},
  t: (k) => k,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("mn");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored === "mn" || stored === "en") {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
      document.documentElement.lang = l;
    }
  }, []);

  const t = useCallback(
    (k: DictKey) => DICT[k]?.[locale] ?? k,
    [locale],
  );

  return (
    <Ctx.Provider value={{ locale, setLocale, t }}>{children}</Ctx.Provider>
  );
}

export function useI18n() {
  return useContext(Ctx);
}
