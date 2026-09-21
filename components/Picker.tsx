"use client";
import { useEffect, useState } from "react";

type Props = {
  pick: { title: string; where: string; moments: string[]; goalLb: string; names: string[]; meta: string[]; note: string };
  goals: string[][];
};
const ICONS = ["dumb", "jump", "plate", "flame"];

export default function Picker({ pick, goals }: Props) {
  const [m, setM] = useState(0);
  const [g, setG] = useState(0);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-pick]");
      if (el) setM(Number(el.dataset.pick));
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  return (
    <>
      <h2>{pick.title}</h2>
      <div className="pick" role="group" aria-labelledby="l1">
        <span className="lab" id="l1">{pick.where}</span>
        {pick.moments.map((t, i) => (
          <button key={t} type="button" aria-pressed={m === i} onClick={() => setM(i)}>{t}</button>
        ))}
      </div>
      <div className="pick" role="group" aria-labelledby="l2">
        <span className="lab" id="l2">{pick.goalLb}</span>
        {goals.map((x, i) => (
          <button key={x[0]} type="button" aria-pressed={g === i} onClick={() => setG(i)}>
            <svg className="i" aria-hidden="true"><use href={`#${ICONS[i]}`} /></svg>
            <span>{x[0]}</span>
          </button>
        ))}
      </div>
      <div className={m === 1 ? "res b" : "res"} aria-live="polite">
        <h3>{pick.names[m]}, {goals[g][0].toLowerCase()}</h3>
        <p>{goals[g][1]}</p>
        <p style={{ fontWeight: 600, color: "var(--ink)" }}>{pick.meta[m]}</p>
        <p className="note">{pick.note}</p>
      </div>
    </>
  );
}
