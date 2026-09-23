"use client";
import { useState } from "react";
import type { Lang } from "@/lib/dict";
import type { ProgramSlug } from "@/lib/programs";
import { buy, fmtPrice, prices, RUNNING_PRICE } from "@/lib/checkout";
import { combos, comboTitle, goalCats, goalNames, REATH, type GoalId } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";

// Posts to /api/checkout. The checkboxes are real form fields, so the form still submits without
// JavaScript; the server checks the goal count either way.
export default function BuyForm({ lang, slug, goals = [], test, error }: { lang: Lang; slug: ProgramSlug; goals?: GoalId[]; test: boolean; error?: string }) {
  const t = buy[lang];
  const [sel, setSel] = useState<GoalId[]>(goals);
  const [running, setRunning] = useState(false);
  const [err, setErr] = useState(error);
  const reath = sel.includes(REATH);
  const same = (g: GoalId[]) => g.length === sel.length && g.every((x) => sel.includes(x));
  const toggle = (g: GoalId) => setSel(sel.includes(g) ? sel.filter((x) => x !== g) : [...sel, g]);

  return (
    <form className="buy" id="acheter" method="post" action="/api/checkout"
      onSubmit={(e) => { if (!reath && sel.length !== 2) { e.preventDefault(); setErr("invalide"); } }}>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="program" value={slug} />
      <fieldset className="bgoals">
        <legend className="lab">{t.goalLb} <span className="bcount" aria-live="polite">{reath ? "" : t.count(sel.length)}</span></legend>
        <p className="lab">{t.combosLb}</p>
        <div className="bcombos">
          {combos.filter((c) => c.goals[0] !== REATH).map((c) => (
            <button key={c.goals.join()} type="button" aria-pressed={same(c.goals)} onClick={() => setSel(c.goals)}>{comboTitle(c.goals, lang)}</button>
          ))}
        </div>
        <p className="lab">{t.ownLb}</p>
        {goalCats.map((c) => (
          <div key={c.fr} className="bcat">
            <p><span aria-hidden="true">{c.icon}</span> {c[lang]}</p>
            {c.goals.map((g) => {
              const on = sel.includes(g);
              return (
                <label key={g} className="bchk">
                  <input type="checkbox" name="goal" value={g} checked={on} disabled={!on && (reath || sel.length >= 2)} onChange={() => toggle(g)} />
                  {goalNames[g][lang]}
                </label>
              );
            })}
          </div>
        ))}
        <label className="bchk breath">
          <input type="checkbox" name="goal" value={REATH} checked={reath} onChange={() => setSel(reath ? [] : [REATH])} />
          {t.reath}
        </label>
      </fieldset>
      <label className="bchk brun">
        <input type="checkbox" name="running" checked={running} onChange={() => setRunning(!running)} />
        <span>{t.running} <strong>(+{fmtPrice(RUNNING_PRICE, lang)})</strong></span>
      </label>
      <label className="bconsent">
        <input type="checkbox" name="consent" required />
        <span>{t.consent} <a href={legalPaths[lang].cgv} target="_blank">{t.cgv}</a></span>
      </label>
      {err && <p className="berr" role="alert">{err === "invalide" ? t.invalid : t.off}</p>}
      <button type="submit" className="btn">{t.btn(fmtPrice(prices[slug] + (running ? RUNNING_PRICE : 0), lang))}</button>
      <p className="note">{t.secure}</p>
      {test && <p className="note btest">{t.test}</p>}
    </form>
  );
}
