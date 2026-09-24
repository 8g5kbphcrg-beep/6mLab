import type { Lang } from "@/lib/dict";
import type { ProgramSlug } from "@/lib/programs";

// Prices in cents. Source of truth for what Stripe charges: the prices shown in dict.ts must match.
export const prices: Record<ProgramSlug, number> = { "pre-saison": 3999, "maintien-saison": 2999 };
export const RUNNING_PRICE = 900;
export const SECOND_GOAL_PRICE = 500;
export const orderTotal = (slug: ProgramSlug, goals: readonly string[], running: boolean) =>
  prices[slug] + (goals.length === 2 ? SECOND_GOAL_PRICE : 0) + (running ? RUNNING_PRICE : 0);

export const genders = ["femme", "homme", "non-precise"] as const;
export type Gender = (typeof genders)[number];

// 39,99 € / €39.99 (no decimals for whole euros: 9 €).
export const fmtPrice = (cents: number, lang: Lang) => {
  const n = cents % 100 ? (cents / 100).toFixed(2) : String(cents / 100);
  return lang === "fr" ? `${n.replace(".", ",")} €` : `€${n}`;
};

export const buy = {
  fr: {
    step1: "Tes objectifs", step2: "Option", step3: "Ton profil", step4: "Récapitulatif",
    profileHint: "Pour adapter ton programme et te l'envoyer à ton nom.",
    firstName: "Prénom", age: "Âge", gender: "Genre",
    genders: { femme: "Femme", homme: "Homme", "non-precise": "Je préfère ne pas le dire" },
    minor: "Moins de 18 ans ? La commande doit être passée avec l'accord d'un parent.",
    count: (n: number) => `${n}/2`,
    hint: "1 objectif inclus. Tu peux en ajouter un 2e pour +5 €.",
    second: "2e objectif",
    reathQ: "Tu reviens de blessure ?",
    reathD: "Objectif unique, à suivre avec le feu vert de ton médecin.",
    runT: "Programme course à pied", runD: "Des séances de 30 à 45 min, en plus de ton programme.",
    goalsLb: "Objectifs", none: "À choisir", total: "Total",
    consent: "J'accepte les conditions générales de vente. Je demande l'accès immédiat au programme et je reconnais perdre mon droit de rétractation une fois le programme envoyé.",
    cgv: "Lire les CGV",
    btn: (price: string) => `Payer ${price}`,
    secure: "Paiement sécurisé par Stripe. Programme envoyé par email.",
    test: "Mode test : aucun paiement réel. Carte 4242 4242 4242 4242, date future, code au choix.",
    off: "Le paiement est momentanément indisponible. Réessaie plus tard ou écris-nous.",
    invalid: "Choisis au moins 1 objectif (ou la réathlétisation seule), remplis ton profil et accepte les CGV.",
  },
  en: {
    step1: "Your goals", step2: "Option", step3: "About you", step4: "Summary",
    profileHint: "So we can adapt your program and send it in your name.",
    firstName: "First name", age: "Age", gender: "Gender",
    genders: { femme: "Woman", homme: "Man", "non-precise": "I'd rather not say" },
    minor: "Under 18? The order must be placed with a parent's consent.",
    count: (n: number) => `${n}/2`,
    hint: "1 goal included. Add a 2nd one for +€5.",
    second: "2nd goal",
    reathQ: "Coming back from injury?",
    reathD: "A single goal, to follow with your doctor's clearance.",
    runT: "Running program", runD: "30 to 45 min sessions, on top of your program.",
    goalsLb: "Goals", none: "To choose", total: "Total",
    consent: "I accept the terms of sale. I ask for immediate access to the program and acknowledge that I lose my right of withdrawal once the program has been sent.",
    cgv: "Read the terms",
    btn: (price: string) => `Pay ${price}`,
    secure: "Secure payment by Stripe. Program sent by email.",
    test: "Test mode: no real payment. Card 4242 4242 4242 4242, any future date, any code.",
    off: "Payment is temporarily unavailable. Please try again later or contact us.",
    invalid: "Pick at least 1 goal (or return to play alone), fill in your details and accept the terms.",
  },
};

export const testMode = !process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
