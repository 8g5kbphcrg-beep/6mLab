export const programSlugs = ["pre-saison", "maintien-saison"] as const;
export type ProgramSlug = (typeof programSlugs)[number];

export const programs = {
  fr: {
    "pre-saison": {
      idx: 0, name: "Pré-saison", tag: "Avant la saison", color: "a",
      duration: "8 semaines", freq: "3 à 4 séances par semaine",
      pitch: "Repars sur des bases solides avant la reprise avec ton club : 8 semaines de progression, construites autour des objectifs que tu choisis.",
      includes: ["Un PDF avec le planning complet, semaine par semaine", "Des animations qui montrent chaque exercice", "1 objectif au choix (+5 € pour un 2e), ou la réathlétisation après une blessure", "En option : un programme de course à pied (+9 €)"],
      phases: [
        { t: "Semaines 1-2 — Mise en route", d: "Réhabituer progressivement le corps à l'effort et apprendre les gestes, avec un effort modéré." },
        { t: "Semaines 3-5 — Montée en charge", d: "Le travail sur tes objectifs augmente semaine après semaine. La semaine 5 est la plus exigeante." },
        { t: "Semaines 6-7 — Intensité", d: "Moins de volume, plus de qualité : chaque répétition est faite au maximum de ta vitesse d'exécution." },
        { t: "Semaine 8 — Affûtage", d: "Une dernière semaine plus légère, pour aborder le premier entraînement collectif en pleine forme." },
      ],
      faq: [
        { q: "Je débute en préparation physique, ce programme est fait pour moi ?", a: "Oui, chaque séance indique une version allégée pour les personnes qui débutent." },
        { q: "J'ai besoin de matériel ?", a: "Non, le programme fonctionne au poids du corps. Des variantes avec haltères sont proposées si tu as accès à une salle." },
        { q: "Que se passe-t-il après les 8 semaines ?", a: "Tu peux enchaîner avec la formule Maintien en saison pour garder ta forme toute l'année." },
      ],
    },
    "maintien-saison": {
      idx: 1, name: "Maintien en saison", tag: "Pendant la saison", color: "b",
      duration: "12 semaines", freq: "2 séances de 30 à 40 min par semaine",
      pitch: "Deux séances courtes par semaine pour entretenir le travail sur tes objectifs, sans jamais empiéter sur tes entraînements de club ni tes matchs.",
      includes: ["Un PDF avec le planning complet, semaine par semaine", "Des animations qui montrent chaque exercice", "1 objectif au choix (+5 € pour un 2e), ou la réathlétisation après une blessure", "En option : un programme de course à pied (+9 €)"],
      phases: [
        { t: "Séance 1 — La plus exigeante", d: "Le plus gros volume de la semaine, à placer au moins 3 jours avant le match." },
        { t: "Séance 2 — Plus légère", d: "Plus courte, pour entretenir sans fatigue, au plus tard 2 jours avant le match." },
      ],
      faq: [
        { q: "Est-ce que ça va me fatiguer avant les matchs ?", a: "Les séances sont courtes et pensées pour se placer loin des matchs. Le programme indique où les positionner dans ta semaine." },
        { q: "Je peux renouveler après les 12 semaines ?", a: "Oui, le programme est conçu pour être reconduit tout au long de la saison." },
        { q: "J'ai besoin de matériel ?", a: "Non, le programme fonctionne au poids du corps." },
      ],
    },
  },
  en: {
    "pre-saison": {
      idx: 0, name: "Pre-season", tag: "Before the season", color: "a",
      duration: "8 weeks", freq: "3 to 4 sessions per week",
      pitch: "Build a solid base before your club's restart: 8 weeks of progression, built around the goals you choose.",
      includes: ["A PDF with the full week-by-week plan", "Animations showing every exercise", "1 goal of your choice (+€5 for a 2nd), or return to play after injury", "Optional: a running program (+€9)"],
      phases: [
        { t: "Weeks 1-2 — Getting started", d: "Gradually get the body used to effort again and learn the movements, at a moderate effort." },
        { t: "Weeks 3-5 — Building up", d: "The work on your goals increases week after week. Week 5 is the hardest." },
        { t: "Weeks 6-7 — Intensity", d: "Less volume, more quality: every rep done at your maximum speed of execution." },
        { t: "Week 8 — Taper", d: "A lighter final week, so you arrive fresh at the first team training." },
      ],
      faq: [
        { q: "I'm new to physical training, is this program for me?", a: "Yes, every session includes a lighter version for beginners." },
        { q: "Do I need equipment?", a: "No, the program works with bodyweight only. Dumbbell variations are offered if you have gym access." },
        { q: "What happens after the 8 weeks?", a: "You can move on to the In-season maintenance program to stay in shape all year." },
      ],
    },
    "maintien-saison": {
      idx: 1, name: "In-season maintenance", tag: "During the season", color: "b",
      duration: "12 weeks", freq: "2 sessions of 30 to 40 min per week",
      pitch: "Two short sessions a week to maintain the work on your goals, without ever getting in the way of club training or matches.",
      includes: ["A PDF with the full week-by-week plan", "Animations showing every exercise", "1 goal of your choice (+€5 for a 2nd), or return to play after injury", "Optional: a running program (+€9)"],
      phases: [
        { t: "Session 1 — The hardest one", d: "The biggest volume of the week, at least 3 days before the game." },
        { t: "Session 2 — Lighter", d: "Shorter, to maintain without fatigue, no later than 2 days before the game." },
      ],
      faq: [
        { q: "Will this tire me out before matches?", a: "Sessions are short and designed to sit away from matches. The program shows where to place them in your week." },
        { q: "Can I renew after the 12 weeks?", a: "Yes, the program is built to be repeated throughout the season." },
        { q: "Do I need equipment?", a: "No, the program works with bodyweight only." },
      ],
    },
  },
} as const;
