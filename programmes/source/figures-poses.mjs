// Positions of every exercise, for figures.mjs (angle conventions are described there).
// Each exercise has versions, each a list of positions played in order: poids (bodyweight),
// maison (at home with something else than bodyweight), elastique (with a band) and/or materiel
// (with equipment). scene: fixed objects (box, wall, bar, post, cones), for
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
// In the air: toes pulled up towards the shins (ankle "armed" for the landing).
const ARMED = 90;
const air = (o = {}) => ({ torso: 0, lift: 24, ...o, ...legs({ thigh: 2, shin: -2, foot: ARMED }, { upper: 160, fore: 168 }) });
const landing = (o = {}) => ({ torso: 34, ...o, ...legs({ thigh: 68, shin: -28 }, { upper: 70, fore: 85 }) });

// Lying on the back (support 0: shoulders on the floor), knees bent, heels on the floor.
const onBack = { support: 0, torso: -90, head: 25 };
const heelsDown = (sh = "sh", dy = 5) => [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: sh, dy }];
const armsFloor = { upper: 87, fore: 87, hand: 87 };

// Push-up positions.
// Hands and toes stay in place between the top and the bottom (same distance, feet planted).
const pushTop = { ...plankBody(72.5, { near: { upper: 0, fore: 0, hand: 90 } }), contact: "near.toe", pin: ["near.toe", 0], plantHands: [128.5, 3] };
// Bottom: the chest goes down between the hands, forearms stay upright (never on the floor).
const pushBottom = { ...plankBody(83, { near: { upper: -106, fore: 40, hand: 90 } }), contact: "near.toe", pin: ["near.toe", 0], plantHands: [128.5, 3] };

// Bench press (lying on a bench, feet on the floor).
// Bottom: elbows about 45° from the trunk (upper arm towards the floor, out and towards the feet).
// Legs apart on each side of the bench, feet flat on the floor.
const benchPress = (low) => ({ support: BENCH, flatBench: true, torso: -90, head: 0, contact: "near.heel", near: { thigh: 70, thighOut: 24, shin: -5, shinOut: 18, upper: low ? 45 : 180, upperOut: low ? 45 : 0, fore: 180, hand: 180 }, gear: ["dumbbells"],
  solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "sh", dy: BENCH + 5 }] });

const BENCH_CAM = { yaw: 30, pitch: 18 };

// Hip thrust: shoulders resting on a bench, they stay in place; the feet are planted under the
// knees at the top (knees at 90°) and never slide.
const thrust = (top, arms, gear) => ({ support: BENCH, pin: ["sh", 0], plant: [87, 0], gear, torso: top ? -90 : -42, head: top ? 35 : 20, near: { thigh: top ? 90 : 122, shin: 0, ...arms }, far: { thigh: top ? 90 : 122, shin: 0, ...arms } });
const thrustBar = [thrust(false, { upper: 108, fore: 8 }, ["barHip"]), thrust(true, { upper: 105, fore: 125 }, ["barHip"])];

// Glute bridge on the floor: shoulders in place, heels planted where the knees are at 90° at the
// top (the hips never come down onto the heels). far: the raised leg (single-leg version).
const bridge = (top, far) => {
  const t = top ? -118 : -90, th = top ? 105.5 : 135;
  return { ...onBack, torso: t, head: top ? 50 : 25, pin: ["sh", 0], plant: [94, 0], plantSides: far ? ["near"] : undefined,
    near: { thigh: th, shin: 40, ...armsFloor }, far: far ? { ...far(th), ...armsFloor } : { thigh: th, shin: 40, ...armsFloor } };
};

// Forward / backward lunge, bottom position.
const lungeLow = (arms = { near: { upper: 3, fore: 3 }, far: { upper: -4, fore: -4 } }, gear) => ({ gear, torso: 3, contact: "near.heel",
  near: { thigh: 90, shin: 2, ...arms.near }, far: { thigh: -8, shin: -70, foot: 40, ...arms.far }, solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel", dy: -2 }] });
// Lunge with the front foot planted at x = 0 (it never slides; only the back leg moves). front:
// the side of the front leg, so that both sides can alternate.
// forward: forward lunge, the back foot is the one that stays planted at x = 0.
const lunge = (front, arms = { near: { upper: 3, fore: 3 }, far: { upper: -4, fore: -4 } }, gear, extra = {}, forward = false) => {
  const back = front === "near" ? "far" : "near";
  // Placed by the planted foot (forward: the back toe, 2 above the floor as in the solved pose).
  return { gear, torso: 3, contact: forward ? `${back}.toe` : `${front}.heel`, lift: forward ? 2 : 0, pin: [forward ? `${back}.toe` : `${front}.toe`, 0], ...extra,
    [front]: { thigh: 90, shin: 2, ...arms[front] }, [back]: { thigh: -8, shin: -70, foot: 40, ...arms[back] },
    solve: [{ vary: [`${back}.shin`], a: `${back}.toe`, b: `${front}.heel`, dy: -2 }] };
};
// Arms held straight in front.
const ARMS_FWD = { near: { upper: 90, fore: 90 }, far: { upper: 88, fore: 88 } };
// Stepping back: the back foot is lifted on its way (it never slides on the floor).
const stepBack = (front, arms = { near: { upper: 3, fore: 3 }, far: { upper: -4, fore: -4 } }, gear) => {
  const back = front === "near" ? "far" : "near";
  return { gear, torso: 2, contact: `${front}.heel`, pin: [`${front}.toe`, 0], [front]: { thigh: 20, shin: 0, ...arms[front] }, [back]: { thigh: -22, shin: -80, foot: 5, ...arms[back] } };
};
// Stepping forward: the front knee comes up on its way, the back foot stays planted.
const stepFwd = (front, arms) => {
  const back = front === "near" ? "far" : "near";
  return { torso: 2, contact: `${back}.toe`, pin: [`${back}.toe`, 0], [front]: { thigh: 55, shin: -5, foot: 80, ...arms[front] }, [back]: { thigh: -6, shin: -8, foot: 60, ...arms[back] } };
};
// Standing, feet together at x = 0 (between two lunges).
const standPinned = (arms = { near: { upper: 3, fore: 3 }, far: { upper: -4, fore: -4 } }, gear) => ({ gear, pin: ["near.toe", 0], near: arms.near, far: arms.far });

// Bulgarian split squat: back foot (laces down) on a bench behind.
const BULG_X = -62;
// The front foot stays planted (heel at x = 22), the back foot on the bench.
const bulgarian = (low, arms = { upper: 4, fore: 4 }, gear) => ({ gear, torso: low ? 16 : 6, pin: ["far.toe", BULG_X], plant: [22, 0], plantSides: ["near"],
  near: { thigh: low ? 80 : 10, shin: low ? -10 : -3, ...arms }, far: { thigh: low ? -6 : -24, shin: -80, foot: -62, ...arms },
  solve: [{ vary: ["far.shin", "far.foot"], a: "far.toe", b: "near.heel", dy: -(BENCH + 2) }] });

// Hinge (Romanian deadlift, row): hips back, flat back.
const hinge = () => ({ thigh: 14, shin: -6 });

// Pull-up bar and table heights.
const BAR = 200, TABLE = 80;

// Side plank, lying on the near side, seen from the front: bottom forearm on the floor, top arm up.
const SIDE_PLANK_CAM = { yaw: 70, pitch: 15 };
const sidePlank = (l, extra = {}) => ({ lean: l, head: 0, contact: "near.heel",
  near: { thighOut: -l, shinOut: -l, foot: 90, upper: 0, fore: 90 }, far: { thighOut: l, shinOut: l, foot: 90, upper: 180, fore: 180 }, ...extra });
const sidePlankSolve = [{ vary: ["lean", "-near.thighOut", "-near.shinOut", "far.thighOut", "far.shinOut"], a: "near.elbow", b: "near.heel", dy: -3 }];

// Lying face down.
const prone = { support: 0, torso: 90, head: -20 };
const proneLegs = { thigh: -90, shin: -90, foot: -95 };

// Feet apart, knees slightly bent.
const STANCE = { thigh: 10, thighOut: 10, shin: -6, shinOut: 8 };

// Seated 90/90: "front" = the leg folded in front (the other one is out to the side).
const ARMS_BEHIND = { upper: -40, upperOut: 20, fore: -40, foreOut: 20 };
const hips9090 = (front) => {
  const f = { thigh: 90, thighOut: 15, shin: 90, shinOut: -75, foot: 90, footOut: -75, ...ARMS_BEHIND };
  const b = { thigh: 90, thighOut: 75, shin: -90, shinOut: 15, foot: -90, footOut: 15, ...ARMS_BEHIND };
  return { torso: -12, near: front === "near" ? f : b, far: front === "near" ? b : f };
};

// On all fours. up: the arm reaching to the ceiling, the upper back turning with it.
const allFours = (up) => {
  const down = { upper: 0, fore: 0, hand: 90 }, high = { upper: 180, fore: 180, hand: 180 };
  const leg = { thigh: 0, shin: -90, foot: -100 };
  // The head turns with the arm: the gaze follows the hand.
  return { torso: 78, twist: up === "far" ? 40 : up === "near" ? -40 : 0, head: 0, headTurn: up === "far" ? -85 : up === "near" ? 85 : 0, contact: "near.knee",
    near: { ...leg, ...(up === "near" ? high : down) }, far: { ...leg, ...(up === "far" ? high : down) },
    solve: [{ vary: ["torso"], a: `${up === "near" ? "far" : "near"}.wrist`, b: "near.knee", dy: -3 }] };
};

// Inverted row under a table: body straight from the heels, hands on the edge.
const invRow = (arm) => ({ hang: TABLE, pin: ["near.hand", 0], torso: -72, head: 10, near: { thigh: 72, shin: 72, foot: 160, ...arm, hand: 180 }, far: { thigh: 72, shin: 72, foot: 160, ...arm, hand: 180 },
  solve: [{ vary: ["-torso", "near.thigh", "near.shin", "near.foot", "far.thigh", "far.shin", "far.foot"], a: "near.heel", b: "near.hand", dy: TABLE }] });

// Bent-over one-arm row with a dumbbell, free hand on the knee.
const rowDb = (pull) => ({ gear: ["dumbbell"], torso: 72, head: -10, near: { thigh: 16, shin: -8, upper: pull ? -72 : 0, fore: pull ? -4 : 0 }, far: { thigh: 16, shin: -8, upper: 0, fore: 0, hand: 90 } });

// Bench under the free hand.
const ROW_BENCH = { box: [30, 46, 43], z: [-34, 4] };

// Pull-up.
const pullUp = (top) => ({ hang: BAR, pin: ["near.hand", 0], torso: top ? 6 : 0, head: 0, ...legs({ thigh: top ? 18 : 10, shin: top ? -45 : -55, foot: 40 }, top ? { upper: 35, fore: 176, hand: 180 } : { upper: 180, fore: 180, hand: 180 }) });

// Seated on a bench (seat height SEAT), back against a backrest inclined at 70°, feet flat.
const SEAT = 50; // hip height; the seat top is a little lower
const seated = { torso: -20, head: 12, lift: SEAT, contact: "hip", pin: ["hip", 0], near: { thigh: 90, thighOut: 20, shin: 0, shinOut: 12 }, far: { thigh: 90, thighOut: 20, shin: 0, shinOut: 12 } };

// Kneeling upright, shins on the floor behind.
const KNEEL = { thigh: 0, shin: -90, foot: -100 };

// Lying on the side (on the back, then roll), knees bent, bottom arm under the head: the top
// forearm turns up from the belly, a bottle in the hand.
// The lower hip stays on the mat (no jump when the arm moves).
const sideLying = (up) => ({ torso: -90, roll: -90, head: 0, gear: ["bottle"], contact: "far.hip", lift: 8,
  near: { thigh: 130, shin: 60, foot: 150, upper: 90, fore: 90, foreOut: up ? 55 : -55 }, far: { thigh: 130, shin: 60, foot: 150, upper: -90, fore: -150 } });

// Walking step: the front foot lands on the heel, the back foot pushes off the toes; arms down.
const walkStep = (front) => {
  const back = front === "near" ? "far" : "near", arm = { upper: 2, fore: 2 };
  return { gear: ["dumbbells"], torso: 2, [front]: { thigh: 20, shin: 8, foot: 92, ...arm }, [back]: { thigh: -16, shin: -26, foot: 50, ...arm } };
};

// Mountain climber: high plank (hips a little raised), hands in place. Like high knees: one knee
// comes up to a little over 90° at the hip, the other leg stays straight behind, then the knee goes
// back and the other one comes up.
// Ankle always armed (toes pulled up towards the shin): foot = shin + 90.
const CLIMB = { straight: { thigh: -69.5, shin: -69.5, foot: 20.5 }, lift: { thigh: -40, shin: -120, foot: -30 }, drive: { thigh: 22, shin: -110, foot: -20 } };
const climber = (near, far) => {
  const arm = { upper: 0, fore: 0, hand: 90 };
  return { torso: 82, head: -8, contact: "near.hand", pin: ["near.hand", 0], near: { ...CLIMB[near], ...arm }, far: { ...CLIMB[far], ...arm } };
};

// Burpee squat, hands on the floor in front of the feet.
const squatHands = { torso: 70, near: { thigh: 108, shin: -42, upper: 0, fore: 0, hand: 90 }, far: { thigh: 108, shin: -42, upper: 0, fore: 0, hand: 90 }, solve: [{ vary: ["torso"], a: "near.wrist", b: "near.heel", dy: -3 }] };
// Burpee: feet planted until the jump, and the hands stay on the floor from the squat to the
// push-up and back; they only leave it for the jump.
const BURPEE_TOE = 25, BURPEE_HAND = 27; // wrist x in the squat
const onHands = (p) => ({ ...p, pin: ["near.toe", BURPEE_HAND - 128.5] });
const burpee = [{ ...STAND, pin: ["near.toe", BURPEE_TOE] }, { ...squatHands, pin: ["near.toe", BURPEE_TOE] }, onHands(pushTop), onHands(pushBottom), onHands(pushTop), { ...squatHands, pin: ["near.toe", BURPEE_TOE] }, { ...air({ lift: 20 }), pin: ["near.toe", BURPEE_TOE] }];

// A throw: loaded (a), release (b), the ball reaches its target (wall or floor) then comes back to
// the hands, and the thrower gets ready again. hands: where the ball is in a and b.
const throwBack = (a, b, ballA, ballB, target) => [
  { ...a, ball: ballA }, { ...b, ball: ballB }, { ...b, ball: target }, { ...b, ball: ballB }, { ...a, ball: ballA },
];

export const defs = {
  // ---- Warm-up -----------------------------------------------------------------------------
  // Seen from the front side: in the lunge, the shoulders and the arms held in front turn towards
  // the front leg (near side).
  "fente-rotation": {
    cam: { yaw: 40, pitch: 12 },
    loop: "restart",
    // A step forward, the trunk turns towards the front leg, back to standing, then the other side.
    // The back foot stays planted; the front foot is lifted to step, never slid.
    poids: [
      standPinned(ARMS_FWD),
      stepFwd("near", ARMS_FWD),
      lunge("near", ARMS_FWD, undefined, {}, true),
      lunge("near", { near: { upper: 90, upperOut: 60, fore: 90, foreOut: 60 }, far: { upper: 90, upperOut: -60, fore: 90, foreOut: -60 } }, undefined, { twist: -55, headTurn: 45 }, true),
      lunge("near", ARMS_FWD, undefined, {}, true),
      stepFwd("near", ARMS_FWD),
      standPinned(ARMS_FWD),
      stepFwd("far", ARMS_FWD),
      lunge("far", ARMS_FWD, undefined, {}, true),
      lunge("far", { near: { upper: 90, upperOut: -60, fore: 90, foreOut: -60 }, far: { upper: 90, upperOut: 60, fore: 90, foreOut: 60 } }, undefined, { twist: 55, headTurn: -45 }, true),
      lunge("far", ARMS_FWD, undefined, {}, true),
      stepFwd("far", ARMS_FWD),
      standPinned(ARMS_FWD),
    ],
  },
  // Feet together; the knee rises out to the side (hip and knee at 90°, lower leg and foot in
  // line with the thigh), comes round to the front keeping both at 90°, and only then goes down.
  "ouverture-hanche": {
    cam: { yaw: 55, pitch: 25 },
    loop: "restart",
    pace: [0.9, 1.3, 0.8, 0.9, 1.3, 0.8],
    still: [1, 2],
    // One leg, then the other.
    poids: [
      { near: { thighOut: -3, upper: 8, upperOut: 20 }, far: { thighOut: -3, upper: 8, upperOut: 20 } },
      { near: { thigh: 88, thighOut: 80, shin: 0, footOut: 80, upper: 10, upperOut: 35 }, far: { thighOut: -3, upper: 10, upperOut: 35 } },
      { near: { thigh: 88, thighOut: 0, shin: 0, upper: 10, upperOut: 35 }, far: { thighOut: -3, upper: 10, upperOut: 35 } },
      { near: { thighOut: -3, upper: 8, upperOut: 20 }, far: { thighOut: -3, upper: 8, upperOut: 20 } },
      { far: { thigh: 88, thighOut: 80, shin: 0, footOut: 80, upper: 10, upperOut: 35 }, near: { thighOut: -3, upper: 10, upperOut: 35 } },
      { far: { thigh: 88, thighOut: 0, shin: 0, upper: 10, upperOut: 35 }, near: { thighOut: -3, upper: 10, upperOut: 35 } },
      { near: { thighOut: -3, upper: 8, upperOut: 20 }, far: { thighOut: -3, upper: 8, upperOut: 20 } },
    ],
  },
  "pont-fessier": { poids: [bridge(false), bridge(true)] },
  planche: { poids: [{ ...plankBody(80, { near: { upper: 0, fore: 90, hand: 90 } }), contact: "near.toe", solve: [{ vary: planks, a: "near.elbow", b: "near.toe", dy: -3 }] }] },
  // Held still on one leg, arms relaxed.
  equilibre: {
    poids: [{ near: { thigh: 4, shin: -6, upper: 6, fore: 12 }, far: { thigh: 22, shin: -55, foot: 30, upper: -4, fore: 4 } }],
  },
  "saut-reception": { loop: "restart", poids: [STAND, crouch(), air({ lift: 18 }), landing()] },

  // ---- Prevention / core -------------------------------------------------------------------
  "gainage-lateral": { cam: SIDE_PLANK_CAM, poids: [{ ...sidePlank(78), solve: sidePlankSolve }] },
  nordic: {
    poids: [
      // The knees stay where they are: only the body tips forward around them.
      { gear: ["anchor"], contact: "near.knee", pin: ["near.knee", 0], near: { thigh: 0, shin: -90, foot: -100, upper: 15, fore: 110 } },
      { gear: ["anchor"], contact: "near.knee", pin: ["near.knee", 0], torso: 62, near: { thigh: -62, shin: -90, foot: -100, upper: 95, fore: 80 } },
    ],
  },
  // One arm and the opposite leg reach out, back to the start, then the other side.
  "dead-bug": {
    loop: "restart",
    poids: [
      { ...onBack, ...legs({ thigh: 180, shin: 90, foot: 178 }, { upper: 180, fore: 180, hand: 180 }) },
      { ...onBack, near: { thigh: 180, shin: 90, foot: 178, upper: 262, fore: 262, hand: 262 }, far: { thigh: 98, shin: 98, foot: 178, upper: 180, fore: 180, hand: 180 } },
      { ...onBack, ...legs({ thigh: 180, shin: 90, foot: 178 }, { upper: 180, fore: 180, hand: 180 }) },
      { ...onBack, far: { thigh: 180, shin: 90, foot: 178, upper: 262, fore: 262, hand: 262 }, near: { thigh: 98, shin: 98, foot: 178, upper: 180, fore: 180, hand: 180 } },
      { ...onBack, ...legs({ thigh: 180, shin: 90, foot: 178 }, { upper: 180, fore: 180, hand: 180 }) },
    ],
  },
  // Lying face down, seen from above: the arms draw the letters Y, T and W.
  ytw: {
    cam: { yaw: 0, pitch: 80 },
    poids: [
      { ...prone, ...legs(proneLegs, { upper: 112, upperOut: 35, fore: 112, foreOut: 35 }) },
      { ...prone, ...legs(proneLegs, { upper: 180, upperOut: 76, fore: 180, foreOut: 76 }) },
      { ...prone, ...legs(proneLegs, { upper: 210, upperOut: 62, fore: 112, foreOut: 28 }) },
    ],
  },
  // The ball leaves the hands, bounces off the wall and comes back to be caught.
  "equilibre-balle": {
    scene: { all: [{ wall: 105 }] },
    loop: "restart",
    pace: [0.5, 0.45, 0.45, 0.6],
    materiel: [
      { gear: ["ball"], ball: [53, 140], near: { thigh: 4, shin: -6, upper: 55, fore: 125 }, far: { thigh: 22, shin: -55, foot: 30, upper: 55, fore: 125 } },
      { gear: ["ball"], ball: [64, 151], near: { thigh: 4, shin: -6, upper: 100, fore: 100 }, far: { thigh: 22, shin: -55, foot: 30, upper: 100, fore: 100 } },
      { gear: ["ball"], ball: [95, 158], near: { thigh: 4, shin: -6, upper: 100, fore: 100 }, far: { thigh: 22, shin: -55, foot: 30, upper: 100, fore: 100 } },
      { gear: ["ball"], ball: [64, 151], near: { thigh: 4, shin: -6, upper: 100, fore: 100 }, far: { thigh: 22, shin: -55, foot: 30, upper: 100, fore: 100 } },
      { gear: ["ball"], ball: [53, 140], near: { thigh: 4, shin: -6, upper: 55, fore: 125 }, far: { thigh: 22, shin: -55, foot: 30, upper: 55, fore: 125 } },
    ],
  },
  "pont-une-jambe": { poids: [bridge(false, (th) => ({ thigh: th, shin: th, foot: th + 80 })), bridge(true, (th) => ({ thigh: th, shin: th, foot: th + 80 }))] },
  copenhague: {
    cam: SIDE_PLANK_CAM,
    scene: { all: [{ bench: [-18, 36, 34], z: [-128, -92] }] },
    poids: [
      { lean: 62, head: 0, contact: "near.elbow", lift: 3, pin: ["far.ankle", 0, -108],
        near: { thighOut: -84, shinOut: -84, foot: 90, upper: 0, fore: 90 }, far: { thighOut: 80, shinOut: 80, foot: 90, upper: 180, fore: 180 },
        solve: [{ vary: ["far.thighOut", "far.shinOut"], a: "far.ankle", b: "near.elbow", dy: -39 }] },
      { lean: 78, head: 0, contact: "near.elbow", lift: 3, pin: ["far.ankle", 0, -108],
        near: { thighOut: -77, shinOut: -77, foot: 90, upper: 0, fore: 90 }, far: { thighOut: 80, shinOut: 80, foot: 90, upper: 180, fore: 180 },
        solve: [{ vary: ["far.thighOut", "far.shinOut"], a: "far.ankle", b: "near.elbow", dy: -39 }] },
    ],
  },
  // Elbow against the side, bent at 90°: the forearm turns outwards, band anchored on the other side.
  // At home without a band: lying on the side, a bottle in the hand.
  "rotation-externe": {
    cam: { materiel: { yaw: 70, pitch: 45 }, maison: { yaw: -120, pitch: 12 } },
    // The dotted arrow shows which way the forearm goes.
    scene: { materiel: [{ post: [8, 104], z: -80 }, { arrow: [[32, 108, -17], [43, 108, 27], [12, 108, 58]] }], maison: [{ arrow: [[7, 4, 0], [24, 31, 0], [7, 65, 0]] }] },
    maison: [sideLying(false), sideLying(true)],
    materiel: [
      { gear: ["band"], near: { upper: 0, fore: 90, foreOut: -45 }, far: { upper: 4, fore: 4 } },
      { gear: ["band"], near: { upper: 0, fore: 90, foreOut: 75 }, far: { upper: 4, fore: 4 } },
    ],
  },
  // Arm out to the side at shoulder height, elbow at 90°: the forearm turns from forward to up.
  // The band is anchored in front, at the height of the hand in the top position.
  // At home: standing straight, a bottle in the hand. The dotted arrow shows which way the
  // forearm goes (from forward to up).
  "rotation-externe-haute": {
    cam: { materiel: { yaw: 30, pitch: 35 }, maison: { yaw: 70, pitch: 10 } },
    scene: { materiel: [{ post: [75, 165], z: 47 }, { arrow: [[45, 140, 47], [32, 171, 47], [0, 184, 47]] }], maison: [{ arrow: [[45, 140, 47], [32, 171, 47], [0, 184, 47]] }] },
    maison: [
      { gear: ["bottle"], near: { upper: 90, upperOut: 90, fore: 90 }, far: { upper: 4, fore: 4 } },
      { gear: ["bottle"], near: { upper: 90, upperOut: 90, fore: 180 }, far: { upper: 4, fore: 4 } },
    ],
    materiel: [
      { gear: ["band"], near: { upper: 90, upperOut: 90, fore: 90 }, far: { upper: 4, fore: 4 } },
      { gear: ["band"], near: { upper: 90, upperOut: 90, fore: 180 }, far: { upper: 4, fore: 4 } },
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
  // Quick little jumps, straight one after the other.
  pogos: {
    pace: [0.3, 0.3],
    poids: [
      { ...legs({ thigh: 6, shin: -8, foot: 45 }, { upper: 25, fore: 110 }) },
      { lift: 11, ...legs({ thigh: 0, shin: -1, foot: ARMED }, { upper: 20, fore: 105 }) },
    ],
  },
  "squat-jump": {
    poids: [
      { torso: 38, near: { thigh: 70, shin: -30, upper: -40, fore: -30 } },
      { torso: -2, lift: 26, near: { thigh: 0, shin: -3, foot: ARMED, upper: 156, fore: 164 } },
    ],
  },
  "skater-hop": {
    cam: { yaw: 80, pitch: 5 },
    poids: [
      { lean: 8, near: { thigh: 20, thighOut: 6, shin: -8, shinOut: 4, upper: 30, upperOut: 40, fore: 60, foreOut: 20 }, far: { thigh: -10, thighOut: -12, shin: -80, shinOut: -5, upper: 40, upperOut: -30, fore: 60, foreOut: -30 } },
      { z: -55, lift: 22, ...legs({ thigh: 10, thighOut: 25, shin: 0, shinOut: 15, foot: ARMED }, { upper: 30, upperOut: 60, fore: 40, foreOut: 70 }) },
      { lean: -8, z: -110, far: { thigh: 20, thighOut: 6, shin: -8, shinOut: 4, upper: 30, upperOut: 40, fore: 60, foreOut: 20 }, near: { thigh: -10, thighOut: -12, shin: -80, shinOut: -5, upper: 40, upperOut: -30, fore: 60, foreOut: -30 } },
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
  freinage: {
    loop: "restart",
    poids: [
      stride({ torso: 14, knee: 62, back: -26, arm: 50 }),
      // Braking step: front knee bent to absorb, never a straight leg.
      { torso: 8, x: 45, near: { thigh: 62, shin: 4, foot: 82, upper: 40, fore: 110 }, far: { thigh: -12, shin: -52, foot: 40, upper: -30, fore: 40 } },
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
      // Stepping off the box: in the air in front of it, arms back.
      { torso: 6, lift: 30, pin: ["near.toe", 2], ...legs({ thigh: 18, shin: -6, foot: ARMED }, { upper: -30, fore: -20 }) },
      // Very short contact: barely bent on landing, straight back up.
      { torso: 16, pin: ["near.toe", 30], ...legs({ thigh: 34, shin: -20 }, { upper: -40, fore: -20 }) },
      { ...air({ lift: 32 }), pin: ["near.toe", 36] },
    ],
    pace: [1, 0.7, 0.25],
  },
  "lancer-poitrine": {
    scene: { materiel: [{ wall: 115 }], elastique: [{ post: [-80, 118] }] },
    // Band anchored behind at chest height: explosive push forward.
    elastique: [
      { gear: ["bands"], torso: 8, ...legs({ thigh: 24, shin: -18 }, { upper: -25, fore: 140 }) },
      { gear: ["bands"], torso: 14, x: 8, near: { thigh: 30, shin: 5, upper: 92, fore: 92, hand: 92 }, far: { thigh: -18, shin: -30, foot: 45, upper: 92, fore: 92, hand: 92 } },
    ],
    // Thrown against the wall, the ball bounces back into the hands.
    loop: "restart",
    pace: [0.6, 0.45, 0.45, 0.8],
    materiel: throwBack(
      { gear: ["ball"], torso: 8, ...legs({ thigh: 24, shin: -18 }, { upper: -25, fore: 140 }) },
      { gear: ["ball"], torso: 14, x: 8, near: { thigh: 30, shin: 5, upper: 92, fore: 92, hand: 92 }, far: { thigh: -18, shin: -30, foot: 45, upper: 92, fore: 92, hand: 92 } },
      [15, 130], [85, 141], [109, 146]),
  },
  "lancer-rotation": {
    cam: { yaw: 60, pitch: 10 },
    scene: { materiel: [{ wallZ: -140, x: [-50, 50] }], elastique: [{ post: [0, 105], z: 110 }] },
    // Band anchored on the side at hip height: fast rotation away from the anchor.
    elastique: [
      { gear: ["bands"], twist: 40, near: { ...STANCE, upper: 30, upperOut: 60, fore: 40, foreOut: 60 }, far: { ...STANCE, upper: 40, upperOut: -20, fore: 40, foreOut: 40 } },
      { gear: ["bands"], twist: -35, near: { ...STANCE, upper: 60, upperOut: -40, fore: 60, foreOut: -50 }, far: { ...STANCE, upper: 60, upperOut: 50, fore: 60, foreOut: 40 } },
    ],
    // Both hands stay in front of the trunk; the ball hits the wall and comes back to the hands.
    loop: "restart",
    pace: [0.6, 0.45, 0.45, 0.8],
    materiel: throwBack(
      { gear: ["ball"], twist: -40, near: { ...STANCE, upper: 10, upperOut: 30, fore: 40, foreOut: 10 }, far: { ...STANCE, upper: 40, upperOut: -40, fore: 40, foreOut: -30 } },
      { gear: ["ball"], twist: 30, near: { ...STANCE, upper: 90, upperOut: -70, fore: 90, foreOut: -75 }, far: { ...STANCE, upper: 90, upperOut: 70, fore: 90, foreOut: 75 } },
      [30, 91, 29], [19, 138, -62], [15, 142, -131]),
  },
  "lancer-haut": {
    // Slammed to the floor, the ball bounces back up into the hands.
    loop: "restart",
    pace: [0.6, 0.35, 0.45, 0.8],
    materiel: throwBack(
      { gear: ["ball"], torso: -8, ...legs({ foot: 45 }, { upper: 170, fore: 200 }) },
      { gear: ["ball"], torso: 50, ...legs({ thigh: 62, shin: -28 }, { upper: 62, fore: 55 }) },
      [-13, 210], [93, 61], [112, 9]),
  },
  // Jump shot (home page): in the air, throwing arm cocked high behind with the ball, the other
  // arm up in front, the opposite knee driven up. It floats gently.
  "tir-suspension": {
    cam: { yaw: 18, pitch: 0 },
    poids: [0, 1].map((k) => ({ gear: ["ballHand"], lift: 44 + 5 * k, torso: 10, twist: -22 - 5 * k, head: 2,
      near: { thigh: 32, shin: -58, foot: -5, upper: -112 - 6 * k, upperOut: 12, fore: -128 - 6 * k, foreOut: 6, hand: -128 },
      far: { thigh: -6, shin: -98, foot: -20, upper: 98, upperOut: -8, fore: 165, foreOut: -4, hand: 178 } })),
  },
  // Home page cards of the sports coming soon: a free kick stance with the ball in front, and a dunk.
  "coup-franc": {
    cam: { yaw: 58, pitch: 4 },
    scene: { all: [{ football: [70, -38] }] },
    poids: [0, 1].map((k) => ({ torso: 5 + 2 * k, head: -6,
      near: { thigh: 6, thighOut: 23, shin: -12 - 3 * k, shinOut: 5, upper: 4, upperOut: 18, fore: 12, foreOut: 12, hand: 10 },
      far: { thigh: 6, thighOut: 23, shin: -12 - 3 * k, shinOut: 5, upper: 4, upperOut: 18, fore: 12, foreOut: 12, hand: 10 } })),
  },
  dunk: {
    cam: { yaw: 14, pitch: 0 },
    scene: { all: [{ hoop: [34, 236] }] },
    poids: [0, 1].map((k) => ({ gear: ["basketHand"], lift: 62 + 5 * k, torso: 6, head: -6,
      near: { thigh: 42, shin: -72, foot: -35, upper: 168 + 4 * k, upperOut: 4, fore: 172 + 4 * k, hand: 176 },
      far: { thigh: -22, shin: -88, foot: -30, upper: -22, upperOut: 22, fore: -8, foreOut: 12, hand: -8 } })),
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
    poids: [crouch(), { ...air({ lift: 64 }), torso: 20, ...legs({ thigh: 75, shin: 0, foot: ARMED }, { upper: 150, fore: 150 }), x: 36 }, { ...landing(), lift: 40, pin: ["near.toe", 112] }],
  },
  "squat-jump-leste": {
    // At home: a light backpack.
    maison: [
      { gear: ["backpack"], torso: 38, ...legs({ thigh: 70, shin: -30 }, { upper: -45, fore: -30 }) },
      { gear: ["backpack"], torso: -2, lift: 22, ...legs({ thigh: 0, shin: -3, foot: ARMED }, { upper: 150, fore: 160 }) },
    ],
    materiel: [
      { gear: ["dumbbells"], torso: 38, ...legs({ thigh: 70, shin: -30 }, { upper: -6, fore: -6 }) },
      { gear: ["dumbbells"], torso: -2, lift: 22, ...legs({ thigh: 0, shin: -3, foot: ARMED }, { upper: 2, fore: 2 }) },
    ],
  },
  "reception-unipodale": {
    loop: "restart",
    poids: [
      crouch({ torso: 32 }),
      { lift: 16, x: 30, torso: 10, ...legs({ thigh: 20, shin: -10, foot: ARMED }, { upper: 90, fore: 100 }) },
      { x: 60, torso: 30, near: { thigh: 52, shin: -24, upper: 60, fore: 70 }, far: { thigh: 14, shin: -72, foot: 20, upper: 60, fore: 70 } },
    ],
  },

  // ---- Strength / muscle -------------------------------------------------------------------
  squat: {
    poids: [
      { near: { upper: 8, fore: 8 } },
      { torso: 42, near: { thigh: 92, shin: -32, upper: 88, fore: 88 } },
    ],
    // Band under the feet, hands at the shoulders.
    elastique: [
      { gear: ["bandFeet"], near: { upper: 15, fore: 165 } },
      { gear: ["bandFeet"], torso: 26, near: { thigh: 95, shin: -36, upper: 45, fore: 175 } },
    ],
    materiel: [
      { gear: ["goblet"], near: { upper: 15, fore: 160 } },
      { gear: ["goblet"], torso: 24, near: { thigh: 95, shin: -36, upper: 40, fore: 170 } },
    ],
  },
  // One leg back, then the other; the front foot stays planted.
  "fente-arriere": {
    loop: "restart",
    poids: [standPinned(), stepBack("near"), lunge("near"), stepBack("near"), standPinned(), stepBack("far"), lunge("far"), stepBack("far"), standPinned()],
    materiel: [standPinned(undefined, ["dumbbells"]), stepBack("near", undefined, ["dumbbells"]), lunge("near", undefined, ["dumbbells"]), stepBack("near", undefined, ["dumbbells"]), standPinned(undefined, ["dumbbells"]),
      stepBack("far", undefined, ["dumbbells"]), lunge("far", undefined, ["dumbbells"]), stepBack("far", undefined, ["dumbbells"]), standPinned(undefined, ["dumbbells"])],
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
    // Arms along the body, hands towards the hips.
    poids: [thrust(false, { upper: 42, fore: 60 }), thrust(true, { upper: 90, fore: 90 })],
    materiel: thrustBar,
  },
  pompes: {
    cam: { materiel: BENCH_CAM },
    poids: [pushTop, pushBottom], materiel: [benchPress(false), benchPress(true)] },
  rowing: {
    scene: { poids: [{ bar: [0, TABLE - 3] }], materiel: [ROW_BENCH], elastique: [{ post: [95, 108] }] },
    poids: [invRow({ upper: 180, fore: 180 }), invRow({ upper: 38, fore: 176 })],
    // Band anchored to a door at chest height: pull the elbows back.
    elastique: [
      { gear: ["bands"], torso: 12, ...legs({ thigh: 18, shin: -10 }, { upper: 82, fore: 82 }) },
      { gear: ["bands"], torso: 6, ...legs({ thigh: 18, shin: -10 }, { upper: -38, fore: 78 }) },
    ],
    materiel: [rowDb(false), rowDb(true)],
  },
  "developpe-militaire": {
    cam: { materiel: { yaw: 35, pitch: 8 }, elastique: { yaw: 75, pitch: 5 } },
    // At the gym: seated on a bench, backrest inclined at 70°.
    scene: { materiel: [{ box: [-24, 44, SEAT - 7] }, { slab: [[-22, SEAT - 7], [-22 - 62 * Math.cos((70 * Math.PI) / 180), SEAT - 7 + 62 * Math.sin((70 * Math.PI) / 180)]] }] },
    // Band under the feet, pressed above the head.
    elastique: [
      { gear: ["bandFeet"], near: { upperOut: 80, foreOut: 176 } },
      { gear: ["bandFeet"], near: { upperOut: 166, foreOut: 176 } },
    ],
    // Pike push-up: hands and feet stay in place, only the trunk goes down (elbows bend) and up.
    poids: [
      { torso: 110, head: 0, contact: "near.toe", lift: 2, pin: ["near.toe", 0], ...legs({ thigh: -45, shin: -45, foot: 20 }, { upper: -2, fore: -2, hand: 90 }) },
      { torso: 137, head: -10, contact: "near.toe", lift: 2, pin: ["near.toe", 0], ...legs({ thigh: -50, shin: -50, foot: 20 }, { upper: -30, fore: 70, hand: 90 }) },
    ],
    materiel: [
      { gear: ["dumbbells"], ...seated, ...legs(seated.near, { upperOut: 80, foreOut: 176 }) },
      { gear: ["dumbbells"], ...seated, ...legs(seated.near, { upperOut: 166, foreOut: 176 }) },
    ],
  },
  tractions: {
    scene: { poids: [{ bar: [0, BAR - 3] }], elastique: [{ post: [22, 190] }] },
    poids: [pullUp(false), pullUp(true)],
    // Kneeling, band anchored high: pull the elbows down to the sides.
    elastique: [
      { gear: ["bands"], contact: "near.knee", ...legs(KNEEL, { upper: 168, fore: 172 }) },
      { gear: ["bands"], contact: "near.knee", ...legs(KNEEL, { upper: 22, fore: 150 }) },
    ],
  },
  // Band anchored on the side at chest height: the arms press forward without the trunk turning.
  pallof: {
    cam: { yaw: 55, pitch: 15 },
    scene: { all: [{ post: [10, 118], z: -95 }] },
    materiel: [
      { gear: ["band"], ...legs(STANCE, { upper: 10, upperOut: 25, fore: 130, foreOut: -65 }) },
      { gear: ["band"], ...legs(STANCE, { upper: 90, upperOut: -12, fore: 90, foreOut: -12 }) },
    ],
  },
  // Walking (one foot always on the floor), a load in each hand.
  fermier: { materiel: [walkStep("near"), walkStep("far")] },
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
    cam: { materiel: BENCH_CAM },
    poids: [{ ...pushTop, gear: ["backpack"] }, { ...pushBottom, gear: ["backpack"] }],
    materiel: [benchPress(false), benchPress(true)],
  },
  "tirage-lourd": { scene: { all: [ROW_BENCH] }, materiel: [rowDb(false), rowDb(true)] },

  // ---- Running / conditioning --------------------------------------------------------------
  // Circuit training: its exercises are shown one by one (lieux.mjs), burpee here by default.
  circuit: { loop: "restart", poids: burpee },
  burpee: { loop: "restart", poids: burpee },
  // High plank, hands and feet in place: one knee comes to the chest, then the other.
  "mountain-climber": { loop: "restart", still: [2, 6], pace: [0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22, 0.22],
    poids: ["straight", "lift", "drive", "lift", "straight"].map((k) => climber(k, "straight")).concat(["lift", "drive", "lift", "straight"].map((k) => climber("straight", k))) },
  "montees-genoux": {
    poids: [
      // Trunk slightly forward.
      { torso: 8, near: { thigh: 100, shin: 5, foot: 80, upper: -45, fore: 45 }, far: { thigh: -3, shin: -3, foot: 42, upper: 45, fore: 135 } },
      { torso: 8, far: { thigh: 100, shin: 5, foot: 80, upper: -45, fore: 45 }, near: { thigh: -3, shin: -3, foot: 42, upper: 45, fore: 135 } },
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
  // Arms straight, hands and feet in place: the shoulder blades squeeze (the chest sinks between
  // the arms) then spread (the upper back rises).
  "pompes-scapulaires": {
    poids: [
      { ...plankBody(76, { near: { upper: 0, fore: 0, hand: 90 } }), scap: -5, contact: "near.toe", pin: ["near.hand", 0], solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] },
      { ...plankBody(76, { near: { upper: 0, fore: 0, hand: 90 } }), scap: 9, contact: "near.toe", pin: ["near.hand", 0], solve: [{ vary: planks, a: "near.wrist", b: "near.toe", dy: -3 }] },
    ],
  },
  // Seen from the front and slightly above: back leg out to the side (shin going away), front leg
  // folded in front (thigh towards us, shin across).
  // Seated, seen from the front and above: front leg folded in front, back leg out to the side,
  // then the knees swing over to the other side (windscreen wiper).
  "hanches-9090": {
    cam: { yaw: 80, pitch: 55 },
    poids: [hips9090("near"), { torso: -12, ...legs({ thigh: 135, thighOut: 15, shin: 0 }, ARMS_BEHIND), solve: [{ vary: ["near.shin", "far.shin"], a: "near.heel", b: "hip", dy: 7.5 }] }, hips9090("far")],
  },
  "cheville-mur": {
    scene: { all: [{ wall: 10 }] },
    poids: [
      // Hands resting flat against the wall (never through it).
      { torso: 6, contact: "near.heel", pin: ["near.toe", 0], near: { thigh: 30, shin: -4, upper: 43, fore: 131, hand: 180 }, far: { thigh: -20, shin: -24, foot: 42, upper: 43, fore: 131, hand: 180 },
        solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel" }] },
      { torso: 8, contact: "near.heel", pin: ["near.toe", 0], near: { thigh: 50, shin: -32, upper: 34, fore: 149, hand: 180 }, far: { thigh: -12, shin: -40, foot: 38, upper: 34, fore: 149, hand: 180 },
        solve: [{ vary: ["far.shin"], a: "far.toe", b: "near.heel" }] },
    ],
  },
  // On all fours: the upper back turns and one arm reaches up to the ceiling, then the other.
  "rotation-thoracique": {
    cam: { yaw: 45, pitch: 20 },
    loop: "restart",
    still: [0, 1, 3],
    poids: [allFours(), allFours("far"), allFours(), allFours("near"), allFours()],
  },
};
