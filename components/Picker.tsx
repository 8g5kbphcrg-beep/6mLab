"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/dict";
import { programSlugs } from "@/lib/programs";
import { goalIds, goals, goalName, goalsTitle, REATH, type GoalId } from "@/lib/goals";

type Props = {
  lang: Lang;
  pick: { title: string; where: string; moments: string[]; goalLb: string; go: string; pickTwo: string; names: string[]; meta: string[]; note: string };
};

export default function Picker({ lang, pick }: Props) {
  const [m, setM] = useState(0);
  const [sel, setSel] = useState<GoalId[]>(["muscle", "explosivite"]);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-pick]");
      if (el) setM(Number(el.dataset.pick));
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);
  // Picking a third goal drops the oldest one; Réathlétisation always stands alone.
  const toggle = (g: GoalId) =>
    setSel(sel.includes(g) ? sel.filter((x) => x !== g) : g === REATH ? [REATH] : [...sel.filter((x) => x !== REATH), g].slice(-2));
  const done = sel.includes(REATH) || sel.length === 2;
  return (
    <>
      <h2>{pick.title}</h2>
      <div className="pick" role="group" aria-labelledby="l1">
        <span className="lab" id="l1">{pick.where}</span>
        {pick.moments.map((t, i) => (
          <button key={t} type="button" aria-pressed={m === i} onClick={() => setM(i)}>{t}</button>
        ))}
      </div>
      <p className="lab" id="l2">{pick.goalLb}</p>
      <div className="combos" role="group" aria-labelledby="l2">
        {[...goalIds, REATH].map((g) => (
          <button key={g} type="button" className="combo" aria-pressed={sel.includes(g)} onClick={() => toggle(g)}>
            <strong>{goalName(g, lang)}</strong>
            <span>{goals[g][lang].details.join(" · ")}</span>
          </button>
        ))}
      </div>
      <div className={m === 1 ? "res b" : "res"} aria-live="polite">
        <div>
          <h3>{pick.names[m]}{sel.length > 0 && ` · ${goalsTitle(sel, lang)}`}</h3>
          <p className="note">{done ? pick.meta[m] : pick.pickTwo}</p>
        </div>
        {done && <a className="btn" href={`/${lang}/programmes/${programSlugs[m]}?objectifs=${sel.join(",")}#acheter`}>{pick.go}</a>}
      </div>
      <p className="note" style={{ marginTop: "1rem" }}>{pick.note}</p>
    </>
  );
}
