"use client";
import { useEffect, useRef, useState } from "react";
import { dict, type Lang } from "@/lib/dict";
import { quiz } from "@/lib/quiz";
import "@/app/quiz.css";

export default function Quiz({ lang }: { lang: Lang }) {
  const t = quiz[lang];
  const d = dict[lang];
  const [a, setA] = useState<number[]>([]);
  const head = useRef<HTMLHeadingElement>(null);
  const i = a.length;
  const n = t.steps.length;
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
          {s.o.map((o, j) => (
            <button key={o} type="button" className="qopt" onClick={() => setA([...a, j])}>{o}</button>
          ))}
        </div>
        {i > 0 && <button type="button" className="qlink" onClick={() => setA(a.slice(0, -1))}>{t.back}</button>}
      </>
    );
  } else if (a[5] === 1) {
    body = (
      <>
        <h2 className="qq" tabIndex={-1} ref={head}>{t.hurt.t}</h2>
        <p>{t.hurt.p}</p>
        <button type="button" className="qlink" onClick={() => setA([])}>{t.restart}</button>
      </>
    );
  } else {
    const f = a[0];
    const goal = d.goals[a[1]];
    const note = f === 0 && a[4] === 0 ? t.notes[0] : f === 1 && a[4] === 2 ? t.notes[1] : "";
    body = (
      <>
        <p className="lab" style={{ margin: 0 }}>{t.result}</p>
        <h2 className="qq" tabIndex={-1} ref={head}>{d.pick.names[f]}, {goal[0].toLowerCase()}</h2>
        <div className={f === 1 ? "qres b" : "qres"}>
          <p className="qprice">{d.cmp.price[f]}</p>
          <p>{goal[1]}</p>
          <p><strong style={{ color: "var(--ink)" }}>{d.pick.meta[f]}</strong></p>
          {note && <p>{note}</p>}
          {a[1] >= 2 && <p className="note">{t.diet}</p>}
        </div>
        <p className="lab" style={{ marginTop: "1.5rem" }}>{t.summary}</p>
        <ul className="qsum">
          {t.labels.map((l, k) => <li key={l}>{l} : <b>{t.steps[k].o[a[k]]}</b></li>)}
        </ul>
        <button type="button" className="btn" disabled>{t.buy}</button>
        <p className="note">{t.buyNote} {d.why.note}</p>
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
