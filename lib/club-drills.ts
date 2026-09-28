// The collective drills, goalkeeper drills and tests of the club programs, with their animated
// diagrams (from the club documents, private/docs/exemple-club-u18.html): the club library
// (app/[lang]/clubs/bibliotheque). Coordinates in a 320 × 200 field. Texts in French.
/* eslint-disable @typescript-eslint/no-explicit-any */
export type ClubText = { name: string; how: string; cues?: string; soon?: boolean };
export type Drill = { name: string; how: string; org?: string; cues?: string; legend: [string, string][]; [k: string]: any };

export const TXT: Record<string, ClubText> = {
  "footing-dynamique": { name: "Course légère et gammes", how: "Course légère en alternant pas chassés, montées de genoux et talons-fesses.", cues: "Commence doucement, augmente progressivement le rythme." },
  "accelerations": { name: "Accélérations progressives", how: "Course sur 15 m en augmentant la vitesse : 60 %, puis 80 %, puis 90 % de ta vitesse maximale. Retour en marchant.", cues: "Relâché, sans crisper les épaules." },
  "marche": { name: "Marche et étirements légers", how: "2 minutes de marche, puis étirements légers de 20 à 30 secondes, sans forcer : fléchisseurs de hanche, quadriceps, ischios, mollets.", cues: "Respire lentement, aucun étirement ne doit faire mal." },
  "footing": { name: "Footing facile", how: "Course continue à une allure où tu peux tenir une conversation.", cues: "Si tu ne peux pas parler, ralentis." },
};
export const DR: Record<string, Drill> = {
  "miroir": { name: "Le miroir", legend: [["r", "Attaquant"], ["b", "Défenseur"], ["y", "Plots (limites de l'atelier)"]],
    how: "Par deux, face à face, entre deux plots écartés de 4 m. L'attaquant se déplace librement en pas chassés entre les plots ; le défenseur, en face, doit rester exactement devant lui. Une répétition dure 6 s ; à la suivante, on échange les rôles.",
    org: "Tout le groupe en même temps, un binôme entre chaque paire de plots, répartis sur le terrain. Matériel : 2 plots par binôme.",
    cues: "Rester bas, ne jamais croiser les pieds.",
    items: [["cone", 70, 105], ["cone", 250, 105]], dots: [["r", "M160,75 L100,75 L215,75 L130,75 L160,75", 4], ["b", "M160,135 L100,135 L215,135 L130,135 L160,135", 4, 0.06]] },
  "echelle-induction-tir": { name: "Échelle, induction, tir", legend: [["r", "Joueur"], ["g", "Passeur (le joueur qui vient de tirer)"], ["o", "Ballon"], ["v", "Gardien"]],
    how: "Le joueur traverse l'échelle (un appui par case, puis deux, puis en latéral), fait une induction devant le plot (il montre un côté pour faire réagir un défenseur imaginaire, puis part de l'autre), reçoit la passe et tire au-dessus de la ligne des 9 m.",
    org: "Une colonne par cage, un gardien dans chaque cage. Le joueur qui vient de tirer récupère un ballon et devient le passeur du suivant, puis retourne au bout de la colonne. Un joueur part quand le précédent a tiré : le temps d'attente dans la colonne est la récupération.",
    cues: "Appuis rapides dans l'échelle, induction franche, tir en course.",
    items: [["ladder", 20, 130, 110], ["cone", 180, 135], ["goal", 300, 100], ["arc", 300, 100, 95, true], ["arc", 300, 100, 65]], passer: [230, 40], gk: [288, 100],
    dots: [["r", "M15,135 L135,135 L170,120 L185,140 L205,112", 5]], ball: ["M230,40 L205,112 L290,95", 5, 0.62] },
  "etoile": { name: "L'étoile de couleurs", legend: [["r", "Joueur"], ["y", "Plot central et plots de couleur"]],
    how: "Cinq plots de couleurs en étoile, à 4 m d'un plot central. Le coach annonce une couleur : le joueur sprinte jusqu'au plot, le touche de la main et revient au centre en pas arrière. 3 couleurs par passage.",
    org: "Un joueur par étoile à la fois, les autres attendent derrière le plot central : le temps d'attente est la récupération. Avec deux étoiles, deux joueurs passent en même temps.",
    cues: "Freine bas avant le plot, repars fort.",
    items: [["cone", 160, 105], ["cone", 160, 30, "#E32B2B"], ["cone", 232, 82, "#2B6BE3"], ["cone", 205, 168, "#2EC46B"], ["cone", 115, 168, "#F2C230"], ["cone", 88, 82, "#8C3BE3"]],
    dots: [["r", "M160,105 L160,38 L160,105 L225,84 L160,105 L118,160 L160,105", 5]] },
  "haies": { name: "Haies, réception, passe", legend: [["r", "Joueur"], ["g", "Partenaire"], ["o", "Ballon"]],
    how: "Le joueur franchit 4 mini-haies pieds joints, se réceptionne dans le cerceau et tient 2 secondes (genoux dans l'axe des pieds), puis fait une passe au partenaire.",
    org: "Une ligne de haies par colonne. Le joueur suivant part quand le précédent a fait sa passe ; celui qui a passé devient le partenaire du suivant, puis retourne au bout de la colonne. L'attente est la récupération.",
    cues: "Réception silencieuse, genoux au-dessus des pieds, jamais vers l'intérieur.",
    items: [["hurdle", 70, 110], ["hurdle", 105, 110], ["hurdle", 140, 110], ["hurdle", 175, 110], ["hoop", 220, 115]], passer: [290, 115],
    dots: [["r", "M30,115 Q50,80 70,115 Q88,80 105,115 Q123,80 140,115 Q158,80 175,115 Q198,80 220,115 L220,115", 4]], ball: ["M220,112 L285,112", 4, 0.8] },
  "franchir": { name: "Franchir la ligne", legend: [["r", "Attaquant"], ["b", "Défenseur"], ["y", "Couloir de 4 m et ligne à franchir (rouge)"]],
    how: "1 contre 1 sans ballon dans un couloir de 4 m de large. L'attaquant doit franchir la ligne rouge. Le défenseur, face à lui, doit l'en empêcher pendant toute la durée du duel : il se place devant lui et le repousse avec le haut du corps et les bras, sans le ceinturer. Le duel dure 5 s.",
    org: "Plusieurs couloirs côte à côte, deux binômes par couloir : pendant qu'un binôme fait son duel, l'autre attend derrière, et c'est sa récupération. Les rôles s'inversent à chaque duel. Matériel : 4 plots par couloir.",
    cues: "Attaquant : changements d'appuis francs. Défenseur : reste bas, bras engagés, ne croise pas les pieds.",
    items: [["line", 20, 55, 300, 55], ["line", 20, 155, 300, 155], ["line", 290, 55, 290, 155, "#E32B2B"]],
    dots: [["r", "M40,105 L110,78 L150,130 L190,85 L215,115", 5], ["b", "M140,105 L150,85 L180,125 L215,92 L235,112", 5]] },
  "departs": { name: "Départs au signal", legend: [["r", "Joueur"], ["y", "Ligne de départ et plot d'arrivée à 10 m"]],
    how: "Départ d'une position variée (assis, dos au sens de course, en appui sur les mains). Au signal du coach (sifflet ou main levée), sprint à fond jusqu'au plot à 10 m. Retour en marchant.",
    org: "Par vagues de 4 sur la ligne. Une vague part, revient en marchant sur le côté, puis c'est la suivante : le temps des autres vagues est la récupération.",
    cues: "Réagis au signal, ne devine pas. Premiers appuis courts et puissants.",
    items: [["line", 40, 60, 40, 150], ["cone", 270, 105]], dots: [["r", "M40,105 L40,105 L270,105", 3, 0, [0, 0.45, 1]]] },
  "contre-attaque": { name: "Contre-attaque en vague, 2 contre 1", legend: [["r", "Vague de 3 attaquants"], ["b", "Le 3e joueur devient défenseur"], ["v", "Gardiens (un dans chaque cage)"], ["o", "Ballon"], ["k", "Joueurs en attente"]],
    how: "Tous les joueurs de champ sont du même côté du terrain, près d'une cage. Au signal (sifflet ou main levée), une vague de 3 joueurs part en contre-attaque. Le gardien fait la relance à l'un des trois. Celui qui reçoit n'a pas le droit de dribbler : il passe à un des deux autres. Les deux joueurs qui ont touché le ballon attaquent alors à 2 contre 1 jusqu'au tir ; le troisième, qui n'a pas touché le ballon, devient défenseur. Toujours sans dribble.",
    org: "Toutes les vagues passent l'une après l'autre ; ensuite, les joueurs attendent de l'autre côté du terrain. Quand tout le monde est passé, on repart dans l'autre sens : c'est l'autre gardien qui relance. Une série = tout le monde passe à l'aller et au retour. Le temps des autres vagues est la récupération.",
    cues: "Sprint à fond dès le signal. Le receveur lève la tête et passe vite. En 2 contre 1, on fixe le défenseur avant de passer.",
    items: [["goal", 14, 100], ["goal", 306, 100], ["arc", 14, 100, 60, false, true], ["arc", 306, 100, 60], ["line", 160, 12, 160, 188, "#C9C3DC"]], gk: [26, 100], gk2: [294, 100], waitL: [[40, 22], [54, 22], [68, 22], [82, 22], [96, 22]], waitR: [[224, 22], [238, 22], [252, 22]],
    dots: [["r", "M112,26 L150,70 L205,75 L245,78", 5], ["r", "M126,30 L165,125 L215,120 L262,110", 5], ["r", "M140,26 L165,165 L238,108", 5, 0, null, false, 0.42]], ball: ["M26,100 L150,70 L215,120 L306,100", 5, 0] },
  "navettes": { name: "15-15 par groupes de niveau", legend: [["r", "Groupe 1"], ["b", "Groupe 2"], ["g", "Groupe 3"], ["y", "Plots à la distance de chaque groupe"]],
    how: "15 secondes de course jusqu'au plot de son groupe (distance réglée sur la VIFT, voir le tableau des groupes), puis 15 secondes de récupération en marchant. On repart du plot où l'on est arrivé, dans l'autre sens.",
    org: "Tout le groupe en même temps, par groupes de niveau alignés sur la ligne. Tout le monde part au même coup de sifflet. Si un joueur n'arrive pas au plot 3 fois de suite, il passe dans le groupe en dessous.",
    cues: "Arriver au plot pile au sifflet, pas avant.",
    items: [["line", 30, 40, 30, 170], ["cone", 230, 60], ["cone", 260, 105], ["cone", 290, 150]],
    dots: [["r", "M30,60 L230,60", 3, 0, [0, 0.5, 1], true], ["b", "M30,105 L260,105", 3, 0, [0, 0.5, 1], true], ["g", "M30,150 L290,150", 3, 0, [0, 0.5, 1], true]] },
  "3c3": { name: "3 contre 3 sur demi-terrain", legend: [["r", "Attaquants"], ["b", "Défenseurs"], ["v", "Gardien"], ["o", "Ballon"]],
    how: "Sur un demi-terrain : 3 attaquants contre 3 défenseurs, avec un gardien. Pour avoir le droit de tirer, l'équipe qui attaque doit faire au moins 3 passes et les 3 attaquants doivent avoir touché le ballon. Dès que l'attaque tire, marque ou perd le ballon, les défenseurs prennent le ballon, ressortent derrière la ligne des 9 m et deviennent attaquants.",
    org: "Deux matchs en même temps, un sur chaque demi-terrain, chacun avec un des deux gardiens. Avec 14 joueurs de champ, 12 jouent et 2 attendent : à chaque pause (toutes les 3 min), les 2 joueurs en attente remplacent 2 joueurs, qui attendent à leur tour.",
    cues: "Tout le monde bouge sans ballon : appels, soutiens, replacements.",
    items: [["goal", 302, 100], ["arc", 302, 100, 70], ["arc", 302, 100, 110, true]], gk: [290, 100],
    dots: [["r", "M110,55 L120,60 L110,55", 4], ["r", "M100,100 L110,105 L100,100", 4], ["r", "M110,150 L125,145 L110,150", 4], ["b", "M205,65 L215,75 L205,65", 4], ["b", "M195,100 L205,108 L195,100", 4], ["b", "M205,135 L215,128 L205,135", 4]], ball: ["M110,55 L100,100 L110,150 L100,100 L110,55", 4, 0] },
  "caisse": { name: "Saut sur caisse puis départ", legend: [["r", "Joueur"], ["y", "Caisse (ou banc solide) et plot à 5 m"]],
    how: "Saut à pieds joints sur la caisse, réception en douceur, descente en marchant, puis départ explosif jusqu'au plot à 5 m.",
    org: "Une colonne par caisse. Le joueur suivant part quand le précédent a passé le plot : l'attente est la récupération.",
    cues: "Saute haut, pas loin. Toujours redescendre en marchant.",
    items: [["box", 110, 85], ["cone", 270, 110]], dots: [["r", "M60,110 Q90,40 125,85 L150,85 L165,110 L270,110", 4]] },
  "bonds": { name: "Bonds horizontaux", legend: [["r", "Joueur"], ["y", "Ligne de départ"]],
    how: "3 sauts en longueur à pieds joints enchaînés, réception stabilisée 2 secondes après le 3e.",
    org: "Par colonnes de 4 à 5 derrière une ligne. Le suivant part quand le précédent a fini sa réception ; retour en marchant sur le côté. L'attente est la récupération.",
    cues: "Bras qui balancent vers l'avant, réception contrôlée.",
    items: [["line", 40, 70, 40, 150]], dots: [["r", "M40,110 Q80,50 120,110 Q160,50 200,110 Q240,50 280,110", 3]] },
  "505": { name: "Test 505 (changement de direction)", legend: [["r", "Joueur"], ["y", "Lignes : départ, chrono (10 m plus loin), demi-tour (5 m après le chrono)"]],
    how: "Départ 10 m avant la ligne du chrono. Sprint, passage de la ligne du chrono (on déclenche), demi-tour sur la ligne 5 m plus loin, retour jusqu'à la ligne du chrono (on arrête). 2 essais en tournant sur le pied gauche, 2 sur le pied droit, 2 min entre les essais.",
    org: "Un couloir, un chronométreur. Les joueurs passent l'un après l'autre : l'attente est la récupération.",
    cues: "Le pied doit toucher la ligne du demi-tour, sinon l'essai ne compte pas.",
    items: [["line", 30, 60, 30, 150], ["line", 210, 60, 210, 150, "#E32B2B"], ["line", 290, 60, 290, 150]],
    dots: [["r", "M30,95 L290,95 L290,115 L210,115", 3.5]] },
  "3015": { name: "Test 30-15 Intermittent Fitness Test", legend: [["r", "Joueurs"], ["y", "Lignes à 40 m et zones de 3 m"]],
    how: "Navettes sur 40 m au rythme de bips (application gratuite « 30-15 IFT »). 30 s de course, 15 s de marche. On part à 8 km/h, +0,5 km/h à chaque palier. Le test s'arrête pour un joueur quand il n'arrive pas dans la zone de 3 m au bip 3 fois de suite. On note la vitesse du dernier palier réussi : c'est la VIFT.",
    org: "Tout le groupe en même temps, de front sur la largeur du terrain, navettes dans la longueur (40 m). Le coach et l'adjoint surveillent les zones et notent les arrêts.",
    cues: "Pas de départ anticipé : on part au bip.",
    items: [["line", 30, 50, 30, 160], ["line", 290, 50, 290, 160], ["zone", 30, 50, 18], ["zone", 272, 50, 18], ["zone", 151, 50, 18]],
    dots: [["r", "M30,80 L290,80 L30,80", 4], ["r", "M30,105 L290,105 L30,105", 4], ["r", "M30,130 L290,130 L30,130", 4]] },
  // Goalkeepers
  "gk-cible": { name: "Appuis latéraux vers une cible", legend: [["v", "Gardien"], ["y", "Plots de couleur aux poteaux"], ["o", "Ballon lancé (progression)"]],
    how: "En position de base au milieu du but. Le coach montre un plot : 1 à 2 appuis latéraux et extension vers la cible, retour au centre. Progression : signal simple, puis choix entre deux cibles, puis vrai ballon lancé.",
    org: "À côté de l'atelier du groupe, avec le coach ou l'autre gardien qui montre la cible ou lance le ballon.",
    cues: "Reste bas, pousse avec la jambe opposée, ne te relève pas avant de partir.",
    items: [["goalwide", 160, 150], ["cone", 90, 150, "#E32B2B"], ["cone", 230, 150, "#2B6BE3"]], coach: [160, 40],
    dots: [["v", "M160,140 L100,140 L160,140 L220,140 L160,140", 4]], ball: ["M160,45 L225,135", 4, 0.55] },
  "gk-echelle": { name: "Échelle du gardien", legend: [["v", "Gardien"], ["o", "Ballon lancé par le partenaire"]],
    how: "Deux appuis latéraux dans l'échelle, puis sortie explosive sur une jambe vers la balle lancée, bras et jambe en extension. Même chose de l'autre côté.",
    org: "Avec l'autre gardien qui lance : on échange les rôles à chaque série, la série de l'autre est la récupération.",
    cues: "Appuis rapides et bas, extension complète vers la balle.",
    items: [["ladderv", 130, 60, 90]], passer: [290, 60],
    dots: [["v", "M140,150 L140,120 L140,95 L200,70", 3]], ball: ["M290,60 L205,70", 3, 0.6] },
  "gk-poussee": { name: "Poussée latérale résistée", legend: [["v", "Gardien"], ["g", "Partenaire qui tient l'élastique"]],
    how: "Un élastique autour de la taille, tenu par un partenaire sur le côté. En position de base, poussée explosive sur une jambe vers le côté opposé, sur 1 à 2 appuis, puis retour contrôlé.",
    org: "Les deux gardiens ensemble : l'un pousse, l'autre tient l'élastique, puis on échange. La série de l'autre est la récupération.",
    cues: "Pousse avec la jambe la plus proche du partenaire, reste bas.",
    items: [["band", 60, 105]], passer: [60, 105],
    dots: [["v", "M150,105 L230,105 L150,105", 2.5]] },
  "gk-arrets": { name: "Répétition d'arrêts et relances", legend: [["v", "Gardien dans la cage"], ["r", "Tireur (l'autre gardien ou le coach)"], ["o", "Ballon"], ["g", "Cible de la relance"]],
    how: "Pendant 20 s, le gardien reçoit un tir toutes les 4 à 5 s, à des endroits différents, puis fait une relance longue vers une cible (plot ou partenaire).",
    org: "Les deux gardiens alternent : pendant que l'un est dans la cage, l'autre tire (ballons préparés au 9 m), puis on échange. Récupération : la série de l'autre gardien, plus 1 min. Si le coach est disponible, c'est lui qui tire.",
    cues: "Garde la qualité : si les arrêts deviennent mous, on arrête la série.",
    items: [["goal", 302, 100], ["arc", 302, 100, 95]], passerAt: [40, 30], gk: [290, 100],
    dots: [["r", "M190,50 L180,100 L190,150", 5], ["v", "M290,100 L290,72 L290,100 L290,128 L290,100", 5]], ball: ["M190,50 L290,72 L180,100 L290,100 L190,150 L290,128 L40,30", 5, 0] },
  "gk-lateral": { name: "Appuis latéraux et extensions", legend: [["v", "Gardien"], ["y", "Plots à 3 m de chaque côté"]],
    how: "Entre deux plots écartés de 6 m : pas chassés rapides jusqu'à un plot, extension (bras et jambe) comme pour un arrêt, retour en pas chassés, puis de l'autre côté. 20 secondes d'effort.",
    org: "Seul, en autonomie.",
    cues: "Toujours face à l'avant, pieds qui ne se croisent jamais.",
    items: [["cone", 70, 110], ["cone", 250, 110]], dots: [["v", "M160,110 L80,110 L160,110 L240,110 L160,110", 3]] },
};

export const COL: Record<string, string> = { r: "#E4572E", b: "#2B6BE3", g: "#1F9D55", v: "#7B4FD1", o: "#F28C28", y: "#F2A516", k: "#A8A2BA" };
// The diagram of a drill, as SVG markup (moving players drawn with SMIL animations).
export function drillSVG(d: Drill): string {
  const it = d.items.map((e: any[]) => {
    const [t, x, y, a, b, c] = e;
    if (t === "cone") return `<path d="M${x},${y - 9} L${x + 7},${y + 5} L${x - 7},${y + 5} Z" fill="${a || COL.y}" stroke="#7a5a10" stroke-width=".8"/>`;
    if (t === "ladder") { let s = `<rect x="${x}" y="${y - 10}" width="${a}" height="20" fill="none" stroke="#3A3452" stroke-width="1.6"/>`; for (let k = x + 15; k < x + a; k += 15) s += `<line x1="${k}" y1="${y - 10}" x2="${k}" y2="${y + 10}" stroke="#3A3452" stroke-width="1.6"/>`; return s; }
    if (t === "ladderv") { let s = `<rect x="${x}" y="${y}" width="20" height="${a}" fill="none" stroke="#3A3452" stroke-width="1.6"/>`; for (let k = y + 15; k < y + a; k += 15) s += `<line x1="${x}" y1="${k}" x2="${x + 20}" y2="${k}" stroke="#3A3452" stroke-width="1.6"/>`; return s; }
    if (t === "hurdle") return `<path d="M${x - 8},${y + 8} L${x - 8},${y - 8} L${x + 8},${y - 8} L${x + 8},${y + 8}" fill="none" stroke="#3A3452" stroke-width="2"/>`;
    if (t === "hoop") return `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="#1F9D55" stroke-width="2"/>`;
    if (t === "goal") return `<rect x="${x - 4}" y="${y - 22}" width="8" height="44" fill="#fff" stroke="#3A3452" stroke-width="2"/>`;
    if (t === "goalwide") return `<rect x="${x - 80}" y="${y}" width="160" height="10" fill="#fff" stroke="#3A3452" stroke-width="2"/>`;
    if (t === "arc") return `<path d="M${x},${y - a} A${a},${a} 0 0 ${c ? 1 : 0} ${x},${y + a}" fill="none" stroke="#9B94B5" stroke-width="1.4" ${b ? 'stroke-dasharray="5 4"' : ""}/>`;
    if (t === "line") return `<line x1="${x}" y1="${y}" x2="${a}" y2="${b}" stroke="${c || "#3A3452"}" stroke-width="2"/>`;
    if (t === "box") return `<rect x="${x}" y="${y - 12}" width="32" height="24" rx="3" fill="#E7D8B8" stroke="#7a5a10"/>`;
    if (t === "band") return `<line x1="${x}" y1="${y}" x2="150" y2="${y}" stroke="#1F9D55" stroke-width="2" stroke-dasharray="4 3"/>`;
    if (t === "zone") return `<rect x="${x}" y="${y}" width="${a}" height="110" fill="#F2A516" opacity=".18"/>`;
    return "";
  }).join("");
  const stat: string[] = [];
  if (d.passer) stat.push(`<circle cx="${d.passer[0]}" cy="${d.passer[1]}" r="7" fill="${COL.g}"/>`);
  if (d.passerAt) stat.push(`<circle cx="${d.passerAt[0]}" cy="${d.passerAt[1]}" r="7" fill="${COL.g}"/>`);
  (d.shooters || []).forEach(([x, y]: number[]) => stat.push(`<circle cx="${x}" cy="${y}" r="7" fill="${COL.r}"/>`));
  if (d.coach) stat.push(`<circle cx="${d.coach[0]}" cy="${d.coach[1]}" r="7" fill="#17122B"/><text x="${d.coach[0] + 11}" y="${d.coach[1] + 4}" font-size="10" fill="#17122B" font-family="Inter,sans-serif">Coach</text>`);
  if (d.gk && !d.dots.some((x: any[]) => x[0] === "v")) stat.push(`<circle cx="${d.gk[0]}" cy="${d.gk[1]}" r="7" fill="${COL.v}"/>`);
  if (d.gk2) stat.push(`<circle cx="${d.gk2[0]}" cy="${d.gk2[1]}" r="7" fill="${COL.v}"/>`);
  [...(d.waitL || []), ...(d.waitR || [])].forEach(([x, y]: number[]) => stat.push(`<circle cx="${x}" cy="${y}" r="6" fill="${COL.k}"/>`));
  const dots = d.dots.map(([c, path, dur, begin = 0, kt, restAfter, turnBlue]: any[]) => {
    const keys = kt ? ` keyPoints="${restAfter ? "0;1;1" : "0;0;1"}" keyTimes="${kt.join(";")}" calcMode="linear"` : "";
    const hide = begin ? ` visibility="hidden"` : "", show = begin ? `<set attributeName="visibility" to="visible" begin="${begin * dur}s"/>` : "";
    // turnBlue: the player becomes a defender at that point of the move (colour change).
    const turn = turnBlue ? `<animate attributeName="fill" dur="${dur}s" repeatCount="indefinite" calcMode="discrete" keyTimes="0;${turnBlue}" values="${COL[c]};${COL.b}"/>` : "";
    return `<circle r="7.5" fill="${COL[c]}" stroke="#fff" stroke-width="1.5"${hide}>${show}${turn}<animateMotion dur="${dur}s" begin="${begin * dur}s" repeatCount="indefinite" path="${path}"${keys}/></circle>`;
  }).join("");
  const ball = d.ball ? `<circle r="4.5" fill="${COL.o}" stroke="#7a3a00" stroke-width=".8"${d.ball[2] ? ' visibility="hidden"' : ""}>${d.ball[2] ? `<set attributeName="visibility" to="visible" begin="${d.ball[2] * d.ball[1]}s"/>` : ""}<animateMotion dur="${d.ball[1]}s" begin="${d.ball[2] * d.ball[1]}s" repeatCount="indefinite" path="${d.ball[0]}"/></circle>` : "";
  return `<svg viewBox="0 0 320 200" class="drill-svg" role="img" aria-label="Schéma : ${d.name}"><rect x="1" y="1" width="318" height="198" rx="10" fill="#F3EFE7" stroke="#DDD3C2"/>${it}${stat.join("")}${dots}${ball}</svg>`;
}
