import { dict, type Lang } from "@/lib/dict";
import { programs, programSlugs } from "@/lib/programs";
import { fmtPrice, PACK_PRICE, prices } from "@/lib/checkout";
import { recommended } from "@/lib/season";
import "@/app/offers.css";

// The two offers side by side, used on the home page and on /programmes. The one that fits the
// handball calendar comes first with a badge; the "Saison complète" pack sits under them.
export default function ProgramCards({ lang, shared = true }: { lang: Lang; shared?: boolean }) {
  const d = dict[lang];
  const fr = lang === "fr";
  const now = recommended();
  const order = [now, ...programSlugs.filter((s) => s !== now)];
  return (
    <>
      <div className="offers">
        {order.map((s) => {
          const p = programs[lang][s];
          const i = programSlugs.indexOf(s);
          return (
            <article key={s} className={`offer ${p.color}${s === now ? " now" : ""}`}>
              {s === now && <span className="onow">{fr ? "Recommandé en ce moment" : "Recommended right now"}</span>}
              <span className={`ptag ${p.color}`}>{p.tag}</span>
              <h3>{p.name}</h3>
              <p className="oprice">{d.cmp.price[p.idx]}</p>
              <p className="ofocus">{d.cmp.rows[0][i + 1]}</p>
              <ul className="ofacts">
                <li><span>{d.cmp.rows[1][0]}</span>{p.duration}</li>
                <li><span>{d.cmp.rows[2][0]}</span>{p.freq}</li>
              </ul>
              <a className="btn" data-go href={`/${lang}/programmes/${s}#acheter`}>{fr ? "Acheter ce programme" : "Buy this program"}</a>
            </article>
          );
        })}
      </div>
      <a className="opack" data-go href={`/${lang}/programmes/saison-complete`}>
        <span className="opack-t">{fr ? "Pack Saison complète" : "Full season pack"}</span>
        <span className="opack-d">{fr ? "Pré-saison + Maintien en saison, avec les mêmes objectifs : 20 semaines pour toute ta saison." : "Pre-season + In-season maintenance, same goals: 20 weeks for your whole season."}</span>
        <span className="opack-p"><strong>{fmtPrice(PACK_PRICE, lang)}</strong> <s>{fmtPrice(prices["pre-saison"] + prices["maintien-saison"], lang)}</s></span>
      </a>
      {shared && <div className="shared">
        <p className="lab">{fr ? "Inclus dans les deux formules" : "Included in both programs"}</p>
        <ul>
          <li>{fr ? "Le planning complet en PDF, semaine par semaine" : "The full week-by-week plan as a PDF"}</li>
          <li>{fr ? "Une animation pour chaque exercice" : "An animation for every exercise"}</li>
          <li>{fr ? "1 objectif au choix, +5 € pour un 2e, ou la réathlétisation" : "1 goal of your choice, +€5 for a 2nd, or return to play"}</li>
          <li>{fr ? "Option course à pied : +9 €" : "Running option: +€9"}</li>
        </ul>
      </div>}
    </>
  );
}
