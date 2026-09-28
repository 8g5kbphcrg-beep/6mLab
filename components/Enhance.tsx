"use client";
import { useEffect, useState } from "react";

// What slides in on scroll: section headers, cards, list items, questions.
const REVEAL = [".shead", ".uni-c", ".why li", ".offer", ".opack", ".clubb", ".founder", ".free", ".rlist li", ".pc", ".phase", ".faq details", ".clubs-why li", ".clubs-cmp > div", ".plan-steps li", ".clubs-care-g > div", ".clubs-how li", ".nf-card", ".steps li", ".ticker"].join(",");

export default function Enhance({ cta }: { cta: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Blocks below the first screen slide in as they scroll into view, siblings one after the
    // other. Blocks already on screen are left alone, so nothing blinks when the page loads.
    if (!rm) {
      document.querySelectorAll<HTMLElement>(REVEAL).forEach((e) => {
        if (e.closest(".hero") || e.classList.contains("rise") || e.getBoundingClientRect().top < innerHeight) return;
        const sibs = e.parentElement ? [...e.parentElement.children].filter((c) => c.matches(REVEAL)) : [];
        e.style.setProperty("--d", String(Math.max(0, sibs.indexOf(e)) % 6));
        e.classList.add("rv");
      });
    }
    const els = document.querySelectorAll(".rv");
    let o: IntersectionObserver | undefined;
    if (rm || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
    } else {
      o = new IntersectionObserver(
        (x) => x.forEach((y) => {
          if (!y.isIntersecting) return;
          const t = y.target as HTMLElement;
          t.classList.add("in");
          o?.unobserve(t);
          // Once in place, the block goes back to its own transitions (hover lift).
          t.addEventListener("transitionend", () => { t.classList.remove("rv", "in"); t.style.removeProperty("--d"); }, { once: true });
        }),
        { threshold: 0.15 },
      );
      els.forEach((e) => o!.observe(e));
    }
    if (rm) {
      // Freeze the scene on the frame where the ball is in the net.
      const svg = document.querySelector<SVGSVGElement>("svg.scene");
      svg?.setCurrentTime(1.6);
      svg?.pauseAnimations();
    }
    const hero = document.querySelector<HTMLElement>(".hero");
    let t = false;
    const s = () => {
      if (t) return;
      t = true;
      requestAnimationFrame(() => { t = false; setOn(!!hero && scrollY > hero.offsetHeight * 0.7); });
    };
    addEventListener("scroll", s, { passive: true });
    return () => { removeEventListener("scroll", s); o?.disconnect(); };
  }, []);
  return <aside className={"cta" + (on ? " on" : "")} aria-label={cta}><a className="btn" href="#formules">{cta}</a></aside>;
}
