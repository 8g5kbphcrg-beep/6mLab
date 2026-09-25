// Anatomical front-view body drawing for the fitness questionnaire (viewBox 0 0 200 440).
// A body is described by its sex, fat (0 to 1), muscle (0 to 1.1) and definition (0 to 1):
// fat widens and softens the shapes, muscle builds shoulders, arms, chest and thighs, and
// definition draws the muscle lines (abs, pecs, deltoids, quads…).

export type BodySpec = { sex: "f" | "h" | "n"; fat: number; muscle: number; def: number };

type P = [number, number];
const C = 100;
const r1 = (x: number) => Math.round(x * 10) / 10;

// Smooth closed (or open) curve through points (Catmull-Rom converted to cubic Béziers).
function smooth(pts: P[], closed = true): string {
  const n = pts.length;
  const at = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  for (let i = 0; i < (closed ? n : n - 1); i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    const c1: P = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: P = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? d + " Z" : d;
}
const mirror = (pts: P[]): P[] => pts.map(([x, y]) => [2 * C - x, y] as P);
const R = (x: number, y: number): P => [C + x, y];

export function bodyShapes(b: BodySpec) {
  const fem = b.sex === "f" ? 1 : b.sex === "n" ? 0.5 : 0;
  const f = b.fat, m = b.muscle * (1 - fem * 0.35), d = Math.max(0, b.def - f * 1.2);

  // Widths from the centre line, per height.
  const neck = 7 - fem * 1.2 + m * 2.2 + f * 3;
  const S = 30 - fem * 4 + m * 8 + f * 3;               // shoulder
  const delt = 1.5 + m * 6.5;                            // deltoid bulge
  const pit = S - 4 + f * 2;                              // armpit
  const rib = 25 - fem * 3.5 + m * 6.5 + f * 9;
  const waist = 21 - fem * 4 + m * 1.5 + f * 17;
  const belly = waist + f * 7 - fem * f * 2;
  const hip = 24 + fem * 5 + m * 1 + f * 12;
  const thighO = hip - 1 + m * 5.5 + f * 2;
  const thighI = Math.max(0.4, 3.6 - f * 3.8 - m * 1.2);
  const kneeO = 18.5 + f * 4 + m * 2.2, kneeI = 3.6 + f * 2;
  const calfO = 20 + m * 5 + f * 3.5, calfI = 4.4 + m * 2.8 + f * 2.5;

  const torso: P[] = [
    R(neck, 58), R(neck + (S - neck) * 0.55, 70 - m * 3), R(S - 1, 80), R(pit, 104), R(rib, 128), R(waist, 158), R(belly, 180), R(hip, 199),
    R(thighO + f * 1.5, 222), R(thighO, 255), R(thighO * 0.62 + 7, 290), R(kneeO, 306), R(calfO, 340), R(14 + f * 1.5, 382), R(12.5, 404), R(16.5, 424), R(13.5, 432), R(3.4, 431), R(4, 404), R(4.4, 382),
    R(calfI, 344), R(kneeI, 306), R(thighI + 1.5, 280), R(thighI, 240), R(0, 214),
  ];
  const left = mirror(torso.slice(0, -1)).reverse();
  const body = smooth([...torso, ...left.slice(1)]);

  // Arms hang slightly away from the body, the hand beside the thigh.
  const ua = (6 + m * 5.5 + f * 4.2) * (1 - fem * 0.12), fa = (5 + m * 3.2 + f * 2.6) * (1 - fem * 0.1);
  const wristX = Math.max(rib + 2, belly + 1.5, hip + 0.5) + ua * 0.55 + 3.5;
  const ax = (y: number) => S - 1 + (wristX - (S - 1)) * ((y - 92) / 144);
  const arm: P[] = [
    R(S - 3, 78), R(S + delt, 92), R(ax(128) + ua, 128), R(ax(170) + ua * 0.72, 170), R(ax(192) + fa, 192), R(ax(236) + 3.4, 236),
    R(ax(250) + 4.6, 250), R(ax(262) + 1.5, 268), R(ax(262) - 3, 264), R(ax(250) - 3.8, 250), R(ax(236) - 3.1, 236), R(ax(192) - fa * 0.85, 192),
    R(ax(170) - ua * 0.6, 170), R(ax(128) - ua * 0.85, 128), R(pit - 3, 106),
  ];
  const arms = [smooth(arm), smooth(mirror(arm).reverse())];

  // Muscle lines (right side, mirrored), with their opacity.
  const lines: { d: string; o: number; w?: number; hl?: boolean }[] = [];
  // Shadow areas (filled), for depth under the muscles.
  const shades: { pts: P[]; o: number }[] = [];
  const both = (pts: P[], o: number, w?: number, open = true) => {
    lines.push({ d: smooth(pts, !open), o, w }, { d: smooth(mirror(pts), !open), o, w });
  };
  // Collarbones and neck.
  both([R(3, 70), R(12, 69), R(S - 6, 74)], 0.25 + d * 0.3);
  if (d > 0.3) both([R(neck - 1.5, 58), R(4, 68)], d * 0.5);
  // Chest: male pecs / female bust line is under the bra.
  if (fem < 1) {
    const pw = pit - 2, py = 112 + m * 4 + f * 6;
    both([R(1.5, py - 4), R(pw * 0.45, py + 3), R(pw - 3, py - 1), R(pit - 1, 98)], (0.15 + d * 0.65) * (1 - fem), 1.6);
    shades.push({ pts: [R(1.5, py - 3), R(pw * 0.45, py + 4), R(pw - 3, py), R(pit - 1, 99), R(pw - 3, py + 6), R(pw * 0.45, py + 10), R(2, py + 5)], o: d * 0.35 * (1 - fem) });
    if (d > 0.25) lines.push({ d: `M${C} 80 L${C} ${py - 2}`, o: d * 0.5 * (1 - fem) });
  }
  // Abs: centre line, three pairs of blocks, V lines to the groin.
  if (d > 0.15) {
    lines.push({ d: `M${C} ${126} L${C} 188`, o: d * 0.55 });
    [138, 152, 167].forEach((y, i) => both([R(1, y + 1), R(6.5, y - 1), R(11 - i * 0.5, y + 1)], d * (0.55 - i * 0.08), 1.4));
    shades.push({ pts: [R(12, 128), R(15, 150), R(13, 180), R(waist - 1, 176), R(rib - 2, 140)], o: d * 0.25 });
    both([R(12, 128), R(13.5, 150), R(12, 178)], d * 0.4);
  }
  if (d > 0.35) both([R(waist - 1, 182), R(hip * 0.55, 198), R(6, 210)], d * 0.55, 1.3);
  if (d > 0.55) [132, 140, 148].forEach((y) => both([R(rib - 3, y), R(rib - 7, y + 3)], (d - 0.5) * 0.8));
  // Shoulders and arms.
  both([R(S - 5, 84), R(S + delt * 0.3, 100), R(ax(112) + ua * 0.2, 114)], 0.1 + d * 0.55);
  if (d > 0.2) both([R(ax(140) - ua * 0.5, 140), R(ax(152) - ua * 0.1, 158), R(ax(166) + ua * 0.1, 168)], d * 0.5);
  if (d > 0.3) both([R(ax(176) + fa * 0.6, 178), R(ax(200) + fa * 0.1, 206)], d * 0.4);
  // Legs: quad sweep, inner teardrop, kneecap, calf.
  both([R(thighO - 3, 238), R(thighO - 4, 262), R(kneeO - 1, 296)], 0.08 + d * 0.5);
  if (d > 0.2) both([R(hip * 0.55, 226), R(hip * 0.5, 258), R(kneeI + 5, 292)], d * 0.35);
  if (d > 0.45) both([R(kneeI + 5, 297), R((kneeI + kneeO) / 2, 303), R(kneeO - 4.5, 297)], d * 0.3);
  if (d > 0.25) both([R(calfI + 1, 322), R(calfI + 3, 348), R(calfI + 2, 370)], d * 0.4);
  // Fat: navel, belly fold, softness under the chest.
  if (f > 0.25) {
    lines.push({ d: `M${C - 1.4} 172 a1.4 1.8 0 1 0 2.8 0 a1.4 1.8 0 1 0 -2.8 0`, o: 0.35 });
    both([R(2, 186 + f * 4), R(belly * 0.6, 184 + f * 2), R(belly - 2, 176)], f * 0.45, 1.4);
  } else lines.push({ d: `M${C - 1} 170 a1 1.4 0 1 0 2 0 a1 1.4 0 1 0 -2 0`, o: 0.3 });
  if (f > 0.5) both([R(waist - 1, 150), R(waist + 1, 162)], f * 0.3);

  // Deltoid and biceps shadows.
  if (d > 0.3) shades.push({ pts: [R(ax(118) - ua * 0.8, 112), R(ax(140) - ua * 0.9, 140), R(ax(165) - ua * 0.5, 166), R(ax(140) - ua * 0.3, 142)], o: d * 0.3 });
  const shadePaths = shades.flatMap((x) => [{ d: smooth(x.pts), o: x.o }, { d: smooth(mirror(x.pts)), o: x.o }]);
  return { body, arms, lines, shadePaths, S, pit, fem, hip, neck, f, d };
}

// Full SVG markup (string), used by the React component and by tests.
export function bodySvg(b: BodySpec, id: string): string {
  const s = bodyShapes(b);
  const skin = `url(#sk-${id})`;
  const hairColor = "#3B2418";
  const bra = s.fem >= 1
    ? `<g clip-path="url(#cl-${id})"><path d="M0 104 Q${C - 22} 98 ${C - 12} ${102 + b.fat * 2} Q${C} 110 ${C + 12} ${102 + b.fat * 2} Q${C + 22} 98 200 104 L200 ${128 + b.fat * 6} Q${C + 14} ${136 + b.fat * 8} ${C} ${130 + b.fat * 6} Q${C - 14} ${136 + b.fat * 8} 0 ${128 + b.fat * 6} Z" fill="#17152B"/><path d="M${C - 13} 72 L${C - 19} 102 M${C + 13} 72 L${C + 19} 102" stroke="#17152B" stroke-width="3.2"/><path d="M${C - 22} ${120 + b.fat * 4} Q${C - 11} ${127 + b.fat * 6} ${C - 1} ${120 + b.fat * 4} M${C + 22} ${120 + b.fat * 4} Q${C + 11} ${127 + b.fat * 6} ${C + 1} ${120 + b.fat * 4}" stroke="#34305A" stroke-width="1.5" fill="none"/></g>`
    : "";
  const lines = s.lines.filter((l) => l.o > 0.02).map((l) => `<path d="${l.d}" stroke="#6B3A22" stroke-opacity="${r1(Math.min(0.85, l.o))}" stroke-width="${l.w ?? 1.1}"/>`).join("");
  const hair0 = s.fem >= 1
    ? `<path d="M${C - 17} 34 Q${C - 18} 12 ${C} 12 Q${C + 18} 12 ${C + 17} 34 Q${C + 22} 50 ${C + 16} 64 Q${C + 12} 52 ${C + 13} 36 Q${C} 22 ${C - 13} 36 Q${C - 12} 52 ${C - 16} 64 Q${C - 22} 50 ${C - 17} 34 Z" fill="${hairColor}"/>`
    : s.fem > 0 ? `<path d="M${C - 16} 30 Q${C - 15} 13 ${C} 13 Q${C + 15} 13 ${C + 16} 30 Q${C + 9} 21 ${C} 22 Q${C - 9} 21 ${C - 16} 30 Z" fill="${hairColor}"/>`
    : `<path d="M${C - 15.5} 29 Q${C - 15} 14 ${C} 14 Q${C + 15} 14 ${C + 15.5} 29 Q${C + 8} 22 ${C} 23 Q${C - 8} 22 ${C - 15.5} 29 Z" fill="${hairColor}"/>`;
  const hair = `<g transform="translate(${C} 34) scale(1.1) translate(${-C} -36)">${hair0}</g>`;
  return `<svg viewBox="0 0 200 440" xmlns="http://www.w3.org/2000/svg">
<defs>
<linearGradient id="sk-${id}" x1="0" x2="1"><stop offset="0" stop-color="#B9825F"/><stop offset=".28" stop-color="#D9A27F"/><stop offset=".5" stop-color="#E7B48F"/><stop offset=".72" stop-color="#D9A27F"/><stop offset="1" stop-color="#B9825F"/></linearGradient>
<radialGradient id="hd-${id}" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#E7B48F"/><stop offset="1" stop-color="#BF8763"/></radialGradient>
<clipPath id="cl-${id}"><path d="${s.body}"/></clipPath>
</defs>
<rect x="${C - s.neck}" y="46" width="${s.neck * 2}" height="20" fill="${skin}"/>
<path d="${s.body}" fill="${skin}" stroke="#A8704E" stroke-width=".8"/>
<g clip-path="url(#cl-${id})">${s.shadePaths.filter((x) => x.o > 0.02).map((x) => `<path d="${x.d}" fill="#8A5234" fill-opacity="${r1(x.o)}"/>`).join("")}</g>
${s.arms.map((a) => `<path d="${a}" fill="${skin}" stroke="#A8704E" stroke-width=".8"/>`).join("")}
<g clip-path="url(#cl-${id})"><rect x="0" y="193" width="200" height="${44 + b.fat * 8}" fill="#17152B"/></g>
${bra}
<g fill="none" stroke-linecap="round" stroke-linejoin="round">${lines}</g>
<ellipse cx="${C}" cy="34" rx="${17 + b.fat * 1.5}" ry="21" fill="url(#hd-${id})"/>
<ellipse cx="${C - 17 - b.fat * 1.5}" cy="37" rx="2.6" ry="4.4" fill="#C98E6B"/><ellipse cx="${C + 17 + b.fat * 1.5}" cy="37" rx="2.6" ry="4.4" fill="#C98E6B"/>
${hair}
</svg>`;
}
