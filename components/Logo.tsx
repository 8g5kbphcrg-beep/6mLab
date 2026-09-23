// The 6M Lab mark: a "6" drawn as a thrown handball. The loop is the ball (classic pentagon
// and hexagon panels, no brand),
// the stroke above is its trajectory, and two speed lines show the shot.
export const MARK = `<rect width="48" height="48" rx="12" fill="#100A24"/><circle cx="23" cy="29" r="11.5" fill="#FFE14A"/><path d="M23 25.2L26.61 27.83L25.23 32.07L20.77 32.07L19.39 27.83Z" fill="#FF5A1F"/><path d="M27.33 23.05L25.82 18.42L29.76 15.56L33.7 18.42L32.19 23.05Z" fill="#FF5A1F"/><path d="M30 31.27L33.94 28.41L37.87 31.27L36.37 35.9L31.5 35.9Z" fill="#FF5A1F"/><path d="M23 36.36L26.94 39.22L25.43 43.85L20.57 43.85L19.06 39.22Z" fill="#FF5A1F"/><path d="M16 31.27L14.5 35.9L9.63 35.9L8.13 31.27L12.06 28.41Z" fill="#FF5A1F"/><path d="M18.67 23.05L13.81 23.05L12.3 18.42L16.24 15.56L20.18 18.42Z" fill="#FF5A1F"/><path d="M23 25.2L23 22.1M26.61 27.83L29.56 26.87M25.23 32.07L27.06 34.58M20.77 32.07L18.94 34.58M19.39 27.83L16.44 26.87M23 22.1L27.33 23.05M23 22.1L18.67 23.05M29.56 26.87L30 31.27M29.56 26.87L27.33 23.05M27.06 34.58L23 36.36M27.06 34.58L30 31.27M18.94 34.58L16 31.27M18.94 34.58L23 36.36M16.44 26.87L18.67 23.05M16.44 26.87L16 31.27" fill="none" stroke="#100A24" stroke-width="1.3" stroke-linecap="round"/><circle cx="23" cy="29" r="15.5" fill="none" stroke="#100A24" stroke-width="8"/><path d="M36 8C22 8 12 16 12 29" fill="none" stroke="#FFE14A" stroke-width="6.5" stroke-linecap="round"/><path d="M40 12.5l4-3.5M41.5 18.5l4.5-1.5" stroke="#FF5A1F" stroke-width="3" stroke-linecap="round"/>`;

// The same ball, centred on 0,0 with radius 10, for the hero animation.
export const BALL = `<circle r="10" fill="#FFE14A"/><g clip-path="url(#ballclip)"><path d="M0 -3.3L3.14 -1.02L1.94 2.67L-1.94 2.67L-3.14 -1.02Z" fill="#FF5A1F"/><path d="M3.76 -5.18L2.45 -9.2L5.88 -11.69L9.3 -9.2L7.99 -5.18Z" fill="#FF5A1F"/><path d="M6.09 1.98L9.51 -0.51L12.93 1.98L11.63 6L7.39 6Z" fill="#FF5A1F"/><path d="M-0 6.4L3.42 8.89L2.12 12.91L-2.12 12.91L-3.42 8.89Z" fill="#FF5A1F"/><path d="M-6.09 1.98L-7.39 6L-11.63 6L-12.93 1.98L-9.51 -0.51Z" fill="#FF5A1F"/><path d="M-3.76 -5.18L-7.99 -5.18L-9.3 -9.2L-5.88 -11.69L-2.45 -9.2Z" fill="#FF5A1F"/><path d="M0 -3.3L0 -6M3.14 -1.02L5.71 -1.85M1.94 2.67L3.53 4.85M-1.94 2.67L-3.53 4.85M-3.14 -1.02L-5.71 -1.85M0 -6L3.76 -5.18M0 -6L-3.76 -5.18M5.71 -1.85L6.09 1.98M5.71 -1.85L3.76 -5.18M3.53 4.85L-0 6.4M3.53 4.85L6.09 1.98M-3.53 4.85L-6.09 1.98M-3.53 4.85L-0 6.4M-5.71 -1.85L-3.76 -5.18M-5.71 -1.85L-6.09 1.98" fill="none" stroke="#100A24" stroke-width="1.1" stroke-linecap="round"/></g><circle r="10" fill="none" stroke="#100A24" stroke-width="1.2"/>`;

export function Mark({ size = 32, className }: { size?: number; className?: string }) {
  return <svg className={className} viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" dangerouslySetInnerHTML={{ __html: MARK }} />;
}

export default function Logo({ size = 32 }: { size?: number }) {
  return (
    <>
      <Mark size={size} />
      <span>6M<b>Lab</b></span>
    </>
  );
}
