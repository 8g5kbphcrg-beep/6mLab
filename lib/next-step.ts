import type { Lang } from "@/lib/dict";
import type { GoalId } from "@/lib/goals";
import type { Offer } from "@/lib/access";
import type { Part } from "@/lib/season-parts";
import { SITE } from "@/lib/dict";

// What to do after a program: the next part of the season (lib/season-parts.ts), same goals.
// - after the Pré-saison: the 1re partie, as the games start;
// - after the 1re partie: the 2e partie, from January to the June finals;
// - after the 2e partie (or a whole Saison complète): two weeks of break, then the next season,
//   ideally as a Saison complète.
// Shown in the customer area near the end of a program, and in the end-of-program emails.
export type NextStep = { slug: Part | "saison-complete"; goals: GoalId[]; t: string; p: string; cta: string };

const DAY = 86400000;
export const programEnd = (weeks: number, start: number) => start + weeks * 7 * DAY;

export function nextStep(offer: Offer, _end: number, goals: GoalId[], lang: Lang): NextStep {
  const fr = lang === "fr";
  const same = goals.filter((g) => g !== "reathletisation").slice(0, 2);
  if (offer === "pre-saison") return {
    slug: "premiere-partie", goals: same,
    t: fr ? "La saison commence : garde ce que tu as construit" : "The season starts: keep what you built",
    p: fr ? "Sans entretien, la force et l'explosivité de l'été baissent en quelques semaines. La 1re partie de saison prend le relais jusqu'aux vacances de Noël : 2 séances courtes par semaine, placées loin des matchs, avec les mêmes objectifs." : "Without maintenance, the strength and explosiveness of the summer fade within a few weeks. The first half of the season takes over until the Christmas holidays: 2 short sessions a week, placed away from games, with the same goals.",
    cta: fr ? "Voir la 1re partie de saison" : "See the first half of the season",
  };
  if (offer === "premiere-partie") return {
    slug: "deuxieme-partie", goals: same,
    t: fr ? "Après la trêve : la 2e partie de saison" : "After the break: the second half of the season",
    p: fr ? "La reprise de janvier est le moment où l'on se blesse le plus. La 2e partie de saison te fait repartir progressivement, puis te garde frais jusqu'aux matchs décisifs et aux phases finales de juin." : "The January restart is when most injuries happen. The second half of the season gets you going again gradually, then keeps you fresh until the decisive games and the June finals.",
    cta: fr ? "Voir la 2e partie de saison" : "See the second half of the season",
  };
  return {
    slug: "saison-complete", goals: same,
    t: fr ? "Fin de saison : souffle, puis prépare la suivante" : "End of season: rest, then prepare the next one",
    p: fr ? "Deux semaines de vraie coupure fin juin, puis la Pré-saison en juillet. La Saison complète enchaîne les 3 parties de la saison prochaine avec les mêmes objectifs, 20 % moins cher." : "Two weeks of real break in late June, then the Pre-season in July. The Full season links the 3 parts of next season with the same goals, 20% cheaper.",
    cta: fr ? "Préparer ma prochaine saison" : "Prepare my next season",
  };
}

export const nextHref = (n: NextStep, lang: Lang, abs = false) => `${abs ? SITE : ""}/${lang}/programmes/${n.slug}${n.goals.length ? `?objectifs=${n.goals.join(",")}` : ""}#acheter`;
