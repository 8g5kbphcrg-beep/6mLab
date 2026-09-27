import Nav from "./Nav";
import { todos } from "@/lib/admin-todo";
import { SITE } from "@/lib/dict";

// Home of the admin: every section in one place, and what is still waiting.
export const dynamic = "force-dynamic";

const CARDS = [
  ["/admin/audience", "Audience & ventes", "Visites, parcours d'achat, ventes et chiffre d'affaires sur 7, 30 ou 90 jours, par source."],
  ["/admin/avis", "Commandes & avis", "Chaque commande : accès aux animations, avis des clients, relances. Export des avis."],
  ["/admin/programmes", "Programmes", "Retrouver les PDF d'une commande (déjà personnalisés) pour un envoi à la main, la séance gratuite, et toutes les animations."],
  ["/admin/clubs", "Clubs", "Répondre à une demande de devis : marche à suivre, Méthode Clubs, exemple U18, Dossier Gardiens, fiche de suivi à imprimer."],
  ["/admin/memo", "Aide-mémoire", "Ce que le site fait tout seul, les réglages Vercel et à quoi ils servent, la mise en ligne."],
] as const;

export default function Admin() {
  const list = todos();
  return (
    <main>
      <Nav here="accueil" />
      <h1>Espace 6M Lab</h1>
      <p className="sub">Tout ce qui te sert pour piloter le site, au même endroit.</p>
      <div className="cards">
        {CARDS.map(([href, t, d]) => <a key={href} className="card" href={href}><h3>{t}</h3><p>{d}</p></a>)}
      </div>
      <h2>En attente</h2>
      <div className="card">
        <ul className="todo">
          {list.map((x) => <li key={x.t}><b>{x.t}</b> <span className="tag">{x.you ? "de ta part" : "à faire avec Claude"}</span><br /><span className="muted">{x.d}</span></li>)}
        </ul>
      </div>
      <h2>Liens utiles</h2>
      <div className="card">
        <ul>
          <li><a href={`/fr`}>Le site</a> (adresse actuelle : {SITE})</li>
          <li><a href="https://dashboard.stripe.com/test/payments">Stripe</a> : paiements et remboursements (mode test pour l'instant)</li>
          <li><a href="https://vercel.com/6-ml-ab/6m-lab">Vercel</a> : déploiements, réglages (variables), statistiques détaillées (Web Analytics)</li>
          <li><a href="https://github.com/8g5kbphcrg-beep/6mLab/pulls">GitHub</a> : les modifications à valider (PR)</li>
        </ul>
      </div>
    </main>
  );
}
