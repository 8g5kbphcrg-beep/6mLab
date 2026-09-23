import type { ProgramSlug } from "@/lib/programs";

// Prices in cents. Source of truth for what Stripe charges: the prices shown in dict.ts must match.
export const prices: Record<ProgramSlug, number> = { "pre-saison": 3900, "maintien-saison": 2900 };

// Same order as dict.goals.
export const goalIds = ["force", "explosivite", "masse", "perte-poids"] as const;
export type GoalId = (typeof goalIds)[number];

export const buy = {
  fr: {
    goalLb: "Ton objectif",
    consent: "J'accepte les conditions générales de vente. Je demande l'accès immédiat au programme et je reconnais perdre mon droit de rétractation une fois le programme envoyé.",
    cgv: "Lire les CGV",
    btn: (price: string) => `Payer ${price}`,
    secure: "Paiement sécurisé par Stripe. Tu reçois ton programme par email sous 48 heures.",
    test: "Mode test : aucun paiement réel. Utilise la carte 4242 4242 4242 4242, une date future et n'importe quel code.",
    off: "Le paiement est momentanément indisponible. Réessaie plus tard ou écris-nous.",
  },
  en: {
    goalLb: "Your goal",
    consent: "I accept the terms of sale. I ask for immediate access to the program and acknowledge that I lose my right of withdrawal once the program has been sent.",
    cgv: "Read the terms",
    btn: (price: string) => `Pay ${price}`,
    secure: "Secure payment by Stripe. You get your program by email within 48 hours.",
    test: "Test mode: no real payment. Use card 4242 4242 4242 4242, any future date and any code.",
    off: "Payment is temporarily unavailable. Please try again later or contact us.",
  },
};

export const testMode = !process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
