import type { Lang } from "@/lib/dict";
import type { ProgramSlug } from "@/lib/programs";
import { PACK_FULL, PACK_INSTALMENT, PACK_PRICE, PACK_WEEKS, PRICES } from "@/lib/season-parts";

// Prices in cents, from the season in 3 parts (lib/season-parts.ts). Source of truth for what
// Stripe charges.
export const prices: Record<ProgramSlug, number> = PRICES;
export const RUNNING_PRICE = 900;
export const SECOND_GOAL_PRICE = 500;
export { PACK_FULL, PACK_INSTALMENT, PACK_PRICE, PACK_WEEKS };
// The options on top of the program (or the Saison complète) price.
export const orderTotal = (base: number, goals: readonly string[], running: boolean) =>
  base + (goals.length === 2 ? SECOND_GOAL_PRICE : 0) + (running ? RUNNING_PRICE : 0);

export const genders = ["femme", "homme", "non-precise"] as const;
// Where the customer trains: the exercises, drawings and dosages of the program follow it.
export const places = ["maison", "salle"] as const;
export type Place = (typeof places)[number];
export type Gender = (typeof genders)[number];

// 39,99 € / €39.99 (no decimals for whole euros: 9 €).
export const fmtPrice = (cents: number, lang: Lang) => {
  const n = cents % 100 ? (cents / 100).toFixed(2) : String(cents / 100);
  // Non-breaking space: "9,99 €" never splits across two lines.
  return lang === "fr" ? `${n.replace(".", ",")}\u00a0€` : `€${n}`;
};

// Price per week, rounded to 10 cents: the Saison complète's 199,99 € over 49 weeks is about 4 € a week.
export const perWeek = (cents: number, weeks: number, lang: Lang) => fmtPrice(Math.round(cents / weeks / 10) * 10, lang);

export const buy = {
  fr: {
    startT: "Quand commences-tu ?",
    startHint: (name: string, week: number) => `${name} : la saison en est à la semaine ${week}. Choisis ton programme.`,
    fromWeek: (w: number) => `À partir de la semaine ${w}`,
    fromWeekD: (weeks: number) => `Ton PDF commence à la semaine où en est la saison : les ${weeks} semaines qui restent, au prix de ces semaines.`,
    whole: "Le programme entier",
    wholeD: (weeks: number) => `Toutes les séances depuis la semaine 1 (${weeks} semaines), au prix plein.`,
    weeksLeft: (weeks: number) => `${weeks} semaines`,
    now: "· maintenant", from: (d: string) => `· à partir du ${d}`,
    step1: "Tes objectifs", stepPlace: "Où t'entraînes-tu ?", step2: "Options", step3: "Ton profil", step4: "Récapitulatif",
    placeHint: "Les exercices, leurs animations et les dosages de ton programme sont adaptés à ton lieu d'entraînement.",
    plangT: "Langue du programme", plangs: { fr: "Français", en: "English" },
    places: { maison: ["Maison", "Poids du corps et objets du quotidien, avec des variantes à l'élastique."], salle: ["Salle de sport", "Haltères, barre, poulies. La course sur tapis de course incurvé, ou une alternative."] },
    placeLb: "Lieu",
    profileHint: "Pour adapter ton programme et te l'envoyer à ton nom. Les silhouettes des animations suivent ton genre (neutres si tu préfères ne pas le dire).",
    firstName: "Prénom", age: "Âge", gender: "Genre",
    genders: { femme: "Femme", homme: "Homme", "non-precise": "Je préfère ne pas le dire" },
    minor: "Moins de 18 ans ? La commande doit être passée par un parent ou un représentant légal.",
    parentName: "Nom et prénom du parent ou représentant légal",
    parentOk: "Je suis le parent ou le représentant légal de l'athlète, qui a moins de 18 ans. Je passe cette commande, j'accepte les CGV et j'autorise ce programme, y compris les exercices avec charges, sous ma responsabilité. Je m'assure qu'il ou elle est en bonne santé pour le suivre.",
    count: (n: number) => `${n}/2`,
    hint: "1 objectif inclus. Tu peux en ajouter un 2e pour +5 €.",
    noGoal: "Choisis au moins un objectif pour recevoir ton programme.",
    second: "2e objectif",
    reathQ: "Tu reviens de blessure ?",
    reathD: "Objectif unique, à suivre avec le feu vert de ton médecin.",
    soon: "En préparation",
    reathSoon: "Ce programme est en préparation : il sera bientôt disponible.",
    runT: "Programme course à pied", runD: "Des séances de 30 à 45 min, en plus de ton programme.",
    packT: "Saison complète", packWeeks: "3 parties, 49 semaines", perWeek: (w: string) => `soit ${w} par semaine`,
    upsellT: "Et si tu prenais toute la saison ?",
    upsellD: (pack: string, full: string, save: string, w: string) => `La Saison complète : les 3 parties à la suite (celle-ci et les deux suivantes), mêmes objectifs, ${pack} au lieu de ${full}. Tu économises ${save}, soit ${w} par semaine. Voir la Saison complète →`,
    goalsLb: "Objectifs", none: "À choisir", total: "Total",
    consent: "J'accepte les conditions générales de vente. Je demande l'accès immédiat au programme et je reconnais perdre mon droit de rétractation une fois le programme envoyé.",
    cgv: "Lire les CGV",
    btn: (price: string) => `Payer ${price}`,
    secure: "Paiement sécurisé par Stripe. Programme envoyé par email. Un coéquipier t'a donné son code ? Tu le saisis sur la page de paiement.",
    test: "Mode test : aucun paiement réel. Carte 4242 4242 4242 4242, date future, code au choix.",
    off: "Le paiement est momentanément indisponible. Réessaie plus tard ou écris-nous.",
    invalid: "Choisis au moins 1 objectif, ton lieu d'entraînement, remplis ton profil et accepte les CGV. Moins de 18 ans : le parent indique son nom et coche son accord.",
  },
  en: {
    startT: "When do you start?",
    startHint: (name: string, week: number) => `${name}: the season is in week ${week}. Choose your program.`,
    fromWeek: (w: number) => `From week ${w}`,
    fromWeekD: (weeks: number) => `Your PDF starts at the week the season is at: the ${weeks} weeks left, at the price of those weeks.`,
    whole: "The whole program",
    wholeD: (weeks: number) => `Every session from week 1 (${weeks} weeks), at full price.`,
    weeksLeft: (weeks: number) => `${weeks} weeks`,
    now: "· now", from: (d: string) => `· from ${d}`,
    step1: "Your goals", stepPlace: "Where do you train?", step2: "Options", step3: "About you", step4: "Summary",
    placeHint: "The exercises, their animations and the dosages of your program are adapted to where you train.",
    plangT: "Program language", plangs: { fr: "Français", en: "English" },
    places: { maison: ["Home", "Bodyweight and everyday objects, with resistance band variations."], salle: ["Gym", "Dumbbells, barbell, cables. Running on a curved treadmill, or an alternative."] },
    placeLb: "Place",
    profileHint: "So we can adapt your program and send it in your name. The figures in the animations match your gender (neutral if you'd rather not say).",
    firstName: "First name", age: "Age", gender: "Gender",
    genders: { femme: "Woman", homme: "Man", "non-precise": "I'd rather not say" },
    minor: "Under 18? The order must be placed by a parent or legal guardian.",
    parentName: "Full name of the parent or legal guardian",
    parentOk: "I am the parent or legal guardian of the athlete, who is under 18. I am placing this order, I accept the terms and I authorise this program, including loaded exercises, under my responsibility. I make sure they are healthy enough to follow it.",
    count: (n: number) => `${n}/2`,
    hint: "1 goal included. Add a 2nd one for +€5.",
    noGoal: "Pick at least one goal to get your program.",
    second: "2nd goal",
    reathQ: "Coming back from injury?",
    reathD: "A single goal, to follow with your doctor's clearance.",
    soon: "Coming soon",
    reathSoon: "This program is being prepared and will be available soon.",
    runT: "Running program", runD: "30 to 45 min sessions, on top of your program.",
    packT: "Full season", packWeeks: "3 parts, 49 weeks", perWeek: (w: string) => `just ${w} a week`,
    upsellT: "Why not the whole season?",
    upsellD: (pack: string, full: string, save: string, w: string) => `The Full season: the 3 parts in a row (this one and the next two), same goals, ${pack} instead of ${full}. You save ${save}, just ${w} a week. See the Full season →`,
    goalsLb: "Goals", none: "To choose", total: "Total",
    consent: "I accept the terms of sale. I ask for immediate access to the program and acknowledge that I lose my right of withdrawal once the program has been sent.",
    cgv: "Read the terms",
    btn: (price: string) => `Pay ${price}`,
    secure: "Secure payment by Stripe. Program sent by email. Got a code from a teammate? Enter it on the payment page.",
    test: "Test mode: no real payment. Card 4242 4242 4242 4242, any future date, any code.",
    off: "Payment is temporarily unavailable. Please try again later or contact us.",
    invalid: "Pick at least 1 goal and where you train, fill in your details and accept the terms. Under 18: the parent gives their name and ticks their consent.",
  },
};

export const testMode = !process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_");
