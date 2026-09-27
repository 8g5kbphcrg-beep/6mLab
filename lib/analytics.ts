// Audience and purchase funnel, measured without cookies or identifiers: each browser tab session
// sends at most one count per event (sessionStorage), tagged with where the visit came from (utm
// link or referring site). Only daily totals are stored, in Redis (Upstash, connected from the
// Vercel dashboard). Payments started and paid are read from Stripe, not from here.

export const EVENTS = ["visite", "offres", "page", "quiz_debut", "quiz_fin", "paiement_clic", "lead"] as const;
export type Evt = (typeof EVENTS)[number];

// Page kinds counted by the "page" event, from the path without the language.
export function pageKind(path: string): string | null {
  const p = path.replace(/^\/(fr|en)(?=\/|$)/, "") || "/";
  if (p === "/") return "accueil";
  const [a, b] = p.split("/").filter(Boolean);
  if (a === "handball") return "handball";
  if (a === "programmes") return b ? `offre-${b}` : "programmes";
  if (a === "questionnaire") return "questionnaire";
  if (a === "forme") return "forme";
  if (a === "exercices") return "exercice";
  if (a === "conseils") return b ? "article" : "conseils";
  if (a === "seance-gratuite") return "seance-gratuite";
  if (a === "merci") return "merci";
  if (a === "a-propos" || a === "about") return "a-propos";
  if (a === "contact") return "contact";
  return null;
}
// Pages where the offers are shown: the "offres" step of the funnel.
export const OFFER_PAGES = ["handball", "programmes", "offre-pre-saison", "offre-maintien-saison", "offre-saison-complete"];

// Source names: letters, digits, dash, underscore, dot; 30 characters at most.
export const cleanSrc = (s: string) => s.toLowerCase().replace(/[^a-z0-9_.-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30) || "direct";

// Day in Paris time, YYYY-MM-DD.
export const parisDay = (d = new Date()) => new Intl.DateTimeFormat("fr-CA", { timeZone: "Europe/Paris" }).format(d);
