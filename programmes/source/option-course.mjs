// Option course à pied: complementary running sessions of 30 to 45 min, for both formulas.
export default {
  title: "Option course à pied",
  tag: "Option",
  color: "#FF7A59",
  subtitle: "Des séances de course de 30 à 45 minutes, en plus de ton programme, pour développer ton foncier et ta capacité à enchaîner.",
  meta: [["Séance", "30 à 45 min"], ["Pré-saison", "1 à 2 par semaine"], ["En saison", "1 par semaine"]],
  blocks: [
    { h2: "À quoi sert cette option" },
    { p: "La course construit le « moteur » : un cœur et des muscles qui récupèrent plus vite entre deux actions. Ces séances complètent ton programme principal sans le remplacer." },
    { h3: "Où les placer dans ta semaine" },
    { ul: [
      "**Pré-saison** : 1 séance par semaine au niveau 1, 2 séances aux niveaux 2 et 3. Un jour sans séance A, B ou C, ou le même jour au moins 6 heures après.",
      "**En saison** : 1 séance par semaine, au moins 3 jours avant le match. Si tu as déjà beaucoup couru à l'entraînement ou en match, remplace-la par un footing facile de 25 minutes.",
      "Jamais deux séances intenses (intervalles, côtes) deux jours de suite.",
    ] },
    { h3: "Régler l'allure sans montre" },
    { table: { head: ["Zone", "Repère", "Utilisée pour"], rows: [
      ["Facile", "Tu peux tenir une conversation", "Échauffement, footing, récupération"],
      ["Soutenue", "Tu peux dire quelques mots, pas des phrases", "Tempo, intervalles longs"],
      ["Intense", "Impossible de parler", "Intervalles courts, côtes"],
    ] } },
    { h3: "Chaque séance" },
    { table: { head: ["Étape", "Durée"], rows: [
      ["Échauffement : footing facile, puis 3 accélérations progressives", "10 min"],
      ["Corps de séance", "15 à 25 min"],
      ["Retour au calme : footing très lent ou marche, étirements légers", "5 à 10 min"],
    ] } },
    { note: "**Chaussures** : des chaussures de running, pas tes chaussures de salle. Sur route ou sur chemin, évite les chaussures à semelle plate." },

    { pagebreak: true },
    { h2: "Les séances types" },
    { exercise: "Footing progressif", how: "Course continue, qui commence en zone facile et finit, sur les 5 dernières minutes, en zone soutenue.", cues: "Démarre plus lentement que tu ne le penses." },
    { exercise: "Fartlek", how: "Course continue avec des accélérations libres : par exemple 1 minute soutenue, 2 minutes faciles, à répéter.", cues: "Le rythme change, mais tu ne t'arrêtes jamais." },
    { exercise: "Tempo", how: "Un bloc continu en zone soutenue, à allure régulière.", cues: "Tu dois pouvoir tenir la même allure jusqu'au bout." },
    { exercise: "Intervalles longs", how: "Répétitions de 2 à 3 minutes en zone soutenue à intense, avec 1 minute 30 de récupération en trottinant.", cues: "Même allure sur toutes les répétitions." },
    { exercise: "Intervalles courts 30-30", how: "30 secondes rapides, 30 secondes de trot, en continu.", cues: "Rapide mais pas un sprint : tu dois tenir toutes les répétitions." },
    { exercise: "Côtes", how: "Montée rapide de 15 à 20 secondes dans une côte, retour en marchant.", cues: "Petits pas rapides, buste légèrement penché, bras actifs." },

    { h2: "Pré-saison : ton plan sur 8 semaines" },
    { p: "Au niveau 1, fais seulement la séance 1 de chaque semaine. Aux niveaux 2 et 3, fais les deux." },
    { table: { head: ["Semaines", "Séance 1", "Séance 2 (niveaux 2 et 3)"], rows: [
      ["1-2", "Footing facile 25-30 min", "Footing progressif 30 min"],
      ["3", "Fartlek 30 min (1 min soutenue / 2 min facile)", "Footing facile 35 min"],
      ["4", "Intervalles longs : 4 × 2 min", "Footing progressif 35 min"],
      ["5", "Intervalles longs : 5 × 2 min 30", "Tempo : 2 × 8 min, 2 min de trot entre"],
      ["6", "Intervalles courts : 2 × 8 min de 30-30", "Côtes : 8 × 15 s"],
      ["7", "Intervalles courts : 2 × 10 min de 30-30", "Côtes : 10 × 20 s"],
      ["8", "Footing facile 25 min + 4 accélérations", "Repos"],
    ] } },
    { p: "Les durées indiquées sont celles du corps de séance, sans l'échauffement ni le retour au calme. Au total, une séance dure entre 30 et 45 minutes." },

    { h2: "En saison : ton plan sur 12 semaines" },
    { p: "Une séance par semaine, qui tourne sur 4 semaines. Recommence le cycle aux semaines 5 et 9." },
    { table: { head: ["Semaine du cycle", "Séance"], rows: [
      ["1", "Fartlek 25 min"],
      ["2", "Intervalles longs : 4 × 2 min"],
      ["3", "Intervalles courts : 2 × 6 min de 30-30"],
      ["4 (allégée)", "Footing facile 25 min"],
    ] } },
    { warn: "Douleur au tibia, au genou ou au talon qui augmente pendant la course : arrête la séance. Une douleur qui revient à chaque sortie doit être vue par un professionnel de santé." },
    { p: "Une question sur le programme ? Réponds simplement à l'email qui t'a envoyé ce document." },
  ],
};
