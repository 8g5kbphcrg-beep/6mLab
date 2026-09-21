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
      document.querySelector("#ball animateMotion")?.remove();
      document.querySelectorAll("#ball animateTransform").forEach((n) => n.remove());
      document.getElementById("ball")?.setAttribute("transform", "translate(428 180)");
    }
    const hero = document.querySelector<HTMLElement>(".hero");
    let t = false;
    const s = () => {
      if (t) return;
      t = true;
      requestAnimationFrame(() => { t = false; setOn(scrollY > (hero?.offsetHeight ?? 600) * 0.7); });
    };
    addEventListener("scroll", s, { passive: true });
    return () => { removeEventListener("scroll", s); o?.disconnect(); };
  }, []);
  return <div className={"cta" + (on ? " on" : "")}><a className="btn" href="#formules">{cta}</a></div>;
}
