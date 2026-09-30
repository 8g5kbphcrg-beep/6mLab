"use client";
import { useEffect, useRef, useState } from "react";
import { dict, type Lang } from "@/lib/dict";
import { quiz } from "@/lib/quiz";
import { goalIds, goalsTitle, REATH, REATH_READY, type GoalId } from "@/lib/goals";
import { programSlugs } from "@/lib/programs";
import { fmtPrice } from "@/lib/checkout";
import type { Part, Quote } from "@/lib/season-parts";
import BuyForm from "@/components/BuyForm";
import { track } from "@/components/Track";
import "@/app/quiz.css";

// quotes: today's offer for each part and the Saison complète (lib/season-parts.ts), from the page.
export default function Quiz({ lang, test, quotes }: { lang: Lang; test: boolean; quotes: Record<Part | "pack", Quote> }) {
  const t = quiz[lang];
  const d = dict[lang];
  const [a, setA] = useState<number[]>([]);
  const head = useRef<HTMLHeadingElement>(null);
  // Steps: 0 moment (the part of the season: pre-season, first half, second half), 1 period (that
  // part, or the "Saison complète"), 2 first goal, 3 second goal, 4 level, 5 place (home, gym),
  // 6 injury. The number of sessions is set by each program, so it is not asked.
  // Picking Réathlétisation (last option of step 2) skips step 3, recorded as -1.
  const i = a.length;
  const n = t.steps.length;
  const R = goalIds.length;
  const answer = (j: number) => setA(i === 2 && j === R ? [...a, j, -1] : [...a, j]);
  // Back undoes the last question actually asked.
  const back = () => {
    let k = a.length - 1;
    if (a[k] === -1) k--;
    setA(a.slice(0, k));
  };
  useEffect(() => {
    if (i > 0) head.current?.focus();
    // Audience: started at the first answer, finished with the recommended offer (or the advice to
    // see a doctor first).
    if (i === 1) track("quiz_debut", "handball", true);
    if (i >= n) track("quiz_fin", a[6] === 1 ? "blessure" : a[1] === 1 ? "pack" : programSlugs[a[0]], true);
  }, [i, n, a]);

  // Numbering and progress without the skipped question.
  const skip = a[0] === 1 ? 1 : 0, shown = Math.min(i, n) - (i > 1 ? skip : 0), total = n - skip;
  let body;
  if (!REATH_READY && a[2] === R) {
    // Réathlétisation is not for sale yet: the questionnaire stops here.
    body = (
      <>
        <h2 className="qq" tabIndex={-1} ref={head}>{t.soon.t}</h2>
        <p>{t.soon.p}</p>
        <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <button type="button" className="qlink" onClick={back}>{t.back}</button>
          <button type="button" className="qlink" onClick={() => setA([])}>{t.restart}</button>
        </div>
      </>
    );
  } else if (i < n) {
    const s = t.steps[i];
    body = (
      <>
        <p className="lab" style={{ margin: 0 }}>{t.q} {shown + 1} {t.of} {total}</p>
        <h2 className="qq" tabIndex={-1} ref={head}>{s.q}</h2>
        <div className="qopts">
          {s.o.map((o, j) => (i === 3 && j === a[2] ? null :
            <button key={o} type="button" className="qopt" onClick={() => answer(j)}>{o}</button>
          ))}
        </div>
        {i > 0 && <button type="button" className="qlink" onClick={back}>{t.back}</button>}
      </>
    );
  } else if (a[6] === 1) {
    body = (
      <>
        <h2 className="qq" tabIndex={-1} ref={head}>{t.hurt.t}</h2>
        <p>{t.hurt.p}</p>
        <button type="button" className="qlink" onClick={() => setA([])}>{t.restart}</button>
      </>
    );
  } else {
    // The moment decides the part; the period, that part alone or the Saison complète (which
    // starts with the part under way, like its own page).
    const pack = a[1] === 1, f = a[0], qt = quotes[pack ? "pack" : programSlugs[f]];
    // Last option of step 3: no second goal.
    const sel: GoalId[] = a[2] === R ? [REATH] : a[3] === R ? [goalIds[a[2]]] : [goalIds[a[2]], goalIds[a[3]]];
    body = (
      <>
        <p className="lab" style={{ margin: 0 }}>{t.result}</p>
        <h2 className="qq" tabIndex={-1} ref={head}>{pack ? t.pack.name : d.pick.names[f]} · {goalsTitle(sel, lang)}</h2>
        <div className={pack ? "qres p" : ["qres", "qres b", "qres c"][f]}>
          <p className="qprice">{fmtPrice(qt.price, lang)}{qt.before && <s>{fmtPrice(qt.before, lang)}</s>}</p>
          <p><strong style={{ color: "var(--ink)" }}>{pack ? t.pack.meta : d.pick.meta[f]}</strong></p>
          {sel.some((g) => g === "muscle" || g === "condition") && <p className="note">{t.diet}</p>}
        </div>
        <p className="lab" style={{ marginTop: "1.5rem" }}>{t.summary}</p>
        <ul className="qsum">
          {t.labels.map((l, k) => a[k] >= 0 && <li key={l}>{l} : <b>{t.steps[k].o[a[k]]}</b></li>)}
        </ul>
        <BuyForm lang={lang} slug={pack ? qt.slots[0].part : programSlugs[f]} q={qt} goals={sel} pack={pack} place={a[5] === 1 ? "salle" : "maison"} test={test} />
        <p className="note" style={{ marginTop: "1rem" }}>{d.why.note}</p>
        <button type="button" className="qlink" onClick={() => setA([])}>{t.restart}</button>
      </>
    );
  }
  return (
    <div className="quiz">
      <h1 style={{ fontSize: "1.4rem", color: "var(--muted)" }}>{t.title}</h1>
      <div className="qbar" role="progressbar" aria-label={lang === "fr" ? "Progression du questionnaire" : "Questionnaire progress"} aria-valuemin={0} aria-valuemax={total} aria-valuenow={shown}>
        <span style={{ width: `${(shown / total) * 100}%` }} />
      </div>
      {i === 0 && <p>{t.intro}</p>}
      {body}
    </div>
  );
}
