import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { markFile, SLOGAN } from "@/lib/mark.mjs";
import { dict, locales, type Lang } from "@/lib/dict";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "6M Lab · Be ready.";
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

// Bebas Neue, the slogan's font (SIL Open Font License). Bundled so the build never depends on
// the network.
const bebas = () => readFile(join(process.cwd(), "app/[lang]/bebas-neue.ttf")).catch(() => null);

// The preview shown when a page of the site is shared (WhatsApp, Instagram, Facebook, etc.).
export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const d = dict[(lang in dict ? lang : "fr") as Lang];
  const font = await bebas();
  const mark = `data:image/svg+xml;base64,${Buffer.from(markFile("#FFE14A", "#FF5A1F")).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#100A24", color: "#F3F1FB", padding: "0 80px", gap: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
          <img width={250} height={298} src={mark} alt="" />
          <span style={{ fontFamily: font ? "Bebas" : undefined, fontSize: 64, letterSpacing: 14, color: "#FFE14A", marginTop: 26, paddingLeft: 14 }}>{SLOGAN.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: 6, color: "#FF5A1F", marginBottom: 18 }}>6M LAB</div>
          <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.12 }}>{d.hero.h1}</div>
          <div style={{ fontSize: 28, color: "#CFC8EE", marginTop: 24, lineHeight: 1.4 }}>{d.hero.sub}</div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Bebas", data: font, weight: 400 }] : undefined },
  );
}
