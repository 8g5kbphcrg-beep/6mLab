import Nav from "./Nav";
import { todos } from "@/lib/admin-todo";
import { SITE } from "@/lib/dict";
import { isLive, posts } from "@/lib/posts";
import { recentAlerts } from "@/lib/alert";
import { recentLogins } from "@/lib/client-auth";

// Home of the admin: every section in one place, and what is still waiting.
export const dynamic = "force-dynamic";

const CARDS = [
  ["/admin/docs/guide-site", "Guide du site", "Les 78 points d'un site qui vend bien, de l'offre au marketing, avec leur statut et les prochains chantiers. On le reprend chaque mois."],
  ["/admin/audience", "Audience & ventes", "Visites, parcours d'achat, ventes et chiffre d'affaires sur 7, 30 ou 90 jours, par source."],
  ["/admin/avis", "Commandes & avis", "Chaque commande : accès aux animations, avis des clients, relances. Export des avis."],
  ["/admin/programmes", "Programmes", "Retrouver les PDF d'une commande (déjà personnalisés) pour un envoi à la main, la séance gratuite, et toutes les animations."],
  ["/admin/clubs", "Clubs", "Répondre à une demande de devis : marche à suivre, Méthode Clubs, exemple U18, Dossier Gardiens, fiche de suivi à imprimer."],
  ["/admin/reponses", "Réponses types", "Les réponses prêtes à copier pour les questions fréquentes (code, programme, appareils, remboursement…), en français et en anglais."],
  ["/admin/memo", "Aide-mémoire", "Ce que le site fait tout seul, les réglages Vercel et à quoi ils servent, la mise en ligne."],
] as const;

export default async function Admin() {
  const list = todos(), alerts = await recentAlerts(), logins = await recentLogins();
  return (
    <main>
      <Nav here="accueil" />
      <h1>Espace 6M Lab</h1>
      <p className="sub">Tout ce qui te sert pour piloter le site, au même endroit.</p>
      {alerts.length > 0 && (
        <div className="card alerts" id="alertes">
          <h2>⚠ Alertes récentes</h2>
          <p className="muted">Chaque alerte t'est aussi envoyée par email (une fois par jour au plus pour la même). Vide la liste quand c'est réglé.</p>
          <ul className="todo">
            {alerts.map((a) => (
              <li key={a.at + a.title}>
                <b>{a.title}</b> <span className="tag">{new Date(a.at).toLocaleString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                <br /><span className="muted">{a.details.filter(Boolean).join(" · ")}</span>
              </li>
            ))}
          </ul>
          <form method="post" action="/admin/alertes"><button className="ghost" name="action" value="clear">Vider la liste</button></form>
        </div>
      )}
      <div className="cards">
        {CARDS.map(([href, t, d]) => <a key={href} className="card" href={href}><h3>{t}</h3><p>{d}</p></a>)}
      </div>
      <h2>En attente</h2>
      <div className="card">
        <ul className="todo">
          {list.map((x) => <li key={x.t}><b>{x.t}</b> <span className="tag">{x.you ? "de ta part" : "à faire avec Claude"}</span><br /><span className="muted">{x.d}</span></li>)}
        </ul>
      </div>
      <h2>Articles de conseils</h2>
      <div className="card">
        <p className="muted">Rythme : 2 articles par mois, calés sur la saison. Un article programmé se publie seul à sa date.</p>
        <ul className="todo">
          {[...posts].sort((a, b) => b.date.localeCompare(a.date)).map((p) => (
            <li key={p.slug}>
              <b>{new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</b> <span className="tag">{isLive(p) ? "publié" : "programmé"}</span><br />
              {isLive(p) ? <a href={`/fr/conseils/${p.slug}`}>{p.title}</a> : <a href={`/admin/conseils?a=${p.slug}`}>{p.title} (aperçu)</a>}
            </li>
          ))}
        </ul>
      </div>
      <h2 id={alerts.length ? undefined : "alertes"}>Alertes</h2>
      <div className="card">
        <p className="muted">Si un paiement, un envoi de programme, un formulaire ou les emails automatiques échouent, tu reçois un email « ⚠ 6M Lab » et l'alerte s'affiche en haut de cette page. {alerts.length ? "" : "Aucune alerte pour l'instant."}</p>
        <form method="post" action="/admin/alertes"><button name="action" value="test">Envoyer une alerte de test</button></form>
      </div>
      <h2 id="connexions">Connexions à l'espace client</h2>
      <div className="card">
        <p className="muted">Les dernières demandes de code et connexions des clients (adresse en partie masquée). Si un client ne reçoit pas son code : « aucune commande » veut dire qu'il n'utilise pas l'adresse de sa commande ; « code envoyé (serveur mail : 250 …) » veut dire que le mail est bien parti, il faut alors regarder ses indésirables.</p>
        {logins.length ? <ul className="todo">
          {logins.map((e) => <li key={e.at + e.what}><span className="tag">{new Date(e.at).toLocaleString("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span> <b>{e.email}</b> : {e.what}</li>)}
        </ul> : <p className="muted">Aucune connexion pour l'instant.</p>}
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
