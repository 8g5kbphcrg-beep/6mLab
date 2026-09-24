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

// Order of the blocks in a session (explosive work first) and in the PDF file names. Must match
// "ordre" in programmes/source/objectifs.mjs.
export const goalOrder: GoalId[] = ["explosivite", "puissance", "muscle", "condition", "prevention", "reathletisation"];

// Old orders may carry goal ids that no longer exist: their raw id is shown instead.
export const goalName = (g: GoalId, lang: Lang) => goals[g]?.[lang].name ?? g;
export const goalsTitle = (sel: readonly GoalId[], lang: Lang) => sel.map((g) => goalName(g, lang)).join(" + ");

// 1 goal, or 2 distinct goals (the second one is paid extra), or Réathlétisation alone.
export const validGoals = (g: string[]): g is GoalId[] =>
  g.length === 1 ? g[0] in goals
    : g.length === 2 && g[0] !== g[1] && g.every((x) => x in goals && x !== REATH);
// Whether the order pays for a second goal.
export const hasSecondGoal = (g: readonly string[]) => g.length === 2;

// Suggested pairs of goals: what the pair builds, and who it suits.
export const suggestions: { goals: [GoalId, GoalId]; fr: { gain: string; who: string }; en: { gain: string; who: string } }[] = [
  { goals: ["explosivite", "puissance"],
    fr: { gain: "Produire beaucoup de force en très peu de temps : démarrages, sauts et tirs plus puissants.", who: "Pour qui cherche la performance, surtout arrières et ailiers." },
    en: { gain: "Produce a lot of force very fast: stronger first steps, jumps and shots.", who: "For players chasing performance, especially backs and wings." } },
  { goals: ["explosivite", "condition"],
    fr: { gain: "Répéter les sprints et les changements de direction jusqu'à la dernière minute du match.", who: "Pour les ailiers, demi-centres et joueurs de contre-attaque." },
    en: { gain: "Repeat sprints and changes of direction until the last minute of the game.", who: "For wings, centre backs and fast-break players." } },
  { goals: ["puissance", "muscle"],
    fr: { gain: "Prendre du muscle et le rendre efficace dans les duels, les contacts et les tirs.", who: "Pour les pivots, les arrières et qui veut s'étoffer." },
    en: { gain: "Build muscle and make it count in duels, contacts and shots.", who: "For pivots, backs and players who want to bulk up." } },
  { goals: ["explosivite", "prevention"],
    fr: { gain: "Gagner en vivacité tout en protégeant genoux et chevilles.", who: "Pour les jeunes et celles et ceux qui se blessent souvent." },
    en: { gain: "Get sharper while protecting knees and ankles.", who: "For young players and those who often get injured." } },
  { goals: ["muscle", "prevention"],
    fr: { gain: "Se renforcer en douceur et solidifier épaules, genoux et chevilles.", who: "Pour qui débute en préparation physique." },
    en: { gain: "Get stronger gradually and protect shoulders, knees and ankles.", who: "For beginners in physical training." } },
  { goals: ["condition", "prevention"],
    fr: { gain: "Retrouver du cardio et reprendre sans se blesser, avec une perte de masse possible.", who: "Pour une reprise après une longue pause." },
    en: { gain: "Rebuild your fitness and return safely, with possible fat loss.", who: "For a comeback after a long break." } },
];
