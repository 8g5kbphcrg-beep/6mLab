export const programSlugs = ["pre-saison", "maintien-saison"] as const;
export type ProgramSlug = (typeof programSlugs)[number];

export const programs = {
  fr: {
    "pre-saison": {
      idx: 0, name: "Pré-saison", tag: "Avant la saison", color: "a",
      duration: "8 semaines", freq: "3 à 4 séances par semaine",
      pitch: "Repars sur des bases solides avant la reprise avec ton club : plus fort, plus explosif, prêt à enchaîner les efforts.",
      includes: ["Un PDF avec le planning complet, semaine par semaine", "Des vidéos qui montrent chaque exercice", "2 objectifs au choix, ou la réathlétisation après une blessure", "En option : un programme de course à pied (+9 €)"],
      phases: [
        { t: "Semaines 1-2 — Bases", d: "Réhabituer progressivement le corps à l'effort, avec un travail général et de la mobilité." },
        { t: "Semaines 3-5 — Force", d: "Montée en charge progressive pour construire une base solide, avec un volume qui augmente semaine après semaine." },
        { t: "Semaines 6-7 — Explosivité", d: "Un travail plus dynamique pour retrouver la vivacité propre au handball." },
        { t: "Semaine 8 — Affûtage", d: "Une dernière semaine plus légère, pour arriver frais au premier entraînement collectif." },
      ],
      faq: [
        { q: "Je débute en préparation physique, ce programme est fait pour moi ?", a: "Oui, chaque séance indique une version allégée pour les débutants." },
        { q: "J'ai besoin de matériel ?", a: "Non, le programme fonctionne au poids du corps. Des variantes avec haltères sont proposées si tu as accès à une salle." },
        { q: "Que se passe-t-il après les 8 semaines ?", a: "Tu peux enchaîner avec la formule Maintien en saison pour garder ta forme toute l'année." },
      ],
    },
    "maintien-saison": {
      idx: 1, name: "Maintien en saison", tag: "Pendant la saison", color: "b",
      duration: "12 semaines", freq: "2 séances de 30 à 40 min par semaine",
      pitch: "Deux séances courtes par semaine pour conserver ta force et ta vivacité, sans jamais empiéter sur tes entraînements de club ni tes matchs.",
      includes: ["Un PDF avec le planning complet, semaine par semaine", "Des vidéos qui montrent chaque exercice", "2 objectifs au choix, ou la réathlétisation après une blessure", "En option : un programme de course à pied (+9 €)"],
      phases: [
        { t: "Séance 1 — Force", d: "Un travail de force générale, à placer loin des matchs." },
        { t: "Séance 2 — Vivacité", d: "Un travail plus dynamique, pour garder les jambes réactives." },
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
      pitch: "Build a solid base before pre-season training starts: stronger, more explosive, ready for the workload ahead.",
      includes: ["A PDF with the full week-by-week plan", "Videos showing every exercise", "2 goals of your choice, or return to play after injury", "Optional: a running program (+€9)"],
      phases: [
        { t: "Weeks 1-2 — Base", d: "Gradually get the body used to effort again, with general work and mobility." },
        { t: "Weeks 3-5 — Strength", d: "Progressive loading to build a solid base, with volume increasing week by week." },
        { t: "Weeks 6-7 — Explosiveness", d: "More dynamic work to bring back the speed handball needs." },
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
      pitch: "Two short sessions a week to keep your strength and sharpness, without ever getting in the way of club training or matches.",
      includes: ["A PDF with the full week-by-week plan", "Videos showing every exercise", "2 goals of your choice, or return to play after injury", "Optional: a running program (+€9)"],
      phases: [
        { t: "Session 1 — Strength", d: "General strength work, best placed away from matches." },
        { t: "Session 2 — Sharpness", d: "More dynamic work, to keep your legs reactive." },
      ],
      faq: [
        { q: "Will this tire me out before matches?", a: "Sessions are short and designed to sit away from matches. The program shows where to place them in your week." },
        { q: "Can I renew after the 12 weeks?", a: "Yes, the program is built to be repeated throughout the season." },
        { q: "Do I need equipment?", a: "No, the program works with bodyweight only." },
      ],
    },
  },
} as const;
