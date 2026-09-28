import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import { animatedIds, exName } from "@/components/ExerciseCard";
import AccessGate from "@/components/AccessGate";
import LibrarySearch from "@/components/LibrarySearch";
import { accessEnd, accessPi, type Gate } from "@/lib/access-page";
import { stripe } from "@/lib/feedback";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, referralCode, SPONSOR_PERCENT, VALIDATION_DAYS } from "@/lib/referral";

import { accessWeeks, offerOf } from "@/lib/access";
import { programs } from "@/lib/programs";
import { SITE } from "@/lib/dict";
import ShareCode from "@/components/ShareCode";

// The customer's dashboard: their order and referral (lib/referral.ts). The code is created here
// for orders placed before it existed. Null when Stripe cannot be reached: the library still opens.
async function myArea() {
  const pi = await accessPi(), s = stripe();
  if (!pi || !s) return null;
  try {
    const m = (await s.paymentIntents.retrieve(pi)).metadata ?? {};
    const code = await referralCode(s, pi, m.firstName ?? "", m.par_code);
    // Teammates who ordered this week, whose points are not validated yet.
    const pending = (await s.paymentIntents.search({ query: `metadata['par_by']:'${pi}' AND metadata['par_st']:'attente'`, limit: 20 }).catch(() => ({ data: [] }))).data.length;
    return { firstName: m.firstName ?? "", offer: offerOf(m), program: m.program, start: m.acc_start ? Date.parse(m.acc_start) : null, code, pts: Number(m.par_pts || 0), n: Number(m.par_n || 0), r: Number(m.par_r || 0), pending };
  } catch (e) {
    console.error("[espace client]", e);
    return null;
  }
}
import "@/app/library.css";

// Customer area: a dashboard (access, referral code and points), then every animated exercise, by family. For customers only, while their access
// lasts (lib/access.ts); each exercise opens its page with every version (home, gym, band).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Espace client | 6M Lab", robots: { index: false } };

const FAMILIES: [string, string, string[]][] = [
  ["Échauffement et mobilité", "Warm-up and mobility", ["footing-dynamique", "montees-genoux", "fente-rotation", "ouverture-hanche", "hanches-9090", "cheville-mur", "rotation-thoracique"]],
  ["Sauts et explosivité", "Jumps and power", ["saut-reception", "reception-unipodale", "snap-down", "pogos", "squat-jump", "squat-jump-leste", "skater-hop", "bonds", "box-jump", "drop-jump"]],
  ["Vitesse et appuis", "Speed and footwork", ["accelerations", "departs-10", "departs-reactifs", "sprint-20", "freinage", "navette-5105"]],
  ["Force", "Strength", ["squat", "squat-lourd", "fente-arriere", "squat-bulgare", "squat-une-jambe", "sdt-roumain", "hip-thrust", "hip-thrust-lourd", "pompes", "pompes-explosives", "developpe-couche", "developpe-militaire", "rowing", "tirage-lourd", "tractions", "fermier"]],
  ["Lancers", "Throws", ["lancer-poitrine", "lancer-rotation", "lancer-haut"]],
  ["Gainage", "Core", ["planche", "gainage-lateral", "dead-bug", "pallof", "copenhague"]],
  ["Prévention des blessures", "Injury prevention", ["pont-fessier", "pont-une-jambe", "equilibre", "equilibre-balle", "nordic", "mollets-excentrique", "ytw", "rotation-externe", "rotation-externe-haute", "pompes-scapulaires"]],
  ["Gardiens de but", "Goalkeepers", ["fente-laterale", "cosaque", "adduction"]],
  ["Condition physique", "Conditioning", ["footing", "intervalles-1515", "intervalles-3030", "sprints-repetes", "navettes-hand", "circuit"]],
];

type P = { params: Promise<{ lang: string }>; searchParams: Promise<Gate> };

export default async function Library({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const l = lang as Lang, fr = l === "fr";
  const end = await accessEnd();
  if (!end) {
    const g = await searchParams;
    return <AccessGate lang={l} next={`/${l}/exercices`} state={g.acces} code={g.ref} offer={g.offre} />;
  }
  const days = Math.ceil((end - Date.now()) / 86400000);
  const me = await myArea();
  const endDate = new Date(end).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const slots = POINTS_FOR_REWARD / POINTS_PER_FRIEND;
  const listed = new Set(FAMILIES.flatMap((f) => f[2]));
  const families = [...FAMILIES, ["Autres", "Others", animatedIds.filter((id) => !listed.has(id))] as [string, string, string[]]]
    .map(([a, b, ids]) => [fr ? a : b, ids.filter((id) => animatedIds.includes(id))] as const)
    .filter(([, ids]) => ids.length);
  return (
    <div className="lib wrap">
      <header className="cs-head">
        <p className="lib-k">{fr ? "Espace client" : "Customer area"}</p>
        <h1>{me?.firstName ? (fr ? `Salut ${me.firstName} !` : `Hi ${me.firstName}!`) : (fr ? "Ton espace" : "Your area")}</h1>
        {me && <p className="cs-prog">{me.offer === "pack" ? (fr ? "Pack Saison complète" : "Full season pack") : programs[l][me.program as keyof (typeof programs)["fr"]]?.name}</p>}
      </header>
      <div className="cs-grid">
        <section className="cs-card cs-acc" aria-labelledby="cs-acc-h">
          <h2 id="cs-acc-h">{fr ? "Ton accès aux animations" : "Your access to the animations"}</h2>
          <p className="cs-big"><b>{days}</b> {fr ? `jour${days > 1 ? "s" : ""} restant${days > 1 ? "s" : ""}` : `day${days > 1 ? "s" : ""} left`}</p>
          {me && <meter className="cs-meter" min={0} max={accessWeeks(me.offer) * 7} value={days} aria-label={fr ? "Temps d'accès restant" : "Access time left"} />}
          <p className="cs-muted">{fr ? "Ouvert jusqu'au " : "Open until "}<strong>{endDate}</strong>. {fr ? "Ton PDF, lui, reste à toi." : "Your PDF is yours to keep."}</p>
          <a className="btn cs-go" href="#biblio">{fr ? "Voir les exercices" : "See the exercises"} ↓</a>
        </section>
        {me && (
          <section className="cs-card cs-par" aria-labelledby="cs-par-h">
            <h2 id="cs-par-h">{fr ? "Parrainage" : "Referral"}</h2>
            <p className="cs-muted">{fr ? `Tes coéquipiers ont -${FRIEND_PERCENT} % avec ton code. Chacun te rapporte ${POINTS_PER_FRIEND} points : à ${POINTS_FOR_REWARD}, tu gagnes -${SPONSOR_PERCENT} % sur ton prochain programme.` : `Your teammates get ${FRIEND_PERCENT}% off with your code. Each one earns you ${POINTS_PER_FRIEND} points: at ${POINTS_FOR_REWARD}, you win ${SPONSOR_PERCENT}% off your next program.`}</p>
            <p className="cs-code"><span>{fr ? "Ton code" : "Your code"}</span><b>{me.code}</b></p>
            <ShareCode fr={fr} code={me.code} text={fr
              ? `Je fais ma prépa physique avec 6M Lab. Avec mon code ${me.code}, tu as -${FRIEND_PERCENT} % sur ton programme : ${SITE}/fr/programmes`
              : `I train with 6M Lab. With my code ${me.code}, you get ${FRIEND_PERCENT}% off your program: ${SITE}/en/programmes`} />
            <div className="cs-pts">
              <p className="cs-pts-h"><b>{me.pts}</b> / {POINTS_FOR_REWARD} {fr ? "points" : "points"}</p>
              <ol className="cs-slots" aria-label={fr ? "Coéquipiers vers ton prochain code" : "Teammates towards your next code"}>
                {Array.from({ length: slots }, (_, i) => {
                  const on = i < me.pts / POINTS_PER_FRIEND, wait = !on && i < me.pts / POINTS_PER_FRIEND + me.pending;
                  return <li key={i} className={on ? "on" : wait ? "wait" : ""}><span aria-hidden="true">{on ? "✓" : wait ? "…" : i + 1}</span>{on ? (fr ? "Validé" : "Confirmed") : wait ? (fr ? "En attente" : "Pending") : `+${POINTS_PER_FRIEND}`}</li>;
                })}
                <li className="cs-prize"><span aria-hidden="true">%</span>-{SPONSOR_PERCENT} %</li>
              </ol>
              <p className="cs-muted">{me.pts >= POINTS_FOR_REWARD ? "" : fr
                ? `Encore ${Math.ceil((POINTS_FOR_REWARD - me.pts) / POINTS_PER_FRIEND)} coéquipier${Math.ceil((POINTS_FOR_REWARD - me.pts) / POINTS_PER_FRIEND) > 1 ? "s" : ""} pour ton code de -${SPONSOR_PERCENT} %. Les points sont validés ${VALIDATION_DAYS} jours après leur commande.`
                : `${Math.ceil((POINTS_FOR_REWARD - me.pts) / POINTS_PER_FRIEND)} more teammate(s) for your ${SPONSOR_PERCENT}% code. Points are confirmed ${VALIDATION_DAYS} days after their order.`}</p>
            </div>
            <dl className="cs-stats">
              <div><dt>{fr ? "Parrainés" : "Referred"}</dt><dd>{me.n + me.pending}</dd></div>
              <div><dt>{fr ? "En attente" : "Pending"}</dt><dd>{me.pending}</dd></div>
              <div><dt>{fr ? "Codes gagnés" : "Codes earned"}</dt><dd>{me.r}</dd></div>
            </dl>
          </section>
        )}
      </div>
      <h2 id="biblio" className="cs-lib-h">{fr ? "Bibliothèque d'exercices" : "Exercise library"}</h2>
      <LibrarySearch fr={fr} items={families.flatMap(([, ids]) => ids.map((id) => [id, exName(id, fr ? "fr" : "en")] as [string, string]))} />
      {families.map(([name, ids]) => (
        <section key={name}>
          <h2>{name}</h2>
          <ul className="lib-grid">
            {ids.map((id) => (
              <li key={id} id={`ex-${id}`}><Link href={`/${l}/exercices/${id}?retour=/${l}/exercices`}>{exName(id, fr ? "fr" : "en")}<span aria-hidden="true">→</span></Link></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
