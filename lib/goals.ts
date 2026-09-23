import type { Lang } from "@/lib/dict";

// Every goal a buyer can pick. The buyer picks exactly 2, or Réathlétisation alone:
// it is the single goal for anything injury-related (return after injury, reathletisation).
export const goalNames = {
  force: { fr: "Force", en: "Strength" },
  masse: { fr: "Prise de masse", en: "Mass gain" },
  gainage: { fr: "Gainage / stabilité", en: "Core / stability" },
  explosivite: { fr: "Explosivité", en: "Explosiveness" },
  puissance: { fr: "Puissance", en: "Power" },
  vitesse: { fr: "Vitesse", en: "Speed" },
  acceleration: { fr: "Accélération", en: "Acceleration" },
  agilite: { fr: "Changements de direction / agilité", en: "Change of direction / agility" },
  endurance: { fr: "Endurance", en: "Endurance" },
  repetition: { fr: "Capacité à répéter les efforts", en: "Repeated effort capacity" },
  "perte-masse": { fr: "Perte de masse", en: "Fat loss" },
  condition: { fr: "Condition physique générale", en: "General fitness" },
  prevention: { fr: "Prévention des blessures", en: "Injury prevention" },
  renforcement: { fr: "Renforcement spécifique (genoux, chevilles, épaules, ischios…)", en: "Targeted strengthening (knees, ankles, shoulders, hamstrings…)" },
  mobilite: { fr: "Mobilité / souplesse", en: "Mobility / flexibility" },
  articulaire: { fr: "Stabilité articulaire", en: "Joint stability" },
  maintien: { fr: "Maintien des qualités physiques", en: "Maintaining physical qualities" },
  recuperation: { fr: "Récupération", en: "Recovery" },
  reathletisation: { fr: "Réathlétisation / retour après blessure", en: "Return to play after injury" },
} as const;

export type GoalId = keyof typeof goalNames;
export const REATH: GoalId = "reathletisation";
export const goalIds = Object.keys(goalNames) as GoalId[];

export const goalCats: { icon: string; fr: string; en: string; goals: GoalId[] }[] = [
  { icon: "🏋️", fr: "Développement musculaire", en: "Muscle development", goals: ["force", "masse", "gainage"] },
  { icon: "⚡", fr: "Puissance & explosivité", en: "Power & explosiveness", goals: ["explosivite", "puissance", "vitesse", "acceleration", "agilite"] },
  { icon: "🫀", fr: "Condition physique", en: "Fitness", goals: ["endurance", "repetition", "perte-masse", "condition"] },
  { icon: "🛡️", fr: "Prévention & santé", en: "Prevention & health", goals: ["prevention", "renforcement", "mobilite", "articulaire"] },
  { icon: "🔄", fr: "Entretien & retour au sport", en: "Maintenance & return to sport", goals: ["maintien", "recuperation"] },
];

type Combo = { goals: GoalId[]; fr: { obj: string; profile: string }; en: { obj: string; profile: string } };

// Suggested pairs, plus Réathlétisation on its own (last).
export const combos: Combo[] = [
  { goals: ["force", "explosivite"],
    fr: { obj: "Développer la force et la capacité à produire des actions explosives.", profile: "Joueur recherchant la performance." },
    en: { obj: "Build strength and the ability to produce explosive actions.", profile: "Players chasing performance." } },
  { goals: ["explosivite", "vitesse"],
    fr: { obj: "Améliorer les accélérations, démarrages et déplacements rapides.", profile: "Joueur souhaitant gagner en rapidité et vivacité." },
    en: { obj: "Improve acceleration, first steps and quick movement.", profile: "Players who want to get faster and sharper." } },
  { goals: ["force", "masse"],
    fr: { obj: "Développer la force tout en favorisant le développement musculaire.", profile: "Joueur souhaitant se renforcer et prendre de la masse musculaire." },
    en: { obj: "Build strength while promoting muscle growth.", profile: "Players who want to get stronger and build muscle." } },
  { goals: ["endurance", "perte-masse"],
    fr: { obj: "Améliorer la condition physique générale tout en accompagnant une perte de masse.", profile: "Joueur souhaitant améliorer son cardio et sa condition physique." },
    en: { obj: "Improve overall fitness while supporting fat loss.", profile: "Players who want better cardio and fitness." } },
  { goals: ["prevention", "maintien"],
    fr: { obj: "Entretenir les qualités physiques et réduire les risques de blessure pendant la saison.", profile: "Joueur déjà en saison souhaitant maintenir son niveau physique." },
    en: { obj: "Maintain physical qualities and reduce injury risk during the season.", profile: "Players already in season who want to hold their level." } },
  { goals: [REATH],
    fr: { obj: "Un programme adapté à une reprise progressive après blessure, une fois le feu vert médical obtenu.", profile: "Joueur qui revient de blessure." },
    en: { obj: "A program built for a gradual comeback after injury, once you have medical clearance.", profile: "Players coming back from injury." } },
];

export const comboTitle = (goals: readonly GoalId[], lang: Lang) => goals.map((g) => goalNames[g][lang]).join(" + ");

// Exactly 2 distinct goals (not Réathlétisation), or Réathlétisation alone.
export const validGoals = (g: string[]): g is GoalId[] =>
  g.length === 1 ? g[0] === REATH
    : g.length === 2 && g[0] !== g[1] && g.every((x) => x in goalNames && x !== REATH);
