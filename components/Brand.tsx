"use client";
import { useEffect, useRef } from "react";
import { Lockup } from "@/components/Logo";

// Opening screen: logo and slogan, shown on arrival and at most every 30 minutes (also when a
// program's eye icon opens an exercise, often in a new tab). Its markup is in the page from the
// start so nothing flashes before it; splashScript (lib/brand.ts) hides it when already seen.

export function Splash() {
  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains("splash-seen")) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const out = () => { root.classList.add("splash-out"); setTimeout(() => root.classList.add("splash-seen"), 450); };
    const t = setTimeout(out, reduce ? 700 : 1700);
    const skip = () => { clearTimeout(t); out(); };
    const el = document.querySelector(".splash");
    el?.addEventListener("click", skip);
    return () => { clearTimeout(t); el?.removeEventListener("click", skip); };
  }, []);
  return (
    <div className="splash" aria-hidden="true">
      <Lockup size={130} />
    </div>
  );
}

// Short transition with the logo, on the way to the purchase form (links with data-go) and to
// the Stripe payment page (forms with data-go, shown until Stripe has loaded). Shown by changing
// the DOM directly: once a form is sent, the browser may not run another render before leaving.
export function Transition({ paying }: { paying: string }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const show = (msg: string) => {
      const el = box.current;
      if (!el) return;
      el.querySelector(".trans-m")!.textContent = msg;
      el.hidden = false;
    };
    const click = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>("a[data-go]");
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      show("");
      setTimeout(() => window.location.assign(a.href), 550);
    };
    const submit = (e: SubmitEvent) => {
      if (!e.defaultPrevented && (e.target as HTMLElement).matches("form[data-go]")) show(paying);
    };
    // Coming back with the browser's back button (page restored from cache): hide it.
    const back = (e: PageTransitionEvent) => { if (e.persisted && box.current) box.current.hidden = true; };
    document.addEventListener("click", click);
    document.addEventListener("submit", submit);
    window.addEventListener("pageshow", back);
    return () => { document.removeEventListener("click", click); document.removeEventListener("submit", submit); window.removeEventListener("pageshow", back); };
  }, [paying]);
  return (
    <div className="trans" role="status" hidden ref={box}>
      <span className="trans-logo"><Lockup size={70} /></span>
      <p className="trans-m" />
    </div>
  );
}
