import { dict, type Lang } from "@/lib/dict";
import { programs, programSlugs } from "@/lib/programs";
import { fmtPrice, PACK_FULL, PACK_PRICE, PACK_WEEKS, perWeek, prices } from "@/lib/checkout";
import { recommended } from "@/lib/season";
import "@/app/offers.css";

// Used on the handball page and on /programmes: the questionnaire first, then the "Saison
// complète" as the featured offer (best value), then the 3 parts of the season, the one under way
// first with a badge, the others in season order.
// top: the cards sit right under the page title (the programs page), so their titles are h2.
export default function ProgramCards({ lang, shared = true, top = false }: { lang: Lang; shared?: boolean; top?: boolean }) {
  const H = top ? "h2" : "h3";
  const d = dict[lang];
  const fr = lang === "fr";
  const now = recommended();
  const i0 = programSlugs.indexOf(now);
  const order = [...programSlugs.slice(i0), ...programSlugs.slice(0, i0)];
  const full = PACK_FULL, save = full - PACK_PRICE;
  return (
    <>
      <div className="oquiz">
        <a className="btn" data-go href={`/${lang}/questionnaire`}>{fr ? "Trouve ton programme adapté" : "Find the right program for you"} →</a>
        <span>{fr ? "Questionnaire : 7 questions · 1 minute" : "Questionnaire: 7 questions · 1 minute"}</span>
      </div>
      <article className="opack">
        <span className="opack-b">{fr ? "Meilleure offre · toute la saison" : "Best value · the whole season"}</span>
        <div className="opack-main">
          <div>
            <H className="opack-t">{fr ? "Saison complète" : "Full season"}</H>
            <p className="opack-d">{fr ? "Une saison ne se gagne pas en 2 mois : les progrès de l'été se gardent si on les entretient. Les 3 parties à la suite, avec les mêmes objectifs, de juillet aux phases finales de juin." : "A season isn't won in 2 months: the progress of the summer only lasts if you maintain it. The 3 parts in a row, same goals, from July to the June finals."}</p>
            <ul className="opack-l">
              <li>{fr ? "Pré-saison : construire, en juillet et en août" : "Pre-season: build, in July and August"}</li>
              <li>{fr ? "1re partie : entretenir, de septembre à Noël" : "First half: maintain, from September to Christmas"}</li>
              <li>{fr ? "2e partie : rester frais jusqu'aux matchs décisifs" : "Second half: stay fresh until the decisive games"}</li>
            </ul>
          </div>
          <div className="opack-buy">
            <span className="opack-save">{fr ? `Tu économises ${fmtPrice(save, lang)}` : `You save ${fmtPrice(save, lang)}`}</span>
            <p className="opack-p"><strong>{fmtPrice(PACK_PRICE, lang)}</strong> <s>{fmtPrice(full, lang)}</s></p>
            <p className="opack-w">{fr ? `soit ${perWeek(PACK_PRICE, PACK_WEEKS, lang)} par semaine` : `just ${perWeek(PACK_PRICE, PACK_WEEKS, lang)} a week`}</p>
            <a className="btn" data-go href={`/${lang}/programmes/saison-complete`}>{fr ? "Choisir la Saison complète" : "Choose the Full season"} →</a>
          </div>
        </div>
      </article>
      <p className="oor">{fr ? "Ou une seule partie" : "Or a single part"}</p>
      <div className="offers">
        {order.map((s) => {
          const p = programs[lang][s];
          const i = programSlugs.indexOf(s);
          return (
            <article key={s} className={`offer ${p.color}${s === now ? " now" : ""}`}>
              {s === now && <span className="onow">{fr ? "En ce moment" : "Right now"}</span>}
              <span className={`ptag ${p.color}`}>{p.tag}</span>
              <H>{p.name}</H>
              <p className="oprice">{fmtPrice(prices[s], lang)}</p>
              <p className="ofocus">{d.cmp.rows[0][i + 1]}</p>
              <ul className="ofacts">
                <li><span>{d.cmp.rows[1][0]}</span>{p.duration}</li>
                <li><span>{d.cmp.rows[2][0]}</span>{p.freq}</li>
              </ul>
              <a className="btn" data-go href={`/${lang}/programmes/${s}#acheter`}>{fr ? "Choisir cette partie" : "Choose this part"}</a>
            </article>
          );
        })}
      </div>
      {shared && <div className="shared">
        <p className="lab">{fr ? "Inclus dans toutes les formules" : "Included in every program"}</p>
        <ul>
          <li>{fr ? "Le planning complet en PDF, semaine par semaine" : "The full week-by-week plan as a PDF"}</li>
          <li>{fr ? "Une animation pour chaque exercice, en ligne pendant tout ton programme + 2 semaines" : "An animation for every exercise, online for your whole program + 2 weeks"}</li>
          <li>{fr ? "1 objectif au choix, +5 € pour un 2e (réathlétisation en préparation)" : "1 goal of your choice, +€5 for a 2nd (return to play coming soon)"}</li>
          <li>{fr ? "Option course à pied : +9 €" : "Running option: +€9"}</li>
        </ul>
      </div>}
    </>
  );
}
