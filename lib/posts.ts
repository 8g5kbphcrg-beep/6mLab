export type Block = { h: string } | { p: string } | { ul: string[] };
// A study post summarises one published paper in our own words and links to the original.
export type Source = { cite: string; url: string; access: string };
export type Post = { slug: string; title: string; desc: string; date: string; body: Block[]; source?: Source };

export const posts: Post[] = [
  {
    slug: "etude-echauffement-blessures-genou-cheville",
    title: "Étude : un échauffement structuré divise par deux les blessures du genou et de la cheville",
    desc: "Une étude menée dans 120 clubs de handball norvégiens montre qu'un échauffement ciblé réduit fortement les blessures aux membres inférieurs.",
    date: "2026-09-23",
    source: {
      cite: "Olsen O-E, Myklebust G, Engebretsen L, Holme I, Bahr R. Exercises to prevent lower limb injuries in youth sports: cluster randomised controlled trial. BMJ. 2005;330(7489):449.",
      url: "https://doi.org/10.1136/bmj.38330.632801.8F",
      access: "Article en libre accès sur le site du BMJ.",
    },
    body: [
      { p: "Les entorses de la cheville et les blessures du genou, notamment du ligament croisé, font partie des blessures les plus fréquentes au handball. Une équipe du centre de recherche sur les traumatismes sportifs d'Oslo a voulu savoir si un simple échauffement pouvait les éviter." },
      { h: "Ce que les chercheurs ont fait" },
      { p: "L'étude a suivi 1 837 jeunes de 15 à 17 ans, licenciés dans 120 clubs de handball en Norvège, pendant une saison entière (8 mois). La moitié des clubs a remplacé son échauffement habituel par un programme structuré. L'autre moitié a continué comme avant, pour servir de comparaison." },
      { p: "Le programme se faisait en début d'entraînement et combinait :" },
      { ul: ["des exercices de course et de changements de direction", "des exercices d'équilibre, sur tapis ou plateau instable", "un travail sur la réception des sauts, genoux dans l'axe", "du renforcement des jambes et des exercices d'explosivité"] },
      { h: "Les résultats" },
      { p: "Dans les clubs qui ont suivi le programme, les blessures aiguës du genou et de la cheville ont été environ deux fois moins nombreuses que dans les autres clubs. Selon les auteurs, un échauffement qui apprend à mieux contrôler le genou et la cheville lors des réceptions et des pivots pourrait diviser par deux ces blessures chez les jeunes sportifs et sportives." },
      { h: "Ce qu'on en retient" },
      { ul: ["L'échauffement n'est pas une formalité : c'est le meilleur moment pour prévenir les blessures.", "Quelques exercices d'équilibre et de réception, répétés à chaque séance, suffisent à faire la différence.", "C'est pour cela que nos programmes intègrent un travail d'appuis et de réception dès les premières semaines."] },
    ],
  },
  {
    slug: "etude-prevention-epaule-handball",
    title: "Étude : 3 séances d'exercices par semaine pour protéger l'épaule des handballeurs et handballeuses",
    desc: "Un programme de prévention testé sur 660 joueurs et joueuses de haut niveau réduit les problèmes d'épaule de 28 %.",
    date: "2026-09-23",
    source: {
      cite: "Andersson SH, Bahr R, Clarsen B, Myklebust G. Preventing overuse shoulder injuries among throwing athletes: a cluster-randomised controlled trial in 660 elite handball players. British Journal of Sports Medicine. 2017;51(14):1073-1080.",
      url: "https://doi.org/10.1136/bjsports-2016-096226",
      access: "Article en accès gratuit, également disponible sur le site du centre de recherche OSTRC.",
    },
    body: [
      { p: "Au handball, on arme et on tire des centaines de fois par semaine. Résultat : les douleurs d'épaule dues à la répétition des tirs sont très courantes, y compris chez les meilleurs. Une étude norvégienne a testé un programme d'exercices pour les prévenir." },
      { h: "Ce que les chercheurs ont fait" },
      { p: "660 joueurs et joueuses de première division, répartis dans 45 équipes (22 équipes féminines et 23 masculines), ont été suivis pendant une saison de 7 mois. La moitié des équipes a ajouté à son échauffement un programme de prévention de l'épaule, 3 fois par semaine. Les autres équipes ont gardé leur échauffement habituel." },
      { p: "Le programme visait à :" },
      { ul: ["améliorer la rotation interne de l'épaule", "renforcer les muscles qui font tourner l'épaule vers l'extérieur", "renforcer les muscles de l'omoplate", "travailler la mobilité du haut du dos et l'enchaînement des mouvements des jambes jusqu'au bras"] },
      { h: "Les résultats" },
      { p: "Dans les équipes qui ont suivi le programme, le risque d'avoir des problèmes d'épaule pendant la saison était 28 % plus faible. Les auteurs recommandent donc d'intégrer ce type d'exercices à l'échauffement." },
      { h: "Ce qu'on en retient" },
      { ul: ["Quelques minutes, trois fois par semaine, suffisent.", "Le travail avec un élastique et le renforcement de l'omoplate sont au cœur de la prévention.", "Pour démarrer, tu peux t'appuyer sur notre article : 4 exercices simples pour protéger les épaules."] },
    ],
  },
  {
    slug: "etude-exigences-physiques-handball",
    title: "Étude : ce que le handball demande vraiment au corps",
    desc: "Une revue scientifique fait le point sur les qualités physiques et mentales qui font la performance au handball.",
    date: "2026-09-23",
    source: {
      cite: "Wagner H, Finkenzeller T, Würth S, von Duvillard SP. Individual and team performance in team-handball: a review. Journal of Sports Science and Medicine. 2014;13(4):808-816.",
      url: "https://www.jssm.org/volume13/iss4/cap/jssm-13-808.pdf",
      access: "Article en libre accès sur le site du Journal of Sports Science and Medicine.",
    },
    body: [
      { p: "Pour bien se préparer, il faut savoir à quoi on se prépare. Des chercheurs des universités de Salzbourg (Autriche) et du Delaware (États-Unis) ont rassemblé les études disponibles pour décrire ce qui fait la performance au handball." },
      { h: "Un sport d'efforts courts et répétés" },
      { p: "Pendant un match, chaque personne sur le terrain parcourt en moyenne environ 4 km, entre 2 et 5 km selon le poste. Mais ce n'est pas la distance qui compte le plus : c'est l'alternance constante entre marche, course, sprints, sauts, changements de direction et contacts avec l'adversaire." },
      { h: "Les qualités qui font la différence" },
      { p: "La revue identifie plusieurs familles de qualités, qui se combinent :" },
      { ul: ["l'endurance, pour répéter les efforts intenses jusqu'à la fin du match", "la force et la puissance, pour les duels, les sauts et la vitesse de tir", "la vitesse et l'agilité, pour les démarrages et les changements de direction", "la coordination et la technique", "les qualités mentales et la lecture du jeu"] },
      { h: "Ce qu'on en retient" },
      { ul: ["Courir longtemps à allure régulière ne suffit pas : il faut s'entraîner à répéter des efforts courts et intenses.", "La force et l'explosivité sont aussi importantes que le cardio.", "C'est pour cela que nos programmes combinent deux objectifs, par exemple développement musculaire et explosivité, ou condition physique et puissance."] },
    ],
  },
  {
    slug: "reprise-preparation-physique-handball",
    title: "Bien reprendre la préparation physique au handball après l'été",
    desc: "Comment reprendre progressivement après la coupure estivale et arriver en forme au premier entraînement collectif.",
    date: "2026-09-21",
    body: [
      { p: "Après plusieurs semaines sans handball, le corps a perdu un peu de forme, et la tentation est grande de tout reprendre à pleine intensité dès la première semaine. C'est souvent là que les petites blessures arrivent. Une reprise progressive vaut mieux qu'un départ trop rapide." },
      { h: "Commence par le général" },
      { p: "Pendant les deux premières semaines, l'objectif est de réhabituer le corps à l'effort : footing léger ou vélo, gainage, squats et fentes au poids du corps, et de la mobilité pour les épaules, les hanches et les chevilles. Deux à trois séances courtes suffisent." },
      { h: "Monte l'intensité par paliers" },
      { p: "Ensuite, ajoute progressivement de la force (charges légères puis plus lourdes), des sauts et des accélérations courtes. Le handball est un sport de sprints, de sauts et de changements de direction : ton travail doit s'en rapprocher au fil des semaines." },
      { h: "Trois erreurs à éviter" },
      { ul: ["Enchaîner des séances intenses sans jour de récupération.", "Négliger l'échauffement, surtout pour les épaules et les chevilles.", "Vouloir rattraper en une semaine ce qui a été perdu en un mois."] },
      { p: "Une préparation de plusieurs semaines, structurée en phases, te laisse le temps de progresser sans forcer. C'est le principe de la formule Pré-saison de 6M Lab." },
    ],
  },
  {
    slug: "epaules-handball-4-exercices-prevention",
    title: "Handball : 4 exercices simples pour protéger tes épaules",
    desc: "Quatre exercices avec élastique et poids du corps à intégrer à ton échauffement pour préparer les épaules aux tirs répétés.",
    date: "2026-09-21",
    body: [
      { p: "Les tirs répétés sollicitent fortement l'épaule. Renforcer les muscles qui la stabilisent fait partie d'une bonne préparation. Voici quatre exercices simples, à faire avec un élastique de résistance légère ou au poids du corps." },
      { h: "1. Rotation externe avec élastique" },
      { p: "Coude collé au corps et plié à 90°, tire l'élastique vers l'extérieur sans bouger le buste, puis reviens lentement. 2 séries de 12 à 15 répétitions par bras." },
      { h: "2. Écarté d'élastique" },
      { p: "Bras tendus devant toi, écarte l'élastique en rapprochant les omoplates. 2 séries de 12 à 15 répétitions." },
      { h: "3. Pompes scapulaires" },
      { p: "En position de pompe, bras tendus, rapproche puis écarte les omoplates sans plier les coudes. 2 séries de 10 répétitions." },
      { h: "4. Gainage latéral" },
      { p: "Appui sur l'avant-bras, corps aligné, tiens 20 à 30 secondes de chaque côté, 2 à 3 fois." },
      { h: "Comment les intégrer" },
      { p: "Fais-les 2 à 3 fois par semaine, dans ton échauffement ou avant les séances de tirs, avec une charge légère et un mouvement lent et contrôlé." },
      { p: "Ces conseils sont généraux et ne remplacent pas l'avis d'un professionnel de santé. En cas de douleur à l'épaule, arrête-toi et consulte." },
    ],
  },
  {
    slug: "garder-la-forme-en-saison-handball",
    title: "Comment garder la forme en pleine saison de handball",
    desc: "Deux séances courtes par semaine pour conserver ta force et ta vivacité sans te fatiguer avant les matchs.",
    date: "2026-09-21",
    body: [
      { p: "Entre les entraînements de club et les matchs, la préparation physique passe souvent à la trappe. Pourtant, la condition acquise en pré-saison peut s'estomper si elle n'est plus entretenue." },
      { h: "Peu, mais régulier" },
      { p: "Deux séances de 30 à 40 minutes par semaine suffisent pour entretenir la force et l'explosivité, à condition de les faire régulièrement." },
      { h: "Place-les intelligemment" },
      { ul: ["Évite les séances éprouvantes la veille d'un match.", "Place-les après les jours les plus chargés du club, pas avant.", "Garde une séance plus dynamique (sauts, accélérations) et une plus axée sur la force."] },
      { h: "Écoute ta fatigue" },
      { p: "Si tu es plus fatigué que d'habitude, réduis le volume plutôt que de supprimer la séance. Un peu de mobilité et de gainage valent mieux que rien." },
      { p: "C'est le principe de la formule Maintien en saison de 6M Lab : 12 semaines, 2 séances courtes, pensées pour ne pas te fatiguer avant les matchs." },
    ],
  },
];

// About 200 words per minute.
export const readTime = (p: Post) =>
  Math.max(1, Math.round(p.body.map((b) => ("h" in b ? b.h : "p" in b ? b.p : b.ul.join(" "))).join(" ").split(/\s+/).length / 200));
