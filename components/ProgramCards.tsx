import { dict, type Lang } from "@/lib/dict";
import { programs, programSlugs } from "@/lib/programs";

// The two offers side by side, used on the home page and on /programmes.
export default function ProgramCards({ lang }: { lang: Lang }) {
  const d = dict[lang];
  const fr = lang === "fr";
  return (
    <>
      <div className="offers">
        {programSlugs.map((s, i) => {
          const p = programs[lang][s];
          return (
            <article key={s} className={`offer ${p.color}`}>
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
      <div className="shared">
        <p className="lab">{fr ? "Inclus dans les deux formules" : "Included in both programs"}</p>
        <ul>
          <li>{fr ? "Le planning complet en PDF, semaine par semaine" : "The full week-by-week plan as a PDF"}</li>
          <li>{fr ? "Une animation pour chaque exercice" : "An animation for every exercise"}</li>
          <li>{fr ? "1 objectif au choix, +5 € pour un 2e, ou la réathlétisation" : "1 goal of your choice, +€5 for a 2nd, or return to play"}</li>
          <li>{fr ? "Option course à pied : +9 €" : "Running option: +€9"}</li>
        </ul>
      </div>
    </>
  );
}
