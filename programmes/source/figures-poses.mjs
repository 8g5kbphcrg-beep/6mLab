// Positions of every exercise, for figures.mjs (angle conventions are described there).
// Each exercise has a bodyweight version (poids) and/or an equipment version (materiel), each a
// list of positions played in order. scene: fixed objects (box, wall, bar, post, cones), for
// both versions (all) or one of them. loop: "restart" for moves that travel or jump.

const BENCH = 42;

// Body in a straight line from the toes (push-up, plank). t = lean of the trunk.
const plankBody = (t, extra = {}) => ({ torso: t, head: -8, near: { thigh: -t, shin: -t, foot: 90 - t, ...extra.near }, far: { thigh: -t, shin: -t, foot: 90 - t, ...(extra.far ?? extra.near) } });
const planks = ["torso", "-near.thigh", "-near.shin", "-near.foot", "-far.thigh", "-far.shin", "-far.foot"];

// Same legs on both sides, arms given separately (far arm = near arm when omitted).
const legs = (lg, nearArm = {}, farArm = nearArm) => ({ near: { ...lg, ...nearArm }, far: { ...lg, ...farArm } });

// Running stride: near leg forward (knee up), far leg pushing off behind on the toes, arms opposite.
// swap = the other leg forward. Played back and forth, two strides make the running cycle.
const stride = ({ torso = 8, knee = 50, back = -22, arm = 40, x = 0, swap = false, flip, gear, arms } = {}) => {
  const front = { thigh: knee, shin: knee - 66, foot: 80 }, rear = { thigh: back, shin: back - 14, foot: 22 };
  const armF = arms ?? { upper: arm, fore: arm + 90 }, armB = arms ?? { upper: -arm, fore: -arm + 90 };
  return { torso, x, flip, gear, near: swap ? { ...rear, ...armF } : { ...front, ...armB }, far: swap ? { ...front, ...armB } : { ...rear, ...armF } };
};
const run = (o) => [stride(o), stride({ ...o, swap: true })];

// Standing, arms relaxed.
const STAND = { near: { upper: 6, fore: 10 }, far: { upper: -4, fore: 2 } };
// Landing / jump preparation: hips back, arms back.
const crouch = (o = {}) => ({ torso: 42, ...o, ...legs({ thigh: 72, shin: -30 }, { upper: -55, fore: -30 }) });
const air = (o = {}) => ({ torso: 0, lift: 24, ...o, ...legs({ thigh: 2, shin: -2, foot: 22 }, { upper: 160, fore: 168 }) });
const landing = (o = {}) => ({ torso: 34, ...o, ...legs({ thigh: 68, shin: -28 }, { upper: 70, fore: 85 }) });

// Lying on the back (support 0: shoulders on the floor), knees bent, heels on the floor.
const onBack = { support: 0, torso: -90, head: 25 };
const heelsDown = (sh = "sh", dy = 5) => [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: sh, dy }];
const armsFloor = { upper: 87, fore: 87, hand: 87 };

// Push-up positions.
const pushTop = { ...plankBody(76, { near: { upper: 0, fore: 0, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] };
const pushBottom = { ...plankBody(84, { near: { upper: -118, fore: -4, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] };

// Bench press (lying on a bench, feet on the floor).
const benchPress = (upper) => ({ support: BENCH, flatBench: true, torso: -90, head: 0, contact: "near.heel", near: { thigh: 70, shin: -5, upper, fore: 180, hand: 180 }, gear: ["dumbbells"],
  solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 5 }] });

// Hip thrust (shoulders on a bench).
const thrust = (top, arms, gear) => ({ support: BENCH, gear, torso: top ? -90 : -42, head: top ? 35 : 20, near: { thigh: top ? 90 : 122, shin: 0, ...arms }, far: { thigh: top ? 90 : 122, shin: 0, ...arms },
  solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 5 }] });
const thrustBar = [thrust(false, { upper: 108, fore: 8 }, ["barHip"]), thrust(true, { upper: 105, fore: 125 }, ["barHip"])];

// Glute bridge on the floor. far: the raised leg (single-leg version).
const bridge = (top, far) => {
  const t = top ? -118 : -90, th = top ? 118 : 132;
  return { ...onBack, torso: t, head: top ? 50 : 25, near: { thigh: th, shin: -20, ...armsFloor }, far: far ? { ...far(th), ...armsFloor } : { thigh: th, shin: -20, ...armsFloor },
    solve: [{ vary: far ? ["near.shin"] : ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: 5 }] };
};

// Forward / backward lunge, bottom position.
const lungeLow = (arms = { near: { upper: 3, fore: 3 }, far: { upper: -4, fore: -4 } }, gear) => ({ gear, torso: 3, contact: "near.heel",
  near: { thigh: 90, shin: 2, ...arms.near }, far: { thigh: -8, shin: -70, foot: 40, ...arms.far }, solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel" }] });

// Bulgarian split squat: back foot (laces down) on a bench behind.
const BULG_X = -62;
const bulgarian = (low, arms = { upper: 4, fore: 4 }, gear) => ({ gear, torso: low ? 16 : 6, pin: ["far.toe", BULG_X],
  near: { thigh: low ? 80 : 10, shin: low ? -10 : -3, ...arms }, far: { thigh: low ? -6 : -24, shin: -80, foot: -62, ...arms },
  solve: [{ vary: ["far.shin", "far.foot"], a: "far.toe", b: "near.heel", dy: -(BENCH + 2) }] });

// Hinge (Romanian deadlift, row): hips back, flat back.
const hinge = () => ({ thigh: 14, shin: -6 });

// Pull-up bar and table heights.
const BAR = 200, TABLE = 80;

// Side plank, seen from the front: bottom forearm on the floor, top arm up.
const sidePlank = (t, extra = {}) => ({ view: "front", torso: t, head: 0, contact: "near.heel",
  near: { thigh: -t, shin: -t, foot: 90, upper: 0, fore: 90, foreLen: 0.5 }, far: { thigh: t, shin: t, foot: 90, upper: 180, fore: 180 }, ...extra });
const sidePlankSolve = [{ vary: ["torso", "-near.thigh", "-near.shin", "far.thigh", "far.shin"], a: "near.elbow", b: "near.heel", dy: -3 }];

// On all fours (thoracic rotation).
const allFours = (farArm) => ({ torso: 78, head: 0, contact: "near.knee", near: { thigh: 0, shin: -90, foot: -100, upper: 0, fore: 0, hand: 90 }, far: { thigh: 0, shin: -90, foot: -100, ...farArm },
  solve: [{ vary: ["torso"], a: "near.wrist", b: "near.knee", dy: -3 }] });

// Pike push-up (shoulders): hips high, hands and toes on the floor.
const pike = (arm) => ({ torso: 132, head: 0, contact: "near.toe", near: { thigh: -42, shin: -42, foot: 20, ...arm, hand: 90 }, far: { thigh: -42, shin: -42, foot: 20, ...arm, hand: 90 },
  solve: [{ vary: ["near.thigh", "near.shin", "far.thigh", "far.shin"], a: "near.wrist", b: "near.toe", dy: -3 }] });

// Inverted row under a table: body straight from the heels, hands on the edge.
const invRow = (arm) => ({ hang: TABLE, pin: ["near.hand", 0], torso: -72, head: 10, near: { thigh: 72, shin: 72, foot: 160, ...arm, hand: 180 }, far: { thigh: 72, shin: 72, foot: 160, ...arm, hand: 180 },
  solve: [{ vary: ["-torso", "near.thigh", "near.shin", "near.foot", "far.thigh", "far.shin", "far.foot"], a: "near.heel", b: "near.hand", dy: TABLE }] });

// Bent-over one-arm row with a dumbbell, free hand on the knee.
const rowDb = (pull) => ({ gear: ["dumbbell"], torso: 72, head: -10, near: { thigh: 16, shin: -8, upper: pull ? -72 : 0, fore: pull ? -4 : 0 }, far: { thigh: 16, shin: -8, upper: 32, fore: 12 } });

// Pull-up.
const pullUp = (top) => ({ hang: BAR, pin: ["near.hand", 0], torso: top ? 6 : 0, head: 0, ...legs({ thigh: top ? 18 : 10, shin: top ? -45 : -55, foot: 40 }, top ? { upper: 35, fore: 176, hand: 180 } : { upper: 180, fore: 180, hand: 180 }) });

// Burpee squat, hands on the floor in front of the feet.
const squatHands = { torso: 70, near: { thigh: 108, shin: -42, upper: 0, fore: 0, hand: 90 }, far: { thigh: 108, shin: -42, upper: 0, fore: 0, hand: 90 }, solve: [{ vary: ["torso"], a: "near.wrist", b: "near.heel", dy: -3 }] };

export const defs = {
  // ---- Warm-up -----------------------------------------------------------------------------
  "footing-dynamique": { poids: run({ torso: 6, knee: 42, back: -20, arm: 32 }) },
  "fente-rotation": {
    poids: [
      { near: { upper: 90, fore: 90 }, far: { upper: 88, fore: 88 } },
      lungeLow({ near: { upper: 90, fore: 90 }, far: { upper: 88, fore: 88 } }),
      lungeLow({ near: { upper: -95, fore: -95 }, far: { upper: 70, fore: 70 } }),
    ],
  },
  "ouverture-hanche": {
    poids: [
      { view: "front", near: { upper: 12, fore: 12 }, far: { upper: 12, fore: 12 } },
      { view: "front", torso: -4, near: { thigh: 78, shin: 4, upper: 40, fore: 40 }, far: { thigh: 2, upper: 40, fore: 40 } },
    ],
  },
  "pont-fessier": { poids: [bridge(false), bridge(true)] },
  planche: { poids: [{ ...plankBody(80, { near: { upper: 0, fore: 90, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.elbow", b: "near.toe", dy: -3 }] }] },
  equilibre: {
    poids: [
      { near: { thigh: 4, shin: -6, upper: 20, fore: 20 }, far: { thigh: 22, shin: -55, foot: 30, upper: -20, fore: -20 } },
      { near: { thigh: 4, shin: -6, upper: 90, fore: 90 }, far: { thigh: 22, shin: -55, foot: 30, upper: 160, fore: 160 } },
    ],
  },
  "saut-reception": { loop: "restart", poids: [STAND, crouch(), air({ lift: 18 }), landing()] },
  accelerations: { poids: run({ torso: 16, knee: 58, back: -26, arm: 50 }) },

  // ---- Prevention / core -------------------------------------------------------------------
  "gainage-lateral": { poids: [{ ...sidePlank(78), solve: sidePlankSolve }] },
  nordic: {
    poids: [
      { contact: "near.knee", near: { thigh: 0, shin: -90, foot: -100, upper: 15, fore: 110 } },
      { contact: "near.knee", torso: 62, near: { thigh: -62, shin: -90, foot: -100, upper: 95, fore: 80 } },
    ],
  },
  "dead-bug": {
    poids: [
      { ...onBack, ...legs({ thigh: 180, shin: 90, foot: 178 }, { upper: 180, fore: 180, hand: 180 }) },
      { ...onBack, near: { thigh: 180, shin: 90, foot: 178, upper: -100, fore: -100, hand: -100 }, far: { thigh: 98, shin: 98, foot: 178, upper: 180, fore: 180, hand: 180 } },
    ],
  },
  ytw: {
    poids: [
      { support: 0, torso: 90, head: -20, ...legs({ thigh: -90, shin: -90, foot: -95 }, { upper: 108, fore: 108, hand: 108 }) },
      { support: 0, torso: 90, head: -20, ...legs({ thigh: -90, shin: -90, foot: -95 }, { upper: 180, fore: 180, upperLen: 0.4, foreLen: 0.4 }) },
      { support: 0, torso: 90, head: -20, ...legs({ thigh: -90, shin: -90, foot: -95 }, { upper: -118, fore: 150 }) },
    ],
  },
  "equilibre-balle": {
    scene: { all: [{ wall: 105 }] },
    materiel: [
      { gear: ["ball"], near: { thigh: 4, shin: -6, upper: 55, fore: 125 }, far: { thigh: 22, shin: -55, foot: 30, upper: 55, fore: 125 } },
      { gear: ["ball"], near: { thigh: 4, shin: -6, upper: 100, fore: 100 }, far: { thigh: 22, shin: -55, foot: 30, upper: 100, fore: 100 } },
    ],
  },
  "pont-une-jambe": { poids: [bridge(false, (th) => ({ thigh: th, shin: th, foot: th + 80 })), bridge(true, (th) => ({ thigh: th, shin: th, foot: th + 80 }))] },
  copenhague: {
    scene: { all: [{ box: [-88, 36, 34] }] },
    poids: [
      { view: "front", torso: 62, head: 0, contact: "near.elbow", lift: 3, pin: ["far.ankle", -70],
        near: { thigh: -84, shin: -84, foot: 90, upper: 0, fore: 90, foreLen: 0.5 }, far: { thigh: 80, shin: 80, foot: 90, upper: 180, fore: 180 },
        solve: [{ vary: ["far.thigh", "far.shin"], a: "far.ankle", b: "near.elbow", dy: -34 }] },
      { view: "front", torso: 78, head: 0, contact: "near.elbow", lift: 3, pin: ["far.ankle", -70],
        near: { thigh: -77, shin: -77, foot: 90, upper: 0, fore: 90, foreLen: 0.5 }, far: { thigh: 80, shin: 80, foot: 90, upper: 180, fore: 180 },
        solve: [{ vary: ["far.thigh", "far.shin"], a: "far.ankle", b: "near.elbow", dy: -34 }] },
    ],
  },
  "rotation-externe": {
    scene: { all: [{ post: [-72, 106] }] },
    materiel: [
      { view: "front", gear: ["band"], near: { upper: 0, fore: -25, foreLen: 0.35 }, far: { upper: 6, fore: 6 } },
      { view: "front", gear: ["band"], near: { upper: 0, fore: 88 }, far: { upper: 6, fore: 6 } },
    ],
  },
  "rotation-externe-haute": {
    scene: { all: [{ post: [80, 60] }] },
    materiel: [
      { view: "front", gear: ["band"], near: { upper: 90, fore: 60, foreLen: 0.35 }, far: { upper: 6, fore: 6 } },
      { view: "front", gear: ["band"], near: { upper: 90, fore: 180 }, far: { upper: 6, fore: 6 } },
    ],
  },

  // ---- Explosiveness -----------------------------------------------------------------------
  "snap-down": {
    loop: "restart",
    poids: [
      { ...legs({ foot: 35 }, { upper: 175, fore: 178 }) },
      { torso: 42, ...legs({ thigh: 72, shin: -30 }, { upper: -50, fore: -35 }) },
    ],
  },
  pogos: {
    poids: [
      { ...legs({ thigh: 6, shin: -8, foot: 45 }, { upper: 25, fore: 110 }) },
      { lift: 14, ...legs({ thigh: 0, shin: -1, foot: 22 }, { upper: 20, fore: 105 }) },
    ],
  },
  "squat-jump": {
    poids: [
      { torso: 38, near: { thigh: 70, shin: -30, upper: -40, fore: -30 } },
      { torso: -2, lift: 26, near: { thigh: 0, shin: -3, foot: 22, upper: 156, fore: 164 } },
    ],
  },
  "skater-hop": {
    poids: [
      { view: "front", torso: 8, near: { thigh: 10, shin: -4, upper: -30, fore: -40 }, far: { thigh: -12, shin: 14, shinLen: 0.55, upper: 50, fore: 70 } },
      { view: "front", x: -55, lift: 22, near: { thigh: 22, shin: 10, upper: 60, fore: 80 }, far: { thigh: 22, shin: 10, upper: 60, fore: 80 } },
      { view: "front", torso: -8, x: -110, far: { thigh: 10, shin: -4, upper: -30, fore: -40 }, near: { thigh: -12, shin: 14, shinLen: 0.55, upper: 50, fore: 70 } },
    ],
  },
  bonds: {
    loop: "restart",
    poids: [
      crouch(),
      { torso: 22, x: 75, lift: 34, ...legs({ thigh: 72, shin: 12, foot: 95 }, { upper: 120, fore: 140 }) },
      landing({ x: 150 }),
    ],
  },
  "departs-10": {
    loop: "restart",
    poids: [
      { torso: 50, near: { thigh: 62, shin: -28, upper: -45, fore: 30 }, far: { thigh: -22, shin: -48, foot: 35, upper: 45, fore: 120 } },
      stride({ torso: 40, knee: 68, back: -30, arm: 55, x: 40, swap: true }),
      stride({ torso: 28, knee: 64, back: -28, arm: 55, x: 95 }),
    ],
  },
  "departs-reactifs": {
    loop: "restart",
    poids: [
      { torso: 30, ...legs({ thigh: 48, shin: -26 }, { upper: 30, fore: 95 }) },
      stride({ torso: 40, knee: 68, back: -30, arm: 55, x: 40, swap: true }),
      stride({ torso: 30, knee: 64, back: -28, arm: 55, x: 90 }),
    ],
  },
  "sprint-20": { poids: run({ torso: 12, knee: 66, back: -28, arm: 55 }) },
  freinage: {
    loop: "restart",
    poids: [
      stride({ torso: 14, knee: 62, back: -26, arm: 50 }),
      { torso: -4, x: 45, near: { thigh: 48, shin: 22, foot: 95, upper: 40, fore: 110 }, far: { thigh: -12, shin: -48, foot: 40, upper: -30, fore: 40 } },
      { torso: 26, x: 62, near: { thigh: 62, shin: -30, upper: 45, fore: 150 }, far: { thigh: 48, shin: -26, upper: 45, fore: 150 } },
    ],
  },
  "navette-5105": {
    loop: "restart",
    poids: [
      stride({ torso: 14, knee: 60, back: -26, arm: 50 }),
      { torso: 62, x: 60, near: { thigh: 88, shin: -8, upper: 10, fore: 10, hand: 20 }, far: { thigh: -30, shin: -62, foot: 32, upper: -40, fore: -20 },
        solve: [{ vary: ["near.upper", "near.fore", "near.hand"], a: "near.hand", b: "near.heel", dy: 3 }] },
      stride({ torso: 20, knee: 62, back: -26, arm: 50, x: 40, flip: true }),
    ],
  },
  "drop-jump": {
    loop: "restart",
    scene: { all: [{ box: [-75, 46, 28] }] },
    poids: [
      { lift: 28, pin: ["near.toe", -34], ...STAND },
      { ...crouch(), pin: ["near.toe", 30] },
      { ...air({ lift: 32 }), pin: ["near.toe", 36] },
    ],
  },
  "lancer-poitrine": {
    scene: { all: [{ wall: 115 }] },
    materiel: [
      { gear: ["ball"], torso: 8, ...legs({ thigh: 24, shin: -18 }, { upper: -25, fore: 140 }) },
      { gear: ["ball"], torso: 14, x: 8, near: { thigh: 30, shin: 5, upper: 92, fore: 92, hand: 92 }, far: { thigh: -18, shin: -30, foot: 45, upper: 92, fore: 92, hand: 92 } },
    ],
  },
  "lancer-rotation": {
    scene: { all: [{ wall: 115 }] },
    materiel: [
      { view: "front", gear: ["ball"], torso: -10, near: { thigh: 14, shin: 2, upper: -40, fore: -70 }, far: { thigh: 14, shin: 2, upper: 20, fore: 4 } },
      { view: "front", gear: ["ball"], torso: 10, near: { thigh: 14, shin: 2, upper: 100, fore: 100 }, far: { thigh: 14, shin: 2, upper: -80, fore: -96 } },
    ],
  },
  "lancer-haut": {
    materiel: [
      { gear: ["ball"], torso: -8, ...legs({ foot: 45 }, { upper: 170, fore: 200 }) },
      { gear: ["ball"], torso: 50, ...legs({ thigh: 62, shin: -28 }, { upper: 62, fore: 55 }) },
    ],
  },
  "pompes-explosives": {
    poids: [
      pushBottom,
      { ...plankBody(58, { near: { upper: 8, fore: 8, hand: 90 } }), contact: "near.toe" },
    ],
  },
  "box-jump": {
    loop: "restart",
    scene: { all: [{ box: [70, 48, 40] }] },
    poids: [crouch(), { ...air({ lift: 52 }), torso: 20, ...legs({ thigh: 75, shin: 0, foot: 80 }, { upper: 150, fore: 150 }), x: 48 }, { ...landing(), lift: 40, pin: ["near.toe", 112] }],
  },
  "squat-jump-leste": {
    materiel: [
      { gear: ["dumbbells"], torso: 38, ...legs({ thigh: 70, shin: -30 }, { upper: -6, fore: -6 }) },
      { gear: ["dumbbells"], torso: -2, lift: 22, ...legs({ thigh: 0, shin: -3, foot: 22 }, { upper: 2, fore: 2 }) },
    ],
  },
  "reception-unipodale": {
    loop: "restart",
    poids: [
      crouch({ torso: 32 }),
      { lift: 16, x: 30, torso: 10, ...legs({ thigh: 20, shin: -10, foot: 40 }, { upper: 90, fore: 100 }) },
      { x: 60, torso: 30, near: { thigh: 52, shin: -24, upper: 60, fore: 70 }, far: { thigh: 14, shin: -72, foot: 20, upper: 60, fore: 70 } },
    ],
  },

  // ---- Strength / muscle -------------------------------------------------------------------
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
    poids: [{ near: { upper: 3, fore: 3 } }, lungeLow()],
    materiel: [{ gear: ["dumbbells"], near: { upper: 3, fore: 3 } }, lungeLow(undefined, ["dumbbells"])],
  },
  "squat-bulgare": {
    scene: { all: [{ box: [BULG_X - 20, 42, BENCH] }] },
    poids: [bulgarian(false, { upper: 70, fore: 110 }), bulgarian(true, { upper: 80, fore: 120 })],
    materiel: [bulgarian(false, undefined, ["dumbbells"]), bulgarian(true, undefined, ["dumbbells"])],
  },
  "sdt-roumain": {
    poids: [{ ...legs({ thigh: 4, shin: -2 }, { upper: 0, fore: 0 }) }, { torso: 78, ...legs(hinge(), { upper: 0, fore: 0 }) }],
    materiel: [{ gear: ["dumbbells"], ...legs({ thigh: 4, shin: -2 }, { upper: 0, fore: 0 }) }, { gear: ["dumbbells"], torso: 78, ...legs(hinge(), { upper: 0, fore: 0 }) }],
  },
  "hip-thrust": {
    poids: [thrust(false, { upper: -95, fore: -95 }), thrust(true, { upper: -95, fore: -95 })],
    materiel: thrustBar,
  },
  pompes: { poids: [pushTop, pushBottom], materiel: [benchPress(180), benchPress(98)] },
  rowing: {
    scene: { poids: [{ bar: [0, TABLE - 3] }] },
    poids: [invRow({ upper: 180, fore: 180 }), invRow({ upper: 38, fore: 176 })],
    materiel: [rowDb(false), rowDb(true)],
  },
  "developpe-militaire": {
    poids: [pike({ upper: 42, fore: 42 }), pike({ upper: -20, fore: 30 })],
    materiel: [
      { view: "front", gear: ["dumbbells"], near: { upper: 80, fore: 176 }, far: { upper: 80, fore: 176 } },
      { view: "front", gear: ["dumbbells"], near: { upper: 166, fore: 176 }, far: { upper: 166, fore: 176 } },
    ],
  },
  tractions: { scene: { all: [{ bar: [0, BAR - 3] }] }, poids: [pullUp(false), pullUp(true)] },
  pallof: {
    scene: { all: [{ post: [-85, 112] }] },
    materiel: [
      { view: "front", gear: ["band"], ...legs({ thigh: 12, shin: -6 }, { upper: 28, fore: -122 }) },
      { view: "front", gear: ["band"], ...legs({ thigh: 12, shin: -6 }, { upper: -35, fore: -35, upperLen: 0.45, foreLen: 0.45 }) },
    ],
  },
  fermier: { materiel: run({ torso: 2, knee: 28, back: -16, arms: { upper: 2, fore: 2 }, gear: ["dumbbells"] }) },
  "squat-lourd": {
    scene: { poids: [{ box: [BULG_X - 20, 42, BENCH] }] },
    poids: [bulgarian(false, { upper: -30, fore: 150 }, ["backpack"]), bulgarian(true, { upper: -20, fore: 160 }, ["backpack"])],
    materiel: [
      { gear: ["barBack"], near: { upper: -35, fore: 150 } },
      { gear: ["barBack"], torso: 40, near: { thigh: 92, shin: -32, upper: 5, fore: 190 } },
    ],
  },
  "hip-thrust-lourd": { materiel: thrustBar },
  "developpe-couche": {
    poids: [{ ...pushTop, gear: ["backpack"] }, { ...pushBottom, gear: ["backpack"] }],
    materiel: [benchPress(180), benchPress(98)],
  },
  "tirage-lourd": { materiel: [rowDb(false), rowDb(true)] },

  // ---- Running / conditioning --------------------------------------------------------------
  footing: { poids: run({ torso: 5, knee: 36, back: -18, arm: 30 }) },
  "intervalles-1515": { poids: run({ torso: 10, knee: 58, back: -26, arm: 48 }) },
  "intervalles-3030": { poids: run({ torso: 9, knee: 52, back: -24, arm: 44 }) },
  "sprints-repetes": { poids: run({ torso: 12, knee: 66, back: -28, arm: 55 }) },
  "navettes-hand": {
    loop: "restart",
    poids: [
      stride({ torso: 10, knee: 55, x: 0 }),
      stride({ torso: 10, knee: 55, x: 45, swap: true }),
      stride({ torso: 10, knee: 55, x: 60, flip: true }),
      stride({ torso: 10, knee: 55, x: 15, flip: true, swap: true }),
    ],
  },
  circuit: { loop: "restart", poids: [STAND, squatHands, pushTop, squatHands, air({ lift: 20 })] },
  "montees-genoux": {
    poids: [
      { torso: -3, near: { thigh: 100, shin: 5, foot: 80, upper: -45, fore: 45 }, far: { thigh: -3, shin: -3, foot: 42, upper: 45, fore: 135 } },
      { torso: -3, far: { thigh: 100, shin: 5, foot: 80, upper: -45, fore: 45 }, near: { thigh: -3, shin: -3, foot: 42, upper: 45, fore: 135 } },
    ],
  },

  // ---- Prevention (ankle, knee, shoulder, mobility) ----------------------------------------
  "squat-une-jambe": {
    poids: [
      { near: { thigh: 2, shin: -2, upper: 80, fore: 80 }, far: { thigh: 32, shin: 32, foot: 100, upper: 80, fore: 80 } },
      { torso: 30, near: { thigh: 56, shin: -26, upper: 85, fore: 85 }, far: { thigh: 60, shin: 60, foot: 120, upper: 85, fore: 85 } },
    ],
  },
  "mollets-excentrique": {
    scene: { all: [{ box: [-12, 60, 20] }] },
    poids: [
      { contact: "near.toe", lift: 20, pin: ["near.toe", 4], ...legs({ foot: 32 }, { upper: 30, fore: 60 }) },
      { contact: "near.toe", lift: 20, pin: ["near.toe", 4], near: { foot: 100, upper: 30, fore: 60 }, far: { thigh: -8, shin: -60, foot: 20, upper: 30, fore: 60 } },
    ],
  },
  "pompes-scapulaires": {
    poids: [
      { ...plankBody(75, { near: { upper: -4, fore: -4, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] },
      { ...plankBody(77, { near: { upper: 5, fore: 5, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] },
    ],
  },
  // Seen from the front and slightly above: back leg out to the side (shin going away), front leg
  // folded in front (thigh towards us, shin across).
  "hanches-9090": {
    poids: [
      { view: "front", torso: 4, near: { thigh: 100, shin: 170, shinLen: 0.6, foot: 0, upper: 30, fore: 30 }, far: { thigh: 75, thighLen: 0.6, shin: -92, foot: -90, upper: 30, fore: 30 } },
      { view: "front", torso: -4, far: { thigh: 100, shin: 170, shinLen: 0.6, foot: 0, upper: 30, fore: 30 }, near: { thigh: 75, thighLen: 0.6, shin: -92, foot: -90, upper: 30, fore: 30 } },
    ],
  },
  "cheville-mur": {
    scene: { all: [{ wall: 10 }] },
    poids: [
      { torso: 6, contact: "near.heel", pin: ["near.toe", 0], near: { thigh: 30, shin: -4, upper: 62, fore: 100 }, far: { thigh: -20, shin: -24, foot: 42, upper: 62, fore: 100 },
        solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel" }] },
      { torso: 8, contact: "near.heel", pin: ["near.toe", 0], near: { thigh: 50, shin: -32, upper: 62, fore: 100 }, far: { thigh: -12, shin: -40, foot: 38, upper: 62, fore: 100 },
        solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel" }] },
    ],
  },
  "rotation-thoracique": {
    poids: [allFours({ upper: 15, fore: 160, hand: 160 }), allFours({ upper: 168, fore: 12, hand: 12 })],
  },
};
