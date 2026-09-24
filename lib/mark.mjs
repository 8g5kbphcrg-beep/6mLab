// The 6M Lab mark ("L'élan"): two curved blades, a body springing up and an arm cocking to
// shoot, and the ball. Shared by the site, the icons, the share image, the emails and the PDFs.
export const SLOGAN = "Be ready.";
export const MARK_VIEWBOX = "18 6 94 112";
const BODY = "M24 116Q51.5 77.7 66 40Q16.5 58.3 24 116Z";
const ARM = "M48 74Q94.9 87.3 108 34Q77.1 60.7 48 74Z";
// Inner SVG (use with viewBox MARK_VIEWBOX). color: the blades; ball: the ball.
export const markSvg = (color = "#FFC75F", ball = "#FF7A59") =>
  `<path d="${BODY}" fill="${color}"/><path d="${ARM}" fill="${color}"/><circle cx="76" cy="20" r="12" fill="${ball}"/>`;
export const markFile = (color, ball) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${MARK_VIEWBOX}">${markSvg(color, ball)}</svg>`;
// App icon / favicon: the mark on the sunset tile (48 × 48).
export const iconSvg = (radius = 11) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><defs><linearGradient id="sky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16123F"/><stop offset=".55" stop-color="#3E1858"/><stop offset="1" stop-color="#9E3456"/></linearGradient></defs><rect width="48" height="48" rx="${radius}" fill="url(#sky)"/><svg x="8" y="5" width="32" height="38" viewBox="${MARK_VIEWBOX}">${markSvg()}</svg></svg>`;
