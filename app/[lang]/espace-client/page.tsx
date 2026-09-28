import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, SITE, type Lang } from "@/lib/dict";
import { clientPi } from "@/lib/access-page";
import { accessWeeks, endOf, MAX_DEVICES, offerOf } from "@/lib/access";
import { stripe } from "@/lib/feedback";
import { programs } from "@/lib/programs";
import { alert, why } from "@/lib/alert";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, referralCode, SPONSOR_PERCENT, VALIDATION_DAYS } from "@/lib/referral";
import ShareCode from "@/components/ShareCode";
import "@/app/exercice.css";
import "@/app/library.css";

// Customer area: opened with the order reference (lib/access.ts, clientCookie), without starting
// the access to the animations. Two cards: the access (with the way to the library, a page of its
// own) and the referral (code, sharing, points).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Espace client | 6M Lab", robots: { index: false } };

const DAY_MS = 86400000;

// The order and its referral. The code is created here for orders placed before it existed.
async function load(pi: string) {
  const s = stripe();
  if (!s) return null;
  const m = (await s.paymentIntents.retrieve(pi)).metadata ?? {};
  const offer = offerOf(m), start = m.acc_start ? Date.parse(m.acc_start) : null;
  let code: string | null = null, pending = 0;
  try {
    code = await referralCode(s, pi, m.firstName ?? "", m.par_code);
    // Teammates who ordered this week, whose points are not validated yet.
    pending = (await s.paymentIntents.search({ query: `metadata['par_by']:'${pi}' AND metadata['par_st']:'attente'`, limit: 20 })).data.length;
  } catch (e) {
    await alert(`espace:${pi}`, "Espace client : le parrainage n'a pas pu s'afficher", [`Commande ${pi} (${m.firstName ?? ""})`, `Erreur : ${why(e)}`, "", "Transmets cette alerte à Claude pour qu'il corrige."]);
  }
  return { firstName: m.firstName ?? "", offer, program: m.program, start, end: start ? endOf({ offer, start }) : null, code, pts: Number(m.par_pts || 0), n: Number(m.par_n || 0), r: Number(m.par_r || 0), pending };
}

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ erreur?: string }> };

export default async function CustomerArea({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const l = lang as Lang, fr = l === "fr";
  const pi = await clientPi();
  const me = pi ? await load(pi).catch(() => null) : null;
  if (!me) return <Login lang={l} erreur={(await searchParams).erreur} />;

  const now = Date.now(), fmt = (ms: number) => new Date(ms).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const days = me.end ? Math.max(0, Math.ceil((me.end - now) / DAY_MS)) : 0;
  const state = !me.start ? "todo" : me.end! > now ? "open" : "over";
  const slots = POINTS_FOR_REWARD / POINTS_PER_FRIEND, left = Math.ceil((POINTS_FOR_REWARD - me.pts) / POINTS_PER_FRIEND);
  const progName = me.offer === "pack" ? (fr ? "Pack Saison complète" : "Full season pack") : programs[l][me.program as keyof (typeof programs)["fr"]]?.name;

  return (
    <div className="lib wrap">
      <header className="cs-head">
        <p className="lib-k">{fr ? "Espace client" : "Customer area"}</p>
        <h1>{me.firstName ? (fr ? `Salut ${me.firstName} !` : `Hi ${me.firstName}!`) : (fr ? "Ton espace" : "Your area")}</h1>
        {progName && <p className="cs-prog">{progName}</p>}
      </header>
      <div className="cs-grid">
        <section className="cs-card cs-acc" aria-labelledby="cs-acc-h">
          <h2 id="cs-acc-h">{fr ? "Ton accès aux animations" : "Your access to the animations"}</h2>
          {state === "open" && <>
            <p className="cs-big"><b>{days}</b> {fr ? `jour${days > 1 ? "s" : ""} restant${days > 1 ? "s" : ""}` : `day${days > 1 ? "s" : ""} left`}</p>
            <meter className="cs-meter" min={0} max={accessWeeks(me.offer) * 7} value={days} aria-label={fr ? "Temps d'accès restant" : "Access time left"} />
            <p className="cs-muted">{fr ? "Ouvert jusqu'au " : "Open until "}<strong>{fmt(me.end!)}</strong>. {fr ? "Ton PDF, lui, reste à toi." : "Your PDF is yours to keep."}</p>
          </>}
          {state === "todo" && <p className="cs-muted">{fr
            ? `Pas encore lancé. Ton accès dure ${accessWeeks(me.offer)} semaines à partir de la première ouverture de la bibliothèque : lance-le le jour où tu commences ton programme, sur ${MAX_DEVICES} appareils au plus.`
            : `Not started yet. Your access lasts ${accessWeeks(me.offer)} weeks from the first time you open the library: start it on the day you begin your program, on ${MAX_DEVICES} devices at most.`}</p>}
          {state === "over" && <p className="cs-muted">{fr ? `Ton accès aux animations s'est terminé le ${fmt(me.end!)}. Ton PDF reste à toi.` : `Your access to the animations ended on ${fmt(me.end!)}. Your PDF is yours to keep.`}</p>}
          {state === "over"
            ? <a className="btn cs-go" href={`/${l}/programmes`}>{fr ? "Voir les programmes" : "See the programs"}</a>
            : <a className="btn cs-go" href={`/${l}/exercices`}>{state === "todo" ? (fr ? "Lancer mon accès" : "Start my access") : (fr ? "Voir les exercices" : "See the exercises")} →</a>}
        </section>
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
        <button name="sortie" value="1">{fr ? "Se déconnecter de cet appareil" : "Log out on this device"}</button>
      </form>
    </div>
  );
}

// Asked when the customer area is not open on this device yet: the order reference.
function Login({ lang, erreur }: { lang: Lang; erreur?: string }) {
  const fr = lang === "fr";
  const errors: Record<string, [string, string]> = {
    inconnue: ["Cette référence ne correspond à aucune commande payée. Vérifie-la dans ton email de confirmation (ligne « Référence », 12 caractères).", "This reference does not match any paid order. Check it in your confirmation email (the “Reference” line, 12 characters)."],
    remboursee: ["Cette commande a été remboursée.", "This order was refunded."],
    trop: ["Trop d'essais. Réessaie dans une heure.", "Too many tries. Try again in an hour."],
    indisponible: ["La vérification n'a pas fonctionné. Réessaie dans quelques minutes, ou écris-nous.", "The check did not work. Try again in a few minutes, or write to us."],
  };
  return (
    <div className="exo-back">
      <div className="exo-card acc">
        <p className="acc-k">{fr ? "Espace client" : "Customer area"}</p>
        <h1>{fr ? "Ton espace client" : "Your customer area"}</h1>
        {erreur && errors[erreur] && <p className="acc-err" role="alert">{errors[erreur][fr ? 0 : 1]}</p>}
        <p>{fr ? "Entre la référence de ta commande : elle est dans ton email de confirmation, ligne « Référence ». Tu y retrouves ton accès aux animations, ton code de parrainage et tes points." : "Enter your order reference: it is in your confirmation email, on the “Reference” line. You will find your access to the animations, your referral code and your points."}</p>
        <form method="post" action="/api/espace" className="acc-form">
          <input type="hidden" name="lang" value={lang} />
          <label className="sr" htmlFor="cs-ref">{fr ? "Référence de commande" : "Order reference"}</label>
          <input id="cs-ref" name="ref" required autoComplete="off" autoCapitalize="none" spellCheck={false} placeholder={fr ? "Ex. : a1B2c3D4e5F6" : "E.g. a1B2c3D4e5F6"} maxLength={40} />
          <button className="btn" type="submit">{fr ? "Entrer" : "Enter"}</button>
        </form>
        <ul className="acc-rules">
          <li>{fr ? "Entrer dans ton espace ne lance pas le compte à rebours de tes animations : il démarre seulement quand tu ouvres la bibliothèque." : "Entering your area does not start the countdown of your animations: it only starts when you open the library."}</li>
          <li>{fr ? "Ta référence est personnelle : ne la partage pas. Pour tes coéquipiers, il y a ton code de parrainage." : "Your reference is personal: do not share it. For your teammates, there is your referral code."}</li>
        </ul>
        <p className="acc-cta">{fr ? "Pas encore client ?" : "Not a customer yet?"} <a href={`/${lang}/programmes`}>{fr ? "Découvre les programmes" : "See the programs"}</a></p>
      </div>
    </div>
  );
}
