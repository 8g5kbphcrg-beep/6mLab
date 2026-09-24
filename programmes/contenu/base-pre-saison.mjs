// Base Pré-saison: the frame of the 8 weeks. The main blocks of each session come from the two
// goal sheets (objectif-*.pdf) chosen at checkout.
export default {
  title: "Pré-saison",
  tag: "Avant la saison",
  color: "#FF5A1F",
  subtitle: "8 semaines pour reprendre sur des bases solides et arriver en forme au premier entraînement collectif.",
  meta: [["Durée", "8 semaines"], ["Fréquence", "3 séances + 1 bonus"], ["Séance", "45 à 60 min"]],
  blocks: [
    { h2: "Avant de commencer" },
    { p: "Ce document est le **cadre** de ton programme : l'organisation de la semaine, l'échauffement, la structure des séances et la progression sur 8 semaines. Il va avec tes **deux fiches objectifs**, qui donnent le contenu des blocs principaux de chaque séance." },
    { table: { head: ["Tu as reçu", "À quoi ça sert"], rows: [
      ["Ce document (Pré-saison)", "Planning, échauffement, gainage, retour au calme, progression"],
      ["Fiche objectif n° 1", "Le bloc principal n° 1 de chaque séance"],
      ["Fiche objectif n° 2", "Le bloc principal n° 2 de chaque séance"],
      ["Fiche option course (si choisie)", "Tes séances de course, en plus"],
    ] } },
    { h3: "Matériel" },
    { p: "Rien d'obligatoire : tout peut se faire au poids du corps. Si tu as accès à une salle ou à un peu de matériel (haltères, élastique, banc), les fiches objectifs indiquent des variantes." },
    { h3: "Choisir ton niveau" },
    { table: { head: ["Niveau", "Pour qui", "Dans les séances"], rows: [
      ["Niveau 1", "Tu débutes : peu ou pas de préparation physique jusqu'ici", "Nombre de séries le plus bas, versions « plus facile »"],
      ["Niveau 2", "Tu as quelques bases : une saison de musculation ou de préparation", "Nombre de séries du milieu"],
      ["Niveau 3", "Tu as de l'expérience : plusieurs saisons d'entraînement régulier", "Nombre de séries le plus haut, versions avancées"],
    ] } },
    { p: "Dans les tableaux, « 2-4 × 8 » veut dire 2 séries (niveau 1), 3 séries (niveau 2) ou 4 séries (niveau 3) de 8 répétitions." },
    { h3: "Régler l'intensité : l'échelle d'effort" },
    { p: "Chaque exercice a une intensité cible notée sur 10. Elle se ressent : tu n'as besoin d'aucun appareil." },
    { table: { head: ["Note", "Ressenti", "Repère"], rows: [
      ["5-6", "Facile à modéré", "Tu pourrais encore faire 4 à 5 répétitions"],
      ["7-8", "Difficile mais contrôlé", "Il te reste 2 à 3 répétitions en réserve"],
      ["9", "Très difficile", "Plus qu'une répétition possible"],
      ["10", "Maximal", "À éviter dans ce programme"],
    ] } },
    { warn: "Douleur vive, articulation qui lâche, vertige : arrête l'exercice. Une gêne qui dure plus de 48 heures ou qui revient à chaque séance doit être vue par un professionnel de santé." },

    { h2: "Ta semaine type" },
    { p: "Chaque semaine compte **3 séances (A, B et C)**, plus une **séance D bonus** facultative, courte, centrée sur la prévention et la mobilité." },
    { table: { head: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], rows: [
      ["Séance A", "Repos ou club", "Séance B", "Repos ou club", "Séance D (bonus)", "Séance C", "Repos"],
    ] } },
    { p: "C'est un exemple : adapte-le à ton emploi du temps en respectant ces règles." },
    { ul: [
      "Au moins **48 heures** entre deux séances A, B ou C.",
      "Au moins **un jour de repos complet** par semaine.",
      "Pas de séance la veille d'un match amical ou d'un entraînement collectif très intense.",
      "Une séance ratée ne se rattrape pas en doublant : reprends simplement à la séance suivante.",
    ] },

    { h2: "Structure d'une séance" },
    { table: { head: ["Étape", "Durée", "Contenu"], rows: [
      ["1. Échauffement", "10-12 min", "Le même à chaque séance (page suivante)"],
      ["2. Bloc objectif n° 1", "15-20 min", "Ta fiche objectif n° 1, séance du jour (A, B ou C)"],
      ["3. Bloc objectif n° 2", "15-20 min", "Ta fiche objectif n° 2, séance du jour"],
      ["4. Gainage et prévention", "5-8 min", "Selon la séance (voir plus loin)"],
      ["5. Retour au calme", "5 min", "Marche et étirements légers"],
    ] } },
    { note: "**Dans quel ordre faire les deux blocs ?** Si l'un de tes objectifs est Explosivité ou Puissance, fais-le toujours en premier, quand tu as encore toute ton énergie. Sinon, alterne l'ordre d'une séance à l'autre." },

    { h2: "L'échauffement" },
    { p: "Identique à chaque séance. Il prépare le corps et réduit le risque de blessure : une grande étude menée dans 120 clubs de handball norvégiens a montré qu'un échauffement structuré de ce type divisait environ par deux les blessures du genou et de la cheville (Olsen et al., BMJ, 2005)." },
    { session: "Échauffement · 10 à 12 min", rows: [
      ["Course légère, pas chassés, montées de genoux, talons-fesses", "3 min en alternant", ""],
      ["Fente avant avec rotation du buste", "6 par côté", ""],
      ["Ouverture de hanche en marchant (« franchir une barrière »)", "8 par côté", ""],
      ["Pont fessier", "2 × 10", "15 s"],
      ["Planche sur les avant-bras", "2 × 20 s", "15 s"],
      ["Équilibre sur un pied (puis en bougeant les bras)", "2 × 20 s par jambe", ""],
      ["Petit saut sur place, réception stabilisée genoux dans l'axe", "2 × 5", "20 s"],
      ["Accélérations progressives sur 15 m (60 %, 80 %, 90 %)", "3 passages", "retour en marchant"],
    ] },
    { note: "**Réception stabilisée** : atterris en douceur sur l'avant du pied, genoux légèrement fléchis et alignés avec les orteils. Ils ne doivent jamais rentrer vers l'intérieur. Tiens la position 2 secondes." },

    { h2: "Gainage et prévention" },
    { p: "Un petit bloc en fin de séance, différent selon la séance. Il protège les zones les plus exposées au handball : genoux, chevilles, épaules, ischios et adducteurs." },
    { session: "Séance A", rows: [
      ["Planche frontale", "2-4 × 30 s", "30 s"],
      ["Gainage latéral", "2-3 × 20 s par côté", "20 s"],
      ["Nordic ischios (descente lente, retour aidé des mains)", "2-3 × 4", "60 s"],
    ] },
    { session: "Séance B", rows: [
      ["Dead bug (bras et jambe opposés)", "2-3 × 8 par côté", "30 s"],
      ["Y-T-W à plat ventre (épaules)", "2-3 × 8", "30 s"],
      ["Équilibre sur un pied en lançant une balle contre un mur", "2 × 30 s par jambe", "20 s"],
    ] },
    { session: "Séance C", rows: [
      ["Pont fessier sur une jambe", "2-3 × 10 par jambe", "30 s"],
      ["Gainage Copenhague (adducteurs), version genou", "2-3 × 15 s par côté", "30 s"],
      ["Rotation externe d'épaule avec élastique (ou sans)", "2-3 × 12 par bras", "30 s"],
    ] },
    { session: "Séance D (bonus, 20 min)", rows: [
      ["Échauffement complet", "10 min", ""],
      ["Le bloc gainage et prévention de la séance A", "1 tour", ""],
      ["Mobilité : hanches, chevilles, haut du dos", "5 min", ""],
    ] },

    { h2: "Retour au calme" },
    { p: "2 minutes de marche, puis des étirements légers de 20 à 30 secondes, sans forcer : fléchisseurs de hanche, quadriceps, ischios, mollets, pectoraux et épaules." },

    { pagebreak: true },
    { h2: "La progression sur 8 semaines" },
    { p: "Les fiches objectifs suivent ces 4 phases. Repère la semaine où tu en es, et prends les séances de la phase correspondante." },
    { table: { head: ["Semaine", "Phase", "Ce qu'on cherche", "Volume", "Effort"], rows: [
      ["1", "Bases", "Réhabituer le corps à l'effort, apprendre les gestes", "Faible", "5-6"],
      ["2", "Bases", "Idem, un peu plus de travail", "Faible à moyen", "6"],
      ["3", "Force", "Monter progressivement les charges", "Moyen", "7"],
      ["4", "Force", "Continuer la montée", "Moyen à élevé", "7-8"],
      ["5", "Force", "Semaine la plus chargée", "Élevé", "8"],
      ["6", "Explosivité", "Moins de volume, plus de vitesse", "Moyen", "7-8"],
      ["7", "Explosivité", "Qualité maximale de chaque répétition", "Moyen", "8"],
      ["8", "Affûtage", "Récupérer en gardant l'intensité", "Réduit de moitié", "6-7"],
    ] } },
    { note: "**Semaine 8 : moins, c'est mieux.** Fais la moitié des séries prévues, avec la même qualité. Tu aborderas la reprise avec ton club en pleine forme." },

    { h2: "Suivre tes séances" },
    { p: "Note chaque séance : c'est le meilleur moyen de progresser et de repérer la fatigue." },
    { table: { head: ["Date", "Séance", "Effort ressenti (/10)", "Forme du jour (/5)", "Gênes ou remarques"], rows: [
      [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "],
    ] } },
    { ul: [
      "Forme du jour à 1 ou 2 sur 5 deux séances de suite : allège (moins de séries) ou prends un jour de repos en plus.",
      "Tout est facile (effort à 5 alors que 7-8 est prévu) : prends le niveau au-dessus.",
    ] },

    { h2: "Et après ?" },
    { p: "À la fin des 8 semaines, la saison commence. Pour garder ce que tu as construit sans fatiguer tes jambes avant les matchs, tu peux enchaîner avec la formule **Maintien en saison** : 2 séances courtes par semaine." },
    { p: "Une question sur le programme ? Réponds simplement à l'email qui t'a envoyé ce document." },
  ],
};
