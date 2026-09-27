import type Stripe from "stripe";
import { parisDay } from "@/lib/analytics";
import { redis, redisReady } from "@/lib/redis";
import { stripe, DAY } from "@/lib/feedback";
import { fmtPrice } from "@/lib/checkout";
import { headers } from "next/headers";
import Nav from "../Nav";

// Audience and purchase funnel over 7, 30 or 90 days: the site's own counts (one per visit and
// step, see lib/analytics.ts) and the payments read from Stripe (pages opened, paid, amount), by
// source. Vercel Web Analytics shows the detailed audience (pages, countries, devices).
export const dynamic = "force-dynamic";

const PERIODS = [7, 30, 90];
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 1000) / 10} %` : "–");
type Count = { e: string; d: string; s: string; n: number };
type Sale = { src: string; paid: boolean; amount: number; offer: string; day: string };

const PAGE_NAMES: Record<string, string> = {
  accueil: "Accueil", handball: "Handball", programmes: "Programmes", "offre-pre-saison": "Offre Pré-saison", "offre-maintien-saison": "Offre Maintien",
  "offre-saison-complete": "Offre Pack", questionnaire: "Questionnaire handball", forme: "Forme & bien-être", exercice: "Pages exercices",
  conseils: "Conseils", article: "Articles", "seance-gratuite": "Séance gratuite", merci: "Merci (après paiement)", "a-propos": "À propos", contact: "Contact", autre: "Autre",
};
const OFFER_NAMES: Record<string, string> = { "pre-saison": "Pré-saison", "maintien-saison": "Maintien en saison", pack: "Pack Saison complète", blessure: "Avis médical (blessure)" };
const LEAD_NAMES: Record<string, string> = { seance: "Séance gratuite", forme: "Liste d'attente Forme", foot: "Me prévenir Football", basket: "Me prévenir Basketball", sport: "Sport proposé" };

async function counts(days: string[]): Promise<Count[]> {
  const res = await redis(days.map((d) => ["HGETALL", `a:${d}`]));
  const out: Count[] = [];
  res.forEach((r) => {
    const a = (r as string[] | null) ?? [];
    for (let i = 0; i < a.length; i += 2) {
      const [e, d, s] = a[i].split("|");
      out.push({ e, d, s, n: Number(a[i + 1]) || 0 });
    }
  });
  return out;
}
async function sales(s: Stripe, since: number): Promise<Sale[]> {
  const out: Sale[] = [];
  for await (const c of s.checkout.sessions.list({ created: { gte: since }, limit: 100 })) {
    const m = c.metadata ?? {};
    if (!m.program) continue;
    out.push({ src: m.src || "inconnu", paid: c.payment_status === "paid", amount: c.amount_total ?? 0, offer: m.pack === "oui" ? "pack" : m.program, day: parisDay(new Date(c.created * 1000)) });
    if (out.length >= 3000) break;
  }
  return out;
}
const sum = (c: Count[], f: (x: Count) => boolean) => c.filter(f).reduce((a, x) => a + x.n, 0);
function group<T>(items: T[], key: (x: T) => string, val: (x: T) => number) {
  const m = new Map<string, number>();
  for (const x of items) m.set(key(x), (m.get(key(x)) ?? 0) + val(x));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
}

function Bars({ rows, wide }: { rows: [string, number, string?][]; wide?: boolean }) {
  const top = Math.max(1, ...rows.map((r) => r[1]));
  if (!rows.length) return <div className="card muted">Pas encore de données.</div>;
  return (
    <div className="card">
      {rows.map(([k, n, note]) => (
        <div className={wide ? "bar w" : "bar"} key={k} title={`${k} : ${n}`}><span>{k}</span><s><i style={{ width: `${(n / top) * 100}%` }} /></s><span>{n}{note ? <small className="muted"> {note}</small> : null}</span></div>
      ))}
    </div>
  );
}

export default async function AdminAudience({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  const p = PERIODS.includes(Number((await searchParams).p)) ? Number((await searchParams).p) : 30;
  const now = Date.now();
  const days = Array.from({ length: p }, (_, i) => parisDay(new Date(now - (p - 1 - i) * DAY * 1000)));
  const since = Math.floor(now / 1000) - p * DAY;
  const s = stripe();
  let c: Count[] = [], sl: Sale[] = [], err = "";
  try {
    c = await counts(days);
  } catch (e) {
    err = `Compteur indisponible : ${e instanceof Error ? e.message : String(e)}`;
  }
  try {
    if (s) sl = await sales(s, since);
  } catch (e) {
    err += ` Stripe indisponible : ${e instanceof Error ? e.message : String(e)}`;
  }
  const paid = sl.filter((x) => x.paid);
  const visits = sum(c, (x) => x.e === "visite"), offers = sum(c, (x) => x.e === "offres"), clicks = sum(c, (x) => x.e === "paiement_clic");
  const revenue = paid.reduce((a, x) => a + x.amount, 0);
  const funnel: [string, number][] = [["Visites", visits], ["Ont vu les offres", offers], ["Ont cliqué sur « Payer »", clicks], ["Ont ouvert la page de paiement", sl.length], ["Ont payé", paid.length]];
  const srcs = [...new Set([...c.filter((x) => x.e === "visite").map((x) => x.s), ...sl.map((x) => x.src)])];
  const bySrc = srcs.map((src) => {
    const v = sum(c, (x) => x.e === "visite" && x.s === src), ps = paid.filter((x) => x.src === src);
    return { src, v, o: sum(c, (x) => x.e === "offres" && x.s === src), open: sl.filter((x) => x.src === src).length, n: ps.length, ca: ps.reduce((a, x) => a + x.amount, 0) };
  }).sort((a, b) => b.ca - a.ca || b.v - a.v);
  // Links on the address the admin is opened from (the real domain once it is set up).
  const h = await headers();
  const site = `${h.get("x-forwarded-proto") ?? "https"}://${h.get("host")}`;
  const links: [string, string][] = [["Bio Instagram", "instagram"], ["Story Instagram", "instagram-story"], ["Facebook", "facebook"], ["TikTok", "tiktok"], ["WhatsApp", "whatsapp"], ["Club / flyer", "club"], ["Email", "email"]];
  return (
    <main>
      <Nav here="audience" />
      <h1>Audience & ventes</h1>
      <p className="sub">
        Sur {PERIODS.map((n, i) => <span key={n}>{i ? " · " : ""}{n === p ? <b>{n} jours</b> : <a href={`?p=${n}`}>{n} jours</a>}</span>)}.
        Comptage sans cookie : une visite par onglet ouvert, sans rien garder sur la personne. Les paiements viennent de Stripe{process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ? " (mode test)" : ""}.
      </p>
      {!redisReady() && <p className="card"><b>Compteur de visites pas encore branché.</b> Dans Vercel : projet 6m-lab → Storage → Create Database → Upstash (Redis) → Connect au projet, puis redéploie. Les ventes Stripe ci-dessous s'affichent déjà.</p>}
      {err && <p className="card">{err}</p>}

      <div className="kpis">
        <div className="kpi"><b>{visits}</b><span>Visites</span></div>
        <div className="kpi"><b>{paid.length}</b><span>Ventes</span></div>
        <div className="kpi"><b>{fmtPrice(revenue, "fr")}</b><span>Chiffre d'affaires TTC</span></div>
        <div className="kpi"><b>{pct(paid.length, visits)}</b><span>Taux de conversion (ventes / visites)</span></div>
        <div className="kpi"><b>{paid.length ? fmtPrice(Math.round(revenue / paid.length), "fr") : "–"}</b><span>Panier moyen</span></div>
        <div className="kpi"><b>{sl.length - paid.length}</b><span>Paiements commencés, pas terminés</span></div>
      </div>

      <h2>Parcours d'achat</h2>
      <p className="sub">Chaque ligne : combien de visites arrivent à cette étape, et la part de l'étape précédente. La plus grosse chute montre où agir en premier.</p>
      <Bars wide rows={funnel.map(([k, n], i) => [k, n, i ? `· ${pct(n, funnel[i - 1][1])} de l'étape d'avant` : undefined])} />

      <h2>Par provenance</h2>
      <p className="sub">D'où viennent les visites et les ventes. « direct » : lien tapé ou ouvert depuis une appli sans source (d'où l'intérêt des liens ci-dessous). « inconnu » : ventes d'avant ce suivi.</p>
      <div className="tbl"><table>
        <thead><tr><th>Provenance</th><th>Visites</th><th>Ont vu les offres</th><th>Paiements ouverts</th><th>Ventes</th><th>CA</th><th>Conversion</th></tr></thead>
        <tbody>{bySrc.length ? bySrc.map((r) => (
          <tr key={r.src}><td>{r.src}</td><td>{r.v}</td><td>{r.o}</td><td>{r.open}</td><td>{r.n}</td><td>{fmtPrice(r.ca, "fr")}</td><td>{pct(r.n, r.v)}</td></tr>
        )) : <tr><td colSpan={7} className="muted">Pas encore de données.</td></tr>}</tbody>
      </table></div>

      <div className="grid" style={{ marginTop: 10 }}>
        <div>
          <h2>Questionnaire handball</h2>
          <Bars rows={[["Commencé", sum(c, (x) => x.e === "quiz_debut" && x.d === "handball")], ...group(c.filter((x) => x.e === "quiz_fin" && x.d !== "forme"), (x) => `Résultat : ${OFFER_NAMES[x.d] ?? x.d}`, (x) => x.n) as [string, number][]]} />
          <h2>Ventes par offre</h2>
          <Bars rows={group(paid, (x) => OFFER_NAMES[x.offer] ?? x.offer, () => 1) as [string, number][]} />
        </div>
        <div>
          <h2>Inscriptions (emails)</h2>
          <Bars rows={[...Object.entries(LEAD_NAMES).map(([k, l]) => [l, sum(c, (x) => x.e === "lead" && x.d === k)] as [string, number]), ["Questionnaire Forme terminé", sum(c, (x) => x.e === "quiz_fin" && x.d === "forme")]]} />
          <h2>Pages d'entrée</h2>
          <Bars rows={group(c.filter((x) => x.e === "visite"), (x) => PAGE_NAMES[x.d] ?? x.d, (x) => x.n).slice(0, 8) as [string, number][]} />
        </div>
      </div>

      <h2>Pages vues (une fois par visite)</h2>
      <Bars rows={group(c.filter((x) => x.e === "page"), (x) => PAGE_NAMES[x.d] ?? x.d, (x) => x.n) as [string, number][]} />

      <h2>Liens à partager</h2>
      <p className="sub">Utilise ces liens dans tes publications : les visites et les ventes seront rangées sous le bon nom. Tu peux remplacer la fin par n'importe quel mot (ex. <code>?utm_source=club-toulon</code>).</p>
      <div className="card">{links.map(([l, k]) => <p key={k} style={{ margin: "4px 0" }}><b>{l}</b> : <code>{site}/fr?utm_source={k}</code></p>)}</div>
      <p className="sub" style={{ marginTop: 16 }}>Plus de détails (pays, appareils, pages, sites d'origine) : Vercel → projet 6m-lab → Analytics.</p>
    </main>
  );
}
