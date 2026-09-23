import type { Lang } from "@/lib/dict";
import type { ProgramSlug } from "@/lib/programs";

// Prices in cents. Source of truth for what Stripe charges: the prices shown in dict.ts must match.
export const prices: Record<ProgramSlug, number> = { "pre-saison": 3900, "maintien-saison": 2900 };
export const RUNNING_PRICE = 900;

export const fmtPrice = (cents: number, lang: Lang) => (lang === "fr" ? `${cents / 100} €` : `€${cents / 100}`);

export const buy = {
  fr: {
    goalLb: "Choisis 2 objectifs",
    count: (n: number) => `${n} sur 2 choisis`,
    combosLb: "Combinaisons conseillées",
    ownLb: "Ou compose ta combinaison",
    reath: "Réathlétisation / retour après blessure (objectif unique) : reprise progressive, avec le feu vert de ton médecin",
    running: "Ajouter l'option course à pied : des séances de 30 à 45 min",
    consent: "J'accepte les conditions générales de vente. Je demande l'accès immédiat au programme et je reconnais perdre mon droit de rétractation une fois le programme envoyé.",
    cgv: "Lire les CGV",
    btn: (price: string) => `Payer ${price}`,
    secure: "Paiement sécurisé par Stripe. Tu reçois ton programme par email sous 48 heures.",
    test: "Mode test : aucun paiement réel. Utilise la carte 4242 4242 4242 4242, une date future et n'importe quel code.",
    off: "Le paiement est momentanément indisponible. Réessaie plus tard ou écris-nous.",
    invalid: "Choisis exactement 2 objectifs (ou Réathlétisation seule) et accepte les CGV.",
  },
  en: {
    goalLb: "Pick 2 goals",
    count: (n: number) => `${n} of 2 picked`,
    combosLb: "Suggested combinations",
    ownLb: "Or build your own",
    reath: "Return to play after injury (single goal): gradual comeback, with your doctor's clearance",
    running: "Add the running option: 30 to 45 min sessions",
    consent: "I accept the terms of sale. I ask for immediate access to the program and acknowledge that I lose my right of withdrawal once the program has been sent.",
    cgv: "Read the terms",
    btn: (price: string) => `Pay ${price}`,
    secure: "Secure payment by Stripe. You get your program by email within 48 hours.",
    test: "Test mode: no real payment. Use card 4242 4242 4242 4242, any future date and any code.",
    off: "Payment is temporarily unavailable. Please try again later or contact us.",
    invalid: "Pick exactly 2 goals (or return-to-play alone) and accept the terms.",
  },
};

export const testMode = !process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
