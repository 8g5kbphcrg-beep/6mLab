export const locales = ["fr", "en"] as const;
export type Lang = (typeof locales)[number];
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://6mlab.com";

export const dict = {
  fr: {
    title: "6M Lab | Préparation physique",
    desc: "Programmes de préparation physique planifiés, chaque exercice animé : préparation spécifique au handball, et bientôt forme et bien-être pour tous.",
    hb: { title: "Préparation physique handball | 6M Lab", desc: "Programmes de préparation physique pour les joueurs et joueuses de handball : pré-saison et maintien en saison, conçus par Raphaël, 5 ans en structures de haut niveau." },
    nav: { cmp: "Comparer", goal: "Trouver mon programme", other: "EN", skip: "Aller au contenu" },
    hero: { h1: "La prépa physique du haut niveau, pour ta saison de handball", sub: "Des programmes conçus par Raphaël, entraîneur et préparateur physique. Chaque exercice est animé, chaque semaine est planifiée.", cta: "Voir les programmes", trust: "5 ans en structures de haut niveau", foot: "La préparation physique du haut niveau, pour tous. Par Raphaël, 5 ans en structures de haut niveau." },
    cmp: {
      title: "Choisis ta formule", sub: "Toute la saison avec le pack, ou un seul programme : les mêmes objectifs au choix.",
      heads: [["Pré-saison", "Avant la saison"], ["Maintien en saison", "Pendant la saison"]],
      rows: [
        ["Objectif de la formule", "Arriver prêt à la reprise : 8 semaines de progression, jusqu'à l'affûtage", "Garder ton niveau sans nuire aux entraînements du club"],
        ["Durée", "8 semaines", "12 semaines"],
        ["Fréquence", "3 à 4 séances par semaine", "2 séances de 30 à 40 min par semaine"],
      ],
      goalsLb: "Objectifs (les deux formules) : 1 au choix, +5 € pour un 2e, ou Réathlétisation", priceLb: "Prix", price: ["39,99 €", "29,99 €"],
      runLb: "Option course à pied (les deux formules)", run: "+9 € : des séances de course de 30 à 45 min",
      choose: ["Choisir la pré-saison", "Choisir le maintien"],
    },
    pick: {
      title: "Choisis tes objectifs", where: "Où en es-tu ?", moments: ["Avant la saison", "En pleine saison"], goalLb: "Ton objectif (+5 € pour un 2e)", go: "Choisir ce programme", pickTwo: "Choisis 1 objectif (ou 2, +5 €), ou la réathlétisation seule.",
      names: ["Pré-saison", "Maintien en saison"],
      meta: ["8 semaines, 3 à 4 séances par semaine", "12 semaines, 2 séances de 30 à 40 min par semaine"],
      note: "Tu pourras encore modifier tes objectifs au moment de l'achat. Nos programmes portent sur l'entraînement, sans plan alimentaire.",
    },
    how: { title: "Comment ça marche", steps: ["Réponds à quelques questions sur ton objectif et ton niveau.", "Reçois le programme recommandé pour toi.", "Paie en ligne et reçois ton accès par email."] },
    why: {
      title: "Pensé pour le handball",
      items: [["Explosivité et appuis", "Sauts, changements de direction, tirs : le travail cible les gestes du jeu."], ["Charge planifiée", "Des semaines construites pour progresser sans t'épuiser."], ["Prévention des blessures", "Épaules, genoux et chevilles sont travaillés à chaque cycle."]],
      note: "Programmes destinés aux personnes en bonne santé. En cas de doute ou de blessure, demande l'avis d'un professionnel de santé.",
    },
  },
  en: {
    title: "6M Lab | Physical preparation",
    desc: "Planned physical preparation programs, every exercise animated: handball-specific preparation, and soon fitness and well-being for everyone.",
    hb: { title: "Handball physical preparation | 6M Lab", desc: "Physical training programs for handball players: pre-season and in-season plans, designed by Raphaël, 5 years in elite-level handball programs." },
    nav: { cmp: "Compare", goal: "Find my program", other: "FR", skip: "Skip to content" },
    hero: { h1: "Elite-level physical prep for your handball season", sub: "Programs built by Raphaël, coach and strength coach. Every exercise animated, every week planned.", cta: "See the programs", trust: "5 years in elite-level handball", foot: "Elite-level physical preparation, for everyone. By Raphaël, 5 years in elite-level handball programs." },
    cmp: {
      title: "Choose your program", sub: "The whole season with the pack, or a single program: same goals to choose from.",
      heads: [["Pre-season", "Before the season"], ["In-season maintenance", "During the season"]],
      rows: [
        ["Focus", "Be ready for the restart: 8 weeks of progression, up to the taper", "Stay sharp without hurting your club training"],
        ["Duration", "8 weeks", "12 weeks"],
        ["Frequency", "3 to 4 sessions per week", "2 sessions of 30 to 40 min per week"],
      ],
      goalsLb: "Goals (both programs): pick 1, +€5 for a 2nd, or return-to-play", priceLb: "Price", price: ["€39.99", "€29.99"],
      runLb: "Running option (both programs)", run: "+€9: running sessions of 30 to 45 min",
      choose: ["Choose pre-season", "Choose in-season"],
    },
    pick: {
      title: "Pick your goals", where: "Where are you?", moments: ["Before the season", "During the season"], goalLb: "Your goal (+€5 for a 2nd)", go: "Choose this program", pickTwo: "Pick 1 goal (or 2, +€5), or return to play alone.",
      names: ["Pre-season", "In-season maintenance"],
      meta: ["8 weeks, 3 to 4 sessions per week", "12 weeks, 2 sessions of 30 to 40 min per week"],
      note: "You can still change your goals at checkout. Our programs cover training only, with no meal plans.",
    },
    how: { title: "How it works", steps: ["Answer a few questions about your goal and level.", "Get the program recommended for you.", "Pay online and get access by email."] },
    why: {
      title: "Built for handball",
      items: [["Explosiveness and footwork", "Jumps, changes of direction, throws: the work targets the game's movements."], ["Planned load", "Weeks built to make you progress without wearing you out."], ["Injury prevention", "Shoulders, knees and ankles are trained in every cycle."]],
      note: "Programs are for healthy players. If you have doubts or an injury, ask a health professional first.",
    },
  },
};
