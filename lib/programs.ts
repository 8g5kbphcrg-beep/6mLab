// The season in 3 parts (lib/season-parts.ts): Pré-saison, 1re partie (the former Maintien en
// saison, whose slug maintien-saison old orders may still carry) and 2e partie de saison.
export const programSlugs = ["pre-saison", "premiere-partie", "deuxieme-partie"] as const;
export type ProgramSlug = (typeof programSlugs)[number];

const incFr = (weeks: number) => ["Un PDF avec le planning complet, semaine par semaine", `Des animations qui montrent chaque exercice, en ligne ${weeks + 2} semaines (à lancer quand tu commences)`, "1 objectif au choix (+5 € pour un 2e) ; la réathlétisation après une blessure est en préparation", "En option : un programme de course à pied (+9 €)"];
const incEn = (weeks: number) => ["A PDF with the full week-by-week plan", `Animations showing every exercise, online for ${weeks + 2} weeks (start them when you begin)`, "1 goal of your choice (+€5 for a 2nd); return to play after injury is coming soon", "Optional: a running program (+€9)"];

export const programs = {
  fr: {
    "pre-saison": {
      idx: 0, name: "Pré-saison", tag: "Juillet et août", color: "a",
      duration: "8 semaines", freq: "3 à 4 séances par semaine",
      pitch: "Repars sur des bases solides avant la reprise avec ton club : 8 semaines de progression en juillet et en août, construites autour des objectifs que tu choisis.",
      includes: incFr(8),
      phases: [
        { t: "Semaines 1-2 — Mise en route", d: "Réhabituer progressivement le corps à l'effort et apprendre les gestes, avec un effort modéré." },
        { t: "Semaines 3-5 — Montée en charge", d: "Le travail sur tes objectifs augmente semaine après semaine. La semaine 5 est la plus exigeante." },
        { t: "Semaines 6-7 — Intensité", d: "Moins de volume, plus de qualité : chaque répétition est faite au maximum de ta vitesse d'exécution." },
        { t: "Semaine 8 — Affûtage", d: "Une dernière semaine plus légère, pour aborder le premier entraînement collectif en pleine forme." },
      ],
      faq: [
        { q: "Je débute en préparation physique, ce programme est fait pour moi ?", a: "Oui, chaque séance indique une version allégée pour les personnes qui débutent." },
        { q: "J'ai besoin de matériel ?", a: "Non, le programme fonctionne au poids du corps. Des variantes avec haltères sont proposées si tu as accès à une salle." },
        { q: "Que se passe-t-il après les 8 semaines ?", a: "La 1re partie de saison prend le relais en septembre : ce que tu as construit cet été ne se garde que si on l'entretient. La Saison complète enchaîne les 3 parties avec 20 % de remise." },
      ],
    },
    "premiere-partie": {
      idx: 1, name: "1re partie de saison", tag: "Septembre à Noël", color: "b",
      duration: "18 semaines", freq: "2 séances de 30 à 40 min par semaine",
      pitch: "De la reprise des matchs jusqu'à la fin des vacances de Noël : deux séances courtes par semaine pour garder ce que la pré-saison a construit, sans empiéter sur tes entraînements ni tes matchs, et une trêve qui ne te fait pas tout perdre.",
      includes: incFr(18),
      phases: [
        { t: "Septembre — Entrer dans la saison", d: "Les matchs reprennent : la charge baisse un peu pour laisser la place au collectif, sans perdre la force et l'explosivité de l'été." },
        { t: "Octobre à mi-décembre — Entretenir", d: "Deux séances par semaine : la plus exigeante au moins 3 jours avant le match, la plus légère au plus tard 2 jours avant. Prévention des chevilles, genoux et épaules à chaque séance." },
        { t: "Vacances de Noël — La trêve", d: "Quelques jours de vrai repos, puis 3 séances courtes par semaine, sans matériel, pour reprendre en janvier sans douleur." },
      ],
      faq: [
        { q: "Est-ce que ça va me fatiguer avant les matchs ?", a: "Les séances sont courtes et pensées pour se placer loin des matchs. Le programme indique où les positionner dans ta semaine." },
        { q: "La saison a déjà commencé, je peux encore le prendre ?", a: "Oui. Au moment du paiement, tu choisis : le programme entier au prix plein, ou un programme qui commence à la semaine où on en est, au prix des mois qui restent." },
        { q: "Et après Noël ?", a: "La 2e partie de saison prend le relais en janvier, jusqu'aux phases finales de juin : chaque partie prépare la suivante." },
      ],
    },
    "deuxieme-partie": {
      idx: 2, name: "2e partie de saison", tag: "Janvier à juin", color: "c",
      duration: "23 semaines", freq: "2 séances de 30 à 40 min par semaine",
      pitch: "De la reprise de janvier aux phases finales de juin : repartir fort après la trêve, rester frais quand la fatigue s'accumule, et être au top pour les matchs qui décident de la saison.",
      includes: incFr(23),
      phases: [
        { t: "Janvier — Reprendre après la trêve", d: "Deux semaines pour remonter la charge progressivement, sans la blessure classique de la reprise." },
        { t: "Février à avril — La phase retour", d: "Entretenir la puissance et la vitesse quand les jambes fatiguent, avec un travail de prévention renforcé." },
        { t: "Mai à mi-juin — Les matchs décisifs", d: "Moins de volume, plus de fraîcheur : un bloc court et intense pour les derniers matchs et les phases finales. Si ta saison s'arrête en mai, ces semaines deviennent de la récupération active avant la coupure." },
      ],
      faq: [
        { q: "Pourquoi jusqu'à mi-juin ?", a: "Des U15 aux seniors, la saison régulière finit en mai, mais les finales régionales et nationales se jouent jusqu'à mi-juin. Le programme t'y amène en forme." },
        { q: "La saison a déjà commencé, je peux encore le prendre ?", a: "Oui. Au moment du paiement, tu choisis : le programme entier au prix plein, ou un programme qui commence à la semaine où on en est, au prix des mois qui restent." },
        { q: "Et après ?", a: "Deux semaines de vraie coupure fin juin, puis la Pré-saison en juillet : la Saison complète enchaîne les 3 parties avec 20 % de remise." },
      ],
    },
  },
  en: {
    "pre-saison": {
      idx: 0, name: "Pre-season", tag: "July and August", color: "a",
      duration: "8 weeks", freq: "3 to 4 sessions per week",
      pitch: "Build a solid base before your club's restart: 8 weeks of progression in July and August, built around the goals you choose.",
      includes: incEn(8),
      phases: [
        { t: "Weeks 1-2 — Getting started", d: "Gradually get the body used to effort again and learn the movements, at a moderate effort." },
        { t: "Weeks 3-5 — Building up", d: "The work on your goals increases week after week. Week 5 is the hardest." },
        { t: "Weeks 6-7 — Intensity", d: "Less volume, more quality: every rep done at your maximum speed of execution." },
        { t: "Week 8 — Taper", d: "A lighter final week, so you arrive fresh at the first team training." },
      ],
      faq: [
        { q: "I'm new to physical training, is this program for me?", a: "Yes, every session includes a lighter version for beginners." },
        { q: "Do I need equipment?", a: "No, the program works with bodyweight only. Dumbbell variations are offered if you have gym access." },
        { q: "What happens after the 8 weeks?", a: "The first half of the season takes over in September: what you built this summer only lasts if you maintain it. The Full season links the 3 parts with 20% off." },
      ],
    },
    "premiere-partie": {
      idx: 1, name: "First half of the season", tag: "September to Christmas", color: "b",
      duration: "18 weeks", freq: "2 sessions of 30 to 40 min per week",
      pitch: "From the first games to the end of the Christmas holidays: two short sessions a week to keep what the pre-season built, without getting in the way of training or games, and a winter break that doesn't cost you everything.",
      includes: incEn(18),
      phases: [
        { t: "September — Into the season", d: "Games start again: the load drops a little to make room for team training, without losing the strength and explosiveness of the summer." },
        { t: "October to mid-December — Maintain", d: "Two sessions a week: the hardest at least 3 days before the game, the lighter one no later than 2 days before. Ankle, knee and shoulder prevention in every session." },
        { t: "Christmas holidays — The break", d: "A few days of real rest, then 3 short sessions a week, no equipment, to restart in January without pain." },
      ],
      faq: [
        { q: "Will this tire me out before matches?", a: "Sessions are short and designed to sit away from matches. The program shows where to place them in your week." },
        { q: "The season has started, can I still get it?", a: "Yes. At checkout you choose: the whole program at full price, or a program that starts at the current week, at the price of the months left." },
        { q: "And after Christmas?", a: "The second half of the season takes over in January, up to the June finals: each part prepares the next." },
      ],
    },
    "deuxieme-partie": {
      idx: 2, name: "Second half of the season", tag: "January to June", color: "c",
      duration: "23 weeks", freq: "2 sessions of 30 to 40 min per week",
      pitch: "From the January restart to the June finals: come back strong after the break, stay fresh as fatigue builds up, and be at your best for the games that decide the season.",
      includes: incEn(23),
      phases: [
        { t: "January — Back after the break", d: "Two weeks to raise the load gradually, without the classic restart injury." },
        { t: "February to April — The second leg", d: "Keep your power and speed as the legs get tired, with more injury prevention work." },
        { t: "May to mid-June — The decisive games", d: "Less volume, more freshness: a short, intense block for the last games and the finals. If your season ends in May, these weeks become active recovery before the break." },
      ],
      faq: [
        { q: "Why until mid-June?", a: "From U15 to seniors, the regular season ends in May, but regional and national finals are played until mid-June. The program gets you there in shape." },
        { q: "The season has started, can I still get it?", a: "Yes. At checkout you choose: the whole program at full price, or a program that starts at the current week, at the price of the months left." },
        { q: "And after that?", a: "Two weeks of real break in late June, then the Pre-season in July: the Full season links the 3 parts with 20% off." },
      ],
    },
  },
} as const;

// When to do the Pré-saison: the 2 months before the season (offer pages, guide PDF, email).
// Each case: the 8 weeks, alone ("solo") or alongside the club's physical prep ("club").
export const whenToStart = {
  fr: {
    title: "Quand commencer ?",
    lead: "Fais ton programme pendant les 2 mois qui précèdent le début de la saison : en général en juillet et en août, pour une saison qui démarre début septembre.",
    months: ["Juillet", "Août"],
    legend: { solo: "Seul(e)", club: "En parallèle de la prépa du club" },
    cases: [
      { t: "Ton club fait une prépa physique à la reprise", d: "Par exemple à partir de début août : fais les 4 premières semaines seul(e), avant la reprise, puis les 4 dernières en parallèle des entraînements de prépa physique du club.", weeks: ["solo", "solo", "solo", "solo", "club", "club", "club", "club"] },
      { t: "Ton club ne fait pas de prépa physique", d: "Commence 2 mois avant le début de la saison, vers début juillet, pour finir ta semaine d'affûtage juste avant début septembre.", weeks: ["solo", "solo", "solo", "solo", "solo", "solo", "solo", "solo"] },
    ],
    note: "En parallèle du club, garde 48 heures entre deux séances A, B ou C, pas de séance la veille d'un entraînement collectif très intense, et allège (moins de séries) si la fatigue s'accumule.",
  },
  en: {
    title: "When to start?",
    lead: "Do your program over the 2 months before the season starts: usually July and August, for a season that begins in early September.",
    months: ["July", "August"],
    legend: { solo: "On your own", club: "Alongside the club's physical prep" },
    cases: [
      { t: "Your club runs a physical prep at the restart", d: "For example from early August: do the first 4 weeks on your own, before the restart, then the last 4 alongside the club's physical prep sessions.", weeks: ["solo", "solo", "solo", "solo", "club", "club", "club", "club"] },
      { t: "Your club does no physical prep", d: "Start 2 months before the season, around early July, so your taper week ends just before early September.", weeks: ["solo", "solo", "solo", "solo", "solo", "solo", "solo", "solo"] },
    ],
    note: "Alongside the club, keep 48 hours between two A, B or C sessions, no session the day before a very intense team training, and go lighter (fewer sets) if fatigue builds up.",
  },
} as const;
