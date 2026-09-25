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

// Silhouette drawing (front view, viewBox 0 0 100 200): torso, arms and legs from a few widths.
type Body = { s: number; w: number; h: number; t: number; a: number; b?: number };
const F: Body[] = [{ s: 14, w: 9.5, h: 16, t: 7.5, a: 3 }, { s: 15, w: 12, h: 18.5, t: 9, a: 3.6 }, { s: 16.5, w: 15.5, h: 21.5, t: 10.5, a: 4.4, b: 2 }, { s: 18, w: 19, h: 24.5, t: 12.5, a: 5.3, b: 4 }, { s: 19.5, w: 23, h: 27.5, t: 14.5, a: 6.3, b: 6 }];
const M: Body[] = [{ s: 16.5, w: 10.5, h: 13.5, t: 7.5, a: 3.4 }, { s: 18, w: 13.5, h: 15.5, t: 9, a: 4 }, { s: 19, w: 17.5, h: 18, t: 10.5, a: 4.8, b: 3 }, { s: 20.5, w: 21.5, h: 20.5, t: 12, a: 5.6, b: 5 }, { s: 22, w: 25.5, h: 23.5, t: 13.5, a: 6.6, b: 7 }];
const FT: Body[] = [{ s: 14, w: 9.5, h: 16, t: 7.5, a: 3 }, { s: 15, w: 10.5, h: 17, t: 8.5, a: 3.6 }, { s: 16.5, w: 11, h: 17.5, t: 9.5, a: 4.2 }, { s: 18, w: 11.5, h: 18.5, t: 10.5, a: 5 }, { s: 19.5, w: 12, h: 19, t: 12, a: 6 }];
const MT: Body[] = [{ s: 16.5, w: 10.5, h: 13.5, t: 7.5, a: 3.4 }, { s: 18.5, w: 11.5, h: 14, t: 8.8, a: 4.3 }, { s: 20.5, w: 12, h: 14.5, t: 10, a: 5.2 }, { s: 22.5, w: 12.5, h: 15, t: 11.5, a: 6.3 }, { s: 24.5, w: 13, h: 15.5, t: 13, a: 7.5 }];
const mix = (a: Body, b: Body): Body => ({ s: (a.s + b.s) / 2, w: (a.w + b.w) / 2, h: (a.h + b.h) / 2, t: (a.t + b.t) / 2, a: (a.a + b.a) / 2, b: ((a.b ?? 0) + (b.b ?? 0)) / 2 });
export const bodyFor = (sex: Sex, kind: "cur" | "target", i: number): Body => {
  const [f, m] = kind === "cur" ? [F, M] : [FT, MT];
  return sex === "f" ? f[i] : sex === "h" ? m[i] : mix(f[i], m[i]);
};

const n = (x: number) => Math.round(x * 10) / 10;
export function silhouettePaths(b: Body) {
  const c = 50, bl = b.b ?? 0;
  const R = (x: number) => n(c + x), Lf = (x: number) => n(c - x);
  // Torso: neck, shoulders, armpits, waist (with belly), hips, crotch.
  const torso = `M${Lf(4)} 34 L${R(4)} 34 Q${R(6)} 40 ${R(b.s)} 43 Q${R(b.s + 1)} 50 ${R(b.s - 1.5)} 58 Q${R(b.w + bl)} ${80} ${R(b.w)} 94 Q${R(b.h + 1)} 104 ${R(b.h)} 114 L${Lf(b.h)} 114 Q${Lf(b.h + 1)} 104 ${Lf(b.w)} 94 Q${Lf(b.w + bl)} 80 ${Lf(b.s - 1.5)} 58 Q${Lf(b.s + 1)} 50 ${Lf(b.s)} 43 Q${Lf(6)} 40 ${Lf(4)} 34 Z`;
  // Legs from the hips: outer thigh, knee, calf, ankle, then back up the inside.
  const leg = (sgn: 1 | -1) => {
    const X = (x: number) => n(c + sgn * x);
    const g = Math.max(0.6, 2.2 - bl * 0.25);
    return `M${X(b.h)} 110 Q${X(b.h + 0.4)} 128 ${X(g + b.t * 0.95)} 150 Q${X(g + b.t * 0.9)} 168 ${X(g + 4.2)} 190 L${X(g + 0.7)} 190 Q${X(g + 0.2)} 170 ${X(g + 0.8)} 150 Q${X(g)} 132 ${X(g)} 118 L${X(0)} 114 Z`;
  };
  // Arms: from the shoulder down to a hand that clears the waist and the hips.
  const arm = (sgn: 1 | -1) => {
    const X = (x: number) => n(c + sgn * x);
    const hx = Math.max(b.s + 1.5, b.h + b.a / 2 + 2, b.w + bl + b.a / 2 + 2.5);
    return `M${X(b.s - b.a * 0.5)} 42 Q${X(b.s + b.a * 0.6)} 42 ${X(b.s + b.a * 0.55)} 52 Q${X(hx + b.a / 2 + 0.6)} 80 ${X(hx + b.a / 2)} 108 Q${X(hx)} 115 ${X(hx - b.a / 2)} 108 Q${X(hx - b.a / 2 - 0.4)} 82 ${X(b.s - b.a * 0.7)} 60 Z`;
  };
  return { torso, legs: [leg(1), leg(-1)], arms: [arm(1), arm(-1)] };
}
