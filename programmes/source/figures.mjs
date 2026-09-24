// Exercise illustrations: a figure drawn from joint angles, in successive positions.
//
// Proportions follow Winter's anthropometric data (segment length / body height H = 170):
// thigh 0.245 H, shank 0.246 H, trunk (hip → shoulder) 0.288 H, upper arm 0.186 H,
// forearm 0.146 H, ankle height 0.039 H, foot length 0.152 H.
//
// Side view (default): angles in degrees, absolute, from "pointing down", positive towards the
// direction the figure faces (right): 0 = down, 90 = forward, 180 = up, -90 = backward.
// torso = lean of the trunk (hip → shoulder), positive = forward. foot = heel → toes direction:
// 72 is a flat foot, lower values raise the heel.
// Front view (view: "front"): the figure faces us; positive angles open the limb outwards
// (near = right of the picture, far = left). foreLen / upperLen shorten a segment that points
// towards us.
//
// A pose can also set: x (move along the floor), lift (height in the air), flip (face left),
// contact (point placed on the floor), pin (point placed at an x), support (shoulders resting at that height: 0 on the
// floor, 42 on a bench), hang (hands at that height, e.g. a pull-up bar) and solve (adjust
// angles until two points are level). contactReport() checks that nothing goes through the
// floor.

import { defs } from "./figures-poses.mjs";

const L = { torso: 49, neck: 9, head: 11, upper: 32, fore: 25, hand: 8, thigh: 42, shin: 42, toe: 21, heel: 7.7, hipW: 8, shW: 15 };
const FLAT = 72;
const rad = (d) => (d * Math.PI) / 180;
const go = ([x, y], len, a) => [x + len * Math.sin(rad(a)), y + len * Math.cos(rad(a))];
const SIDE_KEYS = ["thigh", "shin", "foot", "upper", "fore", "hand", "foreLen", "upperLen", "thighLen", "shinLen"];

const norm = (p) => {
  const side = (s = {}) => ({ thigh: 0, shin: 0, foot: p.view === "front" ? 0 : FLAT, upper: 0, fore: 0, foreLen: 1, upperLen: 1, thighLen: 1, shinLen: 1, ...s, hand: s.hand ?? s.fore ?? 0 });
  return { torso: 0, head: 0, lift: 0, x: 0, ...p, near: side(p.near), far: side(p.far ?? p.near) };
};

function joints(p) {
  const front = p.view === "front";
  const hipC = [0, 0];
  const shC = go(hipC, L.torso, 180 - p.torso);
  const neck = go(shC, L.neck, 180 - p.torso - p.head);
  const head = go(neck, L.head, 180 - p.torso - p.head);
  const side = (s, sign) => {
    // Front view: limbs start from each hip / shoulder and open outwards on their own side.
    const hip = front ? go(hipC, L.hipW, 90 * sign - p.torso) : hipC;
    const sh = front ? go(shC, L.shW, 90 * sign - p.torso) : shC;
    const a = (v) => (front ? v * sign : v);
    const knee = go(hip, L.thigh * s.thighLen, a(s.thigh)), ankle = go(knee, L.shin * s.shinLen, a(s.shin));
    const toe = front ? go(ankle, 7, a(s.foot + 90)) : go(ankle, L.toe, s.foot);
    const heel = front ? go(ankle, 7, a(s.foot - 90)) : go(ankle, L.heel, s.foot - 103);
    const elbow = go(sh, L.upper * s.upperLen, a(s.upper)), wrist = go(elbow, L.fore * s.foreLen, a(s.fore)), hand = go(wrist, L.hand * Math.min(1, s.foreLen + 0.3), a(s.hand));
    return { hip, sh, knee, ankle, toe, heel, elbow, wrist, hand };
  };
  const j = { hip: hipC, sh: shC, neck, head, near: side(p.near, 1), far: side(p.far, -1) };
  if (!front) { j.near.hip = j.far.hip = hipC; j.near.sh = j.far.sh = shC; }
  return j;
}

const every = (j, fn) => ({ hip: fn(j.hip), sh: fn(j.sh), neck: fn(j.neck), head: fn(j.head), near: Object.fromEntries(Object.entries(j.near).map(([k, v]) => [k, fn(v)])), far: Object.fromEntries(Object.entries(j.far).map(([k, v]) => [k, fn(v)])) });
const get = (j, spec) => (spec.includes(".") ? j[spec.split(".")[0]][spec.split(".")[1]] : j[spec]);
const allPts = (j) => [j.hip, j.sh, j.neck, [j.head[0], j.head[1] + L.head], ...Object.values(j.near), ...Object.values(j.far)];

// Adjusts the listed angles by the same amount until point a is level with point b (+ dy).
// "-name" turns that angle the other way (legs following a leaning trunk).
function solve(p, { vary, a, b, dy = 0 }) {
  const f = (d) => {
    const q = structuredClone(p);
    for (const v of vary) { const sg = v.startsWith("-") ? -1 : 1, k = v.replace(/^-/, ""); const [s, key] = k.includes(".") ? k.split(".") : [null, k]; if (s) q[s][key] += sg * d; else q[key] += sg * d; }
    const j = joints(q);
    return { q, err: get(j, a)[1] - get(j, b)[1] - dy };
  };
  const e0 = Math.sign(f(0).err);
  if (e0 === 0) return p;
  let lo = null, hi = null;
  for (let k = 1; k <= 120 && lo === null; k++) for (const s of [k, -k]) if (lo === null && Math.sign(f(s).err) !== e0) { lo = s - Math.sign(s); hi = s; }
  if (lo === null) return p;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (Math.sign(f(mid).err) === e0) lo = mid; else hi = mid; }
  return f((lo + hi) / 2).q;
}

const G = 190, BENCH = 42, TOP = 235;

// Pose → joints in world coordinates (x from the pose's x, y down, floor at G).
export function place(raw) {
  let p = norm(raw);
  for (const s of p.solve ?? []) p = solve(p, s);
  let j = joints(p);
  if (p.flip) j = every(j, (q) => [-q[0], q[1]]);
  let dy;
  if (p.support !== undefined) dy = G - p.support - 5 - j.sh[1];
  else if (p.hang !== undefined) dy = G - p.hang - j.near.hand[1];
  else if (p.contact) dy = G - p.lift - get(j, p.contact)[1];
  else dy = G - p.lift - Math.max(...allPts(j).map((q) => q[1]));
  // pin: [point, x] moves the figure along the floor so that point sits at x (hands on a bar…).
  const dx = p.pin ? p.pin[1] - get(j, p.pin[0])[0] : p.x;
  p = { ...p, x: dx };
  return { p, j: every(j, (q) => [q[0] + dx, q[1] + dy]) };
}

// ---- Drawing ------------------------------------------------------------------------------
const INK = "#100A24", FAR = "#A9A3C7", JERSEY = "#FF5A1F", GEAR = "#3A3452", SCENE = "#ECE9F7", EDGE = "#C9C4DD";
const f1 = (v) => v.toFixed(1);
const d = (ps) => "M" + ps.map((q) => `${f1(q[0])} ${f1(q[1])}`).join("L");
const stroke = (w, c) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;

// Drawable parts, in a fixed order so each path can be animated. Side view: the far limbs are
// light and 5 units behind. Front view: both sides dark, trunk drawn as a band.
const back = (q) => [q[0] - 5, q[1]];
const parts = (j, front) => {
  const fb = front ? (q) => q : back, fc = front ? INK : FAR;
  return [
    [[j.far.heel, j.far.toe].map(fb), 6, fc], [[j.far.hip, j.far.knee, j.far.ankle].map(fb), 10, fc], [[j.far.sh, j.far.elbow, j.far.wrist, j.far.hand].map(fb), 7, fc],
    front ? [[j.far.hip, j.far.sh, j.near.sh, j.near.hip, j.far.hip], 9, JERSEY] : [[j.hip, j.sh], 15, JERSEY],
    [[j.sh, j.neck], 7, INK],
    [[j.near.heel, j.near.toe], 6, INK], [[j.near.hip, j.near.knee, j.near.ankle], 10, INK], [[j.near.sh, j.near.elbow, j.near.wrist, j.near.hand], 7, INK],
  ];
};

const plate = (c) => `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="17" fill="none" stroke="${GEAR}" stroke-width="5"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="4" fill="${GEAR}"/>`;
const dumbbell = (w) => `<g transform="translate(${f1(w[0])} ${f1(w[1])})"><rect x="-10" y="-2.5" width="20" height="5" rx="2" fill="${GEAR}"/><rect x="-12" y="-7" width="6" height="14" rx="2" fill="${JERSEY}"/><rect x="6" y="-7" width="6" height="14" rx="2" fill="${JERSEY}"/></g>`;
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];

// Equipment carried by the body (follows the joints). ctx holds the fixed scene points.
const gear = {
  dumbbells: (j) => dumbbell(j.far.wrist) + dumbbell(j.near.wrist),
  dumbbell: (j) => dumbbell(j.near.wrist),
  goblet: (j) => { const w = j.near.wrist; return `<g transform="translate(${f1(w[0] + 3)} ${f1(w[1] - 4)})"><rect x="-2.5" y="-12" width="5" height="24" rx="2" fill="${GEAR}"/><rect x="-8" y="-15" width="16" height="7" rx="2" fill="${JERSEY}"/><rect x="-8" y="8" width="16" height="7" rx="2" fill="${JERSEY}"/></g>`; },
  barBack: (j) => plate(go(j.sh, 6, Math.atan2(j.sh[0] - j.hip[0], j.sh[1] - j.hip[1]) * 180 / Math.PI + 180 + 70)),
  barHip: (j) => plate([j.hip[0], j.hip[1] - 22]),
  ball: (j) => { const c = mid(j.near.hand, j.far.hand); return `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="9" fill="#FFE14A" stroke="${INK}" stroke-width="1.5"/>`; },
  backpack: (j) => { const c = go(mid(j.hip, j.sh), 10, Math.atan2(j.sh[0] - j.hip[0], j.sh[1] - j.hip[1]) * 180 / Math.PI + 90); return `<rect x="${f1(c[0] - 7)}" y="${f1(c[1] - 12)}" width="14" height="24" rx="4" fill="${GEAR}" transform="rotate(${f1(-Math.atan2(j.sh[0] - j.hip[0], j.hip[1] - j.sh[1]) * 180 / Math.PI)} ${f1(c[0])} ${f1(c[1])})"/>`; },
  band: (j, ctx) => ctx.post ? `<path d="${d([ctx.post, j.near.wrist])}" ${stroke(2.5, JERSEY)}/>` : "",
  bandHands: (j) => `<path d="${d([j.near.wrist, j.far.wrist])}" ${stroke(2.5, JERSEY)}/>`,
};

// Fixed scene, in world coordinates (x along the floor, h = height above the floor).
const sceneSvg = (sc, sx) => {
  let s = "";
  const X = (x) => x + sx;
  for (const it of sc ?? []) {
    if (it.box) { const [x, w, h] = it.box; s += `<rect x="${f1(X(x))}" y="${G - h}" width="${w}" height="${h}" rx="3" fill="${SCENE}" stroke="${EDGE}" stroke-width="2"/>`; }
    if (it.wall !== undefined) s += `<path d="M${f1(X(it.wall))} ${G}V${G - 200}" stroke="${EDGE}" stroke-width="6"/>`;
    if (it.bar) { const [x, h] = it.bar; s += `<path d="M${f1(X(x) - 30)} ${G - h}H${f1(X(x) + 30)}" stroke="${GEAR}" stroke-width="5" stroke-linecap="round"/><path d="M${f1(X(x) - 30)} ${G - h}V${G}M${f1(X(x) + 30)} ${G - h}V${G}" stroke="${EDGE}" stroke-width="3"/>`; }
    if (it.post) { const [x, h] = it.post; s += `<path d="M${f1(X(x))} ${G}V${G - h - 12}" stroke="${EDGE}" stroke-width="6"/>`; }
    if (it.cones) for (const x of it.cones) s += `<path d="M${f1(X(x) - 7)} ${G}L${f1(X(x))} ${G - 16}L${f1(X(x) + 7)} ${G}Z" fill="${JERSEY}"/>`;
    if (it.line !== undefined) s += `<path d="M${f1(X(it.line))} ${G - 1}v-3" stroke="${INK}" stroke-width="3"/>`;
  }
  return s;
};
const sceneRange = (sc) => (sc ?? []).flatMap((it) => it.box ? [it.box[0], it.box[0] + it.box[1]] : it.wall !== undefined ? [it.wall - 4, it.wall + 4] : it.bar ? [it.bar[0] - 32, it.bar[0] + 32] : it.post ? [it.post[0] - 4, it.post[0] + 4] : it.cones ? it.cones.flatMap((x) => [x - 8, x + 8]) : []);
const scenePoints = (sc, sx) => { const post = (sc ?? []).find((it) => it.post); return { post: post ? [post.post[0] + sx, G - post.post[1]] : null }; };

const benchUnder = (j, p) => (p.support > 0 ? (p.flatBench ? (() => { const a = Math.min(j.sh[0], j.hip[0]) - 14, b = Math.max(j.sh[0], j.hip[0]) + 10; return `<rect x="${f1(a)}" y="${G - p.support}" width="${f1(b - a)}" height="${p.support}" rx="3" fill="${SCENE}" stroke="${EDGE}" stroke-width="2"/>`; })() : `<rect x="${f1(j.sh[0] - 22)}" y="${G - p.support}" width="40" height="${p.support}" rx="3" fill="${SCENE}" stroke="${EDGE}" stroke-width="2"/>`) : "");

const bodySvg = (j, p, ctx) => {
  let s = benchUnder(j, p);
  s += parts(j, p.view === "front").map(([ps, w, c]) => `<path d="${d(ps)}" ${stroke(w, c)}/>`).join("");
  s += `<circle cx="${f1(j.head[0])}" cy="${f1(j.head[1])}" r="${L.head}" fill="${INK}"/>`;
  for (const g of p.gear ?? []) s += gear[g](j, ctx);
  return s;
};

// ---- Poses --------------------------------------------------------------------------------

// ---- Output -------------------------------------------------------------------------------
const bboxX = (j) => { const q = allPts(j).concat([[j.head[0] - L.head, 0], [j.head[0] + L.head, 0]]); return [Math.min(...q.map((a) => a[0])), Math.max(...q.map((a) => a[0]))]; };
const floor = (W) => `<path d="M4 ${G}H${f1(W - 4)}" stroke="${EDGE}" stroke-width="2"/>`;
const svgWrap = (W, inner) => `<svg viewBox="0 ${G - TOP} ${f1(W)} ${TOP + 6}" xmlns="http://www.w3.org/2000/svg">${floor(W)}${inner}</svg>`;

export const variants = (id) => Object.keys(defs[id] ?? {}).filter((k) => k === "poids" || k === "materiel");
const posesOf = (id, variant) => { const e = defs[id]; const v = e?.[variant ?? variants(id)[0]]; return v ? { poses: v, scene: e.scene?.[variant] ?? e.scene?.all, loop: e.loop } : null; };

// Static: positions side by side with arrows (PDF).
export function figure(id, variant) {
  const ex = posesOf(id, variant);
  if (!ex) return null;
  const gap = 34, pad = 14;
  let x = pad, svg = "";
  ex.poses.forEach((raw, i) => {
    const { p, j } = place(raw);
    const xs = [...bboxX(j), ...sceneRange(ex.scene), ...(p.support > 0 ? [j.sh[0] - 26, j.hip[0] + 12] : [])];
    const x1 = Math.min(...xs), x2 = Math.max(...xs);
    const sx = x - x1;
    const J = every(j, (q) => [q[0] + sx, q[1]]);
    svg += sceneSvg(ex.scene, sx) + bodySvg(J, p, scenePoints(ex.scene, sx));
    x += x2 - x1;
    if (i < ex.poses.length - 1) { svg += `<path d="M${f1(x + 8)} ${G - 90}h${gap - 16}m-7 -7l7 7l-7 7" ${stroke(3.5, JERSEY)}/>`; x += gap; }
  });
  return svgWrap(x + pad, svg);
}

// Animated (SVG + SMIL, website): angles interpolated between positions, eased. Loops back and
// forth, or restarts from the first position for moves that travel (loop: "restart").
const lerp = (a, b, t) => {
  const m = (x, y) => x + (y - x) * t;
  const side = (s, u) => Object.fromEntries(SIDE_KEYS.map((k) => [k, m(s[k], u[k])]));
  const out = { ...a, torso: m(a.torso, b.torso), head: m(a.head, b.head), lift: m(a.lift, b.lift), x: m(a.x, b.x), near: side(a.near, b.near), far: side(a.far, b.far), solve: undefined };
  for (const k of ["support", "hang"]) if (a[k] !== undefined) out[k] = m(a[k], b[k] ?? a[k]);
  // Contacts switch at the halfway point; the vertical placement is blended for smoothness.
  out.contact = t < 0.5 ? a.contact : b.contact;
  out.pin = a.pin && b.pin && a.pin[0] === b.pin[0] ? [a.pin[0], m(a.pin[1], b.pin[1])] : undefined;
  return out;
};

export function animatedFigure(id, variant, { seconds = 1.2, steps = 14 } = {}) {
  const ex = posesOf(id, variant);
  if (!ex) return null;
  const solved = ex.poses.map((raw) => place(raw).p);
  const restart = ex.loop === "restart";
  const seq = solved.length === 1 ? [solved[0], solved[0]] : restart ? solved : [...solved, ...solved.slice(0, -1).reverse()];
  const frames = [];
  for (let i = 0; i < seq.length - 1; i++)
    for (let k = 0; k < steps; k++) { const t = k / steps; frames.push(lerp(seq[i], seq[i + 1], t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)); }
  frames.push(seq[seq.length - 1]);
  if (restart) { for (let k = 0; k < steps / 2; k++) frames.push(seq[seq.length - 1]); frames.push(seq[0]); }
  // Vertical placement is blended between the two neighbouring positions to avoid jumps.
  const placedF = frames.map((p) => place(p).j);
  const xs = [...placedF.flatMap(bboxX), ...sceneRange(ex.scene)];
  const pad = 26, x1 = Math.min(...xs), W = Math.max(...xs) - x1 + 2 * pad, sx = pad - x1;
  const F = placedF.map((j) => every(j, (q) => [q[0] + sx, q[1]]));
  const dur = `${seconds * (seq.length - 1) + (restart ? seconds / 2 : 0)}s`;
  const anim = (attr, vals) => `<animate attributeName="${attr}" dur="${dur}" repeatCount="indefinite" values="${vals.join(";")}"/>`;
  const p0 = solved[0], front = p0.view === "front";
  const ctx = scenePoints(ex.scene, sx);
  let svg = sceneSvg(ex.scene, sx) + benchUnder(F[0], p0);
  parts(F[0], front).forEach((part, i) => { svg += `<path d="${d(part[0])}" ${stroke(part[1], part[2])}>${anim("d", F.map((j) => d(parts(j, front)[i][0])))}</path>`; });
  svg += `<circle r="${L.head}" fill="${INK}" cx="${f1(F[0].head[0])}" cy="${f1(F[0].head[1])}">${anim("cx", F.map((j) => f1(j.head[0])))}${anim("cy", F.map((j) => f1(j.head[1])))}</circle>`;
  if (p0.gear?.length) {
    const n = F.length;
    F.forEach((j, i) => {
      const vis = Array.from({ length: n }, (_, k) => (k === i ? "visible" : "hidden"));
      svg += `<g visibility="${i === 0 ? "visible" : "hidden"}">${p0.gear.map((g) => gear[g](j, ctx)).join("")}<animate attributeName="visibility" dur="${dur}" repeatCount="indefinite" calcMode="discrete" values="${vis.join(";")}"/></g>`;
    });
  }
  return svgWrap(W, svg);
}

// Checks every position: how far the lowest point goes below the floor (should be 0 or less)
// and the height of the main contact points.
export function contactReport(id, variant) {
  return posesOf(id, variant).poses.map((raw) => {
    const { p, j } = place(raw);
    const low = Math.max(...allPts(j).map((q) => q[1]));
    const h = (k) => +(G - get(j, k)[1]).toFixed(1);
    return { below: +(low - G).toFixed(1), heel: h("near.heel"), toe: h("near.toe"), knee: h("near.knee"), hand: h("near.hand"), elbow: h("near.elbow"), farToe: h("far.toe") };
  });
}

export const figureIds = Object.keys(defs);
