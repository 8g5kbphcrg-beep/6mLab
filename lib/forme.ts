import type { Lang } from "@/lib/dict";

// Fitness & well-being questionnaire (/forme/questionnaire): the choices, the silhouettes and the
// rules that adapt the program (suggested goal, age). Answers go to the waiting list until the
// program launches.

export type Sex = "f" | "h" | "n";
export const goalIds = ["perte", "muscle", "remise", "tonifier", "dos", "equilibre"] as const;
export type FitGoal = (typeof goalIds)[number];

type L = Record<Lang, string>;
export const goals: Record<FitGoal, { name: L; desc: L }> = {
  perte: { name: { fr: "Perdre du poids", en: "Lose weight" }, desc: { fr: "Brûler plus, circuits et cardio, tout en gardant ton muscle.", en: "Burn more with circuits and cardio, while keeping your muscle." } },
  muscle: { name: { fr: "Prendre du muscle", en: "Build muscle" }, desc: { fr: "Construire du muscle avec des charges qui progressent.", en: "Build muscle with progressive loads." } },
  remise: { name: { fr: "Me remettre en forme", en: "Get back in shape" }, desc: { fr: "Retrouver de l'énergie, du souffle et de la mobilité.", en: "Regain energy, stamina and mobility." } },
  tonifier: { name: { fr: "Tonifier et raffermir", en: "Tone up" }, desc: { fr: "Une silhouette plus ferme : fessiers, abdos, bras.", en: "A firmer figure: glutes, abs, arms." } },
  dos: { name: { fr: "Soulager mon dos et ma posture", en: "Ease my back, improve posture" }, desc: { fr: "Gainage, mobilité et renforcement doux, pour moins de douleurs au quotidien.", en: "Core, mobility and gentle strength work, for less everyday pain." } },
  equilibre: { name: { fr: "Équilibre & autonomie", en: "Balance & independence" }, desc: { fr: "Équilibre, force des jambes et gestes du quotidien : se relever, porter, monter les escaliers.", en: "Balance, leg strength and everyday movements: getting up, carrying, climbing stairs." } },
};

export const zones: Record<string, L> = {
  bas: { fr: "Bas du corps", en: "Lower body" }, haut: { fr: "Haut du corps", en: "Upper body" },
  abdos: { fr: "Abdos & gainage", en: "Abs & core" }, tout: { fr: "Corps entier", en: "Whole body" },
};
export const levels: Record<string, { icon: string; name: L; desc: L }> = {
  debut: { icon: "🌱", name: { fr: "Je (re)démarre", en: "I'm (re)starting" }, desc: { fr: "Peu ou pas de sport ces derniers mois.", en: "Little or no exercise in recent months." } },
  regulier: { icon: "🔥", name: { fr: "Je m'entraîne déjà", en: "I already train" }, desc: { fr: "1 à 2 fois par semaine depuis quelques mois.", en: "1 to 2 times a week for a few months." } },
  confirme: { icon: "⚡", name: { fr: "Je suis confirmé(e)", en: "I'm experienced" }, desc: { fr: "Entraînement régulier depuis plus d'un an.", en: "Regular training for over a year." } },
};
export const pains: Record<string, L> = {
  dos: { fr: "Dos", en: "Back" }, genoux: { fr: "Genoux", en: "Knees" }, epaules: { fr: "Épaules", en: "Shoulders" }, hanches: { fr: "Hanches", en: "Hips" },
};

// Silhouettes: 5 current body types, 5 targets (+ "just feel better").
export const current: L[] = [
  { fr: "Fine", en: "Slim" }, { fr: "Moyenne", en: "Average" }, { fr: "Enveloppée", en: "Curvy" }, { fr: "Ronde", en: "Round" }, { fr: "Forte", en: "Large" },
];
export const targets: L[] = [
  { fr: "Svelte", en: "Slender" }, { fr: "Tonique", en: "Toned" }, { fr: "Athlétique", en: "Athletic" }, { fr: "Musclée", en: "Muscular" }, { fr: "Très musclée", en: "Very muscular" },
];
export const FEEL_BETTER = 5;

// The goal suggested from the two silhouettes (the person can pick another one).
export function suggestGoal(cur: number, target: number, age: number): FitGoal {
  if (target === FEEL_BETTER) return age >= 65 ? "equilibre" : "remise";
  if (cur >= 2) return "perte";
  if (target >= 3) return "muscle";
  return "tonifier";
}

// Weight loss is not offered to minors, and is discouraged when the silhouette is already slim.
export const goalBlocked = (g: FitGoal, age: number) => g === "perte" && age > 0 && age < 18;
export const goalCaution = (g: FitGoal, cur: number) => g === "perte" && cur === 0;

// What the program changes automatically with age.
export const ageAdaptations = (age: number, lang: Lang): string[] => {
  const fr = lang === "fr";
  const out: string[] = [];
  if (age >= 50) out.push(fr ? "Moins d'impacts, plus de mobilité pour tes articulations" : "Fewer impacts, more mobility for your joints");
  if (age >= 60) out.push(fr ? "Un bloc équilibre dans chaque séance, avec une progression chaque semaine" : "A balance block in every session, progressing every week");
  if (age >= 70) out.push(fr ? "Demande l'avis de ton médecin avant de commencer" : "Ask your doctor before starting");
  if (age > 0 && age < 18) out.push(fr ? "Programme adapté aux moins de 18 ans, avec l'accord d'un parent" : "Program adapted to under-18s, with a parent's consent");
  return out;
};
