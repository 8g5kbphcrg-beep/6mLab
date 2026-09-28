import { owner } from "@/lib/legal";
import { CLUB_PREREQ } from "@/lib/club-prereq";
import { REATH_READY } from "@/lib/goals";
import { isLive, posts } from "@/lib/posts";

// What is still waiting, for the admin home page: read from the site itself where possible, so
// the list stays true without being updated by hand.
export type Todo = { t: string; d: string; you: boolean };
export function todos(): Todo[] {
  const missingLegal = (["name", "siret", "address", "mediator"] as const).filter((k) => owner[k].startsWith("["));
  // Advice articles: 2 a month are planned ahead; below 2 still to come, it is time to write more.
  const upcoming = posts.filter((p) => !isLive(p)).length;
  const prereqEmpty = Object.values(CLUB_PREREQ).filter((p) => p.fr.length === 0).length;
  const list: Todo[] = [
    ...(missingLegal.length ? [{ t: "Compléter les mentions légales", d: "Nom, SIRET, adresse et médiateur de la consommation (lib/legal.ts). Obligatoire avant de vendre pour de vrai.", you: true }] : []),
    ...(prereqEmpty ? [{ t: `Écrire les acquis attendus (${prereqEmpty} listes vides)`, d: "Pour chaque filière, catégorie et niveau : ce qui s'affiche dans le « i » du formulaire de devis Clubs.", you: true }] : []),
    ...(upcoming < 2 ? [{ t: upcoming ? "Plus qu'un article de conseils programmé" : "Plus aucun article de conseils programmé", d: "Le rythme est de 2 articles par mois, calés sur la saison. Demande à Claude d'écrire les prochains : ils se publient seuls à leur date.", you: false }] : []),
    ...(!REATH_READY ? [{ t: "Programme Réathlétisation", d: "Affiché « En préparation » sur le site tant qu'il n'est pas écrit.", you: true }] : []),
    { t: "Ta photo et ton parcours", d: "Pour la page À propos et la confiance des acheteurs.", you: true },
    { t: "Décider de la garantie « Satisfait ou remboursé »", d: "Oui ou non, et sur combien de jours. Le PDF reste au client ; seul l'accès aux animations s'arrête.", you: true },
    { t: "Tes propres exercices pour les clubs", d: "À ajouter à la banque d'exercices de la Méthode Clubs.", you: true },
    { t: "Accès des joueurs de club aux animations", d: "Un code d'accès club, pour que l'œil des PDF clubs ouvre les animations. À faire avant le premier devis.", you: false },
    { t: "Sortie des programmes clubs en PDF", d: "Les 4 documents d'un devis (coach, autonomie joueurs, autonomie gardiens, fiche de suivi) en PDF.", you: false },
    ...(process.env.PROGRAMMES_ENVOI_AUTO !== "1" ? [{ t: "Envoi automatique des programmes désactivé", d: "Tu envoies chaque programme à la main : la page Programmes te donne les bons PDF, déjà personnalisés. Pour l'activer : variable PROGRAMMES_ENVOI_AUTO=1 (voir l'aide-mémoire).", you: true }] : []),
    ...(process.env.SITE_PUBLIC !== "oui" ? [{ t: "Nom de domaine et mise en ligne", d: "Le site est en mode fermé (invisible des moteurs de recherche). Les étapes de mise en ligne sont dans l'aide-mémoire.", you: true }] : []),
  ];
  return list;
}
