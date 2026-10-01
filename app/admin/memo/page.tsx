import Nav from "../Nav";
import { MAX_DEVICES } from "@/lib/access";
import { PROMO_PERCENT } from "@/lib/feedback";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, SPONSOR_PERCENT, VALIDATION_DAYS } from "@/lib/referral";
import { TIP_DAYS } from "@/lib/email";

// What the site does on its own, the Vercel settings and what each is for (never their values),
// and the steps to go live.
export const metadata = { title: "Aide-mémoire | Admin 6M Lab" };
const on = (v?: string) => (v ? <span className="tag ok">réglé</span> : <span className="tag">non réglé</span>);

export default function Memo() {
  const env = process.env;
  const VARS: [string, string, boolean][] = [
    ["SITE_PUBLIC", "« oui » ouvre le site aux moteurs de recherche. Sans elle, le site est en mode fermé (visible avec le lien, mais pas référencé).", !!env.SITE_PUBLIC],
    ["PROGRAMMES_ENVOI_AUTO", "« 1 » joint automatiquement les PDF à l'email de confirmation. Sans elle, tu envoies chaque programme à la main (page Programmes).", !!env.PROGRAMMES_ENVOI_AUTO],
    ["NEXT_PUBLIC_SITE_URL", "L'adresse du site (liens des emails). À changer avec le nom de domaine.", !!env.NEXT_PUBLIC_SITE_URL],
    ["PROGRAMMES_SITE_URL", "L'adresse utilisée par l'œil des PDF. Si elle change, il faut régénérer les PDF.", !!env.PROGRAMMES_SITE_URL],
    ["STRIPE_SECRET_KEY", "La clé secrète Stripe (paiements).", !!env.STRIPE_SECRET_KEY],
    ["STRIPE_WEBHOOK_SECRET", "Le secret du webhook Stripe (confirmation des paiements, envoi des emails).", !!env.STRIPE_WEBHOOK_SECRET],
    ["STRIPE_ALLOW_LIVE", "« 1 » autorise les vraies clés de paiement (sk_live). Sans elle, seul le mode test fonctionne.", !!env.STRIPE_ALLOW_LIVE],
    ["MAIL_USER, MAIL_PASSWORD, MAIL_FROM", "Le compte iCloud qui envoie les emails (mot de passe pour app) et l'adresse d'envoi.", !!(env.MAIL_USER && env.MAIL_PASSWORD)],
    ["ADMIN_PASSWORD", "Le mot de passe de cet espace (identifiant : 6mlab).", !!env.ADMIN_PASSWORD],
    ["CRON_SECRET", "Protège la tâche quotidienne (emails d'avis, conseils, relances, saison).", !!env.CRON_SECRET],
    ["FEEDBACK_SECRET, ACCESS_SECRET", "Signent les liens des questionnaires et les accès aux animations.", !!(env.FEEDBACK_SECRET || env.ACCESS_SECRET)],
    ["KV_REST_API_URL / UPSTASH_REDIS_REST_URL (+ TOKEN)", "La base qui compte les visites (Audience) et limite les envois de formulaires.", !!(env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL)],
  ];
  return (
    <main>
      <Nav here="memo" />
      <h1>Aide-mémoire</h1>
      <p className="sub">Ce que le site fait tout seul, les réglages, et comment faire évoluer le site.</p>

      <h2>Ce que le site fait tout seul</h2>
      <div className="grid">
        <div className="card"><h3>Après un paiement</h3><p>Le client reçoit la confirmation (et ses PDF si l'envoi automatique est activé, sinon « envoi sous 48 heures »). Tu reçois un email avec tout ce qu'il faut pour préparer l'envoi : programme, objectifs, lieu, langue, prénom, âge, genre.</p></div>
        <div className="card"><h3>Accès aux animations</h3><p>La référence de commande ouvre l'accès. Il démarre à la première ouverture, dure la durée du programme + 2 semaines, doit être ouvert dans les 12 mois, sur {MAX_DEVICES} appareils au plus (bouton « Libérer » dans Commandes & avis). Email au client 7 jours avant la fin.</p></div>
        <div className="card"><h3>Avis clients</h3><p>Questionnaire 1 deux semaines après l'achat, questionnaire 2 à la fin du programme (8 semaines pour la Pré-saison, 18 pour la 1re partie, 23 pour la 2e partie ; pour la Saison complète, à la fin de sa 1re partie). Code de -{PROMO_PERCENT} % offert après le questionnaire final. Tu choisis les avis affichés sur le site.</p></div>
        <div className="card"><h3>Séance gratuite</h3><p>Le PDF part tout de suite, puis 3 conseils par email, {TIP_DAYS.join(", ")} jours après la demande.</p></div>
        <div className="card"><h3>Emails de saison</h3><p>Le 20 juin (reprise), le 5 septembre (saison) et le 15 décembre (trêve), aux abonnés de la séance gratuite qui l'ont accepté, pendant 7 jours, 150 par jour au plus.</p></div>
        <div className="card"><h3>Paniers abandonnés</h3><p>Un seul rappel, dans les 24 heures, si l'acheteur a coché « recevoir des offres » sur la page de paiement et n'a pas commandé depuis.</p></div>
        <div className="card"><h3>Demandes de devis clubs</h3><p>Chaque demande t'arrive par email (répondre écrit au coach). 5 demandes par heure au plus depuis une même connexion.</p></div>
        <div className="card"><h3>Chaque matin (vers 10-11 h)</h3><p>Une tâche automatique envoie tout ce qui est dû : avis, conseils, fin d'accès, relances, emails de saison.</p></div>
        <div className="card"><h3>Parrainage</h3><p>Chaque acheteur reçoit son code (email de confirmation et bibliothèque d'exercices). Un coéquipier qui le saisit au paiement a -{FRIEND_PERCENT} %. Le parrain gagne {POINTS_PER_FRIEND} points par coéquipier, validés {VALIDATION_DAYS} jours après sa commande (pas de remboursement, email et carte jamais vus pour ce parrain) ; à {POINTS_FOR_REWARD} points, il reçoit un code de -{SPONSOR_PERCENT} % à usage unique, valable un an. Les points et les filleuls s'affichent dans Commandes & avis.</p></div>
        <div className="card"><h3>Si quelque chose échoue</h3><p>Paiement, envoi de programme, formulaire ou emails du matin : tu reçois un email « ⚠ 6M Lab » avec quoi faire, et l'alerte s'affiche en haut de l'accueil de l'admin. La même alerte part une fois par jour au plus.</p></div>
      </div>

      <h2>Réglages Vercel</h2>
      <p className="sub">Vercel &gt; ton projet &gt; Settings &gt; Environment Variables, puis redéployer. Ne partage jamais les valeurs : seul leur rôle est écrit ici.</p>
      <dl className="vars">{VARS.map(([k, d, set]) => <div key={k} style={{ display: "contents" }}><dt>{k} {on(set ? "1" : "")}</dt><dd>{d}</dd></div>)}</dl>

      <h2>Faire évoluer le site</h2>
      <div className="card"><ol className="steps">
        <li>Tu demandes la modification à Claude (texte, exercice, page, programme).</li>
        <li>Claude la prépare dans une PR sur GitHub, avec un lien de test.</li>
        <li>Tu vérifies sur le lien de test ; si c'est bon, tu fusionnes la PR : le site se met à jour en 1 à 2 minutes.</li>
        <li>Les documents de cet espace (Méthode Clubs, exemple club, Dossier Gardiens) se mettent à jour de la même façon.</li>
      </ol></div>

      <h2>Emails depuis ton domaine (après le choix du domaine)</h2>
      <div className="card">
        <p>Aujourd'hui, le site envoie ses emails avec ton compte iCloud. Avec ton domaine, ils partiront de contact@ton-domaine, et trois réglages prouveront aux messageries (Gmail, Outlook…) que c'est bien toi : c'est ce qui évite les spams.</p>
        <ol className="steps">
          <li><b>iCloud+</b> : vérifie que ton compte Apple a un abonnement iCloud+ (le plus petit suffit). Réglages iCloud, puis « Domaine de messagerie personnalisé », puis ajoute ton domaine.</li>
          <li><b>Les réglages DNS</b> : Apple te donne des lignes à copier chez l'hébergeur de ton domaine (ou dans Vercel si le domaine y est géré) : MX (recevoir), TXT « v=spf1 … » (SPF : qui a le droit d'envoyer), CNAME « sig1._domainkey » (DKIM : la signature des emails) et un TXT de vérification. Copie-les exactement.</li>
          <li><b>DMARC</b>, à ajouter toi-même : une ligne TXT nommée _dmarc, valeur <code>v=DMARC1; p=none; rua=mailto:contact@ton-domaine</code>. Après quelques semaines sans problème, remplace p=none par p=quarantine.</li>
          <li><b>L'adresse</b> : crée contact@ton-domaine dans iCloud, puis attends la validation d'Apple (souvent moins d'une heure).</li>
          <li><b>Vercel</b> : MAIL_FROM = contact@ton-domaine. MAIL_USER (ton identifiant Apple) et MAIL_PASSWORD (le mot de passe pour app) ne changent pas.</li>
          <li><b>Le site</b> : demande à Claude de remplacer l'adresse de contact des mentions légales, de la FAQ et des emails par la nouvelle.</li>
          <li><b>Le test</b> : envoie un email depuis la séance gratuite du site vers l'adresse donnée par mail-tester.com, et vise au moins 9/10.</li>
        </ol>
      </div>

      <h2>Mise en ligne (quand tu auras ton nom de domaine)</h2>
      <div className="card"><ol className="steps">
        <li>Compléter les mentions légales (nom, SIRET, adresse, médiateur).</li>
        <li>Emails depuis le domaine : suivre la marche à suivre ci-dessus.</li>
        <li>Brancher le domaine sur Vercel, puis mettre à jour NEXT_PUBLIC_SITE_URL et PROGRAMMES_SITE_URL.</li>
        <li>Régénérer les PDF pour que l'œil pointe vers le nouveau domaine (à faire avec Claude).</li>
        <li>Stripe en mode réel : clé sk_live, nouveau webhook sur le domaine, STRIPE_ALLOW_LIVE=1.</li>
        <li>Activer l'envoi automatique des PDF (PROGRAMMES_ENVOI_AUTO=1) quand tu les as validés.</li>
        <li>Ouvrir le site : SITE_PUBLIC=oui, puis l'inscrire sur Google Search Console.</li>
      </ol></div>
    </main>
  );
}
