"use client";
import { Children, useRef, useState, type ReactNode } from "react";

// Home page: the sport cards side by side in one frame, swiped (or scrolled with the arrows and
// dots) instead of stacked, so the card keeps its size whatever the number of sports.
export default function SportSlider({ children, labels, hint }: { children: ReactNode; labels: string[]; hint: string }) {
  const track = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(0);
  const n = Children.count(children);
  const go = (i: number) => {
    const t = track.current, el = t?.children[Math.max(0, Math.min(n - 1, i))] as HTMLElement | undefined;
    if (t && el) t.scrollTo({ left: el.offsetLeft - t.offsetLeft, behavior: "smooth" });
  };
  const onScroll = () => {
    const t = track.current;
    if (!t) return;
    const w = (t.children[0] as HTMLElement | undefined)?.offsetWidth || 1;
    setAt(Math.round(t.scrollLeft / w));
  };
  return (
    <div className="slider">
      <div className="slider-track" ref={track} onScroll={onScroll}>
        {Children.map(children, (c, i) => <div className="slider-item" aria-roledescription="slide" aria-label={labels[i]}>{c}</div>)}
      </div>
      <div className="slider-nav">
        <button type="button" className="slider-arr" aria-label="←" disabled={at === 0} onClick={() => go(at - 1)}>‹</button>
        <span className="slider-dots">{labels.map((l, i) => <button type="button" key={l} aria-label={l} aria-current={i === at} onClick={() => go(i)} />)}</span>
        <button type="button" className="slider-arr" aria-label="→" disabled={at >= n - 1} onClick={() => go(at + 1)}>›</button>
      </div>
      <p className="slider-hint">{hint}</p>
    </div>
  );
}
