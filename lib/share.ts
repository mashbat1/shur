import { ProductType } from "./designStore";

export function downloadCanvasPng(filename = "beeb-design.png") {
  const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
  if (!canvas) return;
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export type EncodedDesign = {
  t: ProductType;
  b: string[];          // bead ids
  p?: string | null;    // pendant id
  s: string;            // string id
  l?: number;           // length cm
};

export function encodeDesign(d: EncodedDesign): string {
  const json = JSON.stringify(d);
  return base64UrlEncode(json);
}

export function decodeDesign(hash: string): EncodedDesign | null {
  try {
    const json = base64UrlDecode(hash);
    const data = JSON.parse(json);
    if (!data || !data.t || !Array.isArray(data.b)) return null;
    return data as EncodedDesign;
  } catch {
    return null;
  }
}

function base64UrlEncode(s: string): string {
  if (typeof window === "undefined") return "";
  const utf8 = new TextEncoder().encode(s);
  let bin = "";
  utf8.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(s: string): string {
  if (typeof window === "undefined") return "";
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(padded);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}
