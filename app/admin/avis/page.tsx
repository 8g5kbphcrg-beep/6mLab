import { goalName, type GoalId } from "@/lib/goals";
import { programs } from "@/lib/programs";
import { formUrl, paidOrders, questions, stripe, whenDays, DAY, type FeedbackOrder } from "@/lib/feedback";

// Customer feedback dashboard: response rates, ratings, answers to every question, reviews to
// publish, and each order's questionnaires (send now, open, export).
export const dynamic = "force-dynamic";

const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0);
const label = (key: string, v: string, goals: GoalId[]) => questions(key.startsWith("m_") ? "mid" : "end", goals).find((q) => q.key === key)?.opts?.find((o) => o[0] === v)?.[1] ?? v;

function Bars({ title, items }: { title: string; items: [string, number][] }) {
  const total = items.reduce((a, [, n]) => a + n, 0);
  return (
    <div className="card">
      <b>{title}</b> <span className="muted">({total} réponse{total > 1 ? "s" : ""})</span>
      {items.map(([k, n]) => (
        <div className="bar" key={k}><span>{k}</span><s><i style={{ width: `${pct(n, total)}%` }} /></s><span>{pct(n, total)} %</span></div>
      ))}
    </div>
  );
}
const count = (orders: FeedbackOrder[], key: string) => {
  const m = new Map<string, number>();
  for (const o of orders) if (o.meta[key]) { const l = label(key, o.meta[key], o.goals); m.set(l, (m.get(l) ?? 0) + 1); }
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

export default async function AdminAvis() {
  const s = stripe();
  if (!s) return <main><h1>Avis clients</h1><p>Stripe n'est pas configuré.</p></main>;
  const orders = await paidOrders(s);
  const mid = orders.filter((o) => o.meta.m_at), end = orders.filter((o) => o.meta.f_at);
  const sentMid = orders.filter((o) => o.meta.s_mid).length, sentEnd = orders.filter((o) => o.meta.s_end).length;
  const stars = end.map((o) => Number(o.meta.f_stars)).filter(Boolean);
  const avg = stars.length ? (stars.reduce((a, b) => a + b, 0) / stars.length).toFixed(1) : "–";
  const nps = end.map((o) => Number(o.meta.f_nps)).filter((n) => !Number.isNaN(n));
  const npsScore = nps.length ? pct(nps.filter((n) => n >= 9).length, nps.length) - pct(nps.filter((n) => n <= 6).length, nps.length) : null;
  const goalsSeen = [...new Set(end.flatMap((o) => o.goals))].filter((g) => g !== "reathletisation");
  const texts = (key: string) => orders.filter((o) => o.meta[key]).map((o) => ({ o, t: o.meta[key] }));
  const site = process.env.NEXT_PUBLIC_SITE_URL || "";
  const now = Date.now() / 1000;
  return (
    <main>
      <h1>Avis clients</h1>
      <p className="sub">{orders.length} commande{orders.length > 1 ? "s" : ""}. Questionnaire 1 envoyé 14 jours après l'achat, questionnaire 2 à la fin du programme (8 ou 12 semaines). Données lues dans Stripe{process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_") ? " (mode test)" : ""}. <a href="/admin/avis/export">Exporter en CSV (Excel)</a></p>
      <div className="kpis">
        <div className="kpi"><b>{avg}{stars.length ? " / 5" : ""}</b><span>Note moyenne ({stars.length} avis)</span></div>
        <div className="kpi"><b>{npsScore ?? "–"}</b><span>Score de recommandation (NPS, de -100 à 100)</span></div>
        <div className="kpi"><b>{mid.length} / {sentMid}</b><span>Questionnaire 1 : réponses / envois ({pct(mid.length, sentMid)} %)</span></div>
        <div className="kpi"><b>{end.length} / {sentEnd}</b><span>Questionnaire 2 : réponses / envois ({pct(end.length, sentEnd)} %)</span></div>
      </div>

      <h2>Après 2 semaines</h2>
      <div className="grid">
        <Bars title="Les séances sont claires ?" items={count(mid, "m_clear")} />
        <Bars title="Le niveau est adapté ?" items={count(mid, "m_level")} />
        <Bars title="Les animations aident ?" items={count(mid, "m_anim")} />
      </div>

      <h2>À la fin du programme</h2>
      <div className="grid">
        <Bars title="Note globale" items={[5, 4, 3, 2, 1].map((n) => [`${"★".repeat(n)}`, stars.filter((x) => x === n).length] as [string, number])} />
        <Bars title="Recommanderait 6M Lab" items={[["9-10 (promoteurs)", nps.filter((n) => n >= 9).length], ["7-8 (neutres)", nps.filter((n) => n === 7 || n === 8).length], ["0-6 (détracteurs)", nps.filter((n) => n <= 6).length]]} />
        {goalsSeen.map((g) => <Bars key={g} title={`Progrès : ${goalName(g, "fr")}`} items={count(end, `fp_${g}`)} />)}
      </div>

      <h2>Témoignages</h2>
      {texts("f_text").length === 0 && <p className="muted">Aucun témoignage pour l'instant.</p>}
      {texts("f_text").map(({ o, t }) => (
        <div className="card" key={o.id}>
          <span className="stars">{"★".repeat(Number(o.meta.f_stars) || 0)}</span> <b>{o.firstName}</b> <span className="muted">· {programs.fr[o.program]?.name} · {o.meta.f_at?.slice(0, 10)}</span>
          <p className="quote">« {t} »</p>
          {o.meta.f_pub === "1" ? (
            <form method="post" action="/admin/avis/action">
              <input type="hidden" name="pi" value={o.id} /><input type="hidden" name="action" value={o.meta.f_show === "1" ? "hide" : "show"} />
              {o.meta.f_show === "1" ? <><span className="tag ok">Publié sur le site</span> <button className="ghost">Retirer du site</button></> : <button>Publier sur le site</button>}
            </form>
          ) : <span className="tag">Pas d'accord pour la publication</span>}
        </div>
      ))}

      <h2>Remarques et idées</h2>
      <div className="grid">
        {([["m_note", "Problèmes ou questions (2 semaines)"], ["f_improve", "À améliorer"], ["f_best", "Exercice préféré"], ["f_change", "Exercice à changer"]] as const).map(([k, title]) => (
          <div className="card" key={k}><b>{title}</b>{texts(k).length ? <ul>{texts(k).map(({ o, t }) => <li key={o.id}>{t} <span className="muted">({o.firstName})</span></li>)}</ul> : <p className="muted">Rien pour l'instant.</p>}</div>
        ))}
      </div>

      <h2>Commandes</h2>
      <div className="tbl"><table>
        <thead><tr><th>Date</th><th>Client</th><th>Programme</th><th>Questionnaire 1</th><th>Questionnaire 2</th></tr></thead>
        <tbody>{orders.map((o) => (
          <tr key={o.id}>
            <td>{new Date(o.created * 1000).toLocaleDateString("fr-FR")}</td>
            <td>{o.firstName}<br /><span className="muted">{o.email}</span></td>
            <td>{programs.fr[o.program]?.name}<br /><span className="muted">{o.goals.map((g) => goalName(g, "fr")).join(" + ")}</span></td>
            {(["mid", "end"] as const).map((st) => {
              const answered = o.meta[st === "mid" ? "m_at" : "f_at"], sent = o.meta[st === "mid" ? "s_mid" : "s_end"];
              const due = new Date((o.created + whenDays(st, o.program) * DAY) * 1000).toLocaleDateString("fr-FR");
              return (
                <td key={st}>
                  {answered ? <span className="tag ok">Répondu le {answered.slice(0, 10)}</span> : sent ? <span className="tag">Envoyé le {sent}</span> : <span className="muted">Prévu le {due}{o.created + whenDays(st, o.program) * DAY < now - 10 * DAY ? " (passé)" : ""}</span>}
                  <br />
                  {!answered && o.email && <form method="post" action="/admin/avis/action"><input type="hidden" name="pi" value={o.id} /><input type="hidden" name="action" value={`send-${st}`} /><button className="ghost">Envoyer maintenant</button></form>}{" "}
                  <a className="muted" href={formUrl(site, o.lang, o.id, st)} target="_blank">Ouvrir</a>
                </td>
              );
            })}
          </tr>
        ))}</tbody>
      </table></div>
    </main>
  );
}
