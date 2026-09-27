import type { Lang } from "@/lib/dict";

// Emails at the key moments of the handball season, to the free-session subscribers who accepted
// them (lead metadata saison=1). Each one goes out once a year (metadata c_<id>=<year>), during
// the 7 days after its date, to people subscribed before that date and after their 3 tips.
export type Campaign = { id: string; month: number; day: number; path: string; fr: { s: string; p: string[]; c: string }; en: { s: string; p: string[]; c: string } };

export const CAMPAIGNS: Campaign[] = [
  {
    id: "reprise", month: 6, day: 20, path: "/programmes/pre-saison",
    fr: { s: "Ta reprise se prépare maintenant", c: "Voir la Pré-saison", p: [
      "Salut,",
      "La reprise avec ton club, c'est dans environ 2 mois. C'est maintenant que se joue ta saison : 8 semaines de préparation en juillet et en août, et tu arrives au premier entraînement déjà prêt, au lieu de courir après ta forme jusqu'en octobre.",
      "Si ton club fait une prépa physique à la reprise, fais les 4 premières semaines seul(e) en juillet, puis les 4 dernières en parallèle. Sinon, commence début juillet pour finir début septembre.",
      "La <strong>Pré-saison 6M Lab</strong> t'écrit chaque séance en entier, avec l'animation de chaque exercice, à la maison ou en salle.",
      "Raphaël, 6M Lab",
    ] },
    en: { s: "Your restart starts now", c: "See the Pre-season", p: [
      "Hi,",
      "Your club's restart is about 2 months away. This is when your season is decided: 8 weeks of preparation in July and August, and you arrive at the first training session ready, instead of chasing your fitness until October.",
      "If your club runs a physical prep at the restart, do the first 4 weeks on your own in July, then the last 4 alongside it. Otherwise, start in early July to finish in early September.",
      "The <strong>6M Lab Pre-season</strong> writes out every session in full, with the animation of every exercise, at home or at the gym.",
      "Raphaël, 6M Lab",
    ] },
  },
  {
    id: "saison", month: 9, day: 5, path: "/programmes/maintien-saison",
    fr: { s: "Ne perds pas ta prépa en 6 semaines", c: "Voir le Maintien en saison", p: [
      "Salut,",
      "La saison démarre. Sans entretien, ce que tu as construit cet été (force, explosivité) commence à baisser en quelques semaines, et c'est souvent là que les blessures arrivent.",
      "La bonne dose en saison : <strong>2 séances courtes par semaine</strong>, la plus dure au moins 3 jours avant le match, la plus légère au plus tard 2 jours avant.",
      "C'est exactement le <strong>Maintien en saison</strong> : 12 semaines, 30 à 40 minutes par séance, placées pour arriver frais le jour du match.",
      "Raphaël, 6M Lab",
    ] },
    en: { s: "Don't lose your summer work in 6 weeks", c: "See the In-season program", p: [
      "Hi,",
      "The season is starting. Without maintenance, what you built this summer (strength, explosiveness) starts to fade within a few weeks, and that is often when injuries happen.",
      "The right dose in season: <strong>2 short sessions a week</strong>, the hardest at least 3 days before the game, the lighter one no later than 2 days before.",
      "That is exactly the <strong>In-season maintenance</strong>: 12 weeks, 30 to 40 minutes per session, placed so you arrive fresh on game day.",
      "Raphaël, 6M Lab",
    ] },
  },
  {
    id: "treve", month: 12, day: 15, path: "/programmes/maintien-saison",
    fr: { s: "La trêve : repos, mais pas trop", c: "Voir le Maintien en saison", p: [
      "Salut,",
      "La trêve arrive. Une semaine de vrai repos fait du bien. Au-delà, 2 à 3 semaines sans rien, et la reprise de janvier fait mal : jambes lourdes, souffle court, et plus de risques de blessure.",
      "Le bon compromis : <strong>2 séances courtes par semaine</strong> pendant la trêve, sans matériel, pour garder ta force et tes appuis.",
      "Le <strong>Maintien en saison</strong> se fait à la maison et s'adapte à ton calendrier : c'est le moment idéal pour le commencer et finir la saison fort.",
      "Raphaël, 6M Lab",
    ] },
    en: { s: "Winter break: rest, but not too much", c: "See the In-season program", p: [
      "Hi,",
      "The winter break is coming. A week of real rest does you good. Beyond that, 2 to 3 weeks of nothing and the January restart hurts: heavy legs, short breath, and a higher risk of injury.",
      "The right balance: <strong>2 short sessions a week</strong> during the break, no equipment, to keep your strength and footwork.",
      "The <strong>In-season maintenance</strong> is done at home and fits your calendar: the perfect time to start it and finish the season strong.",
      "Raphaël, 6M Lab",
    ] },
  },
];

// The campaign due today (Paris date), if any: from its date to 6 days after.
export function dueCampaign(now = new Date()): { c: Campaign; year: number; start: number } | null {
  const [y, m, d] = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit" }).format(now).split("-").map(Number);
  const today = Date.UTC(y, m - 1, d);
  for (const c of CAMPAIGNS) {
    const start = Date.UTC(y, c.month - 1, c.day);
    if (today >= start && today < start + 7 * 86400000) return { c, year: y, start: start / 1000 };
  }
  return null;
}

export const campaignText = (c: Campaign, lang: Lang) => c[lang];
