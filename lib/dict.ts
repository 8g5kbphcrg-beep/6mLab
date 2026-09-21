export const locales = ["fr", "en"] as const;
export type Lang = (typeof locales)[number];
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://6mlab.com";

export const dict = {
  fr: {
    title: "6M Lab | Préparation physique handball",
    desc: "Programmes de préparation physique pour handballeurs : pré-saison et maintien en saison, conçus par un joueur étudiant en STAPS.",
    nav: { cmp: "Comparer", goal: "Ton objectif", other: "EN", skip: "Aller au contenu" },
    hero: { h1: "Prépare ta saison de handball comme un pro", sub: "Des programmes de préparation physique conçus par un joueur, étudiant en STAPS.", cta: "Comparer les deux formules", trust: "Conçu par un joueur de handball, étudiant en STAPS (entraînement sportif)." },
    cmp: {
      title: "Compare les deux formules", sub: "Les mêmes objectifs au choix, deux moments de la saison.",
      heads: [["Pré-saison", "Avant la saison"], ["Maintien en saison", "Pendant la saison"]],
      rows: [
        ["Objectif de la formule", "Reprendre fort : base physique, force, explosivité, affûtage", "Rester affûté sans nuire aux entraînements du club"],
        ["Durée", "8 semaines", "12 semaines"],
        ["Fréquence", "3 à 4 séances par semaine", "2 séances de 30 à 40 min par semaine"],
      ],
      goalsLb: "Objectifs au choix (les deux formules)", priceLb: "Prix", price: "Prix à définir",
      choose: ["Choisir la pré-saison", "Choisir le maintien"],
    },
    pick: {
      title: "Choisis ton objectif", where: "Où en es-tu ?", moments: ["Avant la saison", "En pleine saison"], goalLb: "Ton objectif",
      names: ["Pré-saison", "Maintien en saison"],
      meta: ["8 semaines, 3 à 4 séances par semaine", "12 semaines, 2 séances de 30 à 40 min par semaine"],
      note: "Aperçu : le questionnaire complet (niveau, matériel, blessure) et l'achat arrivent avec la version finale. Nos programmes portent sur l'entraînement, sans plan alimentaire.",
    },
    goals: [
      ["Force", "Charges progressives pour gagner en puissance de tir et en solidité dans les duels."],
      ["Explosivité", "Sauts, sprints et changements de direction pour être plus vif sur le terrain."],
      ["Prise de masse", "Volume de travail et surcharge progressive pour développer la masse musculaire."],
      ["Perte de poids", "Séances dynamiques qui augmentent la dépense d'énergie tout en gardant la performance."],
    ],
    how: { title: "Comment ça marche", steps: ["Réponds à quelques questions sur ton objectif et ton niveau.", "Reçois le programme recommandé pour toi.", "Paie en ligne et reçois ton accès par email."] },
    why: {
      title: "Pensé pour le handball",
      items: [["Explosivité et appuis", "Sauts, changements de direction, tirs : le travail cible les gestes du jeu."], ["Charge planifiée", "Des semaines construites pour progresser sans t'épuiser."], ["Prévention des blessures", "Épaules, genoux et chevilles sont travaillés à chaque cycle."]],
      note: "Programmes destinés à des joueurs en bonne santé. En cas de doute ou de blessure, demande l'avis d'un professionnel de santé.",
    },
  },
  en: {
    title: "6M Lab | Handball Performance & Physical Training",
    desc: "Physical training programs for handball players: pre-season and in-season plans, designed by a sport-science student who plays.",
    nav: { cmp: "Compare", goal: "Your goal", other: "FR", skip: "Skip to content" },
    hero: { h1: "Train for your handball season like a pro", sub: "Physical training programs built by a player who studies sport science.", cta: "Compare the two programs", trust: "Built by a handball player studying sport science (training and coaching)." },
    cmp: {
      title: "Compare the two programs", sub: "Same goals to choose from, two moments in the season.",
      heads: [["Pre-season", "Before the season"], ["In-season maintenance", "During the season"]],
      rows: [
        ["Focus", "Come back strong: base fitness, strength, explosiveness, tapering", "Stay sharp without hurting your club training"],
        ["Duration", "8 weeks", "12 weeks"],
        ["Frequency", "3 to 4 sessions per week", "2 sessions of 30 to 40 min per week"],
      ],
      goalsLb: "Goals to choose from (both programs)", priceLb: "Price", price: "Price to be set",
      choose: ["Choose pre-season", "Choose in-season"],
    },
    pick: {
      title: "Pick your goal", where: "Where are you?", moments: ["Before the season", "During the season"], goalLb: "Your goal",
      names: ["Pre-season", "In-season maintenance"],
      meta: ["8 weeks, 3 to 4 sessions per week", "12 weeks, 2 sessions of 30 to 40 min per week"],
      note: "Preview: the full questionnaire (level, equipment, injury) and checkout come with the final version. Our programs cover training only, with no meal plans.",
    },
    goals: [
      ["Strength", "Progressive loading to build throwing power and strength in duels."],
      ["Explosiveness", "Jumps, sprints and changes of direction to be quicker on court."],
      ["Mass gain", "Training volume and progressive overload to build muscle."],
      ["Weight loss", "Dynamic sessions that raise energy expenditure while keeping performance up."],
    ],
    how: { title: "How it works", steps: ["Answer a few questions about your goal and level.", "Get the program recommended for you.", "Pay online and get access by email."] },
    why: {
      title: "Built for handball",
      items: [["Explosiveness and footwork", "Jumps, changes of direction, throws: the work targets the game's movements."], ["Planned load", "Weeks built to make you progress without wearing you out."], ["Injury prevention", "Shoulders, knees and ankles are trained in every cycle."]],
      note: "Programs are for healthy players. If you have doubts or an injury, ask a health professional first.",
    },
  },
};
