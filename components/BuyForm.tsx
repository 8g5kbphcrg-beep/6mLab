"use client";
import { useState } from "react";
import type { Lang } from "@/lib/dict";
import { programs, type ProgramSlug } from "@/lib/programs";
import { buy, fmtPrice, genders, orderTotal, prices, RUNNING_PRICE, SECOND_GOAL_PRICE } from "@/lib/checkout";
import { goalIds, goals as goalInfo, goalName, goalsTitle, REATH, type GoalId } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";
import "@/app/buy.css";

// Posts to /api/checkout. The goal checkboxes are real form fields, so the form still submits
// without JavaScript; the server checks the count.
export default function BuyForm({ lang, slug, goals = [], test, error }: { lang: Lang; slug: ProgramSlug; goals?: GoalId[]; test: boolean; error?: string }) {
  const t = buy[lang];
  const p = programs[lang][slug];
  const [sel, setSel] = useState<GoalId[]>(goals);
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState(error);
  const reath = sel.includes(REATH);
  const toggle = (g: GoalId) => setSel(sel.includes(g) ? sel.filter((x) => x !== g) : [...sel.filter((x) => x !== REATH), g]);
  const done = sel.length > 0;
  const total = orderTotal(slug, sel, running);

  return (
    <form className="buy" id="acheter" method="post" action="/api/checkout"
      onSubmit={(e) => { if (!done) { e.preventDefault(); setErr("invalide"); } }}>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="program" value={slug} />

      <div className="bprice">
        <strong>{fmtPrice(prices[slug], lang)}</strong>
        <span>{p.name} · {p.duration}</span>
      </div>

      <fieldset className="bstep">
        <legend><span className="bnum">1</span>{t.step1}{!reath && <span className={done ? "bbadge ok" : "bbadge"}>{t.count(sel.length)}</span>}</legend>
        <p className="bhint">{t.hint}</p>
        <div className="bcards">
          {goalIds.map((g) => {
            const on = sel.includes(g);
            return (
              <label key={g} className="bcard bgoal">
                <input type="checkbox" name="goal" value={g} checked={on} disabled={!on && !reath && sel.length >= 2} onChange={() => toggle(g)} />
                <span><strong>{goalName(g, lang)}</strong> {goalInfo[g][lang].details.join(" · ")}</span>
                {!on && !reath && sel.length === 1 && <b>+{fmtPrice(SECOND_GOAL_PRICE, lang)}</b>}
              </label>
            );
          })}
        </div>
        <label className="bcard breath">
          <input type="checkbox" name="goal" value={REATH} checked={reath} onChange={() => setSel(reath ? [] : [REATH])} />
          <span><strong>{t.reathQ}</strong> {goalName(REATH, lang)}. {t.reathD}</span>
        </label>
      </fieldset>

      <fieldset className="bstep">
        <legend><span className="bnum">2</span>{t.step2}</legend>
        <label className="bcard brun">
          <input type="checkbox" name="running" checked={running} onChange={() => setRunning(!running)} />
          <span><strong>{t.runT}</strong> {t.runD}</span>
          <b>+{fmtPrice(RUNNING_PRICE, lang)}</b>
        </label>
      </fieldset>

      <fieldset className="bstep">
        <legend><span className="bnum">3</span>{t.step3}</legend>
        <p className="bhint">{t.profileHint}</p>
        <div className="bfields">
          <label className="bfield">{t.firstName}<input name="firstName" required maxLength={50} autoComplete="given-name" /></label>
          <label className="bfield bage">{t.age}<input name="age" type="number" required min={10} max={99} inputMode="numeric" /></label>
        </div>
        <div className="bgender" role="radiogroup" aria-label={t.gender}>
          <span className="lab">{t.gender}</span>
          {genders.map((g) => (
            <label key={g} className="bchip"><input type="radio" name="gender" value={g} required />{t.genders[g]}</label>
          ))}
        </div>
        <p className="note" style={{ margin: 0 }}>{t.minor}</p>
      </fieldset>

      <div className="bstep">
        <p className="blegend"><span className="bnum">4</span>{t.step4}</p>
        <dl className="bsum">
          <div><dt>{p.name}</dt><dd>{fmtPrice(prices[slug], lang)}</dd></div>
          <div><dt>{t.goalsLb}</dt><dd>{sel.length ? goalsTitle(sel, lang) : t.none}</dd></div>
          {sel.length === 2 && <div><dt>{t.second}</dt><dd>{fmtPrice(SECOND_GOAL_PRICE, lang)}</dd></div>}
          {running && <div><dt>{t.runT}</dt><dd>{fmtPrice(RUNNING_PRICE, lang)}</dd></div>}
          <div className="btotal"><dt>{t.total}</dt><dd>{fmtPrice(total, lang)}</dd></div>
        </dl>
        <label className="bconsent">
          <input type="checkbox" name="consent" required />
          <span>{t.consent} <a href={legalPaths[lang].cgv} target="_blank">{t.cgv}</a></span>
        </label>
        {err && <p className="berr" role="alert">{err === "invalide" ? t.invalid : t.off}</p>}
        <button type="submit" className="btn bpay">{t.btn(fmtPrice(total, lang))}</button>
        <p className="note">{t.secure}</p>
        {test && <p className="note btest">{t.test}</p>}
      </div>
    </form>
  );
}
