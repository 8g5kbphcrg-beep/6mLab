// Base Maintien en saison: the frame of the 12 weeks. The main blocks of each session come from
// the two goal sheets (objectif-*.pdf) chosen at checkout.
export default {
  title: "Maintien en saison",
  tag: "Pendant la saison",
  color: "#00C2B2",
  subtitle: "12 semaines pour garder ta force et ta vivacité toute la saison, sans empiéter sur tes entraînements ni tes matchs.",
  meta: [["Durée", "12 semaines"], ["Fréquence", "2 séances par semaine"], ["Séance", "30 à 40 min"]],
  blocks: [
    { h2: "Avant de commencer" },
    { p: "Pendant la saison, ton club s'occupe déjà d'une grande partie de ta charge d'entraînement. Le but de ce programme n'est pas d'en rajouter, mais d'**entretenir** ce que tu as construit : sans travail complémentaire, la force et l'explosivité baissent au fil des semaines de compétition." },
    { p: "Ce document est le **cadre** : l'organisation de la semaine autour des matchs, l'échauffement, la structure des séances et la progression. Il va avec tes **deux fiches objectifs**, qui donnent le contenu des blocs principaux." },
    { table: { head: ["Tu as reçu", "À quoi ça sert"], rows: [
      ["Ce document (Maintien en saison)", "Planning, échauffement, gainage, retour au calme, progression"],
      ["Fiche objectif n° 1", "Le bloc principal n° 1 de chaque séance (partie « Maintien en saison »)"],
      ["Fiche objectif n° 2", "Le bloc principal n° 2 de chaque séance (partie « Maintien en saison »)"],
      ["Fiche option course (si choisie)", "Ta séance de course, en plus"],
    ] } },
    { h3: "Matériel" },
    { p: "Rien d'obligatoire : tout peut se faire au poids du corps. Les fiches objectifs indiquent des variantes si tu as accès à une salle ou à un peu de matériel." },
    { h3: "Choisir ton niveau" },
    { table: { head: ["Niveau", "Pour qui", "Dans les séances"], rows: [
      ["Niveau 1", "Tu débutes : peu ou pas de préparation physique jusqu'ici", "Nombre de séries le plus bas, versions « plus facile »"],
      ["Niveau 2", "Tu as quelques bases : une saison de musculation ou de préparation", "Nombre de séries du milieu"],
      ["Niveau 3", "Tu as de l'expérience : plusieurs saisons d'entraînement régulier", "Nombre de séries le plus haut, versions avancées"],
    ] } },
    { p: "Dans les tableaux, « 2-3 × 6 » veut dire 2 séries (niveau 1 et 2) ou 3 séries (niveau 3) de 6 répétitions. Quand trois nombres sont indiqués (« 1-3 »), ils correspondent aux niveaux 1, 2 et 3." },
    { h3: "Régler l'intensité : l'échelle d'effort" },
    { table: { head: ["Note", "Ressenti", "Repère"], rows: [
      ["5-6", "Facile à modéré", "Tu pourrais encore faire 4 à 5 répétitions"],
      ["7-8", "Difficile mais contrôlé", "Il te reste 2 à 3 répétitions en réserve"],
      ["9-10", "Très difficile à maximal", "À éviter pendant la saison"],
    ] } },
    { warn: "Douleur vive, articulation qui lâche, vertige : arrête l'exercice. Une gêne qui dure plus de 48 heures ou qui revient à chaque séance doit être vue par un professionnel de santé." },

    { h2: "Ta semaine autour du match" },
    { p: "Tes 2 séances se placent **loin du match** : la séance 1 (la plus exigeante) au moins 3 jours avant, la séance 2 (plus légère) au plus tard 2 jours avant. Jamais la veille d'un match." },
    { h3: "Match le samedi" },
    { table: { head: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"], rows: [
      ["Repos", "Séance 1", "Club", "Séance 2", "Club", "Repos ou club léger", "MATCH"],
    ] } },
    { h3: "Match le dimanche" },
    { table: { head: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"], rows: [
      ["Repos", "Séance 1", "Club", "Séance 2", "Club", "Repos", "MATCH"],
    ] } },
    { p: "Si ton club s'entraîne d'autres jours, garde ces règles :" },
    { ul: [
      "La séance 1 peut se faire le même jour qu'un entraînement de club, idéalement le matin ou en fin de séance, si tu te sens bien.",
      "**Semaine avec deux matchs** : fais seulement la séance 2, en version courte.",
      "**Grosse fatigue ou petite blessure** : saute la séance, la saison est longue.",
      "Pas de match ce week-end : fais les deux séances normalement, c'est même l'occasion d'en profiter.",
    ] },

    { h2: "Structure d'une séance" },
    { table: { head: ["Étape", "Durée", "Contenu"], rows: [
      ["1. Échauffement", "8 min", "Le même à chaque séance (ci-dessous)"],
      ["2. Bloc objectif n° 1", "10-12 min", "Ta fiche objectif n° 1, séance du jour (1 ou 2)"],
      ["3. Bloc objectif n° 2", "10-12 min", "Ta fiche objectif n° 2, séance du jour"],
      ["4. Gainage et prévention", "5 min", "Selon la séance (voir plus loin)"],
      ["5. Retour au calme", "3-5 min", "Marche et étirements légers"],
    ] } },
    { note: "**Dans quel ordre ?** Si l'un de tes objectifs est Explosivité ou Puissance, fais-le toujours en premier, quand tu as encore toute ton énergie." },

    { h2: "L'échauffement" },
    { session: "Échauffement · 8 min", rows: [
      ["Course légère, pas chassés, montées de genoux", "2 min", ""],
      ["Fente avant avec rotation du buste", "5 par côté", ""],
      ["Pont fessier", "1 × 10", ""],
      ["Planche sur les avant-bras", "1 × 20 s", ""],
      ["Équilibre sur un pied en bougeant les bras", "20 s par jambe", ""],
      ["Petit saut sur place, réception stabilisée genoux dans l'axe", "1 × 5", ""],
      ["Accélérations progressives sur 15 m (70 %, 85 %)", "2 passages", "retour en marchant"],
    ] },

    { h2: "Gainage et prévention" },
    { session: "Séance 1", rows: [
      ["Nordic ischios (descente lente, retour aidé des mains)", "2 × 3-5", "60 s"],
      ["Gainage Copenhague (adducteurs), version genou", "2 × 15 s par côté", "30 s"],
      ["Planche frontale", "1-2 × 30 s", "30 s"],
    ] },
    { session: "Séance 2", rows: [
      ["Rotation externe d'épaule avec élastique (ou sans)", "2 × 12 par bras", "30 s"],
      ["Y-T-W à plat ventre", "2 × 8", "30 s"],
      ["Équilibre sur un pied en lançant une balle contre un mur", "2 × 20 s par jambe", "20 s"],
    ] },
    { note: "Ces exercices ciblent les épaules, les ischios et les adducteurs, très sollicités au handball. Une étude sur 660 joueurs et joueuses de haut niveau a montré qu'un programme de prévention de l'épaule fait 3 fois par semaine réduisait les problèmes d'épaule de 28 % (Andersson et al., BJSM, 2017)." },

    { h2: "Retour au calme" },
    { p: "2 minutes de marche, puis des étirements légers de 20 à 30 secondes, sans forcer : fléchisseurs de hanche, quadriceps, ischios, mollets, pectoraux et épaules." },

    { h2: "La progression sur 12 semaines" },
    { p: "Les 12 semaines sont découpées en 3 blocs de 4 semaines. La dernière semaine de chaque bloc est **allégée** pour récupérer : tu enchaînes les matchs, ton corps en a besoin." },
    { table: { head: ["Semaines", "Bloc", "Ce qu'on cherche", "Volume", "Effort"], rows: [
      ["1 à 3", "Bloc 1", "Installer la routine, reprendre les gestes", "Normal", "7"],
      ["4", "Allégée", "Récupérer", "Une série en moins partout", "6"],
      ["5 à 7", "Bloc 2", "Entretenir, un peu plus d'intensité", "Normal", "7-8"],
      ["8", "Allégée", "Récupérer", "Une série en moins partout", "6"],
      ["9 à 11", "Bloc 3", "Garder le niveau jusqu'à la fin de la phase", "Normal", "7-8"],
      ["12", "Allégée", "Récupérer avant le cycle suivant", "Une série en moins partout", "6"],
    ] } },
    { note: "**Règle d'or en saison** : en cas de doute entre faire plus ou faire moins, fais moins. Arriver en forme au match compte plus que la séance." },

    { h2: "Suivre tes séances" },
    { table: { head: ["Date", "Séance", "Jours avant le match", "Effort ressenti (/10)", "Forme du jour (/5)"], rows: [
      [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "], [" ", " ", " ", " ", " "],
    ] } },
    { ul: [
      "Forme du jour à 1 ou 2 sur 5 : fais seulement le gainage et la mobilité, ou repose-toi.",
      "Jambes lourdes le jour du match deux semaines de suite : décale la séance 1 un jour plus tôt, ou retire une série.",
    ] },

    { h2: "Et après ?" },
    { p: "Le programme est conçu pour être reconduit : à la fin des 12 semaines, recommence au bloc 1 en prenant le niveau au-dessus si tout t'a semblé facile. Pendant la trêve, tu peux reprendre la formule **Pré-saison** pour repartir sur de nouvelles bases." },
    { p: "Une question sur le programme ? Réponds simplement à l'email qui t'a envoyé ce document." },
  ],
};
