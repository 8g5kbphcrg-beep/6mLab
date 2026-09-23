"use client";
import { useEffect, useState } from "react";

export default function Enhance({ cta }: { cta: string }) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll(".rv");
    let o: IntersectionObserver | undefined;
    if (rm || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("in"));
    } else {
      o = new IntersectionObserver(
        (x) => x.forEach((y) => { if (y.isIntersecting) { y.target.classList.add("in"); o?.unobserve(y.target); } }),
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
  return <div className={"cta" + (on ? " on" : "")}><a className="btn" href="#formules">{cta}</a></div>;
}
