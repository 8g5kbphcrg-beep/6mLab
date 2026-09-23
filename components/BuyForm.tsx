"use client";
import { useState } from "react";
import type { Lang } from "@/lib/dict";
import { programs, type ProgramSlug } from "@/lib/programs";
import { buy, fmtPrice, prices, RUNNING_PRICE } from "@/lib/checkout";
import { combos, comboTitle, goalCats, goalNames, REATH, type GoalId } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";
import "@/app/buy.css";

// Posts to /api/checkout. The goal checkboxes are the real form fields (the combination cards
// just tick them), so the form still submits without JavaScript; the server checks the count.
export default function BuyForm({ lang, slug, goals = [], test, error }: { lang: Lang; slug: ProgramSlug; goals?: GoalId[]; test: boolean; error?: string }) {
  const t = buy[lang];
  const p = programs[lang][slug];
  const [sel, setSel] = useState<GoalId[]>(goals);
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState(error);
  const reath = sel.includes(REATH);
  const same = (g: readonly GoalId[]) => g.length === sel.length && g.every((x) => sel.includes(x));
  const pairs = combos.filter((c) => c.goals[0] !== REATH);
  const custom = sel.length > 0 && !reath && !pairs.some((c) => same(c.goals));
  const toggle = (g: GoalId) => setSel(sel.includes(g) ? sel.filter((x) => x !== g) : [...sel.filter((x) => x !== REATH), g]);
  const done = reath || sel.length === 2;

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
          {pairs.map((c) => (
            <button key={c.goals.join()} type="button" className="bcard" aria-pressed={same(c.goals)} onClick={() => setSel([...c.goals])}>
              <strong>{comboTitle(c.goals, lang)}</strong>
              <span>{c[lang].obj}</span>
            </button>
          ))}
        </div>
        <details className="bown" open={custom || undefined}>
          <summary>{t.own}</summary>
          {goalCats.map((c) => (
            <div key={c.fr} className="bcat">
              <p>{c[lang]}</p>
              <div className="bchips">
                {c.goals.map((g) => {
                  const on = sel.includes(g);
                  return (
                    <label key={g} className="bchip">
                      <input type="checkbox" name="goal" value={g} checked={on} disabled={!on && !reath && sel.length >= 2} onChange={() => toggle(g)} />
                      {goalNames[g][lang]}
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </details>
        <label className="bcard breath">
          <input type="checkbox" name="goal" value={REATH} checked={reath} onChange={() => setSel(reath ? [] : [REATH])} />
          <span><strong>{t.reathQ}</strong> {goalNames[REATH][lang]}. {t.reathD}</span>
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

      <div className="bstep">
        <p className="blegend"><span className="bnum">3</span>{t.step3}</p>
        <dl className="bsum">
          <div><dt>{p.name}</dt><dd>{fmtPrice(prices[slug], lang)}</dd></div>
          <div><dt>{t.goalsLb}</dt><dd>{sel.length ? comboTitle(sel, lang) : t.none}</dd></div>
          {running && <div><dt>{t.runT}</dt><dd>{fmtPrice(RUNNING_PRICE, lang)}</dd></div>}
          <div className="btotal"><dt>{t.total}</dt><dd>{fmtPrice(prices[slug] + (running ? RUNNING_PRICE : 0), lang)}</dd></div>
        </dl>
        <label className="bconsent">
          <input type="checkbox" name="consent" required />
          <span>{t.consent} <a href={legalPaths[lang].cgv} target="_blank">{t.cgv}</a></span>
        </label>
        {err && <p className="berr" role="alert">{err === "invalide" ? t.invalid : t.off}</p>}
        <button type="submit" className="btn bpay">{t.btn(fmtPrice(prices[slug] + (running ? RUNNING_PRICE : 0), lang))}</button>
        <p className="note">{t.secure}</p>
        {test && <p className="note btest">{t.test}</p>}
      </div>
    </form>
  );
}
