"use client";
import { useEffect, useRef, useState } from "react";
import { dict, type Lang } from "@/lib/dict";
import { quiz } from "@/lib/quiz";
import { goalIds, goalsTitle, REATH, type GoalId } from "@/lib/goals";
import { programSlugs } from "@/lib/programs";
import BuyForm from "@/components/BuyForm";
import "@/app/quiz.css";

export default function Quiz({ lang, test }: { lang: Lang; test: boolean }) {
  const t = quiz[lang];
  const d = dict[lang];
  const [a, setA] = useState<number[]>([]);
  const head = useRef<HTMLHeadingElement>(null);
  // Steps: 0 moment, 1 first goal, 2 second goal, 3 level, 4 place, 5 sessions, 6 injury.
  // Picking Réathlétisation (last option of step 1) skips step 2, recorded as -1.
  const i = a.length;
  const n = t.steps.length;
  const R = goalIds.length;
  const answer = (j: number) => setA(i === 1 && j === R ? [...a, j, -1] : [...a, j]);
  const back = () => setA(a.slice(0, a[a.length - 1] === -1 ? -2 : -1));
  useEffect(() => {
    if (i > 0) head.current?.focus();
  }, [i]);

  let body;
  if (i < n) {
    const s = t.steps[i];
    body = (
      <>
        <p className="lab" style={{ margin: 0 }}>{t.q} {i + 1} {t.of} {n}</p>
        <h2 className="qq" tabIndex={-1} ref={head}>{s.q}</h2>
        <div className="qopts">
          {s.o.map((o, j) => (i === 2 && j === a[1] ? null :
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
    const f = a[0];
    const sel: GoalId[] = a[1] === R ? [REATH] : [goalIds[a[1]], goalIds[a[2]]];
    const note = f === 0 && a[5] === 0 ? t.notes[0] : f === 1 && a[5] === 2 ? t.notes[1] : "";
    body = (
      <>
        <p className="lab" style={{ margin: 0 }}>{t.result}</p>
        <h2 className="qq" tabIndex={-1} ref={head}>{d.pick.names[f]} · {goalsTitle(sel, lang)}</h2>
        <div className={f === 1 ? "qres b" : "qres"}>
          <p className="qprice">{d.cmp.price[f]}</p>
          <p><strong style={{ color: "var(--ink)" }}>{d.pick.meta[f]}</strong></p>
          {note && <p>{note}</p>}
          {sel.some((g) => g === "muscle" || g === "condition") && <p className="note">{t.diet}</p>}
        </div>
        <p className="lab" style={{ marginTop: "1.5rem" }}>{t.summary}</p>
        <ul className="qsum">
          {t.labels.map((l, k) => a[k] >= 0 && <li key={l}>{l} : <b>{t.steps[k].o[a[k]]}</b></li>)}
        </ul>
        <BuyForm lang={lang} slug={programSlugs[f]} goals={sel} test={test} />
        <p className="note" style={{ marginTop: "1rem" }}>{d.why.note}</p>
        <button type="button" className="qlink" onClick={() => setA([])}>{t.restart}</button>
      </>
    );
  }
  return (
    <div className="quiz">
      <h1 style={{ fontSize: "1.4rem", color: "var(--muted)" }}>{t.title}</h1>
      <div className="qbar" role="progressbar" aria-valuemin={0} aria-valuemax={n} aria-valuenow={Math.min(i, n)}>
        <span style={{ width: `${(Math.min(i, n) / n) * 100}%` }} />
      </div>
      {i === 0 && <p>{t.intro}</p>}
      {body}
    </div>
  );
}
