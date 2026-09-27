import PrintButton from "../../PrintButton";

// The follow-up sheet of a club program, with one line per player of the quote: tests, sessions
// and the autonomy weeks. Printed on paper or saved as a PDF from the browser.
export const metadata = { title: "Fiche de suivi | Admin 6M Lab" };
type Q = { equipe?: string; champ?: string; gardiens?: string; footings?: string };
const clamp = (v: string | undefined, lo: number, hi: number, d: number) => { const n = Math.round(Number(v)); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };

export default async function Fiche({ searchParams }: { searchParams: Promise<Q> }) {
  const q = await searchParams;
  const P = clamp(q.champ, 1, 60, 14), GK = clamp(q.gardiens, 0, 10, 2), team = (q.equipe ?? "").slice(0, 60), foot = q.footings !== "non";
  const rows = (k: number, cols: number, gk = false) => Array.from({ length: k }, (_, i) => <tr key={i}><td className="n">{i + 1}</td><td className="name">{gk ? <span className="g">Gardien</span> : null}</td>{Array.from({ length: cols }, (_, c) => <td key={c} />)}</tr>);
  const Head = ({ t, sub }: { t: string; sub: string }) => <div className="h"><div><b>6M LAB</b> · Fiche de suivi{team ? ` · ${team}` : ""}</div><h1>{t}</h1><p>{sub}</p><div className="meta">Club : ______________________ &nbsp; Coach : ______________________ &nbsp; Date : ___ / ___ / ______</div></div>;
  const Tests = ({ t, sub, full }: { t: string; sub: string; full: boolean }) => (
    <section>
      <Head t={t} sub={sub} />
      <div className="tw"><table><thead><tr><th className="n">#</th><th className="name">Joueur</th><th>Poste</th>{full && <th>VIFT 30-15<br />(km/h)</th>}<th>Sprint 10 m<br />(s)</th>{full && <th>Sprint 20 m<br />(s)</th>}<th>Saut<br />(cm)</th>{full ? <><th>505 gauche<br />(s)</th><th>505 droite<br />(s)</th><th>Lancer<br />(m)</th><th>Groupe<br />de course</th></> : <><th>Évolution depuis la reprise</th><th>Remarques</th></>}</tr></thead><tbody>{rows(P, full ? 9 : 5)}</tbody></table></div>
      {GK > 0 && <div className="tw"><table className="gk"><thead><tr><th className="n">#</th><th className="name">Gardien</th><th>Saut<br />(cm)</th><th>Saut latéral<br />gauche (cm)</th><th>Saut latéral<br />droite (cm)</th><th>Adduction :<br />douleur /10</th><th>90/90 :<br />côté limité</th>{full && <th>VIFT<br />(repère)</th>}<th>Remarques</th></tr></thead><tbody>{rows(GK, full ? 7 : 6)}</tbody></table></div>}
      <p className="foot">Protocoles des tests : voir la séance 1 du document du coach. Toujours le même sol, les mêmes chaussures et la même heure pour pouvoir comparer.</p>
    </section>
  );
  const all = (cols: number) => Array.from({ length: P + GK }, (_, i) => <tr key={i}><td className="n">{i + 1}</td><td className="name">{i >= P ? <span className="g">Gardien</span> : null}</td>{Array.from({ length: cols }, (_, c) => <td key={c} />)}</tr>);
  return (
    <div className="fiche">
      <style>{`
        @page{size:A4 landscape;margin:10mm}
        .fiche{font:9pt/1.35 system-ui,Arial,sans-serif;color:#17122B;background:#fff;max-width:1100px;margin:0 auto;padding:16px}
        .fiche .bar{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:16px}.fiche .bar a{font-size:13px}
        .fiche section{page-break-after:always;margin-bottom:28px}.fiche section:last-child{page-break-after:auto}
        .fiche .h{border-bottom:3px solid #E4572E;padding-bottom:3mm;margin-bottom:4mm}.fiche .h b{color:#E4572E;letter-spacing:.1em}.fiche .h h1{font:700 17pt system-ui,Arial;margin:1mm 0}.fiche .h p{margin:0;color:#5E5870}.fiche .meta{margin-top:2mm;color:#3A3452}
        .fiche .tw{overflow-x:auto;margin-bottom:4mm}.fiche .tw table{margin-bottom:0}.fiche table{width:100%;min-width:720px;border-collapse:collapse;margin-bottom:4mm;font-size:9pt;border:0;border-radius:0}
        .fiche th,.fiche td{border:1px solid #B9B2CC;padding:1mm 1.5mm;text-align:center}.fiche th{background:#16123F;color:#fff;font-weight:600;font-size:8pt}
        .fiche td{height:6.9mm}.fiche .n{width:7mm;color:#5E5870}.fiche td.n{background:#F6F5FB}.fiche .name{width:48mm;text-align:left}
        .fiche table.gk th{background:#553C9A}.fiche th.s{background:#3A3452;font-size:7pt;font-weight:500}
        .fiche .g{font-size:7pt;background:#EFEAFB;color:#553C9A;border-radius:6px;padding:0 4px}.fiche .foot{color:#5E5870;font-size:8pt;margin:0}
        @media print{.fiche .tw{overflow:visible}.fiche table{min-width:0}.fiche .bar{display:none}.fiche{padding:0;max-width:none}body{background:#fff!important}}
      `}</style>
      <div className="bar"><PrintButton /><a href="/admin/clubs">← Retour à Clubs</a><span className="muted">{P} joueurs de champ, {GK} gardien{GK > 1 ? "s" : ""} · 5 pages, format paysage</span></div>
      <Tests t="Tests de reprise · semaine 5" sub="Saut, sprint, 505, lancer et 30-15 pour les joueurs ; tests spécifiques pour les gardiens. Le groupe de course se déduit de la VIFT (tableau du document du coach)." full />
      <Tests t="Retests · fin de pré-saison (semaine 8)" sub="Saut et sprint 10 m seulement : le 30-15 revient à la trêve." full={false} />
      <Tests t="Tests de la trêve" sub="Mêmes tests qu'à la reprise : on compare avec la semaine 5." full />
      <section>
        <Head t="Suivi des séances en club" sub="Pour chaque séance : P = présent, A = absent, B = blessé. Puis l'effort ressenti annoncé par le joueur à la fin de la séance (de 0 à 10)." />
        <div className="tw"><table><thead><tr><th className="n" rowSpan={2}>#</th><th className="name" rowSpan={2}>Joueur</th>{[1, 2, 3, 4, 5, 6, 7, 8].map((n) => <th key={n} colSpan={2}>Séance {n}</th>)}<th rowSpan={2}>Remarques</th></tr><tr>{[1, 2, 3, 4, 5, 6, 7, 8].flatMap((n) => [<th key={`${n}a`} className="s">P/A/B</th>, <th key={`${n}b`} className="s">Effort /10</th>])}</tr></thead><tbody>{all(17)}</tbody></table></div>
        <p className="foot">Repère : si l'effort moyen du groupe dépasse nettement l'effort visé de la séance, allège la séance suivante.</p>
      </section>
      <section>
        <Head t="Retour de l'autonomie (semaines 1 à 4)" sub={`Chaque joueur envoie ses notes le dimanche. Note le nombre de séances A, B, C faites (sur 3)${foot ? ", de footings faits (sur 2)" : ""} et l'effort moyen sur 10.`} />
        <div className="tw"><table><thead><tr><th className="n" rowSpan={2}>#</th><th className="name" rowSpan={2}>Joueur</th>{[1, 2, 3, 4].map((n) => <th key={n} colSpan={foot ? 3 : 2}>Semaine {n}</th>)}<th rowSpan={2}>Douleurs signalées</th></tr><tr>{[1, 2, 3, 4].flatMap((n) => [<th key={`${n}a`} className="s">Séances A, B, C /3</th>, ...(foot ? [<th key={`${n}f`} className="s">Footings /2</th>] : []), <th key={`${n}b`} className="s">Effort moyen /10</th>])}</tr></thead><tbody>{all(foot ? 13 : 9)}</tbody></table></div>
        <p className="foot">Un joueur qui a fait moins de 2 séances par semaine : prévois-le dans le groupe de course du dessous et surveille-le en semaine 5.</p>
      </section>
    </div>
  );
}
