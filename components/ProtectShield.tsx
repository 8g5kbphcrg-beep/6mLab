"use client";
import { useEffect, useState, type ReactNode } from "react";
import type { Lang } from "@/lib/dict";

// The paid content (animations, libraries) cannot be fully shielded from screenshots in a web page:
// only native apps can ask the system to blank them. What the page can do:
// - blur everything as soon as it leaves the screen or loses focus (app switcher, other tab or
//   window, most screenshot tools on a computer, which take the focus first);
// - blur it for a moment on the screenshot keys a page can see (Print Screen on Windows; the Mac
//   shortcuts are usually caught by the system first);
// - nothing when printed, no right-click menu, no saving or dragging of the drawings;
// - the buyer's name and order reference written across the content, so a screenshot that
//   circulates says whose it is (as on the PDFs).
export default function ProtectShield({ lang, mark, children }: { lang: Lang; mark: string | null; children: ReactNode }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const hide = () => setHidden(true);
    const show = () => { if (document.visibilityState === "visible" && document.hasFocus()) setHidden(false); };
    const flash = () => { setHidden(true); clearTimeout(timer); timer = setTimeout(show, 1500); };
    const onVis = () => (document.visibilityState === "visible" ? show() : hide());
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "printscreen" || (e.metaKey && e.shiftKey && ["3", "4", "5", "s"].includes(k)) || (e.key === "s" && e.shiftKey && e.getModifierState("OS"))) {
        flash();
        // Windows puts the capture in the clipboard: replace it when the page may.
        if (k === "printscreen") navigator.clipboard?.writeText("").catch(() => {});
      }
    };
    const block = (e: Event) => e.preventDefault();
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    window.addEventListener("pagehide", hide);
    window.addEventListener("pageshow", show);
    window.addEventListener("beforeprint", hide);
    window.addEventListener("afterprint", show);
    document.addEventListener("keydown", onKey);
    document.addEventListener("keyup", onKey);
    document.addEventListener("contextmenu", block);
    document.addEventListener("dragstart", block);
    if (!document.hasFocus() || document.visibilityState !== "visible") hide();
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      window.removeEventListener("pagehide", hide);
      window.removeEventListener("pageshow", show);
      window.removeEventListener("beforeprint", hide);
      window.removeEventListener("afterprint", show);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("keyup", onKey);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("dragstart", block);
    };
  }, []);
  const fr = lang === "fr";
  return (
    <div className={hidden ? "prot on" : "prot"}>
      {children}
      {mark && <div className="prot-mark" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <span key={i}>{mark}</span>)}</div>}
      <div className="prot-veil" aria-hidden={!hidden} onClick={() => setHidden(false)}>
        <p><strong>{fr ? "Contenu protégé" : "Protected content"}</strong><br />{fr ? "Touche l'écran pour revenir à ton programme." : "Tap the screen to go back to your program."}</p>
      </div>
    </div>
  );
}
