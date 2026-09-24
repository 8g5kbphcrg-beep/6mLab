// Exercise illustrations: a side-view figure drawn from joint angles, shown as successive
// positions (start → end). Angles are in degrees, measured from "pointing down", positive
// towards the direction the figure faces (right). The torso angle is its lean from upright.
// Each pose may set "ground" (default true: lowest point on the floor) or an explicit "at".

const L = { torso: 50, neck: 7, head: 10, upper: 27, fore: 25, thigh: 40, shin: 38, foot: 12 };
const rad = (d) => (d * Math.PI) / 180;
const step = ([x, y], len, ang) => [x + len * Math.sin(rad(ang)), y + len * Math.cos(rad(ang))];

// pose: { torso, head?, near: {thigh, shin, foot?, upper, fore}, far: {...}, at?: [x,y] of hip }
function joints(p) {
  const hip = [0, 0];
  const sh = [hip[0] + L.torso * Math.sin(rad(p.torso)), hip[1] - L.torso * Math.cos(rad(p.torso))];
  const neckTop = [sh[0] + L.neck * Math.sin(rad(p.torso + (p.head ?? 0))), sh[1] - L.neck * Math.cos(rad(p.torso + (p.head ?? 0)))];
  const headC = [neckTop[0] + L.head * Math.sin(rad(p.torso + (p.head ?? 0))), neckTop[1] - L.head * Math.cos(rad(p.torso + (p.head ?? 0)))];
  const side = (s) => {
    const knee = step(hip, L.thigh, s.thigh), ankle = step(knee, L.shin, s.shin), toe = step(ankle, L.foot, s.foot ?? 90);
    const elbow = step(sh, L.upper, s.upper), hand = step(elbow, L.fore, s.fore);
    return { knee, ankle, toe, elbow, hand };
  };
  return { hip, sh, headC, near: side(p.near), far: side(p.far ?? p.near) };
}

const pts = (j) => [j.hip, j.sh, [j.headC[0], j.headC[1] + L.head], ...["near", "far"].flatMap((k) => Object.values(j[k]))];

function placed(p, ground) {
  const j = joints(p);
  let dx = 0, dy = 0;
  if (p.at) [dx, dy] = p.at;
  else dy = ground - Math.max(...pts(j).map((q) => q[1]));
  const mv = (q) => [q[0] + dx, q[1] + dy];
  return { hip: mv(j.hip), sh: mv(j.sh), headC: mv(j.headC), near: Object.fromEntries(Object.entries(j.near).map(([k, v]) => [k, mv(v)])), far: Object.fromEntries(Object.entries(j.far).map(([k, v]) => [k, mv(v)])) };
}

const line = (pts, w, c) => `<path d="M${pts.map((q) => q.map((v) => v.toFixed(1)).join(" ")).join("L")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const INK = "#100A24", FAR = "#A9A3C7";

function body(j) {
  const limb = (s, c) => line([j.hip, s.knee, s.ankle, s.toe], 9, c) + line([j.sh, s.elbow, s.hand], 7, c);
  return limb(j.far, FAR) + line([j.hip, j.sh], 12, INK) + limb(j.near, INK) + `<circle cx="${j.headC[0].toFixed(1)}" cy="${j.headC[1].toFixed(1)}" r="${L.head}" fill="${INK}"/>`;
}

// Props, drawn in the frame's coordinates (hands/feet positions available through j).
const P = {
  floor: (w, g) => `<path d="M4 ${g}H${w - 4}" stroke="#C9C4DD" stroke-width="2"/>`,
  dumbbell: (q) => `<g fill="#FF5A1F"><rect x="${(q[0] - 9).toFixed(1)}" y="${(q[1] - 2).toFixed(1)}" width="18" height="4" rx="2"/><rect x="${(q[0] - 11).toFixed(1)}" y="${(q[1] - 5).toFixed(1)}" width="5" height="10" rx="1.5"/><rect x="${(q[0] + 6).toFixed(1)}" y="${(q[1] - 5).toFixed(1)}" width="5" height="10" rx="1.5"/></g>`,
  box: (x, g, w, h) => `<rect x="${x}" y="${g - h}" width="${w}" height="${h}" rx="3" fill="#ECE9F7" stroke="#C9C4DD" stroke-width="2"/>`,
};

// Exercise definitions: successive poses. Optional per pose: lift (height above the floor, for
// jumps), bench (a support under the shoulders), box [dx, h] (a step or box under the feet).
const G = 180; // floor line
const BENCH = 40; // bench / box height
const defs = {
  squat: [
    { torso: 2, near: { thigh: 2, shin: 0, upper: 8, fore: 15 } },
    { torso: 38, near: { thigh: 95, shin: -20, upper: 80, fore: 85 }, far: { thigh: 90, shin: -22, upper: 75, fore: 80 } },
  ],
  "fente-arriere": [
    { torso: 0, near: { thigh: 0, shin: 0, upper: 5, fore: 5 }, far: { thigh: -2, shin: -2, upper: -5, fore: -5 } },
    { torso: 4, near: { thigh: 85, shin: 0, upper: 5, fore: 5 }, far: { thigh: -25, shin: -95, foot: -30, upper: -5, fore: -5 } },
  ],
  pompes: [
    { torso: 80, head: -5, near: { thigh: -100, shin: -100, foot: -20, upper: 0, fore: 0 } },
    { torso: 87, head: -5, near: { thigh: -93, shin: -93, foot: -20, upper: -65, fore: 5 } },
  ],
  planche: [
    { torso: 88, head: -5, near: { thigh: -92, shin: -92, foot: -20, upper: 0, fore: 90 } },
  ],
  "squat-jump": [
    { torso: 35, near: { thigh: 85, shin: -20, upper: -35, fore: -30 }, far: { thigh: 80, shin: -22, upper: -40, fore: -35 } },
    { torso: 0, near: { thigh: -3, shin: -3, foot: 150, upper: 150, fore: 160 }, far: { thigh: -3, shin: -3, foot: 150, upper: 140, fore: 150 }, lift: 18 },
  ],
  nordic: [
    { torso: 0, near: { thigh: 0, shin: -90, foot: -90, upper: 10, fore: 60 } },
    { torso: 55, near: { thigh: -55, shin: -90, foot: -90, upper: 100, fore: 100 } },
  ],
  "hip-thrust": [
    { torso: -60, head: 20, near: { thigh: 120, shin: 0, upper: -95, fore: -95 }, bench: true },
    { torso: -90, head: 30, near: { thigh: 90, shin: 0, upper: -95, fore: -95 }, bench: true },
  ],
};

const JERSEY = "#FF5A1F";
function bodyColored(j) {
  const limb = (s, c) => line([j.hip, s.knee, s.ankle, s.toe], 9, c) + line([j.sh, s.elbow, s.hand], 7, c);
  return limb(j.far, FAR) + line([j.hip, j.sh], 13, JERSEY) + limb(j.near, INK) + `<circle cx="${j.headC[0].toFixed(1)}" cy="${j.headC[1].toFixed(1)}" r="${L.head}" fill="${INK}"/>`;
}

const each = (j, f) => ({ hip: f(j.hip), sh: f(j.sh), headC: f(j.headC), near: Object.fromEntries(Object.entries(j.near).map(([k, v]) => [k, f(v)])), far: Object.fromEntries(Object.entries(j.far).map(([k, v]) => [k, f(v)])) });
const bbox = (j) => { const q = pts(j).concat([[j.headC[0] - L.head, j.headC[1] - L.head], [j.headC[0] + L.head, j.headC[1]]]); return [Math.min(...q.map((a) => a[0])), Math.min(...q.map((a) => a[1])), Math.max(...q.map((a) => a[0])), Math.max(...q.map((a) => a[1]))]; };

export function figure(id) {
  const poses = defs[id];
  if (!poses) return null;
  const gap = 34, pad = 12;
  let x = pad, svg = "";
  // On a bench, the shoulders rest on it; otherwise the lowest point touches the floor.
  const placedPoses = poses.map((p) => {
    if (!p.bench) return placed(p, G - (p.lift ?? 0));
    const j = joints(p);
    return placed({ ...p, at: [0, G - BENCH - 5 - j.sh[1]] }, G);
  });
  placedPoses.forEach((j0, i) => {
    const [x1, y1, x2] = bbox(j0);
    const j = each(j0, (q) => [q[0] - x1 + x, q[1]]);
    const p = poses[i];
    if (p.bench) svg += P.box((j.sh[0] - 16).toFixed(1), G, 34, BENCH);
    svg += bodyColored(j);
    x += x2 - x1;
    if (i < poses.length - 1) { svg += `<path d="M${(x + 8).toFixed(1)} ${G - 70}h${gap - 16}m-7 -7l7 7l-7 7" fill="none" stroke="${JERSEY}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`; x += gap; }
  });
  // Fixed height (same scale for every exercise), width that fits the poses.
  const W = x + pad, y0 = G - 225;
  return `<svg viewBox="0 ${y0} ${W.toFixed(0)} ${G + 6 - y0}" xmlns="http://www.w3.org/2000/svg">${P.floor(W, G)}${svg}</svg>`;
}

export const figureIds = Object.keys(defs);
