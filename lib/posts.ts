export type Block = { h: string } | { p: string } | { ul: string[] };
export type Post = { slug: string; title: string; desc: string; date: string; body: Block[] };

export const posts: Post[] = [
  {
    slug: "reprise-preparation-physique-handball",
    title: "Bien reprendre la préparation physique au handball après l'été",
    desc: "Comment reprendre progressivement après la coupure estivale et arriver prêt au premier entraînement collectif.",
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
