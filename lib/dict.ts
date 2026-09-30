export const locales = ["fr", "en"] as const;
export type Lang = (typeof locales)[number];
export const SITE = process.env.NEXT_PUBLIC_SITE_URL || "https://6mlab.com";
// Closed to search engines until the launch: the variable SITE_PUBLIC=oui on Vercel (then a
// redeploy) opens the site to them. Read at build time.
export const OPEN = process.env.SITE_PUBLIC === "oui";

export const dict = {
  fr: {
    title: "6M Lab | Programmes de préparation physique animés",
    desc: "Programmes de préparation physique planifiés, chaque exercice animé : préparation spécifique au handball, et bientôt forme et bien-être pour tous.",
    hb: { title: "Préparation physique handball : toute la saison, de juillet à juin | 6M Lab", desc: "Programmes de préparation physique pour les joueurs et joueuses de handball : pré-saison, 1re et 2e partie de saison, conçus par Raphaël, 5 ans en structures de haut niveau." },
    nav: { cmp: "Comparer", goal: "Trouver mon programme", other: "EN", skip: "Aller au contenu" },
    hero: { h1: "Prépa physique de haut niveau et adaptée, pour ta saison de handball", sub: "Des programmes conçus par Raphaël, entraîneur et préparateur physique. Chaque exercice est animé, chaque semaine est planifiée.", cta: "Voir les programmes", trust: "5 ans en structures de haut niveau", foot: "Une préparation physique de haut niveau et adaptée, pour tous. Par Raphaël, 5 ans en structures de haut niveau." },
    cmp: {
      title: "Choisis ta formule", sub: "Toute la saison en 3 parties qui s'enchaînent, ou une seule partie : les mêmes objectifs au choix.",
      heads: [["Pré-saison", "Juillet et août"], ["1re partie de saison", "Septembre à Noël"], ["2e partie de saison", "Janvier à juin"]],
      rows: [
        ["Objectif de la formule", "Arriver prêt à la reprise : 8 semaines de progression, jusqu'à l'affûtage", "Garder ce que l'été a construit, matchs et trêve compris", "Repartir fort en janvier et être au top pour les matchs décisifs"],
        ["Durée", "8 semaines", "18 semaines", "23 semaines"],
        ["Fréquence", "3 à 4 séances par semaine", "2 séances de 30 à 40 min par semaine", "2 séances de 30 à 40 min par semaine"],
      ],
      goalsLb: "Objectifs (toutes les formules) : 1 au choix, +5 € pour un 2e (Réathlétisation : en préparation)", priceLb: "Prix",
      runLb: "Option course à pied (toutes les formules)", run: "+9 € : des séances de course de 30 à 45 min",
      choose: ["Choisir la pré-saison", "Choisir la 1re partie", "Choisir la 2e partie"],
    },
    pick: {
      title: "Choisis tes objectifs", where: "Où en es-tu ?", moments: ["Avant la saison", "Septembre à Noël", "Janvier à juin"], goalLb: "Ton objectif (+5 € pour un 2e)", go: "Choisir ce programme", pickTwo: "Choisis 1 objectif (ou 2, +5 €).",
      names: ["Pré-saison", "1re partie de saison", "2e partie de saison"],
      meta: ["8 semaines, 3 à 4 séances par semaine", "18 semaines, 2 séances de 30 à 40 min par semaine", "23 semaines, 2 séances de 30 à 40 min par semaine"],
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
    title: "6M Lab | Animated physical preparation programs",
    desc: "Planned physical preparation programs, every exercise animated: handball-specific preparation, and soon fitness and well-being for everyone.",
    hb: { title: "Handball physical preparation: the whole season, July to June | 6M Lab", desc: "Physical training programs for handball players: pre-season, first and second half of the season, designed by Raphaël, 5 years in elite-level handball programs." },
    nav: { cmp: "Compare", goal: "Find my program", other: "FR", skip: "Skip to content" },
    hero: { h1: "Elite-level, tailored physical prep for your handball season", sub: "Programs built by Raphaël, coach and strength coach. Every exercise animated, every week planned.", cta: "See the programs", trust: "5 years in elite-level handball", foot: "Elite-level, tailored physical preparation, for everyone. By Raphaël, 5 years in elite-level handball programs." },
    cmp: {
      title: "Choose your program", sub: "The whole season in 3 linked parts, or a single part: same goals to choose from.",
      heads: [["Pre-season", "July and August"], ["First half of the season", "September to Christmas"], ["Second half of the season", "January to June"]],
      rows: [
        ["Focus", "Be ready for the restart: 8 weeks of progression, up to the taper", "Keep what the summer built, games and winter break included", "Come back strong in January and peak for the decisive games"],
        ["Duration", "8 weeks", "18 weeks", "23 weeks"],
        ["Frequency", "3 to 4 sessions per week", "2 sessions of 30 to 40 min per week", "2 sessions of 30 to 40 min per week"],
      ],
      goalsLb: "Goals (every program): pick 1, +€5 for a 2nd (return to play: coming soon)", priceLb: "Price",
      runLb: "Running option (every program)", run: "+€9: running sessions of 30 to 45 min",
      choose: ["Choose pre-season", "Choose the first half", "Choose the second half"],
    },
    pick: {
      title: "Pick your goals", where: "Where are you?", moments: ["Before the season", "September to Christmas", "January to June"], goalLb: "Your goal (+€5 for a 2nd)", go: "Choose this program", pickTwo: "Pick 1 goal (or 2, +€5).",
      names: ["Pre-season", "First half of the season", "Second half of the season"],
      meta: ["8 weeks, 3 to 4 sessions per week", "18 weeks, 2 sessions of 30 to 40 min per week", "23 weeks, 2 sessions of 30 to 40 min per week"],
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
