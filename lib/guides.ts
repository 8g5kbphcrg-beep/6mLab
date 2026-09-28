import type { Block, Theme } from "@/lib/posts";
import type { ProgramSlug } from "@/lib/programs";

// Guides: one page per important search ("préparation physique handball pré-saison"…), for
// search engines and readers alike. Each one answers the question in full, shows the exercises,
// has its own FAQ (FAQPage data) and leads to the matching program or to the Clubs page.
// French only, like the advice articles (app/[lang]/guides/[slug]).
export type Guide = {
  slug: string;
  theme: Theme;
  title: string;
  metaTitle: string;
  desc: string;
  brief: string;
  body: Block[];
  exos: string[];
  faq: { q: string; a: string }[];
  next: ProgramSlug | "clubs";
  articles: string[];
};

export const guides: Guide[] = [
  {
    slug: "preparation-physique-handball-pre-saison",
    theme: "reprise",
    title: "Préparation physique handball : réussir sa pré-saison",
    metaTitle: "Préparation physique handball pré-saison : le guide complet | 6M Lab",
    desc: "Combien de semaines, quoi travailler et dans quel ordre : le guide pour préparer sa saison de handball sans se blesser, semaine par semaine.",
    brief: "Une bonne pré-saison dure 6 à 8 semaines. Elle commence par le général (endurance, gainage, gestes), monte en charge, puis se rapproche du handball (vitesse, sauts, changements de direction) avant une semaine plus légère.",
    body: [
      { p: "La pré-saison, ce sont les semaines qui précèdent la reprise avec ton club et les premiers matchs. C'est le moment où l'on construit la condition physique de toute la saison. Bien menée, elle te fait arriver en forme dès le premier entraînement collectif ; mal menée, elle fait partie des périodes où les blessures sont les plus fréquentes." },
      { h: "Combien de temps faut-il ?" },
      { p: "Compte 6 à 8 semaines. En dessous, on a tendance à tout faire trop vite ; au-delà, on risque de s'user avant même le début du championnat. Pour une saison qui commence début septembre, cela revient à démarrer en juillet, après une vraie coupure de 2 à 4 semaines en fin de saison." },
      { h: "Ce qu'il faut travailler" },
      { p: "Le handball demande de tout : des sprints courts et répétés, des sauts, des changements de direction, des duels, des tirs. La préparation couvre donc plusieurs qualités :" },
      { ul: ["L'endurance, pour répéter les efforts : footing au début, puis courses intermittentes (15 secondes vite, 15 secondes lentement).", "La force, pour protéger les articulations et gagner les duels : squats, fentes, pont fessier, gainage.", "L'explosivité : sauts, accélérations, changements de direction.", "La prévention : équilibre, réceptions de sauts genou dans l'axe, épaules, ischio-jambiers."] },
      { h: "Dans quel ordre ?" },
      { ul: ["Semaines 1 et 2, la mise en route : réhabituer le corps à l'effort, apprendre les gestes, effort modéré.", "Semaines 3 à 5, la montée en charge : plus de volume, plus de force, les courses se durcissent.", "Semaines 6 et 7, l'intensité : moins de volume, plus de vitesse et de puissance, des efforts proches du match.", "Semaine 8, l'affûtage : une semaine plus légère pour arriver frais à la reprise."] },
      { h: "Combien de séances par semaine ?" },
      { p: "3 à 4 séances de 45 minutes à 1 heure, avec au moins un jour de récupération entre deux séances intenses. Une séance type commence par un échauffement complet, enchaîne le travail d'appuis et d'explosivité quand tu es encore frais, puis la force, et finit par la course." },
      { h: "Les erreurs les plus fréquentes" },
      { ul: ["Reprendre directement à fond, pour « rattraper » les vacances.", "Ne faire que courir : l'endurance seule ne prépare ni aux sauts ni aux duels.", "Oublier la prévention : c'est pourtant le meilleur moment pour la mettre en place.", "Enchaîner les séances intenses sans récupération."] },
      { p: "Le programme Pré-saison de 6M Lab suit exactement cette logique : 8 semaines planifiées, construites autour des objectifs que tu choisis, avec chaque exercice animé." },
    ],
    exos: ["squat", "fente-arriere", "saut-reception", "departs-10"],
    faq: [
      { q: "Quand commencer la préparation physique avant la saison de handball ?", a: "Environ 8 semaines avant le premier match, après 2 à 4 semaines de coupure en fin de saison. Pour une saison qui démarre début septembre, cela revient à commencer en juillet." },
      { q: "Combien de séances par semaine en pré-saison ?", a: "3 à 4 séances, en gardant au moins un jour de récupération entre deux séances intenses. Pendant la dernière semaine, on allège pour arriver frais." },
      { q: "Faut-il seulement courir pour se préparer ?", a: "Non. La course prépare l'endurance, mais le handball demande aussi de la force, des sauts, des changements de direction et des épaules solides. Une bonne préparation combine tout cela." },
      { q: "Peut-on faire sa pré-saison à la maison ?", a: "Oui. Le poids du corps, un élastique et quelques objets du quotidien suffisent pour une préparation complète, avec des exercices adaptés au lieu." },
    ],
    next: "pre-saison",
    articles: ["reprise-preparation-physique-handball", "etude-exigences-physiques-handball", "etude-echauffement-blessures-genou-cheville"],
  },
  {
    slug: "preparation-physique-gardien-de-but-handball",
    theme: "performance",
    title: "Préparation physique du gardien de but de handball",
    metaTitle: "Préparation physique gardien de but handball : exercices et conseils | 6M Lab",
    desc: "Appuis latéraux, grands écarts, réactivité, adducteurs : ce que le poste de gardien demande au corps, et les exercices pour s'y préparer.",
    brief: "Le gardien de handball fait peu de courses longues mais enchaîne des déplacements latéraux explosifs, des écarts extrêmes et des réactions très rapides. Sa préparation vise l'explosivité latérale, la mobilité des hanches et la solidité des adducteurs.",
    body: [
      { p: "Le gardien de but ne court pas comme un joueur de champ. Son effort se joue sur quelques mètres : une poussée latérale, une extension de jambe ou de bras, un retour immédiat en position, puis on recommence. Sa préparation physique doit donc être différente, même s'il partage une bonne partie du travail avec le groupe." },
      { h: "Ce que le poste demande au corps" },
      { ul: ["Des appuis latéraux explosifs, pour aller chercher un tir à un ou deux mètres.", "Une grande mobilité de hanche, pour les écarts et les parades basses.", "Des adducteurs solides : ce sont eux qui encaissent les grands écarts, et les douleurs d'aine sont fréquentes chez les gardiens.", "De la réactivité : le temps entre le tir et la parade se compte en fractions de seconde.", "Des épaules et un tronc stables, pour les parades hautes et les relances longues."] },
      { h: "Les exercices clés" },
      { ul: ["Fente latérale et squat cosaque : la force et la mobilité dans l'écart.", "Gainage Copenhague et adduction avec un ballon entre les genoux : la prévention de l'aine.", "Mobilité des hanches en 90/90 : l'amplitude pour les parades basses.", "Bonds latéraux et départs sur signal : l'explosivité et la réaction."] },
      { h: "Avec le groupe, ou à part ?" },
      { p: "Les deux. Le gardien fait avec le groupe tout ce qui sert à tous : échauffement, gainage, force des jambes, prévention. Pour les courses longues ou les sprints en ligne droite, il les remplace par des ateliers qui lui ressemblent : appuis latéraux, réactions, arrêts sur tirs." },
      { h: "Attention à la charge de tirs" },
      { p: "Recevoir des tirs, c'est aussi une charge physique. Pendant la préparation, on limite le nombre de tirs reçus par séance et on allège le travail de sauts les jours d'entraînement spécifique intense." },
      { h: "Les jeunes gardiens" },
      { p: "Chez les jeunes, la priorité est la technique des appuis, la mobilité et le gainage, au poids du corps. La musculation avec charges vient plus tard, progressivement et avec un encadrement." },
      { p: "Dans les programmes Clubs de 6M Lab, les gardiens ont leurs propres ateliers, placés au bon moment de chaque séance. En programme individuel, les objectifs Explosivité et Prévention & santé couvrent l'essentiel de ces besoins." },
    ],
    exos: ["fente-laterale", "cosaque", "copenhague", "hanches-9090"],
    faq: [
      { q: "Le gardien de but doit-il faire la même préparation que les joueurs de champ ?", a: "En partie. Il partage l'échauffement, le gainage, la force et la prévention avec le groupe, mais remplace les courses longues et les sprints en ligne par des ateliers d'appuis latéraux et de réaction." },
      { q: "Comment éviter les douleurs d'aine quand on est gardien ?", a: "En renforçant régulièrement les adducteurs, par exemple avec le gainage Copenhague, et en entretenant la mobilité des hanches. En cas de douleur qui dure, il faut consulter un professionnel de santé." },
      { q: "Quels exercices pour être plus explosif dans les buts ?", a: "Les fentes latérales, les bonds latéraux et les départs sur signal, faits vite et avec une bonne récupération entre les répétitions." },
      { q: "Un jeune gardien peut-il faire de la musculation ?", a: "Oui, en commençant par le poids du corps et la technique des gestes. Les charges viennent plus tard, de façon progressive et encadrée." },
    ],
    next: "clubs",
    articles: ["etude-exigences-physiques-handball", "epaules-handball-4-exercices-prevention"],
  },
  {
    slug: "prevention-blessures-handball",
    theme: "prevention",
    title: "Prévenir les blessures au handball : genou, cheville, épaule, ischios",
    metaTitle: "Prévention des blessures au handball : exercices et études | 6M Lab",
    desc: "Les blessures les plus fréquentes au handball, pourquoi elles arrivent et les exercices dont l'efficacité a été étudiée pour les éviter.",
    brief: "Les blessures du handball touchent surtout la cheville, le genou, l'épaule et l'arrière de la cuisse. Des programmes simples d'échauffement, d'équilibre, de réception et de renforcement, faits régulièrement, ont montré qu'ils en évitent une grande partie.",
    body: [
      { p: "Sauts, réceptions, pivots, contacts, tirs répétés : le handball sollicite beaucoup le corps. Certaines blessures reviennent très souvent. La bonne nouvelle, c'est que la prévention au handball est l'une des mieux étudiées de tous les sports collectifs, notamment en Norvège." },
      { h: "La cheville et le genou" },
      { p: "Les entorses de cheville et les blessures du genou, dont la rupture du ligament croisé, arrivent surtout sans contact : à la réception d'un saut ou lors d'un changement de direction, quand le genou part vers l'intérieur. Les joueuses y sont plus exposées." },
      { ul: ["Travailler l'équilibre sur une jambe.", "Apprendre à se réceptionner genoux dans l'axe, sur deux pieds puis sur un pied.", "Renforcer les jambes et les hanches.", "Intégrer ces exercices à l'échauffement, toute la saison."] },
      { p: "Dans une étude menée dans 120 clubs norvégiens, un échauffement structuré de ce type a environ divisé par deux les blessures du genou et de la cheville chez les jeunes." },
      { h: "L'épaule" },
      { p: "Les centaines de tirs d'une semaine d'entraînement usent l'épaule. Chez 660 joueurs et joueuses de haut niveau, un programme de 3 séances par semaine a réduit de 28 % les problèmes d'épaule. Il repose sur la rotation externe à l'élastique, le renforcement des muscles de l'omoplate et la mobilité du haut du dos." },
      { h: "L'arrière de la cuisse" },
      { p: "Sprints et freinages sollicitent les ischio-jambiers. Le Nordic, un exercice où l'on freine sa chute vers l'avant, a montré chez des footballeurs amateurs qu'il réduit nettement les blessures à cet endroit, à condition d'être fait régulièrement." },
      { h: "Ce qui marche, en résumé" },
      { ul: ["La régularité : quelques minutes à chaque séance valent mieux qu'une grosse séance de temps en temps.", "L'échauffement comme moment de prévention, pas comme formalité.", "Une charge qui monte progressivement, surtout à la reprise.", "Du sommeil et de la récupération : moins de 8 heures de sommeil est associé à plus de blessures chez les jeunes."] },
      { p: "Ces conseils sont généraux et ne remplacent pas l'avis d'un professionnel de santé. En cas de douleur qui dure, consulte." },
    ],
    exos: ["saut-reception", "equilibre", "rotation-externe", "nordic"],
    faq: [
      { q: "Quelles sont les blessures les plus fréquentes au handball ?", a: "Les entorses de cheville, les blessures du genou (dont le ligament croisé), les douleurs d'épaule liées aux tirs répétés et les blessures des ischio-jambiers." },
      { q: "Quels exercices pour éviter les blessures au handball ?", a: "L'équilibre sur une jambe, les réceptions de sauts genou dans l'axe, la rotation externe de l'épaule à l'élastique, le renforcement de l'omoplate et le Nordic pour l'arrière des cuisses." },
      { q: "Combien de fois par semaine faire de la prévention ?", a: "Idéalement à chaque échauffement, et au moins 2 à 3 fois par semaine. La régularité sur toute la saison compte plus que la durée de chaque séance." },
      { q: "Les joueuses sont-elles plus exposées aux blessures du genou ?", a: "Oui, les ruptures du ligament croisé sont plus fréquentes chez les joueuses. Les programmes d'équilibre et de réception ont justement été étudiés chez elles en Norvège." },
    ],
    next: "pre-saison",
    articles: ["etude-echauffement-blessures-genou-cheville", "etude-prevention-epaule-handball", "epaules-handball-4-exercices-prevention", "etude-nordic-ischio-jambiers", "etude-ligament-croise-joueuses-handball", "etude-sommeil-blessures-jeunes-sportifs"],
  },
  {
    slug: "musculation-handball",
    theme: "performance",
    title: "Musculation pour le handball : quoi, quand et à partir de quel âge",
    metaTitle: "Musculation handball : exercices, âge et programme | 6M Lab",
    desc: "Pourquoi la musculation rend plus fort et moins fragile au handball, les exercices de base, à la maison ou en salle, et comment commencer selon son âge.",
    brief: "La musculation rend plus explosif et protège les articulations. On commence par la technique au poids du corps, puis on ajoute des charges progressivement. Chez les jeunes, elle est bénéfique si elle est bien encadrée.",
    body: [
      { p: "Tirer plus fort, sauter plus haut, gagner ses duels, mieux encaisser les contacts : la force est la base de presque toutes les qualités du handballeur et de la handballeuse. La musculation bien faite ne rend pas lent ni raide ; elle rend plus explosif et moins fragile." },
      { h: "Pourquoi la musculation aide au handball" },
      { ul: ["Des jambes plus fortes, c'est une meilleure accélération et un meilleur saut.", "Un tronc solide transmet la force des jambes jusqu'au bras qui tire.", "Des muscles forts protègent les genoux, les chevilles et les épaules.", "La force se garde toute la saison avec peu de séances."] },
      { h: "Les exercices de base" },
      { ul: ["Les jambes : squat, fente, pont fessier ou hip thrust, soulevé de terre jambes tendues.", "Le haut du corps : pompes, rowing, développé, tractions.", "Le tronc : gainage, dead bug, Pallof.", "La puissance : sauts, lancers de médecine-ball, pompes explosives."] },
      { h: "À la maison ou en salle ?" },
      { p: "Les deux fonctionnent. À la maison, le poids du corps, un élastique et des objets du quotidien permettent déjà un vrai travail de force, surtout au début. En salle, les haltères, la barre et les poulies permettent de charger plus lourd et de progresser plus longtemps." },
      { h: "À partir de quel âge ?" },
      { p: "Bien menée, la musculation est bénéfique pour les jeunes, à condition d'être très bien encadrée. Avant 15-16 ans environ, on travaille au poids du corps, avec des élastiques et des charges légères, en apprenant les gestes. Ensuite, on ajoute des charges progressivement, toujours avec une technique propre et quelques répétitions en réserve à chaque série." },
      { h: "Combien de séances ?" },
      { ul: ["En pré-saison : 2 à 3 séances de force par semaine.", "En saison : 1 à 2 séances courtes suffisent pour garder ses acquis, loin des matchs.", "Toujours avec un jour de récupération entre deux séances lourdes."] },
      { h: "Les règles de sécurité" },
      { ul: ["La technique d'abord : si la position se dégrade, on arrête la série.", "La charge n'augmente que si toutes les répétitions sont propres.", "Pas de série jusqu'à l'échec chez les jeunes.", "Une douleur articulaire, c'est un signal d'arrêt, pas un défi."] },
      { p: "Dans les programmes 6M Lab, tu choisis ton lieu (maison ou salle) et tes objectifs, par exemple Développement musculaire ou Puissance : chaque exercice est adapté, et animé." },
    ],
    exos: ["squat", "hip-thrust", "pompes", "lancer-poitrine"],
    faq: [
      { q: "La musculation est-elle bonne pour les handballeurs ?", a: "Oui. Elle améliore l'accélération, le saut, le tir et les duels, et elle protège les articulations. Bien faite, elle ne rend pas plus lent." },
      { q: "À partir de quel âge faire de la musculation pour le handball ?", a: "Dès l'adolescence au poids du corps, en apprenant les gestes. Les charges s'ajoutent progressivement ensuite, avec un encadrement et une technique propre." },
      { q: "Peut-on se muscler pour le handball à la maison ?", a: "Oui. Le poids du corps, un élastique et des objets du quotidien suffisent pour un vrai travail de force, surtout au début." },
      { q: "Combien de séances de musculation par semaine pendant la saison ?", a: "1 à 2 séances courtes suffisent pour garder ses acquis, placées loin des matchs." },
    ],
    next: "pre-saison",
    articles: ["etude-exigences-physiques-handball", "garder-la-forme-en-saison-handball"],
  },
];
