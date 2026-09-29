"use client";
import { useEffect, useRef, useState } from "react";

// The 30-second product video (scripts/demo-video.mjs): the PDF pages, the eye of an exercise, the
// animations. Silent and looping; it only loads and plays while it is on screen, stays still when
// the phone asks for less motion, and a button pauses or plays it.
export default function ProductVideo({ caption }: { caption?: string }) {
  const v = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [user, setUser] = useState<boolean | null>(null);
  useEffect(() => {
    const el = v.current;
    if (!el) return;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || !("IntersectionObserver" in window)) return;
    const o = new IntersectionObserver(([x]) => {
      if (user === false) return;
      if (x.isIntersecting) el.play().catch(() => {});
      else el.pause();
    }, { threshold: 0.4 });
    o.observe(el);
    return () => o.disconnect();
  }, [user]);
  const toggle = () => {
    const el = v.current;
    if (!el) return;
    if (el.paused) { setUser(true); el.play().catch(() => {}); } else { setUser(false); el.pause(); }
  };
  return (
    <figure className="pvid">
      <div className="pvid-box">
        <video ref={v} poster="/video/demo.jpg" width={360} height={640} muted loop playsInline preload="none"
          aria-label="Vidéo de 30 secondes : les pages du programme en PDF, l'œil d'un exercice qu'on touche, puis les exercices animés (saut latéral stabilisé, pogos, Nordic ischios)."
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
          <source src="/video/demo.mp4" type="video/mp4" />
          <source src="/video/demo.webm" type="video/webm" />
        </video>
        <button type="button" className="pvid-btn" onClick={toggle} aria-label={playing ? "Mettre la vidéo en pause" : "Lire la vidéo"}>
          {playing
            ? <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor" /></svg>
            : <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M8 5l11 7-11 7z" fill="currentColor" /></svg>}
        </button>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
