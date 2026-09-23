import { dict, type Lang } from "@/lib/dict";
import { programs, type ProgramSlug } from "@/lib/programs";
import { buy, goalIds, type GoalId } from "@/lib/checkout";
import { legalPaths } from "@/lib/legal";

// Plain HTML form posting to /api/checkout, so buying works without JavaScript.
export default function BuyForm({ lang, slug, goal, test, error }: { lang: Lang; slug: ProgramSlug; goal?: GoalId; test: boolean; error?: boolean }) {
  const t = buy[lang];
  const d = dict[lang];
  const price = d.cmp.price[programs[lang][slug].idx];
  return (
    <form className="buy" id="acheter" method="post" action="/api/checkout">
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="program" value={slug} />
      {goal ? <input type="hidden" name="goal" value={goal} /> : (
        <fieldset className="bgoal">
          <legend className="lab">{t.goalLb}</legend>
          {goalIds.map((g, i) => (
            <label key={g}><input type="radio" name="goal" value={g} required defaultChecked={i === 0} /> {d.goals[i][0]}</label>
          ))}
        </fieldset>
      )}
      <label className="bconsent">
        <input type="checkbox" name="consent" required />
        <span>{t.consent} <a href={legalPaths[lang].cgv} target="_blank">{t.cgv}</a></span>
      </label>
      {error && <p className="berr" role="alert">{t.off}</p>}
      <button type="submit" className="btn">{t.btn(price)}</button>
      <p className="note">{t.secure}</p>
      {test && <p className="note btest">{t.test}</p>}
    </form>
  );
}
