"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { OFFER_PAGES, cleanSrc, pageKind, type Evt } from "@/lib/analytics";

// Where this visit comes from, kept for the tab session only (sessionStorage, no cookie): the
// utm_source of the link, or the referring site, or "direct".
const SITES: [RegExp, string][] = [
  [/google\./, "google"], [/bing\.|duckduckgo|qwant|ecosia|yahoo\./, "recherche"], [/instagram\./, "instagram"],
  [/facebook\.|fb\.|messenger\./, "facebook"], [/tiktok\./, "tiktok"], [/(^|\.)t\.co$|twitter\.|x\.com/, "x"],
  [/linkedin\./, "linkedin"], [/youtube\.|youtu\.be/, "youtube"], [/snapchat\./, "snapchat"], [/wa\.me|whatsapp\./, "whatsapp"],
];
function store(): Storage | null {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}
export function source(): string {
  const ss = store();
  const kept = ss?.getItem("6m_src");
  if (kept) return kept;
  const q = new URLSearchParams(location.search);
  let s = q.get("utm_source") || q.get("src") || "";
  if (!s && document.referrer) {
    try {
      const host = new URL(document.referrer).hostname.replace(/^www\./, "");
      if (host !== location.hostname) s = SITES.find(([re]) => re.test(host))?.[1] ?? host;
    } catch {}
  }
  s = cleanSrc(s || "direct");
  ss?.setItem("6m_src", s);
  return s;
}

// Sends an event once per tab session (per event and detail when perDetail is set).
export function track(e: Evt, d = "", perDetail = false) {
  try {
    if (navigator.webdriver) return;
    const ss = store(), k = `6m_e:${e}${perDetail ? `:${d}` : ""}`;
    if (ss?.getItem(k)) return;
    ss?.setItem(k, "1");
    const body = JSON.stringify({ e, d, s: source() });
    if (!navigator.sendBeacon?.("/api/evt", new Blob([body], { type: "application/json" }))) fetch("/api/evt", { method: "POST", body, keepalive: true }).catch(() => {});
  } catch {}
}

// On every page: the visit (first page of the session), the page kind, the offers step. On every
// form sent to the site's API: the source goes along (saved with the order or the email), the
// payment button counts as "paiement_clic" and the sign-ups as "lead" (kind in data-lead).
export default function Track() {
  const path = usePathname();
  useEffect(() => {
    const kind = pageKind(path);
    track("visite", kind ?? "autre");
    if (kind) track("page", kind, true);
    if (kind && OFFER_PAGES.includes(kind)) track("offres", kind);
  }, [path]);
  useEffect(() => {
    const apiForm = (t: EventTarget | null) => (t instanceof HTMLFormElement && t.getAttribute("action")?.startsWith("/api/") ? t : null);
    // Before the page's own handlers: the source field (harmless if the submit is then stopped).
    const addSrc = (ev: Event) => {
      const f = apiForm(ev.target);
      if (!f) return;
      let i = f.querySelector<HTMLInputElement>('input[name="src"]');
      if (!i) {
        i = document.createElement("input");
        i.type = "hidden";
        i.name = "src";
        f.appendChild(i);
      }
      i.value = source();
    };
    // After them: count only the forms really sent.
    const count = (ev: Event) => {
      const f = apiForm(ev.target);
      if (!f || ev.defaultPrevented) return;
      if (f.getAttribute("action") === "/api/checkout") {
        const d = new FormData(f);
        track("paiement_clic", d.get("pack") === "on" ? "pack" : String(d.get("program") ?? ""));
      } else if (f.dataset.lead) track("lead", f.dataset.lead, true);
    };
    document.addEventListener("submit", addSrc, true);
    document.addEventListener("submit", count);
    return () => {
      document.removeEventListener("submit", addSrc, true);
      document.removeEventListener("submit", count);
    };
  }, []);
  return null;
}
