import type { Lang } from "@/lib/dict";

// The 5 goals a buyer picks from (exactly 2), or Réathlétisation on its own for anything
// injury-related. "details" only describe what each goal works on; they are not choices.
export const goals = {
  muscle: {
    fr: { name: "Développement musculaire", details: ["Force", "Prise de masse", "Gainage / stabilité"] },
    en: { name: "Muscle development", details: ["Strength", "Mass gain", "Core / stability"] },
  },
  explosivite: {
    fr: { name: "Explosivité", details: ["Vitesse", "Accélération", "Changements de direction / agilité"] },
    en: { name: "Explosiveness", details: ["Speed", "Acceleration", "Change of direction / agility"] },
  },
  puissance: {
    fr: { name: "Puissance", details: ["Pousser lourd", "Force maximale en un temps très court", "Tirs, sauts et duels plus puissants"] },
    en: { name: "Power", details: ["Pushing heavy loads", "Maximum force in a very short time", "More powerful shots, jumps and duels"] },
  },
  condition: {
    fr: { name: "Condition physique", details: ["Endurance", "Capacité à répéter les efforts", "Perte de masse", "Condition physique générale"] },
    en: { name: "Fitness", details: ["Endurance", "Repeated effort capacity", "Fat loss", "General fitness"] },
  },
  prevention: {
    fr: { name: "Prévention & santé", details: ["Prévention des blessures", "Renforcement genoux, chevilles, épaules, ischios", "Mobilité / souplesse", "Stabilité articulaire"] },
    en: { name: "Prevention & health", details: ["Injury prevention", "Knees, ankles, shoulders, hamstrings", "Mobility / flexibility", "Joint stability"] },
  },
  reathletisation: {
    fr: { name: "Réathlétisation / retour après blessure", details: ["Reprise progressive, avec le feu vert de ton médecin"] },
    en: { name: "Return to play after injury", details: ["Gradual comeback, with your doctor's clearance"] },
  },
} as const;

export type GoalId = keyof typeof goals;
export const REATH: GoalId = "reathletisation";
export const goalIds = (Object.keys(goals) as GoalId[]).filter((g) => g !== REATH);

export const goalName = (g: GoalId, lang: Lang) => goals[g][lang].name;
export const goalsTitle = (sel: readonly GoalId[], lang: Lang) => sel.map((g) => goalName(g, lang)).join(" + ");

// Exactly 2 distinct goals (not Réathlétisation), or Réathlétisation alone.
export const validGoals = (g: string[]): g is GoalId[] =>
  g.length === 1 ? g[0] === REATH
    : g.length === 2 && g[0] !== g[1] && g.every((x) => x in goals && x !== REATH);
