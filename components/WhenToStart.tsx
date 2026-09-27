import type { Lang } from "@/lib/dict";
import { whenToStart } from "@/lib/programs";

// When to do the Pré-saison (offer pages): the two cases, each with its 8 weeks over July-August.
export default function WhenToStart({ lang }: { lang: Lang }) {
  const w = whenToStart[lang];
  return (
    <section className="when" id="quand-commencer">
      <h2>{w.title}</h2>
      <p className="when-lead">{w.lead}</p>
      <div className="when-g">
        {w.cases.map((c) => (
          <div key={c.t} className="when-c">
            <h3>{c.t}</h3>
            <ol className="when-w" aria-label={c.t}>
              {c.weeks.map((k, i) => <li key={i} className={k} title={`${i + 1} · ${w.legend[k]}`}>{i + 1}</li>)}
            </ol>
            <p className="when-m" aria-hidden="true"><span>{w.months[0]}</span><span>{w.months[1]}</span></p>
            <p>{c.d}</p>
          </div>
        ))}
      </div>
      <p className="when-key"><span className="solo" />{w.legend.solo}<span className="club" />{w.legend.club}</p>
      <p className="note">{w.note}</p>
    </section>
  );
}
