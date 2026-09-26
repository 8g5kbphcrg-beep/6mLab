import { dict, type Lang } from "@/lib/dict";
import { programs, programSlugs } from "@/lib/programs";
import { fmtPrice, PACK_PRICE, prices } from "@/lib/checkout";
import { recommended } from "@/lib/season";
import "@/app/offers.css";

// Used on the handball page and on /programmes. The "Saison complète" pack comes first, as the
// featured offer (best value); then the two programs side by side, the one that fits the handball
// calendar first with a badge.
export default function ProgramCards({ lang, shared = true }: { lang: Lang; shared?: boolean }) {
  const d = dict[lang];
  const fr = lang === "fr";
  const now = recommended();
  const order = [now, ...programSlugs.filter((s) => s !== now)];
  const full = prices["pre-saison"] + prices["maintien-saison"], save = full - PACK_PRICE;
  return (
    <>
      <article className="opack">
        <span className="opack-b">{fr ? "Meilleure offre · la saison entière" : "Best value · the whole season"}</span>
        <div className="opack-main">
          <div>
            <h3 className="opack-t">{fr ? "Pack Saison complète" : "Full season pack"}</h3>
            <p className="opack-d">{fr ? "Pré-saison + Maintien en saison, avec les mêmes objectifs : tu es prêt dès la reprise et tu le restes jusqu'à la fin de la saison." : "Pre-season + In-season maintenance, same goals: ready from day one and all the way to the end of the season."}</p>
            <ul className="opack-l">
              <li>{fr ? "Pré-saison : 8 semaines pour préparer la reprise" : "Pre-season: 8 weeks to get ready"}</li>
              <li>{fr ? "Maintien en saison : 12 semaines pour tenir jusqu'au bout" : "In-season: 12 weeks to keep your level"}</li>
              <li>{fr ? "20 semaines planifiées, les mêmes objectifs du début à la fin" : "20 planned weeks, the same goals from start to finish"}</li>
            </ul>
          </div>
          <div className="opack-buy">
            <span className="opack-save">{fr ? `Tu économises ${fmtPrice(save, lang)}` : `You save ${fmtPrice(save, lang)}`}</span>
            <p className="opack-p"><strong>{fmtPrice(PACK_PRICE, lang)}</strong> <s>{fmtPrice(full, lang)}</s></p>
            <a className="btn" data-go href={`/${lang}/programmes/saison-complete`}>{fr ? "Choisir le pack" : "Choose the pack"} →</a>
          </div>
        </div>
      </article>
      <p className="oor">{fr ? "Ou un seul programme" : "Or a single program"}</p>
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
      {shared && <div className="shared">
        <p className="lab">{fr ? "Inclus dans toutes les formules" : "Included in every program"}</p>
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
