export const locales = ["fr", "en"] as const;
export type Lang = (typeof locales)[number];
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://6mlab.com";

export const dict = {
  fr: {
    title: "6M Lab | Préparation physique handball",
    desc: "Programmes de préparation physique pour les joueurs et joueuses de handball : pré-saison et maintien en saison, conçus par un joueur étudiant en STAPS.",
    nav: { cmp: "Comparer", goal: "Ton objectif", other: "EN", skip: "Aller au contenu" },
    hero: { h1: "Prépare ta saison de handball comme au haut niveau", sub: "Des programmes de préparation physique conçus par un joueur, étudiant en STAPS.", cta: "Comparer les deux formules", trust: "Conçu par un joueur de handball, étudiant en STAPS (entraînement sportif)." },
    cmp: {
      title: "Compare les deux formules", sub: "Les mêmes objectifs au choix, deux moments de la saison.",
      heads: [["Pré-saison", "Avant la saison"], ["Maintien en saison", "Pendant la saison"]],
      rows: [
        ["Objectif de la formule", "Reprendre fort : base physique, force, explosivité, affûtage", "Garder ton niveau sans nuire aux entraînements du club"],
        ["Durée", "8 semaines", "12 semaines"],
        ["Fréquence", "3 à 4 séances par semaine", "2 séances de 30 à 40 min par semaine"],
      ],
      goalsLb: "Objectifs (les deux formules) : 2 au choix, ou Réathlétisation", priceLb: "Prix", price: ["39 €", "29 €"],
      runLb: "Option course à pied (les deux formules)", run: "+9 € : des séances de course de 30 à 45 min",
      choose: ["Choisir la pré-saison", "Choisir le maintien"],
    },
    pick: {
      title: "Choisis tes objectifs", where: "Où en es-tu ?", moments: ["Avant la saison", "En pleine saison"], goalLb: "Combinaisons conseillées", profileLb: "Pour qui", go: "Choisir cette combinaison",
      names: ["Pré-saison", "Maintien en saison"],
      meta: ["8 semaines, 3 à 4 séances par semaine", "12 semaines, 2 séances de 30 à 40 min par semaine"],
      note: "Tu peux aussi composer ta propre combinaison de 2 objectifs au moment de l'achat. Nos programmes portent sur l'entraînement, sans plan alimentaire.",
    },
    how: { title: "Comment ça marche", steps: ["Réponds à quelques questions sur ton objectif et ton niveau.", "Reçois le programme recommandé pour toi.", "Paie en ligne et reçois ton accès par email."] },
    why: {
      title: "Pensé pour le handball",
      items: [["Explosivité et appuis", "Sauts, changements de direction, tirs : le travail cible les gestes du jeu."], ["Charge planifiée", "Des semaines construites pour progresser sans t'épuiser."], ["Prévention des blessures", "Épaules, genoux et chevilles sont travaillés à chaque cycle."]],
      note: "Programmes destinés aux personnes en bonne santé. En cas de doute ou de blessure, demande l'avis d'un professionnel de santé.",
    },
  },
  en: {
    title: "6M Lab | Handball Performance & Physical Training",
    desc: "Physical training programs for handball players: pre-season and in-season plans, designed by a sport-science student who plays.",
    nav: { cmp: "Compare", goal: "Your goal", other: "FR", skip: "Skip to content" },
    hero: { h1: "Train for your handball season like the elite", sub: "Physical training programs built by a player who studies sport science.", cta: "Compare the two programs", trust: "Built by a handball player studying sport science (training and coaching)." },
    cmp: {
      title: "Compare the two programs", sub: "Same goals to choose from, two moments in the season.",
      heads: [["Pre-season", "Before the season"], ["In-season maintenance", "During the season"]],
      rows: [
        ["Focus", "Come back strong: base fitness, strength, explosiveness, tapering", "Stay sharp without hurting your club training"],
        ["Duration", "8 weeks", "12 weeks"],
        ["Frequency", "3 to 4 sessions per week", "2 sessions of 30 to 40 min per week"],
      ],
      goalsLb: "Goals (both programs): pick 2, or return-to-play", priceLb: "Price", price: ["€39", "€29"],
      runLb: "Running option (both programs)", run: "+€9: running sessions of 30 to 45 min",
      choose: ["Choose pre-season", "Choose in-season"],
    },
    pick: {
      title: "Pick your goals", where: "Where are you?", moments: ["Before the season", "During the season"], goalLb: "Suggested combinations", profileLb: "Who it's for", go: "Choose this combination",
      names: ["Pre-season", "In-season maintenance"],
      meta: ["8 weeks, 3 to 4 sessions per week", "12 weeks, 2 sessions of 30 to 40 min per week"],
      note: "You can also build your own combination of 2 goals at checkout. Our programs cover training only, with no meal plans.",
    },
    how: { title: "How it works", steps: ["Answer a few questions about your goal and level.", "Get the program recommended for you.", "Pay online and get access by email."] },
    why: {
      title: "Built for handball",
      items: [["Explosiveness and footwork", "Jumps, changes of direction, throws: the work targets the game's movements."], ["Planned load", "Weeks built to make you progress without wearing you out."], ["Injury prevention", "Shoulders, knees and ankles are trained in every cycle."]],
      note: "Programs are for healthy players. If you have doubts or an injury, ask a health professional first.",
    },
  },
};
