import type { Lang } from "@/lib/dict";
import type { ProgramSlug } from "@/lib/programs";

// Prices in cents. Source of truth for what Stripe charges: the prices shown in dict.ts must match.
export const prices: Record<ProgramSlug, number> = { "pre-saison": 3900, "maintien-saison": 2900 };
export const RUNNING_PRICE = 900;

export const fmtPrice = (cents: number, lang: Lang) => (lang === "fr" ? `${cents / 100} €` : `€${cents / 100}`);

export const buy = {
  fr: {
    step1: "Tes objectifs", step2: "Option", step3: "Récapitulatif",
    count: (n: number) => `${n}/2`,
    hint: "Choisis une combinaison conseillée, ou compose la tienne avec 2 objectifs.",
    own: "Composer ma combinaison",
    reathQ: "Tu reviens de blessure ?",
    reathD: "Objectif unique, à suivre avec le feu vert de ton médecin.",
    runT: "Programme course à pied", runD: "Des séances de 30 à 45 min, en plus de ton programme.",
    goalsLb: "Objectifs", none: "À choisir", total: "Total",
    consent: "J'accepte les conditions générales de vente. Je demande l'accès immédiat au programme et je reconnais perdre mon droit de rétractation une fois le programme envoyé.",
    cgv: "Lire les CGV",
    btn: (price: string) => `Payer ${price}`,
    secure: "Paiement sécurisé par Stripe. Programme envoyé par email sous 48 heures.",
    test: "Mode test : aucun paiement réel. Carte 4242 4242 4242 4242, date future, code au choix.",
    off: "Le paiement est momentanément indisponible. Réessaie plus tard ou écris-nous.",
    invalid: "Choisis 2 objectifs (ou la réathlétisation seule) et accepte les CGV.",
  },
  en: {
    step1: "Your goals", step2: "Option", step3: "Summary",
    count: (n: number) => `${n}/2`,
    hint: "Pick a suggested combination, or build your own with 2 goals.",
    own: "Build my own combination",
    reathQ: "Coming back from injury?",
    reathD: "A single goal, to follow with your doctor's clearance.",
    runT: "Running program", runD: "30 to 45 min sessions, on top of your program.",
    goalsLb: "Goals", none: "To choose", total: "Total",
    consent: "I accept the terms of sale. I ask for immediate access to the program and acknowledge that I lose my right of withdrawal once the program has been sent.",
    cgv: "Read the terms",
    btn: (price: string) => `Pay ${price}`,
    secure: "Secure payment by Stripe. Program sent by email within 48 hours.",
    test: "Test mode: no real payment. Card 4242 4242 4242 4242, any future date, any code.",
    off: "Payment is temporarily unavailable. Please try again later or contact us.",
    invalid: "Pick 2 goals (or return to play alone) and accept the terms.",
  },
};

export const testMode = !process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
