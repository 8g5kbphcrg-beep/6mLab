"use client";
import { useEffect, useRef, useState } from "react";

type Theme = "auto" | "light" | "dark";

// Light / dark theme. "Auto" follows the device setting (CSS prefers-color-scheme); a choice is
// kept in localStorage and applied before the page paints (script in the layout).
export default function ThemeToggle({ fr }: { fr: boolean }) {
  const [theme, setTheme] = useState<Theme>("auto");
  const box = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    try { const v = localStorage.getItem("theme"); if (v === "light" || v === "dark") setTheme(v); } catch {}
    const close = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) box.current.open = false; };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);
  const choose = (v: Theme) => {
    setTheme(v);
    const root = document.documentElement;
    try {
      if (v === "auto") { delete root.dataset.theme; localStorage.removeItem("theme"); }
      else { root.dataset.theme = v; localStorage.setItem("theme", v); }
    } catch { if (v !== "auto") root.dataset.theme = v; }
    if (box.current) box.current.open = false;
  };
  const opts: [Theme, string][] = [["auto", fr ? "Automatique (comme l'appareil)" : "Automatic (device setting)"], ["light", fr ? "Clair" : "Light"], ["dark", fr ? "Foncé" : "Dark"]];
  return (
    <details className="theme" ref={box}>
      <summary aria-label={fr ? "Thème clair ou foncé" : "Light or dark theme"} title={fr ? "Thème" : "Theme"}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M12 3.5a8.5 8.5 0 0 1 0 17Z" fill="currentColor" /></svg>
      </summary>
      <div className="theme-m">
        <p>{fr ? "Thème" : "Theme"}</p>
        {opts.map(([v, label]) => (
          <button key={v} type="button" aria-pressed={theme === v} onClick={() => choose(v)}>{label}</button>
        ))}
      </div>
    </details>
  );
}
