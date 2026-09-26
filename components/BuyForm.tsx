"use client";
import { useRef, useState } from "react";
import type { Lang } from "@/lib/dict";
import { programs, type ProgramSlug } from "@/lib/programs";
import { buy, fmtPrice, genders, orderTotal, PACK_PRICE, places, prices, RUNNING_PRICE, SECOND_GOAL_PRICE, type Place } from "@/lib/checkout";
import { Dumbbell, House } from "@/components/PlaceIcons";
import { goalIds, goals as goalInfo, goalName, goalsTitle, REATH, type GoalId } from "@/lib/goals";
import { legalPaths } from "@/lib/legal";
import Suggestions from "@/components/Suggestions";
import "@/app/buy.css";

// Posts to /api/checkout. The goal checkboxes are real form fields, so the form still submits
// without JavaScript; the server checks the count. pack: the "Saison complète" page (Pré-saison
// then Maintien, same goals, one price).
// place: already chosen in the questionnaire (home or gym), then pre-selected.
export default function BuyForm({ lang, slug, goals = [], pack = false, place: chosen, test, error }: { lang: Lang; slug: ProgramSlug; goals?: GoalId[]; pack?: boolean; place?: Place; test: boolean; error?: string }) {
  const t = buy[lang];
  const p = programs[lang][slug];
  const [sel, setSel] = useState<GoalId[]>(goals);
  const [running, setRunning] = useState(false);
  const [place, setPlace] = useState<Place | null>(chosen ?? null);
  const [err, setErr] = useState(error);
  // Paying without a goal: the page scrolls back up to the goals, which show a red message.
  const [noGoal, setNoGoal] = useState(false);
  const goalsRef = useRef<HTMLFieldSetElement>(null);
  const reath = sel.includes(REATH);
  const toggle = (g: GoalId) => setSel(sel.includes(g) ? sel.filter((x) => x !== g) : [...sel.filter((x) => x !== REATH), g]);
  const done = sel.length > 0;
  const total = orderTotal(slug, sel, running, pack);

  return (
    <form className={`buy ${pack ? "p" : slug === "maintien-saison" ? "b" : "a"}`} id="acheter" method="post" action="/api/checkout" data-go
      onSubmit={(e) => { if (!done) { e.preventDefault(); setNoGoal(true); goalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); } }}>
      <input type="hidden" name="lang" value={lang} />
      <input type="hidden" name="program" value={slug} />
      {pack && <input type="hidden" name="pack" value="on" />}

      <div className="bprice">
        <strong>{fmtPrice(pack ? PACK_PRICE : prices[slug], lang)}</strong>
        {pack && <s>{fmtPrice(prices["pre-saison"] + prices["maintien-saison"], lang)}</s>}
        <span>{pack ? `${t.packT} · ${t.packWeeks}` : `${p.name} · ${p.duration}`}</span>
      </div>

      <fieldset className={noGoal && !done ? "bstep bgoals bmiss" : "bstep bgoals"} ref={goalsRef}>
        <legend><span className="bnum">1</span>{t.step1}{!reath && <span className={done ? "bbadge ok" : "bbadge"}>{t.count(sel.length)}</span>}</legend>
        {noGoal && !done && <p className="bmissmsg" role="alert">{t.noGoal}</p>}
        <p className="bhint">{t.hint}</p>
        <Suggestions lang={lang} sel={sel} onPick={setSel} extra={`${lang === "fr" ? "2 objectifs" : "2 goals"} +${fmtPrice(SECOND_GOAL_PRICE, lang)}`} />
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
        <legend><span className="bnum">2</span>{t.stepPlace}</legend>
        <p className="bhint">{t.placeHint}</p>
        <div className="bplaces">
          {places.map((pl) => (
            <label key={pl} className="bcard bplace">
              <input type="radio" name="lieu" value={pl} required checked={place === pl} onChange={() => setPlace(pl)} />
              {pl === "maison" ? <House /> : <Dumbbell />}
              <span><strong>{t.places[pl][0]}</strong> {t.places[pl][1]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="bstep">
        <legend><span className="bnum">3</span>{t.step2}</legend>
        <label className="bcard brun">
          <input type="checkbox" name="running" checked={running} onChange={() => setRunning(!running)} />
          <span><strong>{t.runT}</strong> {t.runD}</span>
          <b>+{fmtPrice(RUNNING_PRICE, lang)}</b>
        </label>
      </fieldset>

      <fieldset className="bstep">
        <legend><span className="bnum">4</span>{t.step3}</legend>
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
        <p className="blegend"><span className="bnum">5</span>{t.step4}</p>
        <dl className="bsum">
          <div><dt>{pack ? t.packT : p.name}</dt><dd>{fmtPrice(pack ? PACK_PRICE : prices[slug], lang)}</dd></div>
          <div><dt>{t.goalsLb}</dt><dd>{sel.length ? goalsTitle(sel, lang) : t.none}</dd></div>
          <div><dt>{t.placeLb}</dt><dd>{place ? t.places[place][0] : t.none}</dd></div>
          {sel.length === 2 && <div><dt>{t.second}</dt><dd>{fmtPrice(SECOND_GOAL_PRICE, lang)}</dd></div>}
          {running && <div><dt>{t.runT}</dt><dd>{fmtPrice(RUNNING_PRICE, lang)}</dd></div>}
          <div className="btotal"><dt>{t.total}</dt><dd>{fmtPrice(total, lang)}</dd></div>
        </dl>
        <label className="bconsent">
          <input type="checkbox" name="consent" required />
          <span>{t.consent} <a href={legalPaths[lang].cgv} target="_blank">{t.cgv}</a></span>
        </label>
        {err && <p className="berr" role="alert">{err === "invalide" ? t.invalid : t.off}</p>}
        <button type="submit" className="btn bpay" onClick={(e) => { if (!done) { e.preventDefault(); setNoGoal(true); goalsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }); } }}>{t.btn(fmtPrice(total, lang))}</button>
        <p className="note">{t.secure}</p>
        {test && <p className="note btest">{t.test}</p>}
      </div>
    </form>
  );
}
