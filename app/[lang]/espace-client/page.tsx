import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, SITE, type Lang } from "@/lib/dict";
import { sessionEmail } from "@/lib/access-page";
import { accessWeeks, endOf, MAX_DEVICES } from "@/lib/access";
import { ordersOf, type ClientOrder } from "@/lib/client-auth";
import { stripe } from "@/lib/feedback";
import { programs } from "@/lib/programs";
import { alert, why } from "@/lib/alert";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, referralCode, SPONSOR_PERCENT, VALIDATION_DAYS } from "@/lib/referral";
import ShareCode from "@/components/ShareCode";
import "@/app/exercice.css";
import "@/app/library.css";

// Customer area: logged in with an order reference and a 6-digit code sent to its email
// (lib/client-auth.ts), which opens every order of that email,
// for the visit only. One card per order, to activate its library (after a confirmation: the
// countdown cannot be paused) or open it; and the referral card (one code per person).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Espace client | 6M Lab", robots: { index: false } };

const DAY_MS = 86400000;
const NEXT = /^\/(fr|en)\/exercices(\/[a-z0-9-]+){0,2}$/;
type Q = { etape?: string; erreur?: string; acces?: string; activer?: string; next?: string; renvoye?: string };
type P = { params: Promise<{ lang: string }>; searchParams: Promise<Q> };

// The orders of the email and the referral, which lives on the order that owns the code.
async function load(email: string) {
  const s = stripe();
  if (!s) return null;
  const orders = await ordersOf(s, email);
  if (!orders.length) return null;
  const home = orders.find((o) => o.meta.par_code && !o.meta.par_home) ?? orders[0];
  let code: string | null = null, pending = 0;
  try {
    code = await referralCode(s, home.pi, home.meta.firstName ?? "", home.meta.par_code);
    // Teammates who ordered this week, whose points are not validated yet.
    pending = (await s.paymentIntents.search({ query: `metadata['par_by']:'${home.pi}' AND metadata['par_st']:'attente'`, limit: 20 })).data.length;
  } catch (e) {
    await alert(`espace:${home.pi}`, "Espace client : le parrainage n'a pas pu s'afficher", [`Commande ${home.pi} (${home.meta.firstName ?? ""})`, `Erreur : ${why(e)}`, "", "Transmets cette alerte à Claude pour qu'il corrige."]);
  }
  const m = home.meta;
  return { orders, firstName: orders[orders.length - 1].meta.firstName ?? "", code, pts: Number(m.par_pts || 0), n: Number(m.par_n || 0), r: Number(m.par_r || 0), pending };
}

export default async function CustomerArea({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const l = lang as Lang, fr = l === "fr";
  const q = await searchParams, next = q.next && NEXT.test(q.next) ? q.next : "";
  const email = await sessionEmail();
  const me = email ? await load(email).catch(() => null) : null;
  if (!me) return <Login lang={l} q={q} next={next} />;

  const slots = POINTS_FOR_REWARD / POINTS_PER_FRIEND, left = Math.ceil((POINTS_FOR_REWARD - me.pts) / POINTS_PER_FRIEND);
  const accessErrors: Record<string, [string, string]> = {
    remboursee: ["Cette commande a été remboursée : l'accès aux animations n'est plus disponible.", "This order was refunded: access to the animations is no longer available."],
    "trop-tard": ["L'accès de cette commande devait être activé dans les 12 mois suivant l'achat. Écris-nous si besoin.", "This order's access had to be activated within 12 months of the purchase. Write to us if needed."],
    expiree: ["L'accès aux animations de cette commande est terminé. Ton PDF reste à toi.", "The access to the animations of this order has ended. Your PDF is yours to keep."],
    appareils: [`Cet accès est déjà ouvert sur ${MAX_DEVICES} appareils. Écris-nous pour libérer une place (par exemple si tu as changé de téléphone).`, `This access is already open on ${MAX_DEVICES} devices. Write to us to free a spot (for example if you changed phones).`],
    indisponible: ["Ça n'a pas fonctionné. Réessaie dans quelques minutes, ou écris-nous.", "It did not work. Try again in a few minutes, or write to us."],
  };
  return (
    <div className="lib wrap">
      <header className="cs-head">
        <p className="lib-k">{fr ? "Espace client" : "Customer area"}</p>
        <h1>{me.firstName ? (fr ? `Salut ${me.firstName} !` : `Hi ${me.firstName}!`) : (fr ? "Ton espace" : "Your area")}</h1>
        <p className="cs-prog">{email}</p>
      </header>
      {q.acces && q.acces !== "a-confirmer" && accessErrors[q.acces] && <p className="acc-err" role="alert">{accessErrors[q.acces][fr ? 0 : 1]}</p>}
      {next && <p className="cs-note" role="status">{fr ? "Choisis ta commande pour ouvrir l'exercice." : "Choose your order to open the exercise."}</p>}
      <div className="cs-grid">
        <div className="cs-col">
          {me.orders.filter((o) => !o.refunded).reverse().map((o) => <AccessCard key={o.pi} o={o} lang={l} confirm={q.activer === o.pi} next={next} />)}
        </div>
        <section className="cs-card cs-par" aria-labelledby="cs-par-h">
          <h2 id="cs-par-h">{fr ? "Parrainage" : "Referral"}</h2>
          <p className="cs-muted">{fr ? `Tes coéquipiers ont -${FRIEND_PERCENT} % avec ton code. Chacun te rapporte ${POINTS_PER_FRIEND} points : à ${POINTS_FOR_REWARD}, tu gagnes -${SPONSOR_PERCENT} % sur ton prochain programme.` : `Your teammates get ${FRIEND_PERCENT}% off with your code. Each one earns you ${POINTS_PER_FRIEND} points: at ${POINTS_FOR_REWARD}, you win ${SPONSOR_PERCENT}% off your next program.`}</p>
          {me.code ? <>
            <p className="cs-code"><span>{fr ? "Ton code" : "Your code"}</span><b>{me.code}</b></p>
            <ShareCode fr={fr} code={me.code} text={fr
              ? `Je fais ma prépa physique avec 6M Lab. Avec mon code ${me.code}, tu as -${FRIEND_PERCENT} % sur ton programme : ${SITE}/fr/programmes`
              : `I train with 6M Lab. With my code ${me.code}, you get ${FRIEND_PERCENT}% off your program: ${SITE}/en/programmes`} />
          </> : <p className="cs-muted">{fr ? "Ton code n'a pas pu s'afficher. Réessaie dans quelques minutes : il est aussi dans ton email de confirmation." : "Your code could not be shown. Try again in a few minutes: it is also in your confirmation email."}</p>}
          <div className="cs-pts">
            <p className="cs-pts-h"><b>{me.pts}</b> / {POINTS_FOR_REWARD} points</p>
            <ol className="cs-slots" aria-label={fr ? "Coéquipiers vers ton prochain code" : "Teammates towards your next code"}>
              {Array.from({ length: slots }, (_, i) => {
                const on = i < me.pts / POINTS_PER_FRIEND, wait = !on && i < me.pts / POINTS_PER_FRIEND + me.pending;
                return <li key={i} className={on ? "on" : wait ? "wait" : ""}><span aria-hidden="true">{on ? "✓" : wait ? "…" : i + 1}</span>{on ? (fr ? "Validé" : "Confirmed") : wait ? (fr ? "En attente" : "Pending") : `+${POINTS_PER_FRIEND}`}</li>;
              })}
              <li className="cs-prize"><span aria-hidden="true">%</span>-{SPONSOR_PERCENT} %</li>
            </ol>
            <p className="cs-muted">{fr
              ? `Encore ${left} coéquipier${left > 1 ? "s" : ""} pour ton code de -${SPONSOR_PERCENT} %. Les points sont validés ${VALIDATION_DAYS} jours après leur commande.`
              : `${left} more teammate${left > 1 ? "s" : ""} for your ${SPONSOR_PERCENT}% code. Points are confirmed ${VALIDATION_DAYS} days after their order.`}</p>
          </div>
          <dl className="cs-stats">
            <div><dt>{fr ? "Parrainés" : "Referred"}</dt><dd>{me.n + me.pending}</dd></div>
            <div><dt>{fr ? "En attente" : "Pending"}</dt><dd>{me.pending}</dd></div>
            <div><dt>{fr ? "Codes gagnés" : "Codes earned"}</dt><dd>{me.r}</dd></div>
          </dl>
        </section>
      </div>
      <form method="post" action="/api/espace" className="cs-out">
        <input type="hidden" name="lang" value={l} />
        <button name="action" value="sortie">{fr ? "Se déconnecter" : "Log out"}</button>
        <p className="cs-muted">{fr ? "Tes commandes, ta bibliothèque et tes points restent enregistrés avec ton adresse email : reconnecte-toi quand tu veux, sur n'importe quel appareil." : "Your orders, library and points stay saved with your email address: log back in whenever you want, on any device."}</p>
      </form>
    </div>
  );
}

// One order: its access to the animations, and the button to activate or open its library.
function AccessCard({ o, lang, confirm, next }: { o: ClientOrder; lang: Lang; confirm: boolean; next: string }) {
  const fr = lang === "fr", now = Date.now();
  const fmt = (ms: number) => new Date(ms).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const end = o.start ? endOf({ offer: o.offer, start: o.start }) : null;
  const state = !end ? "todo" : end > now ? "open" : "over";
  const days = end ? Math.max(0, Math.ceil((end - now) / DAY_MS)) : 0, weeks = accessWeeks(o.offer);
  const name = o.offer === "pack" ? (fr ? "Pack Saison complète" : "Full season pack") : programs[lang][o.program as keyof (typeof programs)["fr"]]?.name;
  const go = (label: string, extra?: React.ReactNode) => (
    <form method="post" action="/api/acces" className="cs-go-f">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="pi" value={o.pi} />
      {next && <input type="hidden" name="next" value={next} />}
      {extra}
      <button className="btn cs-go">{label} →</button>
    </form>
  );
  return (
    <section className="cs-card cs-acc" aria-label={name} id={o.pi}>
      <p className="cs-order">{name} <span>· {fr ? "commande du" : "ordered on"} {fmt(o.created)}</span></p>
      <h2>{fr ? "Ta bibliothèque d'exercices" : "Your exercise library"}</h2>
      {state === "open" && <>
        <p className="cs-big"><b>{days}</b> {fr ? `jour${days > 1 ? "s" : ""} restant${days > 1 ? "s" : ""}` : `day${days > 1 ? "s" : ""} left`}</p>
        <meter className="cs-meter" min={0} max={weeks * 7} value={days} aria-label={fr ? "Temps d'accès restant" : "Access time left"} />
        <p className="cs-muted">{fr ? "Ouverte jusqu'au " : "Open until "}<strong>{fmt(end!)}</strong>. {fr ? "Ton PDF, lui, reste à toi." : "Your PDF is yours to keep."}</p>
        {go(fr ? "Accéder à ma bibliothèque" : "Open my library")}
      </>}
      {state === "todo" && (confirm ? <div className="cs-confirm">
        <p><strong>{fr ? `Ta bibliothèque sera ouverte ${weeks} semaines, du ${fmt(now)} au ${fmt(now + weeks * 7 * DAY_MS)}.` : `Your library will be open for ${weeks} weeks, from ${fmt(now)} to ${fmt(now + weeks * 7 * DAY_MS)}.`}</strong></p>
        <p className="cs-muted">{fr ? "Le compte à rebours démarre maintenant et ne peut pas être mis en pause. Si tu ne commences pas ton programme aujourd'hui, reviens le jour où tu démarres." : "The countdown starts now and cannot be paused. If you are not starting your program today, come back on the day you start."}</p>
        {go(fr ? "Oui, j'active ma bibliothèque" : "Yes, activate my library", <input type="hidden" name="confirm" value="1" />)}
        <a className="cs-cancel" href={`/${lang}/espace-client${next ? `?next=${encodeURIComponent(next)}` : ""}`}>{fr ? "Pas maintenant" : "Not now"}</a>
      </div> : <>
        <p className="cs-muted">{fr ? `Pas encore activée. Elle reste ouverte ${weeks} semaines à partir de son activation (la durée de ton programme + 2 semaines) : active-la le jour où tu commences, dans les 12 mois après l'achat, sur ${MAX_DEVICES} appareils au plus.` : `Not activated yet. It stays open for ${weeks} weeks from its activation (your program + 2 weeks): activate it on the day you start, within 12 months of the purchase, on ${MAX_DEVICES} devices at most.`}</p>
        <a className="btn cs-go" href={`/${lang}/espace-client?${new URLSearchParams({ activer: o.pi, ...(next ? { next } : {}) })}#${o.pi}`}>{fr ? "Activer ma bibliothèque" : "Activate my library"} →</a>
      </>)}
      {state === "over" && <>
        <p className="cs-muted">{fr ? `Ta bibliothèque était ouverte jusqu'au ${fmt(end!)}. Ton PDF reste à toi.` : `Your library was open until ${fmt(end!)}. Your PDF is yours to keep.`}</p>
        <a className="btn cs-go" href={`/${lang}/programmes`}>{fr ? "Voir les programmes" : "See the programs"}</a>
      </>}
    </section>
  );
}

// Login in two steps, the same for everyone: the order reference, then the 6-digit code sent to
// the email of that order (also when Apple hid the address at payment: it forwards the email).
function Login({ lang, q, next }: { lang: Lang; q: Q; next: string }) {
  const fr = lang === "fr", code = q.etape === "code";
  const here = `/${lang}/espace-client${next ? `?next=${encodeURIComponent(next)}` : ""}`;
  const errors: Record<string, [string, string]> = {
    faux: ["Ce code n'est pas le bon. Vérifie le dernier email reçu.", "This code is not the right one. Check the latest email you received."],
    expire: ["Ce code a expiré ou a été trop essayé. Demande un nouveau code.", "This code has expired or was tried too many times. Ask for a new code."],
    trop: ["Trop d'essais. Réessaie dans une heure.", "Too many tries. Try again in an hour."],
    indisponible: ["Ça n'a pas fonctionné. Réessaie dans quelques minutes, ou écris-nous.", "It did not work. Try again in a few minutes, or write to us."],
  };
  return (
    <div className="exo-back">
      <div className="exo-card acc">
        <p className="acc-k">{fr ? "Espace client" : "Customer area"}</p>
        <h1>{code ? (fr ? "Entre ton code" : "Enter your code") : (fr ? "Connecte-toi à ton espace client" : "Log in to your customer area")}</h1>
        {q.erreur && errors[q.erreur] && <p className="acc-err" role="alert">{errors[q.erreur][fr ? 0 : 1]}</p>}
        {next && !code && <p>{fr ? "Les animations sont réservées aux clients : connecte-toi pour ouvrir cet exercice." : "The animations are for customers: log in to open this exercise."}</p>}
        <p>{code
          ? (fr ? "Si cette référence correspond à une commande, un code à 6 chiffres vient d'être envoyé à l'adresse email de la commande (pense aux indésirables). Il est valable 10 minutes." : "If this reference matches an order, a 6-digit code has just been sent to the email of the order (check your spam). It is valid for 10 minutes.")
          : (fr ? "Entre la référence de ta commande : elle est dans ton email de confirmation, ligne « Référence » (12 caractères), et en bas de ton PDF. Tu recevras un code à 6 chiffres par email pour entrer." : "Enter your order reference: it is in your confirmation email, on the “Reference” line (12 characters), and at the foot of your PDF. You will receive a 6-digit code by email to enter.")}</p>
        <form method="post" action="/api/espace" className="acc-form">
          <input type="hidden" name="lang" value={lang} />
          {next && <input type="hidden" name="next" value={next} />}
          {code ? <>
            <label className="sr" htmlFor="cs-code">{fr ? "Code à 6 chiffres" : "6-digit code"}</label>
            <input id="cs-code" name="code" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9 ]{6,7}" maxLength={7} placeholder="123456" className="cs-otp" />
            <button className="btn" name="action" value="verifier">{fr ? "Entrer" : "Enter"}</button>
          </> : <>
            <label className="sr" htmlFor="cs-ref">{fr ? "Référence de commande" : "Order reference"}</label>
            <input id="cs-ref" name="ref" required autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={fr ? "Ex. : a1B2c3D4e5F6" : "E.g. a1B2c3D4e5F6"} maxLength={40} />
            <button className="btn" name="action" value="envoyer">{fr ? "Recevoir mon code" : "Get my code"}</button>
          </>}
        </form>
        {code && <>
          {q.renvoye && !q.erreur && <p className="cs-sent" role="status">{fr ? "Nouveau code envoyé : utilise celui du dernier email reçu." : "New code sent: use the one from the latest email."}</p>}
          <form method="post" action="/api/espace" className="cs-resend">
            <input type="hidden" name="lang" value={lang} />
            {next && <input type="hidden" name="next" value={next} />}
            <span>{fr ? "Pas reçu ? Regarde dans les indésirables, puis" : "Nothing received? Check your spam, then"}</span>
            <button name="action" value="renvoyer">{fr ? "Renvoyer le code" : "Resend the code"}</button>
          </form>
          <p className="acc-cta"><a href={here}>{fr ? "Changer de référence" : "Change reference"}</a></p>
        </>}
        <ul className="acc-rules">
          <li>{fr ? "Tu y retrouves tes commandes, l'accès à ta bibliothèque d'exercices, ton code de parrainage et tes points." : "You will find your orders, the access to your exercise library, your referral code and your points."}</li>
          <li>{fr ? "Le code est envoyé à l'adresse email de ta commande. Si Apple l'a masquée au paiement, il arrive quand même dans ta boîte habituelle." : "The code is sent to the email of your order. If Apple hid it at payment, it still arrives in your usual inbox."}</li>
          <li>{fr ? "Tout est enregistré : tu retrouves tout en te reconnectant, sur cet appareil ou sur un autre. Pour ta sécurité, tu restes connecté le temps de ta visite (1 heure au plus)." : "Everything is saved: you find it all again when you log back in, on this device or another one. For your security, you stay logged in for your visit (1 hour at most)."}</li>
        </ul>
        <p className="acc-cta">{fr ? "Pas encore client ?" : "Not a customer yet?"} <a href={`/${lang}/programmes`}>{fr ? "Découvre les programmes" : "See the programs"}</a> · <a href={`/${lang}/exercices/seance-gratuite`}>{fr ? "Animations de la séance gratuite" : "Free session animations"}</a></p>
      </div>
    </div>
  );
}
