// The 5 goals. Session rows are [exercise id, dosage, rest, precision?]; "precision" is shown
// after the exercise name. Pré-saison: sessions A, B, C per phase (the taper week reuses the
// explosivity phase with half the sets). Maintien: sessions 1 and 2.
export const ordre = ["explosivite", "puissance", "muscle", "condition", "prevention"]; // block order in a session

export const objectifs = {
  explosivite: {
    name: "Explosivité",
    color: "#FFE14A",
    intro: "Au handball, les actions décisives durent moins de 3 secondes : un démarrage pour prendre l'intervalle, un changement de direction pour passer son vis-à-vis, un retour défensif.",
    qualites: ["**Vitesse** : aller vite sur quelques mètres.", "**Accélération** : atteindre ta vitesse le plus tôt possible.", "**Changements de direction et agilité** : freiner, réorienter et repartir sans perdre de temps."],
    regles: ["**Chaque répétition à fond**, ou presque : la qualité compte plus que la quantité.", "**Récupère complètement** entre les répétitions : c'est normal d'attendre.", "**Arrête la série** si tu ralentis ou si tes réceptions deviennent lourdes.", "Sol non glissant et chaussures qui tiennent bien le pied."],
    notes: [{ note: "Niveau 1 : pas plus de **60 sauts** par séance. Niveau 2 : 80. Niveau 3 : 100. Chaque réception compte pour un saut." }],
    phaseNotes: { force: "Explosivité : on entretient la vitesse et on affine la technique pendant que les charges montent ailleurs.", explo: "Explosivité : c'est la phase clé, chaque répétition à intensité maximale." },
    pre: {
      bases: { A: [["snap-down", "2-4 × 5", "45 s"], ["pogos", "2-3 × 10", "45 s"], ["accelerations", "4 passages", "retour en marchant", "15 m à 80 %"]], B: [["skater-hop", "2-3 × 4 par jambe", "45 s"], ["freinage", "3-5 passages", "60 s"], ["pogos", "2 × 10", "45 s"]], C: [["squat-jump", "2-3 × 5", "60 s"], ["departs-10", "4-6 passages", "60 s", "à 90 %"], ["snap-down", "2 × 5", "45 s"]] },
      force: { A: [["squat-jump", "3-4 × 5", "60 s"], ["departs-10", "5-6 passages", "75 s"], ["navette-5105", "2-4 passages", "90 s"]], B: [["bonds", "3-4 × 3", "75 s", "bonds horizontaux"], ["skater-hop", "3 × 5 par jambe", "45 s"], ["freinage", "4-6 passages", "60 s"]], C: [["pogos", "3 × 15", "45 s"], ["departs-reactifs", "6-8 passages", "60 s"], ["sprint-20", "3-4 passages", "2 min"]] },
      explo: { A: [["squat-jump", "3-4 × 4", "90 s", "hauteur maximale"], ["drop-jump", "3 × 4", "90 s", "niveaux 1 et 2 : squat jump"], ["sprint-20", "4-5 passages", "2 min"]], B: [["bonds", "3-4 × 3", "90 s", "triple bond"], ["skater-hop", "3 × 6 par jambe", "60 s", "enchaîné, sans pause"], ["navette-5105", "3-5 passages", "90 s"]], C: [["departs-reactifs", "6-10 passages", "60 s"], ["freinage", "4-6 passages", "75 s", "puis réaccélération sur 5 m"], ["pogos", "3 × 15", "45 s"]] },
    },
    affutage: "Pas de drop jump cette semaine.",
    maintien: { s1: [["squat-jump", "2-3 × 4", "75 s"], ["departs-10", "4-5 passages", "75 s"]], s2: [["pogos", "2 × 10", "45 s"], ["navette-5105", "3 passages", "90 s"], ["departs-reactifs", "4-6 passages", "60 s"]] },
  },

  puissance: {
    name: "Puissance",
    color: "#FFE14A",
    intro: "La puissance, c'est la force multipliée par la vitesse. Un tir en suspension, un duel au poste de pivot ou un démarrage demandent de produire beaucoup de force en une fraction de seconde.",
    qualites: ["**Pousser lourd** : augmenter la force maximale avec des charges lourdes et peu de répétitions.", "**Aller vite** : transformer cette force en gestes rapides (lancers, sauts, poussées).", "**Relier les deux** : enchaîner un exercice lourd et un geste rapide qui lui ressemble (méthode de contraste)."],
    regles: ["**Peu de répétitions, beaucoup de repos** : 3 à 5 répétitions, 2 à 3 minutes de récupération.", "**Chaque répétition à vitesse maximale**, même avec une charge lourde : c'est l'intention qui compte.", "Charges lourdes seulement si la technique est parfaite."],
    notes: [{ warn: "Pour les charges lourdes, fais-toi assister par une autre personne ou utilise une cage de sécurité. Sans matériel adapté, reste sur les versions au poids du corps." }, { note: "**Sans salle** : utilise un sac à dos lesté (livres, bouteilles), un ballon lesté ou un ballon de handball, et privilégie les variantes sur une jambe." }],
    phaseNotes: { bases: "Puissance : charges modérées pour apprendre les gestes, lancers légers.", force: "Puissance : c'est la phase où l'on pousse lourd, monte les charges chaque semaine.", explo: "Puissance : chaque série lourde est suivie tout de suite d'un geste explosif (contraste)." },
    pre: {
      bases: { A: [["squat", "2-3 × 6", "2 min", "charge modérée"], ["lancer-poitrine", "2-3 × 5", "60 s"]], B: [["hip-thrust", "2-3 × 8", "90 s"], ["lancer-rotation", "2 × 5 par côté", "60 s"]], C: [["developpe-couche", "2-3 × 6", "2 min"], ["box-jump", "2-3 × 4", "75 s"]] },
      force: { A: [["squat-lourd", "3-4 × 4-5", "3 min"], ["lancer-poitrine", "3 × 5", "75 s"]], B: [["hip-thrust-lourd", "3-4 × 5", "2 min"], ["tirage-lourd", "3 × 5", "2 min"], ["lancer-rotation", "3 × 4 par côté", "60 s"]], C: [["developpe-couche", "3-4 × 4-5", "3 min"], ["box-jump", "3 × 4", "90 s"]] },
      explo: { A: [["squat-lourd", "3 × 3", "enchaîner"], ["squat-jump-leste", "3 × 4", "3 min après la paire"]], B: [["developpe-couche", "3 × 3", "enchaîner"], ["pompes-explosives", "3 × 4", "3 min après la paire"]], C: [["lancer-haut", "3 × 4", "75 s"], ["lancer-rotation", "3 × 4 par côté", "75 s"], ["box-jump", "3 × 3", "90 s"]] },
    },
    affutage: "Mêmes charges, même vitesse.",
    maintien: { s1: [["squat-lourd", "2-3 × 3", "3 min", "ou hip thrust lourd"], ["lancer-rotation", "2 × 4 par côté", "60 s"]], s2: [["box-jump", "2-3 × 3", "90 s"], ["lancer-poitrine", "2-3 × 4", "60 s"]] },
  },

  muscle: {
    name: "Développement musculaire",
    color: "#FF5A1F",
    intro: "Au handball, on encaisse des contacts à chaque attaque et à chaque défense. Des muscles plus forts protègent les articulations et rendent plus difficile à déséquilibrer.",
    qualites: ["**Force** : pousser, tirer et soulever plus lourd.", "**Prise de masse** : développer le volume musculaire.", "**Gainage et stabilité** : transmettre la force des jambes au bras et rester stable dans les contacts."],
    regles: ["**La technique d'abord** : une charge n'augmente que si le mouvement reste propre.", "**Progresser un peu chaque semaine** : une répétition de plus, ou une charge un peu plus lourde.", "**Contrôler la descente** : 2 à 3 secondes pour descendre, puis remonter avec énergie.", "Garde 2 à 3 répétitions en réserve : pas d'échec musculaire."],
    notes: [{ note: "**Prise de masse** : l'entraînement donne le signal, mais les muscles se construisent avec l'alimentation et le sommeil. Mange suffisamment, avec des protéines à chaque repas, et dors 8 heures. Pour un suivi alimentaire, adresse-toi à un ou une diététicienne." }, { note: "**Sans matériel** : rends l'exercice plus dur en ralentissant la descente, en ajoutant un sac à dos lesté ou en passant à la variante sur une jambe." }],
    phaseNotes: { bases: "Développement musculaire : charges légères, apprentissage des gestes.", force: "Développement musculaire : c'est la phase clé, monte les charges chaque semaine. Si ton objectif est la prise de masse, fais 8 à 12 répétitions avec 60 à 90 s de repos.", explo: "Développement musculaire : moins de séries, charges toujours lourdes." },
    pre: {
      bases: { A: [["squat", "2-3 × 10", "75 s"], ["pompes", "2-3 × 10", "60 s"]], B: [["sdt-roumain", "2-3 × 10", "75 s"], ["rowing", "2-3 × 10", "60 s"], ["pallof", "2 × 10 par côté", "30 s"]], C: [["fente-arriere", "2-3 × 8 par jambe", "60 s"], ["developpe-militaire", "2-3 × 10", "60 s"]] },
      force: { A: [["squat", "3-4 × 6-8", "2 min"], ["pompes", "3-4 × 8", "90 s", "ou développé couché"], ["fermier", "3 × 20 m", "60 s"]], B: [["hip-thrust", "3-4 × 8", "90 s"], ["tractions", "3-4 × 6-8", "90 s", "ou rowing"], ["pallof", "3 × 10 par côté", "30 s"]], C: [["squat-bulgare", "3 × 8 par jambe", "90 s"], ["sdt-roumain", "3 × 8", "90 s"], ["developpe-militaire", "3 × 8", "75 s"]] },
      explo: { A: [["squat", "3 × 5", "2 min"], ["pompes", "3 × 8", "75 s"]], B: [["hip-thrust", "3 × 6", "90 s"], ["tractions", "3 × 6", "90 s", "ou rowing"]], C: [["fente-arriere", "3 × 6 par jambe", "90 s"], ["pallof", "2 × 10 par côté", "30 s"]] },
    },
    affutage: "Mêmes charges.",
    maintien: { s1: [["squat", "2-3 × 5-6", "2 min", "ou squat bulgare"], ["rowing", "2-3 × 6", "90 s", "ou tractions"], ["hip-thrust", "2 × 8", "75 s"]], s2: [["pompes", "2 × 8-10", "60 s"], ["pallof", "2 × 10 par côté", "30 s"], ["fermier", "2 × 20 m", "60 s"]] },
  },

  condition: {
    name: "Condition physique",
    color: "#00C2B2",
    intro: "Pendant un match, on parcourt en moyenne environ 4 km en alternant marche, course, sprints et contacts (Wagner et al., 2014). Ce qui fait la différence en fin de match, c'est la capacité à répéter les efforts intenses et à récupérer vite entre eux.",
    qualites: ["**Endurance** : la base qui permet de récupérer entre les actions.", "**Capacité à répéter les efforts** : enchaîner les sprints sans perdre de vitesse.", "**Perte de masse** : augmenter la dépense d'énergie tout en gardant la performance.", "**Condition physique générale** : tenir sur un match et sur une saison."],
    regles: ["**Progressif** : le volume augmente semaine après semaine, jamais d'un coup.", "**Respecte les allures** : facile = tu peux parler ; soutenu = quelques mots ; intense = impossible de parler.", "Sur les sprints répétés, arrête la série si ta vitesse chute nettement."],
    notes: [{ note: "**Perte de masse** : l'entraînement augmente la dépense d'énergie, mais le résultat dépend surtout de l'alimentation et du sommeil. Évite les régimes restrictifs, qui font baisser la performance. Pour un suivi, adresse-toi à un ou une diététicienne." }, { note: "Quand trois durées sont indiquées (« 12-15-18 min »), elles correspondent aux niveaux 1, 2 et 3." }],
    phaseNotes: { bases: "Condition physique : construire la base d'endurance, en douceur.", force: "Condition physique : on installe les intervalles.", explo: "Condition physique : des efforts courts et répétés, comme en match." },
    pre: {
      bases: { A: [["footing", "12-15-18 min", ""], ["montees-genoux", "4 × 15 m", "retour en marchant"]], B: [["circuit", "2-3 tours", "90 s entre les tours"]], C: [["footing", "10-12-15 min", ""], ["intervalles-1515", "4-5-6 min", "", "découverte"]] },
      force: { A: [["intervalles-1515", "2 × 6-7-8 min", "3 min entre les blocs"]], B: [["circuit", "3-4 tours", "90 s entre les tours"], ["navettes-hand", "4 × 30 s", "30 s"]], C: [["footing", "15-18-20 min", ""], ["intervalles-3030", "6-8-10 répétitions", ""]] },
      explo: { A: [["sprints-repetes", "2-3 séries", "3 min"]], B: [["intervalles-1515", "2 × 8 min", "3 min"]], C: [["navettes-hand", "6 × 30 s", "30 s"], ["footing", "10 min", "", "récupération"]] },
    },
    affutage: "Réduis de moitié la durée ou le nombre de séries, garde l'intensité.",
    maintien: { s1: [["intervalles-1515", "1-2 × 8 min", "3 min"]], s2: [["sprints-repetes", "1-2 séries", "3 min"], ["footing", "5-8 min", "", "récupération"]] },
  },

  prevention: {
    name: "Prévention & santé",
    color: "#00C2B2",
    intro: "Au handball, les blessures les plus fréquentes touchent les chevilles, les genoux, les épaules et les muscles de l'arrière et de l'intérieur de la cuisse. Des études montrent qu'une grande partie peut être évitée avec des exercices simples faits régulièrement : un échauffement ciblé a divisé environ par deux les blessures du genou et de la cheville (Olsen et al., 2005), et un programme pour l'épaule a réduit de 28 % les problèmes d'épaule (Andersson et al., 2017).",
    qualites: ["**Prévention des blessures** : équilibre, réception de saut, contrôle du genou.", "**Renforcement ciblé** : genoux, chevilles, épaules et ischios.", "**Mobilité et souplesse** : hanches, chevilles et haut du dos.", "**Stabilité articulaire** : garder les articulations alignées dans les contacts."],
    regles: ["**La régularité avant l'intensité** : c'est la répétition des séances qui protège.", "**Le geste parfait** : un genou qui rentre vers l'intérieur à la réception, c'est justement ce qu'on corrige.", "Ces exercices ne doivent pas faire mal : une gêne est un signal pour alléger."],
    notes: [{ warn: "Ces exercices préviennent les blessures, ils ne les soignent pas. Si tu as mal en ce moment, consulte un professionnel de santé avant de continuer." }],
    phaseNotes: { bases: "Prévention & santé : on apprend les gestes, variantes faciles.", force: "Prévention & santé : on passe aux variantes plus difficiles.", explo: "Prévention & santé : des exercices plus proches du jeu, avec ballon et dans toutes les directions." },
    pre: {
      bases: { A: [["equilibre", "2 × 30 s par jambe", "15 s", "yeux ouverts"], ["reception-unipodale", "2 × 5 par jambe", "30 s"], ["mollets-excentrique", "2 × 10", "30 s"]], B: [["rotation-externe", "2 × 12 par bras", "30 s"], ["ytw", "2 × 8", "30 s"]], C: [["hanches-9090", "2 × 8 par côté", ""], ["cheville-mur", "2 × 10 par côté", ""]] },
      force: { A: [["equilibre", "3 × 30 s par jambe", "15 s", "yeux fermés ou sur coussin"], ["squat-une-jambe", "2-3 × 8 par jambe", "45 s"], ["reception-unipodale", "3 × 5 par jambe", "30 s", "sur le côté"]], B: [["rotation-externe-haute", "3 × 10 par bras", "30 s"], ["pompes-scapulaires", "2-3 × 10", "30 s"]], C: [["rotation-thoracique", "2 × 8 par côté", ""], ["mollets-excentrique", "3 × 8 par jambe", "30 s", "sur une jambe"]] },
      explo: { A: [["reception-unipodale", "3 × 5 par jambe", "30 s", "en diagonale"], ["equilibre-balle", "3 × 30 s par jambe", "15 s"]], B: [["rotation-externe-haute", "3 × 12 par bras", "30 s"], ["pompes-scapulaires", "3 × 10", "30 s"]], C: [["hanches-9090", "2 × 8 par côté", ""], ["squat-une-jambe", "3 × 8 par jambe", "45 s"]] },
    },
    affutage: "Une série en moins sur chaque exercice.",
    maintien: { s1: [["squat-une-jambe", "2 × 8 par jambe", "45 s"], ["hanches-9090", "1 × 8 par côté", ""]], s2: [["rotation-externe-haute", "2 × 12 par bras", "30 s"], ["equilibre-balle", "2 × 30 s par jambe", "15 s"], ["cheville-mur", "1 × 8 par côté", ""]] },
  },
};
