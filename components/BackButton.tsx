"use client";
import { usePathname } from "next/navigation";

// Round arrow at the top left of every page but the home page: back to the page the visitor
// was on. Arrived straight on this page (link from outside, new tab), there is no page of the
// site to go back to, so it goes up one level (/fr/programmes/pre-saison → /fr/programmes).
export default function BackButton({ label }: { label: string }) {
  const path = usePathname();
  if (/^\/(fr|en)\/?$/.test(path)) return null;
  const up = path.replace(/\/[^/]+\/?$/, "") || "/";
  const back = (e: React.MouseEvent) => {
    let inSite = false;
    try {
      const first = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.name;
      inSite = (!!first && first !== window.location.href) || (!!document.referrer && new URL(document.referrer).origin === window.location.origin);
    } catch {}
    if (inSite && window.history.length > 1) {
      e.preventDefault();
      window.history.back();
    }
  };
  return (
    <a className="backb" href={up} onClick={back} aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5" /></svg>
    </a>
  );
}
