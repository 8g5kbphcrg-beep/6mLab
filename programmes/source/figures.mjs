// Exercise illustrations: a figure built in 3D from joint angles, in successive positions, seen
// from a camera chosen per exercise (side view by default).
//
// Proportions follow Winter's anthropometric data (segment length / body height H = 170):
// thigh 0.245 H, shank 0.246 H, trunk (hip → shoulder) 0.288 H, upper arm 0.186 H,
// forearm 0.146 H, ankle height 0.039 H, foot length 0.152 H.
//
// World: X = the direction the athlete faces, Y = up, Z = the athlete's "near" side (towards the
// camera in the side view). Limb angles are absolute, in degrees:
//   thigh, shin, foot, upper, fore, hand: angle from "pointing down", positive towards the front
//   (0 = down, 90 = forward, 180 = up, -90 = backward);
//   thighOut, shinOut, … : how far the segment opens out to its own side (90 = straight out,
//   negative = across the body).
// foot = heel → toes direction: 72 is a flat foot, lower values raise the heel.
// Trunk: torso = forward lean (hip → shoulder), lean = sideways lean towards the near side,
// twist = rotation of the shoulders (positive: near shoulder forward), head = head bend.
//
// A pose can also set: x / z (move along the floor), lift (height in the air), flip (face the
// other way), contact (point placed on the floor), pin ([point, x, z?]: point placed there),
// support (shoulders resting at that height: 0 on the floor, 42 on a bench), hang (hands at that
// height, e.g. a pull-up bar) and solve (adjust angles until one point is dy below another).
// Exercise options: cam ({ yaw, pitch }, or one per version), scene (box, bench, wall, bar, post, cones), loop, still (positions shown
// in the PDF). contactReport() and framesBelow() check that nothing goes through the floor.

import { defs } from "./figures-poses.mjs";
import { markSvg } from "../../lib/mark.mjs";

const L = { torso: 49, neck: 9, head: 11, upper: 32, fore: 25, hand: 8, thigh: 42, shin: 42, toe: 21, heel: 7.7, hipW: 8, shW: 15 };
// Body types, chosen by the customer: f (woman: narrower shoulders, wider hips, bust, ponytail),
// h (man: broader shoulders, thicker trunk and limbs), n (not specified: neither).
// leg / arm: thickness factors; chest: size and forward offset of the chest.
const BODIES = {
  n: { dims: { shW: 14, hipW: 9 }, trunk: 20, leg: 1, arm: 1, chest: 10, chestOff: 4 },
  f: { dims: { shW: 13, hipW: 10 }, trunk: 18, leg: 0.97, arm: 0.88, chest: 15, chestOff: 6.5, ponytail: true },
  h: { dims: { shW: 18, hipW: 7.5 }, trunk: 23, leg: 1.1, arm: 1.15, chest: 14, chestOff: 5 },
};
// Body of the figure being drawn: set by figure() / animatedFigure() for the time of the call.
let BODY = BODIES.n, DIM = L;
let SEX = "n", GID = 0;
const withBody = (sex, fn) => { SEX = BODIES[sex] ? sex : "n"; BODY = BODIES[SEX]; DIM = { ...L, ...BODY.dims }; try { return fn(); } finally { BODY = BODIES.n; DIM = L; } };
const FLAT = 72;
const G = 190, TOP = 235;
const rad = (d) => (d * Math.PI) / 180;
const LIMBS = ["thigh", "shin", "foot", "upper", "fore", "hand"];
const SIDE_KEYS = [...LIMBS, ...LIMBS.map((k) => k + "Out")];

const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const dir = (a, b, s) => [Math.sin(rad(a)) * Math.cos(rad(b)), -Math.cos(rad(a)) * Math.cos(rad(b)), s * Math.sin(rad(b))];

const norm = (p) => {
  const side = (s = {}) => ({ thigh: 0, shin: 0, foot: FLAT, upper: 0, fore: 0, thighOut: 0, shinOut: 0, footOut: 0, upperOut: 0, foreOut: 0, ...s, hand: s.hand ?? s.fore ?? 0, handOut: s.handOut ?? s.foreOut ?? 0 });
  return { torso: 0, lean: 0, twist: 0, head: 0, lift: 0, x: 0, z: 0, ...p, near: side(p.near), far: side(p.far ?? p.near) };
};

// Body axes: U along the trunk, F towards the chest, S towards the near side; Ssh = shoulder line.
function frame(p) {
  const t = rad(p.torso), l = rad(p.lean), tw = rad(p.twist);
  const U1 = [Math.sin(t), Math.cos(t), 0], F = [Math.cos(t), -Math.sin(t), 0], Z = [0, 0, 1];
  const U = add(mul(U1, Math.cos(l)), mul(Z, Math.sin(l))), S = add(mul(Z, Math.cos(l)), mul(U1, -Math.sin(l)));
  return { U, F, S, Ssh: add(mul(S, Math.cos(tw)), mul(F, Math.sin(tw))) };
}

function joints(p) {
  const { U, F, S, Ssh } = frame(p);
  const hipC = [0, 0, 0], shC = mul(U, L.torso);
  const hd = add(mul(U, Math.cos(rad(p.head))), mul(F, Math.sin(rad(p.head))));
  const neck = add(shC, mul(hd, L.neck)), head = add(neck, mul(hd, L.head));
  // Where the face looks (edge of the head) and the front of the chest: they show which way the
  // figure faces.
  const fd = add(mul(F, Math.cos(rad(p.head))), mul(U, -Math.sin(rad(p.head))));
  const face = add(head, mul(fd, L.head)), chest = add(mul(U, L.torso * 0.72), mul(F, BODY.chestOff)), seat = add(mul(U, L.torso * 0.08), mul(F, -6));
  const side = (q, s) => {
    const D = (k) => dir(q[k], q[k + "Out"], s);
    const hip = mul(S, s * DIM.hipW), sh = add(shC, mul(Ssh, s * DIM.shW));
    const knee = add(hip, mul(D("thigh"), L.thigh)), ankle = add(knee, mul(D("shin"), L.shin));
    const toe = add(ankle, mul(D("foot"), L.toe)), heel = add(ankle, mul(dir(q.foot - 103, q.footOut, s), L.heel));
    const elbow = add(sh, mul(D("upper"), L.upper)), wrist = add(elbow, mul(D("fore"), L.fore)), hand = add(wrist, mul(D("hand"), L.hand));
    return { hip, sh, knee, ankle, toe, heel, elbow, wrist, hand };
  };
  return { hip: hipC, sh: shC, neck, head, face, chest, seat, near: side(p.near, 1), far: side(p.far, -1) };
}

const every = (j, fn) => ({ hip: fn(j.hip), sh: fn(j.sh), neck: fn(j.neck), head: fn(j.head), face: fn(j.face), chest: fn(j.chest), seat: fn(j.seat), near: Object.fromEntries(Object.entries(j.near).map(([k, v]) => [k, fn(v)])), far: Object.fromEntries(Object.entries(j.far).map(([k, v]) => [k, fn(v)])) });
const get = (j, spec) => (spec.includes(".") ? j[spec.split(".")[0]][spec.split(".")[1]] : j[spec]);
const allPts = (j) => [j.hip, j.sh, j.neck, [j.head[0], j.head[1] - L.head, j.head[2]], ...Object.values(j.near), ...Object.values(j.far)];

// Adjusts the listed angles by the same amount until point a is dy below point b.
// "-name" turns that angle the other way (legs following a leaning trunk).
function solve(p, { vary, a, b, dy = 0 }) {
  const f = (d) => {
    const q = structuredClone(p);
    for (const v of vary) { const sg = v.startsWith("-") ? -1 : 1, k = v.replace(/^-/, ""); const [s, key] = k.includes(".") ? k.split(".") : [null, k]; if (s) q[s][key] += sg * d; else q[key] += sg * d; }
    const j = joints(q);
    return { q, err: get(j, b)[1] - get(j, a)[1] - dy };
  };
  const e0 = Math.sign(f(0).err);
  if (e0 === 0) return p;
  let lo = null, hi = null;
  for (let k = 1; k <= 120 && lo === null; k++) for (const s of [k, -k]) if (lo === null && Math.sign(f(s).err) !== e0) { lo = s - Math.sign(s); hi = s; }
  if (lo === null) return p;
  for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; if (Math.sign(f(mid).err) === e0) lo = mid; else hi = mid; }
  return f((lo + hi) / 2).q;
}

// Camera: yaw turns around the athlete (0 = side view, 90 = facing the athlete), pitch looks down.
const camera = (c = {}) => {
  const y = rad(c.yaw ?? 0), ph = rad(c.pitch ?? 0);
  return { r: [Math.cos(y), 0, -Math.sin(y)], c: [Math.sin(y), 0, Math.cos(y)], cp: Math.cos(ph), sp: Math.sin(ph), side: !c.yaw && !c.pitch };
};
const proj = (P, cam) => { const zc = dot(P, cam.c); return [dot(P, cam.r), G - (P[1] * cam.cp - zc * cam.sp)]; };
const depth = (P, cam) => dot(P, cam.c) * cam.cp + P[1] * cam.sp;

// Pose → joints in the world (w, floor at Y = 0) and on screen (j).
export function place(raw, cam = camera()) {
  let p = norm(raw);
  for (const s of p.solve ?? []) p = solve(p, s);
  let j = joints(p);
  if (p.flip) j = every(j, (q) => [-q[0], q[1], q[2]]);
  let dy;
  if (p.support !== undefined) dy = p.support + 5 - j.sh[1];
  else if (p.hang !== undefined) dy = p.hang - j.near.hand[1];
  else if (p.contact) dy = p.lift - get(j, p.contact)[1];
  else dy = p.lift - Math.min(...allPts(j).map((q) => q[1]));
  let dx = p.x, dz = p.z;
  if (p.pin) { const q = get(j, p.pin[0]); dx = p.pin[1] - q[0]; if (p.pin[2] !== undefined) dz = p.pin[2] - q[2]; }
  p = { ...p, x: dx, z: dz };
  const w = every(j, (q) => [q[0] + dx, q[1] + dy, q[2] + dz]);
  return { p, w, j: every(w, (q) => proj(q, cam)) };
}

// ---- Drawing ------------------------------------------------------------------------------
// The figure is drawn with volumes: skin-coloured limbs with muscle bellies (thigh, calf, arm,
// forearm), shorts, a jersey, shoes and a head with hair and a nose, in the style of the
// questionnaire silhouettes. The side further from the camera is drawn darker.
const INK = "#100A24", JERSEY = "#FF7A59", GEAR = "#3A3452", SCENE = "#ECE9F7", EDGE = "#C9C4DD";
const COL = {
  front: { skin: "#E7B48F", shorts: "#17152B", jersey: JERSEY, shoe: "#3A3452" },
  back: { skin: "#C48C69", shorts: "#2E2A48", jersey: "#D9603F", shoe: "#5A5474" },
};
const OUT = "#8A5234", HAIR = "#3B2418", HAIR_OUT = "#1E120B", OW = 2.4;
// The brand mark, light on the jersey, centred on (0, 0) and about 11 units high.
const LOGO = `<g transform="scale(0.1) translate(-65 -62)">${markSvg("#FFF4EC", "#16123F")}</g>`;
const f1 = (v) => v.toFixed(1);
const d = (ps) => "M" + ps.map((q) => `${f1(q[0])} ${f1(q[1])}`).join("L");
const stroke = (w, c) => `fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
const shift = (sx) => (q) => [q[0] + sx, q[1]];
const at = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// How to draw the two sides: the one further from the camera first, darker when clearly behind.
// Side view: far limbs darker and 5 units behind.
function lookOf(w, cam) {
  const dn = depth(w.near.sh, cam), df = depth(w.far.sh, cam);
  const back = dn < df ? "near" : "far", front = back === "near" ? "far" : "near";
  if (cam.side) return { back, front, dark: true, offset: true, trunkW: BODY.trunk };
  return { back, front, dark: Math.abs(dn - df) / (2 * DIM.shW) > 0.5, offset: false, trunkW: BODY.trunk * 0.62 };
}

// Hair, Playmobil style: a helmet a little larger than the head. It covers the top of the head
// down to a straight fringe (cap), and everything behind the line a = sideFront down to the jaw
// (side) or the nape (back). Points are in head coordinates: a towards the face, b towards the
// top, c to the side. It is drawn in 4 roughly convex pieces (crown, left, right, back), each as
// the outline of its points facing the camera, so the haircut follows the view: locks framing
// the face from the front, the whole back of the head in profile, all hair from behind.
const HAIRCUTS = {
  n: { r: 1.14, cap: 0.32, side: -0.45, sideFront: 0.12, back: -0.6 },
  f: { r: 1.13, cap: 0.3, side: -0.3, sideFront: 0.05, back: -0.5 },
  h: { r: 1.1, cap: 0.42, side: -0.1, sideFront: -0.12, back: -0.4 },
};
const SHELL = [];
for (let i = 0; i <= 16; i++) for (let k = 0; k < 32; k++) {
  const t = (i / 16) * Math.PI, ph = (k / 32) * 2 * Math.PI;
  SHELL.push([Math.sin(t) * Math.cos(ph), Math.cos(t), Math.sin(t) * Math.sin(ph)]);
}
const hairPieces = (hc) => {
  const low = ([a, b]) => b <= hc.cap + 0.18 && a < hc.sideFront && b > (a < -0.3 ? hc.back : hc.side);
  return [([, b]) => b > hc.cap, (n) => low(n) && n[2] < -0.2, (n) => low(n) && n[2] > 0.2, (n) => low(n) && Math.abs(n[2]) <= 0.25];
};
const RAYS = 16;
// Convex outline of a point cloud as RAYS points (same count in every frame): for each direction,
// the point furthest along it, so that corners are kept.
function outline(pts, fallback) {
  if (pts.length < 3) return Array(RAYS).fill(fallback);
  return Array.from({ length: RAYS }, (_, k) => {
    const dx = Math.cos((k / RAYS) * 2 * Math.PI), dy = Math.sin((k / RAYS) * 2 * Math.PI);
    return pts.reduce((b, q) => (q[0] * dx + q[1] * dy > b[0] * dx + b[1] * dy ? q : b));
  });
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

// Shapes of one frame, always in the same order and number so that they can be animated:
// ["l", points, width, colour] open line, ["p", …] filled outline, ["c", centre, radius, colour],
// ["b", list of polygons, outline width, colour] filled shapes (hair), ["logo", centre, angle].
// Shapes that share the same points (outline, then fill) are written once in the animation.
function shapes(j, w, cam, lk) {
  const out = [];
  const line = (ps, wd, c) => out.push(["l", ps, wd, c]);
  // A limb: its pieces outlined together, then filled.
  const limb = (pieces, c) => { for (const [ps, wd] of pieces) line(ps, wd + OW, OUT); for (const [ps, wd] of pieces) line(ps, wd, c); };
  const side = (S0, col, fb) => {
    const S = Object.fromEntries(Object.entries(S0).map(([k, v]) => [k, fb(v)]));
    const kl = BODY.leg, ka = BODY.arm;
    limb([[[S.knee, S.ankle], 9 * kl], [[at(S.knee, S.ankle, 0.12), at(S.knee, S.ankle, 0.5)], 12.5 * kl], [[S.hip, S.knee], 12 * kl], [[at(S.hip, S.knee, 0.08), at(S.hip, S.knee, 0.6)], 17 * kl]], col.skin);
    line([S.heel, S.toe], 7.5, col.shoe);
    line([S.hip, at(S.hip, S.knee, 0.42)], 18.5 * kl + 1, col.shorts);
    return () => {
      limb([[[S.sh, S.elbow], 8.5 * ka], [[at(S.sh, S.elbow, 0.15), at(S.sh, S.elbow, 0.65)], 10.5 * ka], [[S.elbow, S.wrist], 7 * ka], [[at(S.elbow, S.wrist, 0.08), at(S.elbow, S.wrist, 0.45)], 9 * ka], [[S.wrist, S.hand], 6.5 * ka]], col.skin);
      line([S.sh, at(S.sh, S.elbow, 0.38)], 12 * ka, col.jersey);
    };
  };
  const B = j[lk.back], F = j[lk.front], cb = lk.dark ? COL.back : COL.front, fb = lk.offset ? (q) => [q[0] - 5, q[1]] : (q) => q;
  const backArm = side(B, cb, fb);
  backArm();
  // Trunk: neck, shorts (pelvis and seat), jersey, chest.
  limb([[[j.sh, j.neck], 8]], COL.front.skin);
  line([j.seat, j.seat], 16 * BODY.leg, COL.front.shorts);
  line([B.hip, F.hip], lk.trunkW + 3, COL.front.shorts);
  const tr = [at(B.hip, B.sh, 0.2), B.sh, F.sh, at(F.hip, F.sh, 0.2)];
  out.push(["p", tr, lk.trunkW + OW, OUT], ["p", tr, lk.trunkW, JERSEY]);
  line([j.chest, j.chest], BODY.chest, JERSEY);
  // Brand mark on the jersey, upright along the trunk.
  out.push(["logo", at(j.hip, j.sh, 0.6), (Math.atan2(j.sh[0] - j.hip[0], j.hip[1] - j.sh[1]) * 180) / Math.PI]);
  const frontArm = side(F, COL.front, (q) => q);
  // Head: skin, then hair on the back and top of the head (all of it seen from behind), nose.
  const R = L.head, h = [(j.head[0] - j.neck[0]) / R, (j.head[1] - j.neck[1]) / R], f = [(j.face[0] - j.head[0]) / R, (j.face[1] - j.head[1]) / R];
  if (BODY.ponytail) {
    const base = [j.head[0] + (-0.8 * f[0] + 0.3 * h[0]) * R, j.head[1] + (-0.8 * f[1] + 0.3 * h[1]) * R];
    const fall = (a, dn) => [base[0] - a * f[0] * R, base[1] - a * f[1] * R + dn * R];
    line([base, fall(0.45, 0.35), fall(0.4, 1.3)], 6.5, HAIR);
  }
  frontArm();
  const fl = Math.hypot(f[0], f[1]), nose = 0.22 * R * Math.max(0, Math.min(1, (fl - 0.5) / 0.3));
  out.push(["c", [j.head[0] + f[0] * 0.95 * R - h[0] * 0.12 * R, j.head[1] + f[1] * 0.95 * R - h[1] * 0.12 * R], nose + 0.01, COL.front.skin]);
  out.push(["c", j.head, R + OW / 2, OUT], ["c", j.head, R, COL.front.skin]);
  // Hair pieces: the shell points of each piece that the camera sees, projected.
  const hdW = mul(add(w.head, mul(w.neck, -1)), 1 / R), fdW = mul(add(w.face, mul(w.head, -1)), 1 / R), sdW = cross(hdW, fdW);
  const view = [cam.c[0] * cam.cp, cam.sp, cam.c[2] * cam.cp], hp = proj(w.head, cam), off = [j.head[0] - hp[0], j.head[1] - hp[1]];
  const hc = HAIRCUTS[SEX];
  const pieces = hairPieces(hc).map((inPiece) => {
    const pts = [];
    for (const n of SHELL) {
      if (!inPiece(n)) continue;
      const N = add(add(mul(fdW, n[0]), mul(hdW, n[1])), mul(sdW, n[2]));
      const q = proj(add(w.head, mul(N, R * hc.r)), cam), x = q[0] + off[0], y = q[1] + off[1];
      // Hair behind the head shows only around it.
      if (dot(N, view) < -0.12 && Math.hypot(x - j.head[0], y - j.head[1]) < R) continue;
      pts.push([x, y]);
    }
    return outline(pts, j.head);
  });
  out.push(["b", pieces, 2.4, HAIR_OUT], ["b", pieces, 0, HAIR]);
  return out;
}

// One shape as SVG, with its <animate> tags in the animated figure.
// Path data and paint of the path shapes (l, p, b).
const geom = ([k, ps]) => (k === "l" ? d(ps) : k === "p" ? d(ps) + "Z" : ps.map((q) => d(q) + "Z").join(""));
const paint = ([k, , w, c]) => (k === "l" ? stroke(f1(w), c) : k === "p" ? `fill="${c}" stroke="${c}" stroke-width="${f1(w)}" stroke-linejoin="round"` : w ? `fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"` : `fill="${c}"`);
const shapeSvg = (sh, anims = {}) => {
  const [k] = sh;
  if (k === "l" || k === "p") return `<path d="${geom(sh)}" ${paint(sh)}>${anims.d ?? ""}</path>`;
  if (k === "c") return `<circle cx="${f1(sh[1][0])}" cy="${f1(sh[1][1])}" r="${f1(sh[2])}" fill="${sh[3]}">${anims.c ?? ""}</circle>`;
  if (k === "b") return `<path d="${geom(sh)}" ${paint(sh)}>${anims.d ?? ""}</path>`;
  return `<g transform="translate(${f1(sh[1][0])} ${f1(sh[1][1])}) rotate(${f1(sh[2])})">${anims.t ?? ""}${LOGO}</g>`;
};
const plate = (c) => `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="17" fill="none" stroke="${GEAR}" stroke-width="5"/><circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="4" fill="${GEAR}"/>`;
const dumbbell = (w) => `<g transform="translate(${f1(w[0])} ${f1(w[1])})"><rect x="-10" y="-2.5" width="20" height="5" rx="2" fill="${GEAR}"/><rect x="-12" y="-7" width="6" height="14" rx="2" fill="${JERSEY}"/><rect x="6" y="-7" width="6" height="14" rx="2" fill="${JERSEY}"/></g>`;
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const angle = (a, b) => (Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI;

// Equipment carried by the body (screen joints). ctx holds the scene's fixed points.
const gear = {
  dumbbells: (j) => dumbbell(j.far.wrist) + dumbbell(j.near.wrist),
  dumbbell: (j) => dumbbell(j.near.wrist),
  goblet: (j) => { const w = j.near.wrist; return `<g transform="translate(${f1(w[0] + 3)} ${f1(w[1] - 4)})"><rect x="-2.5" y="-12" width="5" height="24" rx="2" fill="${GEAR}"/><rect x="-8" y="-15" width="16" height="7" rx="2" fill="${JERSEY}"/><rect x="-8" y="8" width="16" height="7" rx="2" fill="${JERSEY}"/></g>`; },
  barBack: (j) => { const a = rad(angle(j.hip, j.sh) - 110); return plate([j.sh[0] + 6 * Math.sin(a), j.sh[1] + 6 * Math.cos(a)]); },
  barHip: (j) => plate([j.hip[0], j.hip[1] - 22]),
  ball: (j) => { const c = mid(j.near.hand, j.far.hand); return `<circle cx="${f1(c[0])}" cy="${f1(c[1])}" r="9" fill="#FFC75F" stroke="${INK}" stroke-width="1.5"/>`; },
  backpack: (j) => { const a = angle(j.hip, j.sh), m = mid(j.hip, j.sh), r = rad(a + 90); const c = [m[0] + 10 * Math.sin(r), m[1] + 10 * Math.cos(r)]; return `<rect x="${f1(c[0] - 7)}" y="${f1(c[1] - 12)}" width="14" height="24" rx="4" fill="${GEAR}" transform="rotate(${f1(a - 180)} ${f1(c[0])} ${f1(c[1])})"/>`; },
  band: (j, ctx) => (ctx.post ? `<path d="${d([ctx.post, j.near.wrist])}" ${stroke(2.5, JERSEY)}/>` : ""),
  // Feet held under a padded bar (Nordic curl).
  anchor: (j) => { const a = j.near.ankle; return `<path d="M${f1(a[0] - 18)} ${G}L${f1(a[0] - 2)} ${f1(a[1] - 11)}" ${stroke(5, GEAR)}/><circle cx="${f1(a[0] - 2)}" cy="${f1(a[1] - 11)}" r="7" fill="${GEAR}"/>`; },
};

// ---- Scene (fixed objects, in world coordinates) -------------------------------------------
const hull = (pts) => {
  const P = [...pts].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const p of P) { while (lo.length > 1 && cross(lo.at(-2), lo.at(-1), p) <= 0) lo.pop(); lo.push(p); }
  for (const p of P.reverse()) { while (up.length > 1 && cross(up.at(-2), up.at(-1), p) <= 0) up.pop(); up.push(p); }
  return [...lo.slice(0, -1), ...up.slice(0, -1)];
};
const cuboid = ([x0, x1], [y0, y1], [z0, z1], cam) => hull([x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => proj([x, y, z], cam)))));
const poly = (ps, fill = SCENE) => ({ ps, svg: (sx) => `<path d="${d(ps.map(shift(sx)))}Z" fill="${fill}" stroke="${EDGE}" stroke-width="2" stroke-linejoin="round"/>` });
const line = (ps, w, c) => ({ ps, svg: (sx) => `<path d="${d(ps.map(shift(sx)))}" ${stroke(w, c)}/>` });

function sceneItems(sc, cam) {
  const out = [];
  for (const it of sc ?? []) {
    if (it.box) { const [x, w, h] = it.box; out.push(poly(cuboid([x, x + w], [0, h], it.z ?? [-22, 22], cam))); }
    // Bench seen as a top on two legs: the lower leg can pass underneath (Copenhagen plank).
    if (it.bench) { const [x, w, h] = it.bench, z = it.z ?? [-22, 22]; out.push(poly(cuboid([x, x + 5], [0, h - 7], z, cam)), poly(cuboid([x + w - 5, x + w], [0, h - 7], z, cam)), poly(cuboid([x, x + w], [h - 7, h], z, cam))); }
    if (it.wall !== undefined) out.push(poly(cuboid([it.wall, it.wall + 3], [0, 200], [-60, 60], cam), EDGE));
    if (it.wallZ !== undefined) out.push(poly(cuboid(it.x ?? [-50, 50], [0, 200], [it.wallZ - 3, it.wallZ], cam), EDGE));
    if (it.bar) { const [x, h] = it.bar; out.push(line([proj([x - 30, 0, 0], cam), proj([x - 30, h, 0], cam)], 3, EDGE), line([proj([x + 30, 0, 0], cam), proj([x + 30, h, 0], cam)], 3, EDGE), line([proj([x - 30, h, 0], cam), proj([x + 30, h, 0], cam)], 5, GEAR)); }
    if (it.post) { const [x, h] = it.post, z = it.z ?? 0; out.push(line([proj([x, 0, z], cam), proj([x, h + 12, z], cam)], 6, EDGE)); }
    if (it.cones) for (const x of it.cones) { const c = proj([x, 0, 0], cam); out.push({ ps: [[c[0] - 7, c[1]], [c[0] + 7, c[1]]], svg: (sx) => `<path d="M${f1(c[0] + sx - 7)} ${f1(c[1])}l7 -16l7 16Z" fill="${JERSEY}"/>` }); }
  }
  return out;
}
const scenePost = (sc, cam) => { const it = (sc ?? []).find((s) => s.post); return it ? proj([it.post[0], it.post[1], it.z ?? 0], cam) : null; };

// Bench under the shoulders (support), or under the whole trunk (flatBench).
const benchUnder = (w, p, cam) => {
  if (!(p.support > 0)) return [];
  const [a, b] = p.flatBench ? [Math.min(w.sh[0], w.hip[0]) - 14, Math.max(w.sh[0], w.hip[0]) + 10] : [w.sh[0] - 22, w.sh[0] + 18];
  return [poly(cuboid([a, b], [0, p.support], [-14, 14], cam))];
};
// Floor seen from above: a mat under the figure.
const mat = (ws, cam) => {
  if (!cam.sp) return [];
  const P = ws.flatMap(allPts), X = P.map((q) => q[0]), Z = P.map((q) => q[2]);
  return [poly(cuboid([Math.min(...X) - 22, Math.max(...X) + 22], [0, 0], [Math.min(...Z) - 22, Math.max(...Z) + 22], cam))];
};

const bodySvg = (j, w, cam, lk, g, ctx) => shapes(j, w, cam, lk).map((sh) => shapeSvg(sh)).join("") + (g ?? []).map((k) => gear[k](j, ctx)).join("");

// ---- Output -------------------------------------------------------------------------------
const bboxX = (j) => { const q = allPts(j).concat([[j.head[0] - L.head, 0], [j.head[0] + L.head, 0]]); return [Math.min(...q.map((a) => a[0])), Math.max(...q.map((a) => a[0]))]; };
// Height: the usual frame (floor at the bottom), extended when a view from above goes lower.
const svgWrap = (W, inner, cam, ys = []) => {
  const y1 = Math.max(G + 6, ...ys.map((y) => y + 6)), y0 = Math.min(y1 - TOP - 6, ...ys.map((y) => y - 6));
  return `<svg viewBox="0 ${f1(y0)} ${f1(W)} ${f1(y1 - y0)}" xmlns="http://www.w3.org/2000/svg">${cam.sp ? "" : `<path d="M4 ${G}H${f1(W - 4)}" stroke="${EDGE}" stroke-width="2"/>`}${inner}</svg>`;
};
const ysOf = (j, items) => [...allPts(j).map((q) => q[1]), j.head[1] - L.head, ...items.flatMap((it) => it.ps.map((q) => q[1]))];

export const variants = (id) => Object.keys(defs[id] ?? {}).filter((k) => k === "poids" || k === "materiel");
const posesOf = (id, variant) => {
  const e = defs[id], v = variant ?? variants(id)[0], poses = e?.[v];
  if (!poses) return null;
  const c = e.cam && ("yaw" in e.cam || "pitch" in e.cam) ? e.cam : e.cam?.[v];
  return { poses, scene: e.scene?.[v] ?? e.scene?.all, loop: e.loop, still: e.still, cam: camera(c) };
};

// Static: positions side by side with arrows (PDF).
export function figure(id, variant, sex = "n") {
  return withBody(sex, () => drawFigure(id, variant));
}
function drawFigure(id, variant) {
  const ex = posesOf(id, variant);
  if (!ex) return null;
  const { cam } = ex, gap = 34, pad = 14;
  let x = pad, svg = "";
  const ys = [];
  const shown = ex.still ? ex.still.map((i) => ex.poses[i]) : ex.poses;
  shown.forEach((raw, i) => {
    const { p, w, j } = place(raw, cam);
    const items = [...mat([w], cam), ...sceneItems(ex.scene, cam), ...benchUnder(w, p, cam)];
    const xs = [...bboxX(j), ...items.flatMap((it) => it.ps.map((q) => q[0]))];
    const x1 = Math.min(...xs), x2 = Math.max(...xs), sx = x - x1;
    ys.push(...ysOf(j, items));
    const post = scenePost(ex.scene, cam);
    const js = every(j, shift(sx));
    svg += items.map((it) => it.svg(sx)).join("") + bodySvg(js, w, cam, lookOf(w, cam), p.gear, { post: post && shift(sx)(post) });
    x += x2 - x1;
    if (i < shown.length - 1) { svg += `<path d="M${f1(x + 8)} ${G - 90}h${gap - 16}m-7 -7l7 7l-7 7" ${stroke(3.5, JERSEY)}/>`; x += gap; }
  });
  return svgWrap(x + pad, svg, cam, ys);
}

// Animated (SVG + SMIL, website): angles interpolated between positions, eased. Loops back and
// forth, or restarts from the first position for moves that travel (loop: "restart").
const lerp = (a, b, t) => {
  const m = (x, y) => x + (y - x) * t;
  const side = (s, u) => Object.fromEntries(SIDE_KEYS.map((k) => [k, m(s[k], u[k])]));
  // The same adjustment (solve) in both positions is applied to the frames in between too, so
  // that contacts hold during the move.
  const same = a.solve && b.solve && a.solve.length === b.solve.length && a.solve.every((s, i) => s.a === b.solve[i].a && s.b === b.solve[i].b && s.vary.join() === b.solve[i].vary.join());
  const out = { ...a, solve: same ? a.solve.map((s, i) => ({ ...s, dy: m(s.dy ?? 0, b.solve[i].dy ?? 0) })) : undefined, near: side(a.near, b.near), far: side(a.far, b.far) };
  for (const k of ["torso", "lean", "twist", "head", "lift", "x", "z"]) out[k] = m(a[k], b[k]);
  for (const k of ["support", "hang"]) if (a[k] !== undefined) out[k] = m(a[k], b[k] ?? a[k]);
  out.contact = t < 0.5 ? a.contact : b.contact;
  out.pin = a.pin && b.pin && a.pin[0] === b.pin[0] ? [a.pin[0], m(a.pin[1], b.pin[1]), a.pin[2] === undefined ? undefined : m(a.pin[2], b.pin[2])] : undefined;
  return out;
};

export function animatedFigure(id, variant, { seconds = 1.2, steps = 10, sex = "n" } = {}) {
  return withBody(sex, () => drawAnimated(id, variant, seconds, steps));
}
function drawAnimated(id, variant, seconds, steps) {
  const ex = posesOf(id, variant);
  if (!ex) return null;
  const { cam } = ex;
  const solved = ex.poses.map((raw) => place(raw, cam).p);
  const restart = ex.loop === "restart";
  const seq = solved.length === 1 ? [solved[0], solved[0]] : restart ? solved : [...solved, ...solved.slice(0, -1).reverse()];
  const frames = [];
  for (let i = 0; i < seq.length - 1; i++)
    for (let k = 0; k < steps; k++) { const t = k / steps; frames.push(lerp(seq[i], seq[i + 1], t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)); }
  frames.push(seq[seq.length - 1]);
  if (restart) { for (let k = 0; k < steps / 2; k++) frames.push(seq[seq.length - 1]); frames.push(seq[0]); }
  const placed = frames.map((p) => place(p, cam));
  const p0 = solved[0], w0 = placed[0].w;
  const items = [...mat(placed.map((q) => q.w), cam), ...sceneItems(ex.scene, cam), ...benchUnder(w0, p0, cam)];
  const xs = [...placed.flatMap((q) => bboxX(q.j)), ...items.flatMap((it) => it.ps.map((q) => q[0]))];
  const pad = 26, x1 = Math.min(...xs), W = Math.max(...xs) - x1 + 2 * pad, sx = pad - x1;
  const F = placed.map((q) => every(q.j, shift(sx)));
  const dur = `${seconds * (seq.length - 1) + (restart ? seconds / 2 : 0)}s`;
  const anim = (attr, vals) => `<animate attributeName="${attr}" dur="${dur}" repeatCount="indefinite" values="${vals.join(";")}"/>`;
  const lk = lookOf(w0, cam);
  const post = scenePost(ex.scene, cam), ctx = { post: post && shift(sx)(post) };
  let svg = items.map((it) => it.svg(sx)).join("");
  const S = F.map((j, i) => shapes(j, placed[i].w, cam, lk));
  const pick = (i, fn) => S.map((fr) => fn(fr[i]));
  // Logo angle without jumps of 360° between frames.
  const unwrap = (as) => as.reduce((o, v) => { const p = o.at(-1); o.push(p === undefined ? v : v + 360 * Math.round((p - v) / 360)); return o; }, []);
  const tf = (type, vals, sum) => `<animateTransform attributeName="transform" type="${type}"${sum ? ' additive="sum"' : ""} dur="${dur}" repeatCount="indefinite" values="${vals.join(";")}"/>`;
  // Path shapes sharing their points are animated once, in <defs>, and drawn with <use>.
  const shared = new Map(), uid = `g${(GID++).toString(36)}`;
  S[0].forEach((sh, i) => { if ("lpb".includes(sh[0])) shared.set(sh[1], [...(shared.get(sh[1]) ?? []), i]); });
  let defs = "";
  S[0].forEach((sh, i) => {
    const [k] = sh;
    const same = "lpb".includes(k) ? shared.get(sh[1]) : null;
    if (same?.length > 1) {
      const gid = `${uid}-${same[0]}`;
      if (same[0] === i) defs += `<path id="${gid}" d="${geom(sh)}">${anim("d", pick(i, geom))}</path>`;
      svg += `<use href="#${gid}" ${paint(sh)}/>`;
      return;
    }
    const an = "lpb".includes(k) ? { d: anim("d", pick(i, geom)) }
      : k === "c" ? { c: anim("cx", pick(i, (x) => f1(x[1][0]))) + anim("cy", pick(i, (x) => f1(x[1][1]))) + (new Set(pick(i, (x) => f1(x[2]))).size > 1 ? anim("r", pick(i, (x) => f1(x[2]))) : "") }
      : { t: tf("translate", pick(i, (x) => `${f1(x[1][0])} ${f1(x[1][1])}`)) + tf("rotate", unwrap(pick(i, (x) => x[2])).map(f1), true) };
    svg += shapeSvg(sh, an);
  });
  svg = `<defs>${defs}</defs>` + svg;
  if (p0.gear?.length) {
    const n = F.length;
    F.forEach((j, i) => {
      const vis = Array.from({ length: n }, (_, k) => (k === i ? "visible" : "hidden"));
      svg += `<g visibility="${i === 0 ? "visible" : "hidden"}">${p0.gear.map((g) => gear[g](j, ctx)).join("")}<animate attributeName="visibility" dur="${dur}" repeatCount="indefinite" calcMode="discrete" values="${vis.join(";")}"/></g>`;
    });
  }
  return svgWrap(W, svg, cam, [...placed.flatMap((q) => ysOf(q.j, [])), ...items.flatMap((it) => it.ps.map((q) => q[1]))]);
}

// Checks every position: how far the lowest point goes below the floor (should be 0 or less),
// and the height of the main contact points. framesBelow() does the same for the frames in between.
export function contactReport(id, variant) {
  const ex = posesOf(id, variant);
  return ex.poses.map((raw) => {
    const { w } = place(raw, ex.cam);
    const h = (k) => +get(w, k)[1].toFixed(1);
    return { below: +(-Math.min(...allPts(w).map((q) => q[1]))).toFixed(1), heel: h("near.heel"), toe: h("near.toe"), knee: h("near.knee"), hand: h("near.hand"), elbow: h("near.elbow"), farToe: h("far.toe") };
  });
}
export function framesBelow(id, variant) {
  const ex = posesOf(id, variant);
  const solved = ex.poses.map((raw) => place(raw, ex.cam).p);
  let worst = 0;
  for (let i = 0; i < solved.length - 1; i++) for (let k = 1; k < 10; k++) { const { w } = place(lerp(solved[i], solved[i + 1], k / 10), ex.cam); worst = Math.max(worst, -Math.min(...allPts(w).map((q) => q[1]))); }
  return +worst.toFixed(1);
}

export const figureIds = Object.keys(defs);
