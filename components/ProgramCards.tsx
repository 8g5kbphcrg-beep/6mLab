import Link from "next/link";
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
              <Link className="btn" href={`/${lang}/programmes/${s}`}>{fr ? "Voir le programme" : "See the program"}</Link>
            </article>
          );
        })}
      </div>
      <div className="shared">
        <p className="lab">{fr ? "Inclus dans les deux formules" : "Included in both programs"}</p>
        <ul>
          <li>{fr ? "Le planning complet en PDF, semaine par semaine" : "The full week-by-week plan as a PDF"}</li>
          <li>{fr ? "Des vidéos pour chaque exercice" : "Videos for every exercise"}</li>
          <li>{fr ? "2 objectifs au choix, ou la réathlétisation" : "2 goals of your choice, or return to play"}</li>
          <li>{fr ? "Option course à pied : +9 €" : "Running option: +€9"}</li>
        </ul>
      </div>
    </>
  );
}
