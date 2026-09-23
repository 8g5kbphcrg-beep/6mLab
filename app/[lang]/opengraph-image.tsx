import { ImageResponse } from "next/og";
import { MARK } from "@/components/Logo";
import { dict, locales, type Lang } from "@/lib/dict";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "6M Lab";
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

// The preview shown when a page of the site is shared (WhatsApp, Instagram, Facebook, etc.).
export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const d = dict[(lang in dict ? lang : "fr") as Lang];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">${MARK}</svg>`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#100A24", color: "#F3F1FB" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <img width={132} height={132} src={`data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`} alt="" />
          <div style={{ display: "flex", fontSize: 96, fontWeight: 800, letterSpacing: -2 }}>
            6M<span style={{ color: "#FFE14A" }}>Lab</span>
          </div>
        </div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 56, maxWidth: 980, lineHeight: 1.15 }}>{d.hero.h1}</div>
        <div style={{ fontSize: 30, color: "#CFC8EE", marginTop: 24 }}>{d.hero.sub}</div>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 14, display: "flex" }}>
          <div style={{ flex: 1, background: "#FF5A1F" }} />
          <div style={{ flex: 1, background: "#FFE14A" }} />
          <div style={{ flex: 1, background: "#00C2B2" }} />
        </div>
      </div>
    ),
    size,
  );
}
