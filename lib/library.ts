import { DR, TXT } from "@/lib/club-drills";

// The two exercise libraries. The individual one (app/[lang]/exercices) holds every animated
// exercise, for customers of the individual programs. The club one (app/[lang]/clubs/bibliotheque),
// opened with a team's club code (lib/club-access.ts), holds the collective drills, the goalkeeper
// drills and tests, and only the individual exercises used in the club programs.
export const FAMILIES: [string, string, string[]][] = [
  ["Échauffement et mobilité", "Warm-up and mobility", ["footing-dynamique", "montees-genoux", "fente-rotation", "ouverture-hanche", "hanches-9090", "cheville-mur", "rotation-thoracique"]],
  ["Sauts et explosivité", "Jumps and power", ["saut-reception", "reception-unipodale", "snap-down", "pogos", "squat-jump", "saut-cmj", "squat-jump-leste", "skater-hop", "bonds", "box-jump", "drop-jump"]],
  ["Vitesse et appuis", "Speed and footwork", ["accelerations", "departs-10", "departs-reactifs", "sprint-20", "freinage", "navette-5105", "pas-chasses-depart"]],
  ["Force", "Strength", ["squat", "squat-lourd", "fente-arriere", "squat-bulgare", "squat-une-jambe", "sdt-roumain", "hip-thrust", "hip-thrust-lourd", "pompes", "pompes-explosives", "developpe-couche", "developpe-militaire", "rowing", "tirage-lourd", "tractions", "fermier"]],
  ["Lancers", "Throws", ["lancer-poitrine", "lancer-rotation", "lancer-haut"]],
  ["Gainage", "Core", ["planche", "gainage-lateral", "dead-bug", "pallof", "copenhague"]],
  ["Prévention des blessures", "Injury prevention", ["pont-fessier", "pont-une-jambe", "equilibre", "equilibre-balle", "nordic", "mollets-excentrique", "ytw", "rotation-externe", "rotation-externe-haute", "pompes-scapulaires"]],
  ["Gardiens de but", "Goalkeepers", ["fente-laterale", "cosaque", "adduction"]],
  ["Condition physique", "Conditioning", ["footing", "intervalles-1515", "intervalles-3030", "sprints-repetes", "navettes-hand", "circuit"]],
];

// Individual exercises of the club programs (the club documents' "-club" variants are the same
// exercises with the club's equipment: their page is the base exercise).
export const CLUB_EXERCISES = ["fente-rotation", "ouverture-hanche", "pont-fessier", "equilibre", "saut-reception", "squat", "fente-arriere", "pont-une-jambe", "pompes", "rowing", "nordic", "copenhague", "rotation-externe", "planche", "gainage-lateral", "snap-down", "pogos", "squat-jump", "skater-hop", "departs-10", "rotation-externe-haute", "ytw", "hanches-9090", "pallof", "sdt-roumain", "hip-thrust", "squat-bulgare", "pompes-explosives", "box-jump", "bonds", "lancer-rotation", "lancer-poitrine", "lancer-haut", "departs-reactifs", "reception-unipodale", "equilibre-balle", "montees-genoux", "tirage-lourd", "developpe-couche", "fente-laterale", "cosaque", "adduction"];

// The drills and texts of the club library, by group.
const drills = Object.keys(DR);
export const CLUB_GROUPS: [string, string, string[]][] = [
  ["Situations collectives", "Collective drills", drills.filter((id) => !id.startsWith("gk-") && !["505", "3015"].includes(id))],
  ["Ateliers des gardiens", "Goalkeeper drills", drills.filter((id) => id.startsWith("gk-"))],
  ["Tests", "Tests", ["505", "3015"].filter((id) => DR[id])],
  ["Course et retour au calme", "Running and cool-down", Object.keys(TXT)],
];
export const clubItem = (id: string) => DR[id] ?? TXT[id] ?? null;
