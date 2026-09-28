import type { Lang } from "@/lib/dict";
import type { GoalId } from "@/lib/goals";
import { PROGRAM_WEEKS, type Offer } from "@/lib/access";
import { SITE } from "@/lib/dict";

// What to do after a program, from what was done and when it ends (Paris time):
// - after the Pré-saison, the season starts: Maintien en saison, same goals;
// - after a Maintien (or the pack) that ends from September to March, there are months of season
//   left: another Maintien cycle, same goals;
// - after one that ends from April to August, the season is over: Prévention & santé, then the
//   next Pré-saison (or the Full season pack for the whole next year).
// Shown in the customer area near the end of a program, and in the end-of-program emails.
export type NextStep = { slug: "pre-saison" | "maintien-saison"; goals: GoalId[]; t: string; p: string; cta: string };

const DAY = 86400000;
export const programEnd = (offer: Offer, start: number) => start + PROGRAM_WEEKS[offer] * 7 * DAY;
const monthOf = (ms: number) => Number(new Intl.DateTimeFormat("en", { month: "numeric", timeZone: "Europe/Paris" }).format(new Date(ms)));

export function nextStep(offer: Offer, end: number, goals: GoalId[], lang: Lang): NextStep {
  const fr = lang === "fr", m = monthOf(end);
  const same = goals.filter((g) => g !== "reathletisation").slice(0, 2);
  if (offer === "pre-saison") return {
    slug: "maintien-saison", goals: same,
    t: fr ? "La saison commence : garde ton niveau" : "The season starts: keep your level",
    p: fr ? "Le Maintien en saison prend le relais de ta pré-saison : 2 séances courtes par semaine, placées loin des matchs, avec les mêmes objectifs. Tu gardes ce que tu as construit cet été jusqu'aux derniers matchs." : "The In-season maintenance takes over from your pre-season: 2 short sessions a week, placed away from games, with the same goals. You keep what you built this summer until the last games.",
    cta: fr ? "Voir le Maintien en saison" : "See the In-season maintenance",
  };
  if (m >= 9 || m <= 3) return {
    slug: "maintien-saison", goals: same,
    t: fr ? "La saison continue : enchaîne un nouveau cycle" : "The season goes on: start a new cycle",
    p: fr ? "Il reste plusieurs mois de matchs. Un nouveau cycle de Maintien (12 semaines) repart de ton niveau actuel pour que tu tiennes jusqu'au bout, sans baisse de forme en fin de saison." : "There are months of games left. A new Maintenance cycle (12 weeks) starts from your current level so you last until the end, without a dip at the end of the season.",
    cta: fr ? "Lancer un nouveau cycle" : "Start a new cycle",
  };
  return {
    slug: "pre-saison", goals: ["prevention"],
    t: fr ? "Fin de saison : soigne ton corps, puis prépare la reprise" : "End of season: look after your body, then prepare the restart",
    p: fr ? "Après une saison, les petites douleurs s'installent. Profite de la trêve pour travailler la prévention (chevilles, genoux, épaules), puis lance ta Pré-saison 8 semaines avant la reprise. Le Pack Saison complète couvre toute l'année prochaine." : "After a season, small pains settle in. Use the break to work on prevention (ankles, knees, shoulders), then start your Pre-season 8 weeks before the restart. The Full season pack covers the whole next year.",
    cta: fr ? "Préparer ma prochaine saison" : "Prepare my next season",
  };
}

export const nextHref = (n: NextStep, lang: Lang, abs = false) => `${abs ? SITE : ""}/${lang}/programmes/${n.slug}${n.goals.length ? `?objectifs=${n.goals.join(",")}` : ""}#acheter`;
