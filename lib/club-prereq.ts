// Prerequisites expected for each side, age group and level of play (club quote form, the "i"
// next to the level). A coach whose team lacks them picks the level below, or does not ask for a
// quote. While a list is empty, the general explanation is shown instead.
// Key: <side f|m>-<category u15|u17|u18|seniors>-<level departemental|regional|national|pro>.
// Seniors start at regional: there is no county-level seniors program.
//
// Every list follows the same order, so levels compare line by line: training volume, continuous
// running, core, bodyweight strength, landings and footwork, then weight-training experience.
// Checks a coach can run in one session, without equipment, on most of the group. Girls and boys
// differ only on push-ups; U17 girls and U18 boys share the same profile.

type Profile = {
  train: [string, string]; // [fr, en]
  run: number; // minutes of continuous easy running
  plank: number; // seconds, front plank
  side: number; // seconds per side, side plank
  squat: number; // bodyweight squats
  lunge?: number; // forward lunges per leg
  push: { f: number; m: number; knees?: boolean }; // push-ups (knees: girls on the knees)
  land: [string, string];
  extra: [string, string][];
};

const P: Record<string, Profile> = {
  "u15-departemental": {
    train: ["S'entraînent au moins 2 fois par semaine.", "Train at least twice a week."],
    run: 15, plank: 30, side: 20, squat: 10,
    push: { f: 5, m: 5, knees: true },
    land: ["Savent sauter et se réceptionner sur deux pieds sans perdre l'équilibre.", "Can jump and land on both feet without losing balance."],
    extra: [["Aucune expérience de musculation n'est demandée : tout se fait au poids du corps.", "No weight-training experience needed: everything is bodyweight."]],
  },
  "u15-regional": {
    train: ["S'entraînent 2 à 3 fois par semaine, en plus du match.", "Train 2 to 3 times a week, on top of the game."],
    run: 20, plank: 45, side: 30, squat: 15, lunge: 8,
    push: { f: 5, m: 10 },
    land: ["Tiennent 2 secondes sur une jambe à la réception d'un petit saut, genou dans l'axe.", "Hold 2 seconds on one leg when landing a small hop, knee in line."],
    extra: [
      ["Connaissent un échauffement dynamique (gammes athlétiques, pas chassés, montées de genoux).", "Know a dynamic warm-up (running drills, shuffles, high knees)."],
      ["Aucune expérience de musculation n'est demandée : tout se fait au poids du corps.", "No weight-training experience needed: everything is bodyweight."],
    ],
  },
  "jeunes-departemental": {
    train: ["S'entraînent au moins 2 fois par semaine.", "Train at least twice a week."],
    run: 20, plank: 45, side: 30, squat: 15, lunge: 8,
    push: { f: 5, m: 10 },
    land: ["Se réceptionnent sur deux pieds, genoux dans l'axe (ils ne rentrent pas vers l'intérieur).", "Land on both feet with knees in line (not caving in)."],
    extra: [["Aucune expérience de musculation n'est demandée : le programme apprend les gestes avec des charges légères.", "No weight-training experience needed: the program teaches the lifts with light loads."]],
  },
  "jeunes-regional": {
    train: ["S'entraînent 3 fois par semaine, en plus du match.", "Train 3 times a week, on top of the game."],
    run: 25, plank: 60, side: 40, squat: 20, lunge: 10,
    push: { f: 8, m: 15 },
    land: ["Tiennent 2 secondes sur une jambe à la réception d'un saut, genou dans l'axe.", "Hold 2 seconds on one leg when landing a jump, knee in line."],
    extra: [
      ["Enchaînent 6 sprints de 20 m avec 30 secondes de récupération sans ralentir nettement.", "Can run 6 × 20 m sprints with 30 s rest without slowing down much."],
      ["Ont déjà fait squat, fente et pont fessier au poids du corps ou avec élastique.", "Have already done squats, lunges and glute bridges with bodyweight or a band."],
    ],
  },
  "jeunes-national": {
    train: ["S'entraînent 3 à 4 fois par semaine, en plus du match.", "Train 3 to 4 times a week, on top of the game."],
    run: 30, plank: 60, side: 45, squat: 20, lunge: 10,
    push: { f: 10, m: 20 },
    land: ["Tiennent 2 secondes sur une jambe à la réception d'un saut, genou dans l'axe.", "Hold 2 seconds on one leg when landing a jump, knee in line."],
    extra: [
      ["Enchaînent 6 sprints de 20 m avec 30 secondes de récupération sans ralentir nettement.", "Can run 6 × 20 m sprints with 30 s rest without slowing down much."],
      ["Ont une première expérience de musculation encadrée : squat, soulevé de terre jambes tendues et développé couché avec des charges légères, technique propre.", "Have a first supervised weight-training experience: squat, Romanian deadlift and bench press with light loads, clean technique."],
      ["Connaissent déjà les tests de terrain (30-15, sprint, saut) ou sont prêts à les faire à la reprise.", "Already know field tests (30-15, sprint, jump) or are ready to take them at the restart."],
    ],
  },
  "seniors-regional": {
    train: ["S'entraînent 2 à 3 fois par semaine, en plus du match.", "Train 2 to 3 times a week, on top of the game."],
    run: 25, plank: 60, side: 40, squat: 20, lunge: 10,
    push: { f: 8, m: 15 },
    land: ["Se réceptionnent sur une jambe sans déséquilibre, genou dans l'axe.", "Land on one leg without losing balance, knee in line."],
    extra: [["Maîtrisent squat, fente et pont fessier au poids du corps. La musculation avec charges n'est pas obligatoire : le programme l'introduit progressivement.", "Master squats, lunges and glute bridges with bodyweight. Loaded weight training is not required: the program introduces it gradually."]],
  },
  "seniors-national": {
    train: ["S'entraînent 3 à 4 fois par semaine, en plus du match.", "Train 3 to 4 times a week, on top of the game."],
    run: 30, plank: 90, side: 45, squat: 25, lunge: 12,
    push: { f: 12, m: 25 },
    land: ["Se réceptionnent sur une jambe sans déséquilibre, genou dans l'axe, y compris après un sprint.", "Land on one leg without losing balance, knee in line, even after a sprint."],
    extra: [
      ["Enchaînent 8 sprints de 20 m avec 30 secondes de récupération sans ralentir nettement.", "Can run 8 × 20 m sprints with 30 s rest without slowing down much."],
      ["Pratiquent la musculation depuis au moins une saison : squat, soulevé de terre et développé avec une technique propre.", "Have done weight training for at least one season: squat, deadlift and press with clean technique."],
      ["Enchaînent entraînements et match du week-end sans douleur qui revient chaque semaine.", "Handle training plus the weekend game without pain that returns every week."],
    ],
  },
  "seniors-pro": {
    train: ["S'entraînent au moins 5 fois par semaine, match compris.", "Train at least 5 times a week, game included."],
    run: 30, plank: 90, side: 60, squat: 25, lunge: 12,
    push: { f: 15, m: 30 },
    land: ["Se réceptionnent sur une jambe sans déséquilibre, genou dans l'axe, y compris en fin de séance.", "Land on one leg without losing balance, knee in line, even at the end of a session."],
    extra: [
      ["Font de la musculation 2 fois par semaine en saison, avec des charges lourdes maîtrisées.", "Lift twice a week in season, with well-controlled heavy loads."],
      ["Passent déjà des tests physiques réguliers (30-15, sprint, saut) et ont un suivi médical ou kiné au club.", "Already take regular fitness tests (30-15, sprint, jump) and have medical or physio follow-up at the club."],
    ],
  },
};

function list(p: Profile, side: "f" | "m", lang: "fr" | "en"): string[] {
  const fr = lang === "fr", n = p.push[side], knees = side === "f" && p.push.knees;
  return [
    p.train[fr ? 0 : 1],
    fr ? `Courent ${p.run} minutes sans s'arrêter, à allure tranquille.` : `Run ${p.run} minutes without stopping, at an easy pace.`,
    fr ? `Tiennent la planche ${p.plank} secondes et le gainage latéral ${p.side} secondes de chaque côté, dos droit.` : `Hold a front plank for ${p.plank} seconds and a side plank for ${p.side} seconds each side, back straight.`,
    fr
      ? `Font ${p.squat} squats au poids du corps, talons au sol et genoux dans l'axe${p.lunge ? `, et ${p.lunge} fentes avant par jambe sans perdre l'équilibre` : ""}.`
      : `Do ${p.squat} bodyweight squats, heels down and knees in line${p.lunge ? `, and ${p.lunge} forward lunges per leg without losing balance` : ""}.`,
    fr ? `Font ${n} pompes${knees ? " (sur les genoux)" : ""}, corps gainé.` : `Do ${n} push-ups${knees ? " (on the knees)" : ""}, body braced.`,
    p.land[fr ? 0 : 1],
    ...p.extra.map((e) => e[fr ? 0 : 1]),
  ];
}

const entry = (side: "f" | "m", profile: string) => ({ fr: list(P[profile], side, "fr"), en: list(P[profile], side, "en") });

export const CLUB_PREREQ: Record<string, { fr: string[]; en: string[] }> = {
  // Féminines
  "f-u15-departemental": entry("f", "u15-departemental"),
  "f-u15-regional": entry("f", "u15-regional"),
  "f-u17-departemental": entry("f", "jeunes-departemental"),
  "f-u17-regional": entry("f", "jeunes-regional"),
  "f-u17-national": entry("f", "jeunes-national"),
  "f-seniors-regional": entry("f", "seniors-regional"),
  "f-seniors-national": entry("f", "seniors-national"),
  "f-seniors-pro": entry("f", "seniors-pro"),
  // Masculins
  "m-u15-departemental": entry("m", "u15-departemental"),
  "m-u15-regional": entry("m", "u15-regional"),
  "m-u18-departemental": entry("m", "jeunes-departemental"),
  "m-u18-regional": entry("m", "jeunes-regional"),
  "m-u18-national": entry("m", "jeunes-national"),
  "m-seniors-regional": entry("m", "seniors-regional"),
  "m-seniors-national": entry("m", "seniors-national"),
  "m-seniors-pro": entry("m", "seniors-pro"),
};

export const CAT_KEYS = { f: ["u15", "u17", "seniors"], m: ["u15", "u18", "seniors"] } as const;
export const LEVEL_KEYS = ["departemental", "regional", "national", "pro"] as const;
