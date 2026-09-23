import { ImageResponse } from "next/og";
import { LOGO_BALL } from "@/components/Logo";
import { dict, locales, type Lang } from "@/lib/dict";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "6M Lab";
export const generateStaticParams = () => locales.map((lang) => ({ lang }));

// Anton for the "6M" of the logo; falls back to the default font if Google Fonts is unreachable.
async function anton() {
  try {
    const css = await (await fetch("https://fonts.googleapis.com/css2?family=Anton&text=6M")).text();
    const url = css.match(/src: url\((.+?)\)/)?.[1];
    return url ? await (await fetch(url)).arrayBuffer() : null;
  } catch {
    return null;
  }
}

// The preview shown when a page of the site is shared (WhatsApp, Instagram, Facebook, etc.).
export default async function OgImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const d = dict[(lang in dict ? lang : "fr") as Lang];
  const font = await anton();
  const ball = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" color="#FF5A1F">${LOGO_BALL.replaceAll("currentColor", "#FF5A1F")}</svg>`;
  const arc = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 30"><path d="M6 24Q110-6 214 24" fill="none" stroke="#FF5A1F" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 10"/></svg>`;
  const img = (s: string) => `data:image/svg+xml;base64,${Buffer.from(s).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#100A24", color: "#F3F1FB", padding: "0 80px", gap: 80 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "none" }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <span style={{ fontFamily: font ? "Anton" : undefined, fontWeight: 800, fontSize: 190, lineHeight: 1, color: "#FFE14A", letterSpacing: -4 }}>6M</span>
            <img width={88} height={88} src={img(ball)} alt="" style={{ marginTop: 6, marginLeft: 8 }} />
          </div>
          <span style={{ fontSize: 34, fontWeight: 700, letterSpacing: 12, color: "#fff", opacity: 0.85, marginTop: 14 }}>LAB</span>
          <img width={420} height={57} src={img(arc)} alt="" style={{ marginTop: 10 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 50, fontWeight: 700, lineHeight: 1.12 }}>{d.hero.h1}</div>
          <div style={{ fontSize: 28, color: "#CFC8EE", marginTop: 24, lineHeight: 1.4 }}>{d.hero.sub}</div>
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Anton", data: font, weight: 400 }] : undefined },
  );
}
