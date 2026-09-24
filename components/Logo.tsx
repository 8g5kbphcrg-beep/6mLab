import { MARK_VIEWBOX, markSvg, SLOGAN } from "@/lib/mark.mjs";

// The 6M Lab mark ("L'élan", lib/mark.mjs). The blades take the text colour (currentColor), the
// ball stays orange, so it works on dark and light backgrounds.
export function Mark({ className = "mark" }: { className?: string }) {
  return <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true" dangerouslySetInnerHTML={{ __html: markSvg("currentColor", "#FF7A59") }} />;
}

// Header: the mark with the brand name, so people know what to look for.
export default function Logo() {
  return (
    <span className="lg lg-inline">
      <Mark />
      <span className="lgname">6M<span>Lab</span></span>
    </span>
  );
}

// Mark with the slogan underneath (opening screen, footer, thank-you page, transitions).
export function Lockup({ size = 96 }: { size?: number }) {
  return (
    <span className="lg lg-lock" style={{ fontSize: size }}>
      <Mark />
      <span className="lgslogan">{SLOGAN}</span>
    </span>
  );
}

// The ball used in the hero animation: classic pentagon and hexagon panels, no brand,
// centred on 0,0 with radius 10.
export const BALL = `<circle r="10" fill="#FFC75F"/><g clip-path="url(#ballclip)"><path d="M0 -3.3L3.14 -1.02L1.94 2.67L-1.94 2.67L-3.14 -1.02Z" fill="#FF7A59"/><path d="M3.76 -5.18L2.45 -9.2L5.88 -11.69L9.3 -9.2L7.99 -5.18Z" fill="#FF7A59"/><path d="M6.09 1.98L9.51 -0.51L12.93 1.98L11.63 6L7.39 6Z" fill="#FF7A59"/><path d="M-0 6.4L3.42 8.89L2.12 12.91L-2.12 12.91L-3.42 8.89Z" fill="#FF7A59"/><path d="M-6.09 1.98L-7.39 6L-11.63 6L-12.93 1.98L-9.51 -0.51Z" fill="#FF7A59"/><path d="M-3.76 -5.18L-7.99 -5.18L-9.3 -9.2L-5.88 -11.69L-2.45 -9.2Z" fill="#FF7A59"/><path d="M0 -3.3L0 -6M3.14 -1.02L5.71 -1.85M1.94 2.67L3.53 4.85M-1.94 2.67L-3.53 4.85M-3.14 -1.02L-5.71 -1.85M0 -6L3.76 -5.18M0 -6L-3.76 -5.18M5.71 -1.85L6.09 1.98M5.71 -1.85L3.76 -5.18M3.53 4.85L-0 6.4M3.53 4.85L6.09 1.98M-3.53 4.85L-6.09 1.98M-3.53 4.85L-0 6.4M-5.71 -1.85L-3.76 -5.18M-5.71 -1.85L-6.09 1.98" fill="none" stroke="#100A24" stroke-width="1.1" stroke-linecap="round"/></g><circle r="10" fill="none" stroke="#100A24" stroke-width="1.2"/>`;
