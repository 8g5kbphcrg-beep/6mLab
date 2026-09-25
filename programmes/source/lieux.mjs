// Home or gym, chosen at checkout: what changes for each exercise (the correspondence table
// validated with the coach). Exercises not listed here are the same in both places.
// For each place: name (when it changes), how, cues, easier, figs ([exercise id, version] of the
// drawings, from figures-poses.mjs), dose (turns the dosage written in the sessions, which is the
// gym dosage, into this place's), band (the band variant offered at home) and prec (replaces the
// precision shown after the exercise name in the sessions; "" removes it).

export const LIEUX = {
  maison: { name: "À la maison", short: "Maison" },
  salle: { name: "En salle de sport", short: "Salle" },
};

// Dosage at home, without load: more repetitions (the numbers after "×" multiplied by k and
// rounded to a usual count), and a note (slow descent, per leg…). "3-4 × 6-8" with k = 1.5 gives
// "3-4 × 9-12".
const COUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 20, 25, 30];
const round = (v) => COUNTS.reduce((b, c) => (Math.abs(c - v) < Math.abs(b - v) ? c : b));
const more = (k, note = "") => (dose) => {
  const [sets, reps] = dose.split(" × ");
  if (!reps) return dose;
  return `${sets} × ${reps.replace(/^(\d+)(?:-(\d+))?/, (_, a, b) => [a, b].filter(Boolean).map((n) => round(n * k)).join("-"))}${note}`;
};
const slow = " · descente en 3 s";

// Running exercises at the gym: a curved (non-motorised) treadmill if the gym has one,
// otherwise the alternative.
const tapis = (onTreadmill, otherwise) => ({ how: `Sur un **tapis de course incurvé** (non motorisé, en forme de courbe : c'est toi qui fais tourner la bande), si ta salle en a un : ${onTreadmill} Sinon : ${otherwise}` });

export const parLieu = {
  // ---- Bas du corps --------------------------------------------------------------------------
  squat: {
    maison: { how: "Pieds largeur d'épaules, descends comme pour t'asseoir, cuisses au moins parallèles au sol, puis remonte. Quand c'est facile : un sac à dos lesté serré contre la poitrine.", figs: [["squat", "poids"]], dose: more(1.5, slow), prec: "",
      band: { how: "Élastique sous les pieds, tenu aux épaules : il résiste quand tu remontes.", figs: [["squat", "elastique"]] } },
    salle: { how: "Pieds largeur d'épaules, un haltère tenu contre la poitrine (goblet squat), descends cuisses au moins parallèles au sol puis remonte. Plus lourd : barre sur le haut du dos.", figs: [["squat", "materiel"]] },
  },
  "squat-lourd": {
    maison: { name: "Squat bulgare lesté", how: "Pied arrière posé sur le canapé ou une chaise, sac à dos lesté sur le dos : descends sur la jambe avant en 3 secondes, puis remonte le plus vite possible.", figs: [["squat-lourd", "poids"]], dose: more(2, " par jambe · descente en 3 s"),
      band: { how: "Squat avec un élastique fort sous les pieds, tenu aux épaules, pause de 2 secondes en bas.", figs: [["squat", "elastique"]] } },
    salle: { how: "Squat avec une barre sur le haut du dos (ou des haltères lourds), 3 à 5 répétitions.", figs: [["squat-lourd", "materiel"]] },
  },
  "fente-arriere": {
    maison: { how: "Recule une jambe et descends jusqu'à ce que le genou arrière frôle le sol. Reviens en poussant sur la jambe avant. Quand c'est facile : un sac à dos lesté.", figs: [["fente-arriere", "poids"]], dose: more(1.5, slow),
      band: { how: "Élastique sous le pied avant, tenu aux épaules." } },
    salle: { how: "Un haltère dans chaque main, recule une jambe et descends jusqu'à ce que le genou arrière frôle le sol, puis reviens en poussant sur la jambe avant.", figs: [["fente-arriere", "materiel"]] },
  },
  "squat-bulgare": {
    maison: { how: "Pied arrière posé sur le canapé ou une chaise, descends sur la jambe avant puis remonte. Quand c'est facile : un sac à dos lesté.", figs: [["squat-bulgare", "poids"]], dose: more(1.25, slow), prec: "avec sac à dos",
      band: { how: "Élastique sous le pied avant, tenu aux épaules." } },
    salle: { how: "Pied arrière sur un banc, un haltère dans chaque main, descends sur la jambe avant puis remonte.", figs: [["squat-bulgare", "materiel"]] },
  },
  "sdt-roumain": {
    maison: { how: "Sur une jambe (l'autre part en arrière), buste penché vers l'avant, dos plat, jusqu'à sentir l'étirement derrière la cuisse, puis redresse-toi. Plus difficile : un sac à la main.", figs: [["sdt-roumain", "poids"]], dose: more(1, " par jambe"),
      band: { how: "Sur deux jambes, élastique sous les pieds, tenu à deux mains : bascule le buste, dos plat, et redresse-toi." } },
    salle: { how: "Genoux légèrement fléchis, une barre ou deux haltères en main, penche le buste en reculant les fesses, dos plat, puis redresse-toi.", figs: [["sdt-roumain", "materiel"]] },
  },
  "hip-thrust": {
    maison: { how: "Haut du dos appuyé sur le canapé, pieds au sol, monte le bassin jusqu'à aligner épaules, hanches et genoux. Quand c'est facile : sur une jambe.", figs: [["hip-thrust", "poids"]], dose: more(1.5),
      band: { how: "Élastique en travers des hanches, tenu au sol par les mains de chaque côté." } },
    salle: { how: "Haut du dos appuyé sur un banc, barre (avec protection) ou haltère sur les hanches, monte le bassin jusqu'à aligner épaules, hanches et genoux.", figs: [["hip-thrust", "materiel"]] },
  },
  "hip-thrust-lourd": {
    maison: { name: "Hip thrust sur une jambe", how: "Haut du dos sur le canapé, une jambe tendue en l'air : monte le bassin avec force et tiens 2 secondes en haut.", figs: [["hip-thrust", "poids"]], dose: more(2, " par jambe · pause 2 s en haut"),
      band: { how: "Sur deux jambes, élastique fort en travers des hanches, pause en haut." } },
    salle: { how: "Haut du dos sur un banc, barre lourde sur les hanches, monte le bassin avec force.", figs: [["hip-thrust-lourd", "materiel"]] },
  },
  "squat-jump-leste": {
    maison: { how: "Squat jump avec un sac à dos léger (3 à 5 kg). Sans sac : squat jump normal.", figs: [["squat-jump-leste", "maison"]] },
    salle: { how: "Squat jump avec deux haltères légers le long du corps (10 à 20 % de ton poids).", figs: [["squat-jump-leste", "materiel"]] },
  },
  "box-jump": {
    maison: { how: "Saute sur une marche d'escalier ou un banc bien stable, réception en douceur, redescends en marchant. Sans support stable : squat jump.", figs: [["box-jump", "poids"]] },
    salle: { how: "Saute sur une caisse de pliométrie, réception en douceur, redescends en marchant.", figs: [["box-jump", "poids"]] },
  },

  // ---- Haut du corps -------------------------------------------------------------------------
  pompes: {
    maison: { how: "Mains un peu plus larges que les épaules, corps gainé, descends la poitrine près du sol puis pousse. Plus difficile : pieds surélevés sur une chaise.", figs: [["pompes", "poids"]], prec: "",
      band: { how: "Élastique passé dans le dos, tenu sous chaque main : il résiste quand tu pousses." } },
    salle: { name: "Développé couché haltères", how: "Allongé sur un banc, un haltère dans chaque main, descends les haltères au niveau de la poitrine, coudes à 45°, puis pousse.", easier: "Pompes, mains sur un banc.", figs: [["pompes", "materiel"]], prec: "" },
  },
  "developpe-couche": {
    maison: { name: "Pompes lestées", how: "Pompes avec un sac à dos lesté. Sans sac : pieds surélevés, descente en 3 secondes.", figs: [["developpe-couche", "poids"]], dose: more(2), prec: "",
      band: { how: "Pompes avec un élastique fort passé dans le dos." } },
    salle: { name: "Développé couché", how: "Développé couché avec une barre (ou des haltères lourds), pieds au sol, omoplates serrées.", figs: [["developpe-couche", "materiel"]], prec: "" },
  },
  "developpe-militaire": {
    maison: { name: "Pompes piquées", how: "Mains au sol, fesses en l'air (corps en V) : plie les coudes pour amener le haut de la tête vers le sol, puis pousse.", easier: "Pieds plus proches des mains, amplitude plus courte.", figs: [["developpe-militaire", "poids"]],
      band: { how: "Debout sur l'élastique, pousse-le au-dessus de la tête, puis redescends aux épaules.", figs: [["developpe-militaire", "elastique"]] } },
    salle: { how: "Debout ou assis, pousse les haltères au-dessus de la tête, puis redescends aux épaules.", figs: [["developpe-militaire", "materiel"]] },
  },
  rowing: {
    maison: { name: "Rowing inversé", how: "Allongé sous une table solide, mains sur le bord, corps droit : tire la poitrine vers la table, puis redescends. Autre option : rowing à un bras avec un sac à dos lesté.", figs: [["rowing", "poids"]], dose: more(1.25),
      band: { how: "Élastique accroché à une porte à hauteur de poitrine : tire les coudes vers l'arrière.", figs: [["rowing", "elastique"]] } },
    salle: { how: "Buste penché, dos plat, main libre sur un banc : tire un haltère vers la hanche. Autre option : tirage horizontal à la poulie.", figs: [["rowing", "materiel"]] },
  },
  "tirage-lourd": {
    maison: { name: "Rowing inversé, pieds surélevés", how: "Sous une table solide, pieds posés sur une chaise : tire vite la poitrine vers la table, redescends en 3 secondes.", figs: [["rowing", "poids"]], dose: more(1.5),
      band: { how: "Tirage avec un élastique fort accroché à une porte, pause d'1 seconde coudes en arrière.", figs: [["rowing", "elastique"]] } },
    salle: { how: "Rowing lourd à un bras avec un haltère, ou tractions lestées.", figs: [["tirage-lourd", "materiel"]] },
  },
  tractions: {
    maison: { how: "Sur une barre de porte : en suspension, tire jusqu'à passer le menton au-dessus, puis redescends. Sans barre : rowing inversé sous une table.", figs: [["tractions", "poids"]],
      band: { how: "À genoux, élastique accroché en hauteur : tire les coudes vers le bas, le long du corps. Avec une barre : l'élastique sous les genoux pour t'aider.", figs: [["tractions", "elastique"]] } },
    salle: { how: "En suspension à une barre, tire jusqu'à passer le menton au-dessus, puis redescends. Autre option : tirage vertical à la poulie.", easier: "Avec un élastique ou la machine d'assistance.", figs: [["tractions", "poids"]] },
  },
  "rotation-externe": {
    maison: { how: "Allongé sur le côté, coude du dessus collé au corps et plié à 90°, une bouteille d'eau en main : lève l'avant-bras vers le plafond, puis redescends lentement.", figs: [["rotation-externe", "maison"]],
      band: { how: "Debout, élastique attaché sur le côté : coude collé, écarte l'avant-bras vers l'extérieur.", figs: [["rotation-externe", "materiel"]] } },
    salle: { how: "À la poulie réglée à hauteur du coude (ou avec un élastique) : coude collé au corps et plié à 90°, écarte l'avant-bras vers l'extérieur, puis reviens lentement.", figs: [["rotation-externe", "materiel"]] },
  },
  "rotation-externe-haute": {
    maison: { how: "Buste penché vers l'avant, bras écarté sur le côté, coude à 90°, une bouteille d'eau en main : fais pivoter l'avant-bras vers l'avant, jusqu'à l'horizontale, puis redescends lentement.", figs: [["rotation-externe-haute", "maison"]],
      band: { how: "Élastique attaché devant toi : bras à l'horizontale, coude à 90°, fais pivoter l'avant-bras vers le haut.", figs: [["rotation-externe-haute", "materiel"]] } },
    salle: { how: "À la poulie réglée à hauteur d'épaule (ou avec un élastique) : bras à l'horizontale, coude à 90°, fais pivoter l'avant-bras vers le haut.", figs: [["rotation-externe-haute", "materiel"]] },
  },

  // ---- Tronc, porter, lancers, équilibre --------------------------------------------------
  pallof: {
    maison: { name: "Planche avec touchers d'épaule", how: "En planche bras tendus, pieds écartés : touche l'épaule opposée avec une main, puis l'autre, sans que le bassin bouge.", cues: "Résiste à la rotation : c'est un exercice de gainage.", figs: [["planche", "poids"]],
      band: { how: "Pallof press : élastique attaché sur le côté à hauteur de poitrine, tends les bras devant toi sans laisser le buste tourner.", figs: [["pallof", "materiel"]] } },
    salle: { how: "À la poulie réglée à hauteur de poitrine (ou avec un élastique), de profil : tends les bras devant toi sans laisser le buste tourner, tiens 2 secondes.", figs: [["pallof", "materiel"]] },
  },
  fermier: {
    maison: { how: "Marche avec une charge lourde dans chaque main : sacs de courses, packs d'eau ou bidons. Si c'est trop léger, double la distance.", figs: [["fermier", "materiel"]] },
    salle: { how: "Marche 20 m avec un haltère ou un kettlebell lourd dans chaque main.", figs: [["fermier", "materiel"]] },
  },
  "lancer-poitrine": {
    maison: { how: "Face à un mur extérieur, ballon de handball ou de basket à la poitrine, lance le plus fort possible. Sans ballon : pompes explosives.", figs: [["lancer-poitrine", "materiel"]],
      band: { how: "Élastique attaché derrière toi à hauteur de poitrine : pousse vers l'avant le plus vite possible.", figs: [["lancer-poitrine", "elastique"]] } },
    salle: { how: "Face à un mur, médecine-ball de 2 à 4 kg à la poitrine, lance le plus fort possible.", figs: [["lancer-poitrine", "materiel"]] },
  },
  "lancer-rotation": {
    maison: { how: "De profil à un mur extérieur, ballon tenu à la hanche, pivote et lance sur le côté, comme un tir. Sans ballon : rotations rapides du buste, bras tendus.", figs: [["lancer-rotation", "materiel"]],
      band: { how: "Élastique attaché sur le côté à hauteur de hanche : tourne le buste le plus vite possible en tirant l'élastique.", figs: [["lancer-rotation", "elastique"]] } },
    salle: { how: "De profil au mur, médecine-ball de 2 à 4 kg tenu à la hanche, pivote et lance sur le côté, comme un tir.", figs: [["lancer-rotation", "materiel"]] },
  },
  "lancer-haut": {
    maison: { how: "Ballon de handball ou de basket au-dessus de la tête, lance-le fort contre le sol ou un mur extérieur.", figs: [["lancer-haut", "materiel"]] },
    salle: { how: "Médecine-ball (slam ball) au-dessus de la tête, lance-le fort contre le sol.", figs: [["lancer-haut", "materiel"]] },
  },
  "equilibre-balle": {
    maison: { how: "Sur une jambe, sur un coussin plié, lance une balle contre un mur et rattrape-la.", figs: [["equilibre-balle", "materiel"]] },
    salle: { how: "Sur une jambe, sur un bosu ou un plateau instable, lance une balle contre un mur et rattrape-la.", figs: [["equilibre-balle", "materiel"]] },
  },

  // ---- Mêmes exercices, consigne adaptée -----------------------------------------------------
  nordic: {
    maison: { how: "À genoux sur un coussin, pieds bloqués sous le canapé ou tenus par une autre personne, laisse-toi tomber vers l'avant le plus lentement possible, corps droit. Rattrape-toi avec les mains, puis remonte en t'aidant des mains." },
    salle: { how: "À genoux sur un tapis, pieds bloqués sous un banc chargé, sous un espalier ou tenus par une autre personne, laisse-toi tomber vers l'avant le plus lentement possible, corps droit. Rattrape-toi avec les mains, puis remonte en t'aidant des mains." },
  },
  copenhague: {
    maison: { how: "Sur le côté, en appui sur l'avant-bras, jambe du dessus posée sur le canapé ou une chaise (au genou, ou au pied pour plus de difficulté). Monte le bassin et tiens la position." },
    salle: { how: "Sur le côté, en appui sur l'avant-bras, jambe du dessus posée sur un banc (au genou, ou au pied pour plus de difficulté). Monte le bassin et tiens la position." },
  },
  "drop-jump": {
    maison: { how: "Laisse-toi tomber d'une marche d'escalier (20-30 cm) et, dès que tes pieds touchent le sol, rebondis le plus haut possible." },
    salle: { how: "Laisse-toi tomber d'une caisse basse (20-30 cm) et, dès que tes pieds touchent le sol, rebondis le plus haut possible." },
  },
  "mollets-excentrique": {
    maison: { how: "Au bord d'une marche d'escalier, monte sur la pointe des deux pieds, puis redescends en 3 secondes sur un seul pied." },
    salle: { how: "Au bord d'un step ou d'une marche, monte sur la pointe des deux pieds, puis redescends en 3 secondes sur un seul pied. Plus difficile : un haltère dans la main." },
  },

  // ---- Course à la salle ---------------------------------------------------------------------
  "footing-dynamique": { salle: tapis("course légère, puis gammes (montées de genoux, talons-fesses).", "gammes sur place ou dans l'espace libre de la salle : 5 minutes de montées de genoux, talons-fesses et pas chassés.") },
  accelerations: { salle: tapis("3 accélérations de 5 secondes, de plus en plus vite.", "3 accélérations de 10 secondes sur un vélo d'assaut (air bike) ou un rameur.") },
  footing: { salle: tapis("course continue à une allure où tu peux parler.", "tapis motorisé, vélo ou elliptique, à la même intensité et pendant la même durée.") },
  "intervalles-1515": { salle: tapis("mêmes temps d'effort et de récupération.", "vélo d'assaut (air bike) ou rameur, avec les mêmes temps.") },
  "intervalles-3030": { salle: tapis("mêmes temps d'effort et de récupération.", "vélo d'assaut (air bike) ou rameur, avec les mêmes temps.") },
  "sprints-repetes": { salle: tapis("6 sprints de 5 secondes, un départ toutes les 20 secondes.", "6 sprints de 6 secondes sur un vélo d'assaut, un départ toutes les 20 secondes.") },
  "sprint-20": { salle: tapis("sprint de 5 secondes à fond.", "sprint de 20 m dans l'espace libre de la salle ou dehors, sinon 6 secondes à fond sur un vélo d'assaut.") },
  "departs-10": { salle: tapis("départs arrêtés, 3 secondes à fond.", "départs sur 10 m dans l'espace libre de la salle ou dehors.") },
};

// The exercise as it is done in this place: text, drawings ([id, version, label]) and band variant.
export function exoFor(base, id, lieu) {
  const l = parLieu[id]?.[lieu];
  if (!l) return { ...base, figs: null };
  const label = lieu === "maison" ? "À la maison" : "En salle";
  // Drawings of this place, then of the band variant; null keeps the exercise's usual drawings.
  const figs = l.figs ? [...l.figs.map(([fid, v]) => [fid, v, label]), ...(l.band?.figs ?? []).map(([fid, v]) => [fid, v, "Avec un élastique"])] : null;
  return { ...base, name: l.name ?? base.name, how: l.how, cues: l.cues ?? base.cues, easier: l.easier ?? (l.name ? undefined : base.easier), band: l.band?.how, figs };
}
export const doseFor = (id, dose, lieu) => parLieu[id]?.[lieu]?.dose?.(dose) ?? dose;
export const precFor = (id, prec, lieu) => { const p = parLieu[id]?.[lieu]?.prec; return p === undefined ? prec : p || undefined; };
