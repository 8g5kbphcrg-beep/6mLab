// Exercise illustrations: a side-view figure drawn from joint angles, in successive positions.
//
// Proportions follow Winter's anthropometric data (segment length / body height H = 170):
// thigh 0.245 H, shank 0.246 H, trunk (hip → shoulder) 0.288 H, upper arm 0.186 H,
// forearm 0.146 H, ankle height 0.039 H, foot length 0.152 H.
//
// Angles are in degrees, absolute, measured from "pointing down" and positive towards the
// direction the figure faces (right): 0 = down, 90 = forward, 180 = up, -90 = backward.
// torso = lean of the trunk from upright (hip → shoulder), positive = leaning forward.
// foot = direction heel → toes: 72 is a flat foot, lower values raise the heel.
// Contacts ("heel", "toe", "knee", "hand", "elbow", "sh" = shoulder blades on a bench) are
// placed exactly on the floor or the bench; "solve" adjusts angles so every contact touches.

const L = { torso: 49, neck: 9, head: 11, upper: 32, fore: 25, hand: 8, thigh: 42, shin: 42, toe: 21, heel: 7.7 };
const FLAT = 72; // flat foot: toe and heel on the floor, ankle 6.6 above it
const rad = (d) => (d * Math.PI) / 180;
const go = ([x, y], len, a) => [x + len * Math.sin(rad(a)), y + len * Math.cos(rad(a))];

const SIDE_KEYS = ["thigh", "shin", "foot", "upper", "fore", "hand"];
const norm = (p) => {
  const side = (s = {}) => ({ thigh: 0, shin: 0, foot: FLAT, upper: 0, fore: 0, ...s, hand: s.hand ?? s.fore ?? 0 });
  return { torso: 0, head: 0, lift: 0, ...p, near: side(p.near), far: side(p.far ?? p.near) };
};

function joints(p) {
  const hip = [0, 0];
  const sh = go(hip, L.torso, 180 - p.torso);
  const neck = go(sh, L.neck, 180 - p.torso - p.head);
  const head = go(neck, L.head, 180 - p.torso - p.head);
  const side = (s) => {
    const knee = go(hip, L.thigh, s.thigh), ankle = go(knee, L.shin, s.shin);
    const toe = go(ankle, L.toe, s.foot), heel = go(ankle, L.heel, s.foot - 103);
    const elbow = go(sh, L.upper, s.upper), wrist = go(elbow, L.fore, s.fore), hand = go(wrist, L.hand, s.hand);
    return { knee, ankle, toe, heel, elbow, wrist, hand };
  };
  return { hip, sh, neck, head, near: side(p.near), far: side(p.far) };
}

const get = (j, spec) => (spec.includes(".") ? j[spec.split(".")[0]][spec.split(".")[1]] : j[spec]);

// Adjusts the listed angles by the same amount until point a is level with point b (+ dy).
function solve(p, { vary, a, b, dy = 0 }) {
  const f = (d) => {
    const q = structuredClone(p);
    // "-name" turns that angle the other way (legs following a leaning trunk).
    for (const v of vary) { const sg = v.startsWith("-") ? -1 : 1, k = v.replace(/^-/, ""); const [s, key] = k.includes(".") ? k.split(".") : [null, k]; if (s) q[s][key] += sg * d; else q[key] += sg * d; }
    const j = joints(q);
    return { q, err: get(j, a)[1] - (b === "floor" ? 0 : get(j, b)[1]) - dy };
  };
  // Walk outwards from 0 until the error changes sign, then bisect between the last two steps.
  const e0 = Math.sign(f(0).err);
  if (e0 === 0) return p;
  let lo = null, hi = null;
  for (let k = 1; k <= 120 && lo === null; k++)
    for (const s of [k, -k]) if (lo === null && Math.sign(f(s).err) !== e0) { lo = s - Math.sign(s); hi = s; }
  if (lo === null) return p;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (Math.sign(f(mid).err) === e0) lo = mid; else hi = mid; }
  return f((lo + hi) / 2).q;
}

const G = 190, BENCH = 42;
const every = (j, fn) => ({ hip: fn(j.hip), sh: fn(j.sh), neck: fn(j.neck), head: fn(j.head), near: Object.fromEntries(Object.entries(j.near).map(([k, v]) => [k, fn(v)])), far: Object.fromEntries(Object.entries(j.far).map(([k, v]) => [k, fn(v)])) });
const allPts = (j) => [j.hip, j.sh, j.neck, [j.head[0], j.head[1] + L.head], ...Object.values(j.near), ...Object.values(j.far)];

// Pose → joints in frame coordinates: contact on the floor (or shoulders on the bench).
function place(raw) {
  let p = norm(raw);
  for (const s of p.solve ?? []) p = solve(p, s);
  const j = joints(p);
  let dy;
  if (p.bench) dy = G - BENCH - 4 - j.sh[1];
  else if (p.contact) dy = G - p.lift - get(j, p.contact)[1];
  else dy = G - p.lift - Math.max(...allPts(j).map((q) => q[1]));
  return { p, j: every(j, (q) => [q[0], q[1] + dy]) };
}

// ---- Drawing ------------------------------------------------------------------------------
const INK = "#100A24", FAR = "#A9A3C7", JERSEY = "#FF5A1F", GEAR = "#3A3452";
const f1 = (v) => v.toFixed(1);
const d = (ps) => "M" + ps.map((q) => `${f1(q[0])} ${f1(q[1])}`).join("L");
const stroke = (w, c) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

// Each drawable part: [points(j), width, colour]. Kept in a fixed order so paths can be animated.
// The far limbs are drawn 5 units behind, so they stay visible when they mirror the near ones.
const back = (q) => [q[0] - 5, q[1]];
const parts = (j) => [
  [[j.far.heel, j.far.toe].map(back), 6, FAR], [[j.hip, j.far.knee, j.far.ankle].map(back), 10, FAR], [[j.sh, j.far.elbow, j.far.wrist, j.far.hand].map(back), 7, FAR],
  [[j.hip, j.sh], 15, JERSEY], [[j.sh, j.neck], 7, INK],
  [[j.near.heel, j.near.toe], 6, INK], [[j.hip, j.near.knee, j.near.ankle], 10, INK], [[j.sh, j.near.elbow, j.near.wrist, j.near.hand], 7, INK],
];

// Equipment, drawn from the joints so it follows the movement.
const gear = {
  dumbbells: (j) => [j.far.wrist, j.near.wrist].map((w) => `<g transform="translate(${f1(w[0])} ${f1(w[1])})"><rect x="-10" y="-2.5" width="20" height="5" rx="2" fill="${GEAR}"/><rect x="-12" y="-7" width="6" height="14" rx="2" fill="${JERSEY}"/><rect x="6" y="-7" width="6" height="14" rx="2" fill="${JERSEY}"/></g>`).join(""),
  goblet: (j) => { const w = j.near.wrist; return `<g transform="translate(${f1(w[0] + 3)} ${f1(w[1] - 4)})"><rect x="-2.5" y="-12" width="5" height="24" rx="2" fill="${GEAR}"/><rect x="-8" y="-15" width="16" height="7" rx="2" fill="${JERSEY}"/><rect x="-8" y="8" width="16" height="7" rx="2" fill="${JERSEY}"/></g>`; },
  barBack: (j) => { const c = go(j.sh, 5, 180 - (Math.atan2(j.sh[0] - j.hip[0], j.hip[1] - j.sh[1]) * 180) / Math.PI - 180); return `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="17" fill="none" stroke="${GEAR}" stroke-width="5"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="4" fill="${GEAR}"/>`; },
  barHip: (j) => `<circle cx="${f1(j.hip[0])}" cy="${f1(j.hip[1] - 22)}" r="17" fill="none" stroke="${GEAR}" stroke-width="5"/><circle cx="${f1(j.hip[0])}" cy="${f1(j.hip[1] - 22)}" r="4" fill="${GEAR}"/>`,
};
const bench = (j) => `<rect x="${f1(j.sh[0] - 22)}" y="${G - BENCH}" width="40" height="${BENCH}" rx="3" fill="#ECE9F7" stroke="#C9C4DD" stroke-width="2"/>`;
// Lying bench (bench press): from above the shoulders to just past the hips.
const flatBench = (j) => { const a = Math.min(j.sh[0], j.hip[0]) - 14, b = Math.max(j.sh[0], j.hip[0]) + 10; return `<rect x="${f1(a)}" y="${G - BENCH}" width="${f1(b - a)}" height="${BENCH}" rx="3" fill="#ECE9F7" stroke="#C9C4DD" stroke-width="2"/>`; };

const draw = (j, p) => {
  let s = "";
  if (p.bench) s += bench(j);
  if (p.flatBench) s += flatBench(j);
  s += parts(j).map(([ps, w, c]) => `<path d="${d(ps)}" ${stroke(w, c)}/>`).join("");
  s += `<circle cx="${f1(j.head[0])}" cy="${f1(j.head[1])}" r="${L.head}" fill="${INK}"/>`;
  for (const g of p.gear ?? []) s += gear[g](j);
  return s;
};

// ---- Exercises ----------------------------------------------------------------------------
// Straight body from heels to head, leaning by t (push-up, plank): legs point opposite the trunk.
const plankBody = (t, extra) => ({ torso: t, head: -8, near: { thigh: -t, shin: -t, foot: 90 - t, ...extra.near }, far: { thigh: -t, shin: -t, foot: 90 - t, ...(extra.far ?? extra.near) } });
const planks = ["torso", "-near.thigh", "-near.shin", "-near.foot", "-far.thigh", "-far.shin", "-far.foot"];

const defs = {
  squat: {
    poids: [
      { near: { upper: 8, fore: 8 } },
      { torso: 42, near: { thigh: 92, shin: -32, upper: 88, fore: 88 } },
    ],
    materiel: [
      { gear: ["goblet"], near: { upper: 15, fore: 160 } },
      { gear: ["goblet"], torso: 24, near: { thigh: 95, shin: -36, upper: 40, fore: 170 } },
    ],
  },
  "fente-arriere": {
    poids: [
      { near: { upper: 3, fore: 3 } },
      { torso: 3, contact: "near.heel", near: { thigh: 90, shin: 2, upper: 3, fore: 3 }, far: { thigh: -8, shin: -70, foot: 40, upper: -4, fore: -4 },
        solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel" }] },
    ],
    materiel: [
      { gear: ["dumbbells"], near: { upper: 3, fore: 3 } },
      { gear: ["dumbbells"], torso: 3, contact: "near.heel", near: { thigh: 90, shin: 2, upper: 3, fore: 3 }, far: { thigh: -8, shin: -70, foot: 40, upper: -4, fore: -4 },
        solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel" }] },
    ],
  },
  pompes: {
    poids: [
      { ...plankBody(76, { near: { upper: 0, fore: 0, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] },
      { ...plankBody(84, { near: { upper: -118, fore: -4, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] },
    ],
    materiel: [
      { flatBench: true, torso: -90, head: 0, contact: "near.heel", near: { thigh: 70, shin: -5, upper: 180, fore: 180, hand: 180 }, gear: ["dumbbells"],
        solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 4 }] },
      { flatBench: true, torso: -90, head: 0, contact: "near.heel", near: { thigh: 70, shin: -5, upper: 98, fore: 180, hand: 180 }, gear: ["dumbbells"],
        solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 4 }] },
    ],
  },
  planche: {
    poids: [{ ...plankBody(80, { near: { upper: 0, fore: 90, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.elbow", b: "near.toe", dy: -3 }] }],
  },
  "squat-jump": {
    poids: [
      { torso: 38, near: { thigh: 70, shin: -30, upper: -40, fore: -30 } },
      { torso: -2, lift: 26, near: { thigh: 0, shin: -3, foot: 22, upper: 156, fore: 164 } },
    ],
  },
  nordic: {
    poids: [
      { contact: "near.knee", near: { thigh: 0, shin: -90, foot: -100, upper: 15, fore: 110 } },
      { contact: "near.knee", torso: 62, near: { thigh: -62, shin: -90, foot: -100, upper: 95, fore: 80 } },
    ],
  },
  "hip-thrust": {
    poids: [
      { bench: true, torso: -42, head: 20, near: { thigh: 122, shin: 0, upper: -95, fore: -95 }, solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 4 }] },
      { bench: true, torso: -90, head: 35, near: { thigh: 90, shin: 0, upper: -95, fore: -95 }, solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 4 }] },
    ],
    materiel: [
      { bench: true, gear: ["barHip"], torso: -42, head: 20, near: { thigh: 122, shin: 0, upper: 108, fore: 8 }, solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 4 }] },
      { bench: true, gear: ["barHip"], torso: -90, head: 35, near: { thigh: 90, shin: 0, upper: 105, fore: 125 }, solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 4 }] },
    ],
  },
};

// ---- Output -------------------------------------------------------------------------------
const bbox = (j) => { const q = allPts(j).concat([[j.head[0] - L.head, j.head[1] - L.head], [j.head[0] + L.head, j.head[1]]]); return [Math.min(...q.map((a) => a[0])), Math.max(...q.map((a) => a[0]))]; };
const floor = (W) => `<path d="M4 ${G}H${f1(W - 4)}" stroke="#C9C4DD" stroke-width="2"/>`;
const TOP = 225; // same height for every exercise, so they all share one scale

export const variants = (id) => Object.keys(defs[id] ?? {});

// Static: positions side by side with arrows (PDF).
export function figure(id, variant) {
  const poses = defs[id]?.[variant ?? variants(id)[0]];
  if (!poses) return null;
  const gap = 34, pad = 14;
  let x = pad, svg = "";
  poses.forEach((raw, i) => {
    const { p, j } = place(raw);
    const [x1, x2] = bbox(j);
    const extraL = p.bench || p.flatBench ? 26 : 0;
    const J = every(j, (q) => [q[0] - x1 + x + extraL, q[1]]);
    svg += draw(J, p);
    x += x2 - x1 + extraL;
    if (i < poses.length - 1) { svg += `<path d="M${f1(x + 8)} ${G - 80}h${gap - 16}m-7 -7l7 7l-7 7" ${stroke(3.5, JERSEY)}/>`; x += gap; }
  });
  const W = x + pad;
  return `<svg viewBox="0 ${G - TOP} ${f1(W)} ${TOP + 6}" xmlns="http://www.w3.org/2000/svg">${floor(W)}${svg}</svg>`;
}

// Animated (SVG + SMIL, for the website): angles interpolated between positions, eased, looping.
const lerp = (a, b, t) => {
  const m = (x, y) => x + (y - x) * t;
  const side = (s, u) => Object.fromEntries(SIDE_KEYS.map((k) => [k, m(s[k], u[k])]));
  return { ...a, torso: m(a.torso, b.torso), head: m(a.head, b.head), lift: m(a.lift, b.lift), near: side(a.near, b.near), far: side(a.far, b.far), solve: undefined };
};

export function animatedFigure(id, variant, { seconds = 1.4, steps = 14 } = {}) {
  const poses = defs[id]?.[variant ?? variants(id)[0]];
  if (!poses) return null;
  const solved = poses.map((raw) => place(raw).p);
  const seq = solved.length > 1 ? [...solved, ...solved.slice(0, -1).reverse()] : [solved[0], solved[0]];
  const frames = [];
  for (let i = 0; i < seq.length - 1; i++)
    for (let k = 0; k < steps; k++) { const t = k / steps; frames.push(lerp(seq[i], seq[i + 1], t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)); }
  frames.push(seq[seq.length - 1]);
  const placedF = frames.map((p) => place({ ...p, near: p.near, far: p.far }).j);
  const xs = placedF.flatMap(bbox);
  const pad = 30, x1 = Math.min(...xs), W = Math.max(...xs) - x1 + 2 * pad;
  const F = placedF.map((j) => every(j, (q) => [q[0] - x1 + pad, q[1]]));
  const dur = `${seconds * (seq.length - 1)}s`;
  const anim = (attr, vals) => `<animate attributeName="${attr}" dur="${dur}" repeatCount="indefinite" values="${vals.join(";")}"/>`;
  const p0 = solved[0];
  let svg = floor(W);
  if (p0.bench) svg += bench(F[0]);
  if (p0.flatBench) svg += flatBench(F[0]);
  parts(F[0]).forEach((part, i) => { svg += `<path d="${d(part[0])}" ${stroke(part[1], part[2])}>${anim("d", F.map((j) => d(parts(j)[i][0])))}</path>`; });
  svg += `<circle r="${L.head}" fill="${INK}" cx="${f1(F[0].head[0])}" cy="${f1(F[0].head[1])}">${anim("cx", F.map((j) => f1(j.head[0])))}${anim("cy", F.map((j) => f1(j.head[1])))}</circle>`;
  // Equipment follows the body: one group per frame, shown in turn.
  if (p0.gear?.length) {
    const n = F.length;
    F.forEach((j, i) => {
      const vis = Array.from({ length: n }, (_, k) => (k === i ? "visible" : "hidden"));
      svg += `<g visibility="${i === 0 ? "visible" : "hidden"}">${p0.gear.map((g) => gear[g](j)).join("")}<animate attributeName="visibility" dur="${dur}" repeatCount="indefinite" calcMode="discrete" values="${vis.join(";")}"/></g>`;
    });
  }
  return `<svg viewBox="0 ${G - TOP} ${f1(W)} ${TOP + 6}" xmlns="http://www.w3.org/2000/svg">${svg}</svg>`;
}

// Checks that contacts really touch the floor: returns the gap (0 = on the floor) per pose.
export function contactReport(id, variant) {
  return defs[id][variant].map((raw) => {
    const { p, j } = place(raw);
    const low = Math.max(...allPts(j).map((q) => q[1]));
    const pts = ["near.heel", "near.toe", "near.knee", "near.wrist", "near.elbow", "far.toe", "far.knee"].map((k) => [k, +(G - get(j, k)[1]).toFixed(1)]);
    return { belowFloor: +(low - G).toFixed(1), ...Object.fromEntries(pts) };
  });
}

export const figureIds = Object.keys(defs);
