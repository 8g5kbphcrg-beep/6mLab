// The 6M Lab logo ("Ballon & trajectoire"): "6M" with a small ball as an exponent, "LAB" spaced
// out underneath and a dotted shot trajectory. Colours come from CSS so it works on dark and light.

// The small ball of the logo: a circle with three seams, drawn in currentColor.
export const LOGO_BALL = `<circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" stroke-width="7"/><path d="M18 32Q50 12 82 32M18 68Q50 88 82 68M12 50Q50 34 88 50" fill="none" stroke="currentColor" stroke-width="6"/>`;

// Favicon / app icon: the logo ball on the night tile.
export const ICON = `<rect width="48" height="48" rx="11" fill="#100A24"/><g transform="translate(9 5) scale(.3)" color="#FF5A1F">${LOGO_BALL}</g><path d="M9 42Q24 35 39 42" fill="none" stroke="#FFE14A" stroke-width="2.4" stroke-linecap="round" stroke-dasharray=".1 4.6"/>`;

// The ball used in the hero animation: classic pentagon and hexagon panels, no brand,
// centred on 0,0 with radius 10.
export const BALL = `<circle r="10" fill="#FFE14A"/><g clip-path="url(#ballclip)"><path d="M0 -3.3L3.14 -1.02L1.94 2.67L-1.94 2.67L-3.14 -1.02Z" fill="#FF5A1F"/><path d="M3.76 -5.18L2.45 -9.2L5.88 -11.69L9.3 -9.2L7.99 -5.18Z" fill="#FF5A1F"/><path d="M6.09 1.98L9.51 -0.51L12.93 1.98L11.63 6L7.39 6Z" fill="#FF5A1F"/><path d="M-0 6.4L3.42 8.89L2.12 12.91L-2.12 12.91L-3.42 8.89Z" fill="#FF5A1F"/><path d="M-6.09 1.98L-7.39 6L-11.63 6L-12.93 1.98L-9.51 -0.51Z" fill="#FF5A1F"/><path d="M-3.76 -5.18L-7.99 -5.18L-9.3 -9.2L-5.88 -11.69L-2.45 -9.2Z" fill="#FF5A1F"/><path d="M0 -3.3L0 -6M3.14 -1.02L5.71 -1.85M1.94 2.67L3.53 4.85M-1.94 2.67L-3.53 4.85M-3.14 -1.02L-5.71 -1.85M0 -6L3.76 -5.18M0 -6L-3.76 -5.18M5.71 -1.85L6.09 1.98M5.71 -1.85L3.76 -5.18M3.53 4.85L-0 6.4M3.53 4.85L6.09 1.98M-3.53 4.85L-6.09 1.98M-3.53 4.85L-0 6.4M-5.71 -1.85L-3.76 -5.18M-5.71 -1.85L-6.09 1.98" fill="none" stroke="#100A24" stroke-width="1.1" stroke-linecap="round"/></g><circle r="10" fill="none" stroke="#100A24" stroke-width="1.2"/>`;

export function LogoBall({ size }: { size: string }) {
  return <svg className="lball" viewBox="0 0 100 100" style={{ width: size, height: size }} aria-hidden="true" dangerouslySetInnerHTML={{ __html: LOGO_BALL }} />;
}

// Compact version for the header: 6M + ball, LAB next to it.
export default function Logo() {
  return (
    <span className="lg lg-inline">
      <span className="lg6">6M</span>
      <LogoBall size=".5em" />
      <span className="lglab">Lab</span>
    </span>
  );
}

// Full version: 6M + ball, LAB underneath, dotted trajectory.
export function LogoStacked({ size = 96 }: { size?: number }) {
  return (
    <span className="lg lg-stack" style={{ fontSize: size }}>
      <span className="lgrow"><span className="lg6">6M</span><LogoBall size=".48em" /></span>
      <span className="lglab">Lab</span>
      <svg className="lgarc" viewBox="0 0 220 30" aria-hidden="true"><path d="M6 24Q110-6 214 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="1 10" /></svg>
    </span>
  );
}
