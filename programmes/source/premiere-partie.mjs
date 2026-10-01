// 1re partie de saison (September to the end of the Christmas holidays, 18 weeks): the sessions
// of each goal, block by block. Rows are [exercise id, dosage, rest, precision?], gym dosages
// (lieux.mjs adapts them for home), as in objectifs.mjs.
//
// Blocks (validated with the coach):
//   entree    weeks 1-3 (4 lighter)   enter the season: keep the summer's strength as games start
//   intensite weeks 5-7 (8 lighter)   few sets, heavy and fast (Rønnestad 2011: one weekly
//                                     strength session keeps the gains for 12 weeks)
//   niveau    weeks 9-11 (12 lighter) keep the level: contrast heavy → fast, short sprints
//   treve     weeks 13-15 (16 lighter) fresh for the last games before the break
// then the Christmas break: week 17 real rest, week 18 work (TREVE sessions, below). Same rule for
// a 2-week autumn break (weeks 8 and 9) when the league stops.
// Session 1: the more demanding one, at least 3 days before the game. Session 2: lighter, no later
// than 2 days before. A little plyometrics in each (Hermassi: twice-weekly in-season
// plyometrics improves jumps, sprint and throwing in young handball players).

export const BLOCS = ["entree", "intensite", "niveau", "treve"];

// Two goals: one block per goal in each session.
export const p1 = {
  explosivite: {
    entree: { s1: [["saut-cmj", "2-3 × 4", "75 s"], ["departs-10", "4-5 passages", "75 s"]], s2: [["pogos", "2 × 10", "45 s"], ["navette-5105", "2-3 passages", "90 s"], ["departs-reactifs", "4-5 passages", "60 s"]] },
    intensite: { s1: [["squat-jump", "3 × 3", "90 s", "hauteur maximale"], ["bonds", "2-3 × 3", "90 s", "bonds horizontaux"], ["sprint-20", "3-4 passages", "2 min"]], s2: [["skater-hop", "2 × 4 par jambe", "45 s"], ["pas-chasses-depart", "4-6 passages", "60 s"], ["departs-reactifs", "4-6 passages", "60 s"]] },
    niveau: { s1: [["saut-cmj", "3 × 3", "90 s"], ["departs-10", "4-6 passages", "75 s"], ["sprint-20", "3-4 passages", "2 min"]], s2: [["pogos", "2 × 12", "45 s"], ["navette-5105", "3-4 passages", "90 s"], ["pas-chasses-depart", "4-6 passages", "60 s"]] },
    treve: { s1: [["saut-cmj", "2-3 × 3", "90 s"], ["departs-10", "3-4 passages", "90 s"]], s2: [["pogos", "2 × 10", "45 s"], ["departs-reactifs", "4 passages", "60 s"]] },
  },
  puissance: {
    entree: { s1: [["squat-lourd", "2-3 × 4-5", "2-3 min", "ou hip thrust lourd"], ["lancer-rotation", "2 × 4 par côté", "60 s"]], s2: [["box-jump", "2-3 × 3", "90 s"], ["lancer-poitrine", "2-3 × 4", "60 s"]] },
    intensite: { s1: [["squat-lourd", "2-3 × 3", "3 min"], ["squat-jump", "2-3 × 3", "90 s", "juste après le squat, en contraste"], ["lancer-rotation", "2-3 × 4 par côté", "60 s"]], s2: [["hip-thrust-lourd", "2-3 × 4", "2 min"], ["lancer-haut", "2-3 × 4", "60 s"], ["pompes-explosives", "2 × 4-5", "60 s"]] },
    niveau: { s1: [["squat-lourd", "2-3 × 3", "3 min"], ["saut-cmj", "2-3 × 3", "90 s", "juste après le squat, en contraste"], ["developpe-couche", "2-3 × 3-4", "2-3 min"]], s2: [["box-jump", "2-3 × 3", "90 s"], ["lancer-poitrine", "2-3 × 4", "60 s"], ["lancer-rotation", "2 × 4 par côté", "60 s"]] },
    treve: { s1: [["squat-lourd", "2 × 3", "3 min"], ["lancer-rotation", "2 × 4 par côté", "60 s"]], s2: [["saut-cmj", "2 × 3", "90 s"], ["lancer-poitrine", "2 × 4", "60 s"]] },
  },
  muscle: {
    entree: { s1: [["squat", "2-3 × 6-8", "2 min", "ou squat bulgare"], ["rowing", "2-3 × 8", "90 s", "ou tractions"], ["hip-thrust", "2 × 8-10", "75 s"]], s2: [["pompes", "2 × 8-10", "60 s"], ["pallof", "2 × 10 par côté", "30 s"], ["fermier", "2 × 20 m", "60 s"]] },
    intensite: { s1: [["squat-bulgare", "2-3 × 6 par jambe", "90 s"], ["tractions", "2-3 × 5-8", "2 min", "ou rowing"], ["sdt-roumain", "2-3 × 6-8", "90 s"]], s2: [["developpe-militaire", "2-3 × 8", "75 s"], ["fente-arriere", "2 × 8 par jambe", "75 s"], ["pallof", "2 × 10 par côté", "30 s"]] },
    niveau: { s1: [["squat", "2-3 × 5-6", "2 min"], ["rowing", "2-3 × 6-8", "90 s"], ["hip-thrust", "2-3 × 8", "75 s"]], s2: [["pompes", "2-3 × 8-12", "60 s"], ["sdt-roumain", "2 × 8", "75 s"], ["fermier", "2-3 × 20 m", "60 s"]] },
    treve: { s1: [["squat", "2 × 5-6", "2 min"], ["rowing", "2 × 8", "90 s"]], s2: [["pompes", "2 × 8-10", "60 s"], ["pallof", "2 × 10 par côté", "30 s"]] },
  },
  condition: {
    entree: { s1: [["intervalles-1515", "1-2 × 6 min", "3 min"]], s2: [["navettes-hand", "4-6 passages", "45 s"], ["footing", "8-10 min", "", "récupération"]] },
    intensite: { s1: [["intervalles-1515", "2 × 8 min", "3 min"]], s2: [["sprints-repetes", "1-2 séries", "3 min"], ["footing", "5-8 min", "", "récupération"]] },
    niveau: { s1: [["intervalles-3030", "2 × 6 min", "3 min"]], s2: [["sprints-repetes", "2 séries", "3 min"], ["footing", "5-8 min", "", "récupération"]] },
    treve: { s1: [["intervalles-1515", "1-2 × 6 min", "3 min"]], s2: [["navettes-hand", "4 passages", "45 s"], ["footing", "6-8 min", "", "récupération"]] },
  },
  prevention: {
    entree: { s1: [["squat-une-jambe", "2 × 6-8 par jambe", "45 s"], ["reception-unipodale", "2 × 4 par jambe", "30 s"]], s2: [["rotation-externe-haute", "2 × 12 par bras", "30 s"], ["equilibre-balle", "2 × 30 s par jambe", "15 s"], ["cheville-mur", "1 × 8 par côté", ""]] },
    intensite: { s1: [["squat-une-jambe", "2-3 × 8 par jambe", "45 s"], ["mollets-excentrique", "2 × 8 par jambe", "45 s"], ["hanches-9090", "1 × 8 par côté", ""]], s2: [["pompes-scapulaires", "2 × 10", "30 s"], ["reception-unipodale", "2 × 5 par jambe", "30 s"], ["rotation-thoracique", "1 × 8 par côté", ""]] },
    niveau: { s1: [["reception-unipodale", "2-3 × 5 par jambe", "30 s"], ["squat-une-jambe", "2-3 × 8 par jambe", "45 s"]], s2: [["rotation-externe-haute", "2-3 × 12 par bras", "30 s"], ["equilibre-balle", "2 × 30 s par jambe", "15 s"], ["hanches-9090", "1 × 8 par côté", ""]] },
    treve: { s1: [["squat-une-jambe", "2 × 8 par jambe", "45 s"], ["cheville-mur", "1 × 8 par côté", ""]], s2: [["rotation-externe-haute", "2 × 12 par bras", "30 s"], ["equilibre-balle", "2 × 30 s par jambe", "15 s"]] },
  },
};

// A single goal: two blocks per session, with a name each (the emphasis changes over the blocks;
// what was built before stays with fewer sets).
export const p1Solo = {
  explosivite: {
    names: ["Sauts", "Vitesse et changements de direction"],
    entree: { s1: [[["saut-cmj", "2-3 × 4", "75 s"], ["squat-jump", "2 × 4", "75 s"]], [["departs-10", "4-5 passages", "75 s"], ["sprint-20", "2-3 passages", "2 min"]]], s2: [[["pogos", "2 × 10", "45 s"], ["skater-hop", "2 × 4 par jambe", "45 s"]], [["navette-5105", "2-3 passages", "90 s"], ["departs-reactifs", "4-5 passages", "60 s"]]] },
    intensite: { s1: [[["squat-jump", "3 × 3", "90 s", "hauteur maximale"], ["bonds", "2-3 × 3", "90 s", "bonds horizontaux"]], [["sprint-20", "3-4 passages", "2 min"], ["departs-10", "4 passages", "75 s"]]], s2: [[["skater-hop", "2-3 × 4 par jambe", "45 s"], ["pogos", "2 × 12", "45 s"]], [["pas-chasses-depart", "4-6 passages", "60 s"], ["departs-reactifs", "4-6 passages", "60 s"]]] },
    niveau: { s1: [[["saut-cmj", "3 × 3", "90 s"], ["box-jump", "2 × 3", "90 s"]], [["departs-10", "4-6 passages", "75 s"], ["sprint-20", "3-4 passages", "2 min"]]], s2: [[["pogos", "2 × 12", "45 s"], ["bonds", "2 × 3", "90 s", "triple bond"]], [["navette-5105", "3-4 passages", "90 s"], ["pas-chasses-depart", "4-6 passages", "60 s"]]] },
    treve: { s1: [[["saut-cmj", "2-3 × 3", "90 s"]], [["departs-10", "3-4 passages", "90 s"], ["sprint-20", "2 passages", "2 min"]]], s2: [[["pogos", "2 × 10", "45 s"]], [["departs-reactifs", "4 passages", "60 s"], ["pas-chasses-depart", "3-4 passages", "60 s"]]] },
  },
  puissance: {
    names: ["Force lourde", "Lancers et sauts"],
    entree: { s1: [[["squat-lourd", "2-3 × 4-5", "2-3 min"], ["hip-thrust-lourd", "2 × 5", "2 min"]], [["lancer-rotation", "2 × 4 par côté", "60 s"], ["saut-cmj", "2 × 3", "90 s"]]], s2: [[["developpe-couche", "2-3 × 4-5", "2-3 min"], ["tirage-lourd", "2 × 5", "2 min"]], [["box-jump", "2-3 × 3", "90 s"], ["lancer-poitrine", "2-3 × 4", "60 s"]]] },
    intensite: { s1: [[["squat-lourd", "2-3 × 3", "3 min"], ["squat-jump", "2-3 × 3", "90 s", "juste après le squat, en contraste"]], [["lancer-rotation", "2-3 × 4 par côté", "60 s"], ["lancer-haut", "2 × 4", "60 s"]]], s2: [[["hip-thrust-lourd", "2-3 × 4", "2 min"], ["developpe-couche", "2-3 × 3-4", "2-3 min"]], [["pompes-explosives", "2 × 4-5", "60 s"], ["box-jump", "2 × 3", "90 s"]]] },
    niveau: { s1: [[["squat-lourd", "2-3 × 3", "3 min"], ["saut-cmj", "2-3 × 3", "90 s", "juste après le squat, en contraste"]], [["lancer-rotation", "2-3 × 4 par côté", "60 s"], ["lancer-poitrine", "2 × 4", "60 s"]]], s2: [[["developpe-couche", "2-3 × 3", "3 min"], ["pompes-explosives", "2 × 4", "60 s", "juste après, en contraste"]], [["box-jump", "2-3 × 3", "90 s"], ["lancer-haut", "2 × 4", "60 s"]]] },
    treve: { s1: [[["squat-lourd", "2 × 3", "3 min"]], [["lancer-rotation", "2 × 4 par côté", "60 s"], ["saut-cmj", "2 × 3", "90 s"]]], s2: [[["developpe-couche", "2 × 3-4", "3 min"]], [["lancer-poitrine", "2 × 4", "60 s"], ["box-jump", "2 × 3", "90 s"]]] },
  },
  muscle: {
    names: ["Bas du corps", "Haut du corps et tronc"],
    entree: { s1: [[["squat", "2-3 × 6-8", "2 min", "ou squat bulgare"], ["hip-thrust", "2 × 8-10", "75 s"]], [["rowing", "2-3 × 8", "90 s", "ou tractions"], ["pompes", "2 × 8-10", "60 s"]]], s2: [[["fente-arriere", "2 × 8 par jambe", "75 s"], ["sdt-roumain", "2 × 8", "75 s"]], [["developpe-militaire", "2 × 8", "75 s"], ["pallof", "2 × 10 par côté", "30 s"], ["fermier", "2 × 20 m", "60 s"]]] },
    intensite: { s1: [[["squat-bulgare", "2-3 × 6 par jambe", "90 s"], ["sdt-roumain", "2-3 × 6-8", "90 s"]], [["tractions", "2-3 × 5-8", "2 min", "ou rowing"], ["pompes", "2-3 × 8-10", "60 s"]]], s2: [[["squat", "2-3 × 6", "2 min"], ["hip-thrust", "2 × 8", "75 s"]], [["developpe-militaire", "2-3 × 8", "75 s"], ["rowing", "2 × 8", "75 s"], ["pallof", "2 × 10 par côté", "30 s"]]] },
    niveau: { s1: [[["squat", "2-3 × 5-6", "2 min"], ["hip-thrust", "2-3 × 8", "75 s"]], [["rowing", "2-3 × 6-8", "90 s"], ["pompes", "2-3 × 8-12", "60 s"]]], s2: [[["squat-bulgare", "2 × 8 par jambe", "75 s"], ["sdt-roumain", "2 × 8", "75 s"]], [["tractions", "2 × 5-8", "2 min", "ou rowing"], ["fermier", "2-3 × 20 m", "60 s"]]] },
    treve: { s1: [[["squat", "2 × 5-6", "2 min"]], [["rowing", "2 × 8", "90 s"], ["pompes", "2 × 8-10", "60 s"]]], s2: [[["hip-thrust", "2 × 8", "75 s"]], [["developpe-militaire", "2 × 8", "75 s"], ["pallof", "2 × 10 par côté", "30 s"]]] },
  },
  condition: {
    names: ["Intervalles", "Efforts répétés et récupération"],
    entree: { s1: [[["intervalles-1515", "1-2 × 6 min", "3 min"]], [["navettes-hand", "4 passages", "45 s"]]], s2: [[["intervalles-3030", "1 × 6 min", "3 min"]], [["footing", "10 min", "", "récupération"]]] },
    intensite: { s1: [[["intervalles-1515", "2 × 8 min", "3 min"]], [["navettes-hand", "4-6 passages", "45 s"]]], s2: [[["sprints-repetes", "1-2 séries", "3 min"]], [["footing", "8 min", "", "récupération"]]] },
    niveau: { s1: [[["intervalles-3030", "2 × 6 min", "3 min"]], [["sprints-repetes", "1 série", "3 min"]]], s2: [[["sprints-repetes", "2 séries", "3 min"]], [["footing", "8 min", "", "récupération"]]] },
    treve: { s1: [[["intervalles-1515", "1-2 × 6 min", "3 min"]], [["navettes-hand", "4 passages", "45 s"]]], s2: [[["sprints-repetes", "1 série", "3 min"]], [["footing", "6-8 min", "", "récupération"]]] },
  },
  prevention: {
    names: ["Genoux et chevilles", "Épaules, hanches et mobilité"],
    entree: { s1: [[["squat-une-jambe", "2 × 6-8 par jambe", "45 s"], ["reception-unipodale", "2 × 4 par jambe", "30 s"]], [["rotation-externe-haute", "2 × 12 par bras", "30 s"], ["hanches-9090", "1 × 8 par côté", ""]]], s2: [[["equilibre-balle", "2 × 30 s par jambe", "15 s"], ["mollets-excentrique", "2 × 8 par jambe", "45 s"]], [["pompes-scapulaires", "2 × 10", "30 s"], ["cheville-mur", "1 × 8 par côté", ""]]] },
    intensite: { s1: [[["squat-une-jambe", "2-3 × 8 par jambe", "45 s"], ["mollets-excentrique", "2 × 8 par jambe", "45 s"]], [["rotation-externe-haute", "2-3 × 12 par bras", "30 s"], ["hanches-9090", "1 × 8 par côté", ""]]], s2: [[["reception-unipodale", "2 × 5 par jambe", "30 s"], ["equilibre-balle", "2 × 30 s par jambe", "15 s"]], [["pompes-scapulaires", "2 × 10", "30 s"], ["rotation-thoracique", "1 × 8 par côté", ""]]] },
    niveau: { s1: [[["reception-unipodale", "2-3 × 5 par jambe", "30 s"], ["squat-une-jambe", "2-3 × 8 par jambe", "45 s"]], [["rotation-externe-haute", "2-3 × 12 par bras", "30 s"], ["rotation-thoracique", "1 × 8 par côté", ""]]], s2: [[["mollets-excentrique", "2 × 10 par jambe", "45 s"], ["equilibre-balle", "2 × 30 s par jambe", "15 s"]], [["pompes-scapulaires", "2 × 12", "30 s"], ["hanches-9090", "1 × 8 par côté", ""]]] },
    treve: { s1: [[["squat-une-jambe", "2 × 8 par jambe", "45 s"]], [["rotation-externe-haute", "2 × 12 par bras", "30 s"], ["cheville-mur", "1 × 8 par côté", ""]]], s2: [[["equilibre-balle", "2 × 30 s par jambe", "15 s"]], [["pompes-scapulaires", "2 × 10", "30 s"], ["hanches-9090", "1 × 8 par côté", ""]]] },
  },
};

// Week 18 (and week 9 if the league stops for the autumn holidays): 3 short sessions without
// equipment, the same for every goal, done at home (gyms are often closed then).
export const TREVE = [
  { title: "Séance A · Jambes et sauts · 25 min", rows: [["squat", "3 × 15", "45 s"], ["fente-arriere", "3 × 10 par jambe", "45 s"], ["squat-jump", "3 × 5", "60 s"], ["planche", "2 × 30 s", "30 s"]] },
  { title: "Séance B · Course · 25 min", rows: [["intervalles-1515", "2 × 6 min", "3 min"], ["navettes-hand", "4 passages", "45 s"], ["footing", "5 min", "", "récupération"]] },
  { title: "Séance C · Gainage et épaules · 20 min", rows: [["planche", "2 × 30 s", "30 s"], ["gainage-lateral", "2 × 20 s par côté", "20 s"], ["nordic", "2 × 4", "60 s"], ["rotation-externe", "2 × 12 par bras", "30 s"], ["ytw", "2 × 8", "30 s"]] },
];

// The optional 10-minute shoulder routine: prevention 3 times a week (Andersson et al., BJSM
// 2017), for instance before club training.
export const EPAULES = { title: "Routine épaules · 10 min (facultative)", rows: [["rotation-externe", "2 × 12 par bras", "20 s"], ["ytw", "2 × 8", "20 s"], ["pompes-scapulaires", "2 × 10", "20 s"], ["rotation-thoracique", "1 × 8 par côté", ""]] };
