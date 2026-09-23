"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/dict";
import { programSlugs } from "@/lib/programs";
import { combos, comboTitle } from "@/lib/goals";

type Props = {
  lang: Lang;
  pick: { title: string; where: string; moments: string[]; goalLb: string; profileLb: string; go: string; names: string[]; meta: string[]; note: string };
};

export default function Picker({ lang, pick }: Props) {
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
  const c = combos[g];
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
        {combos.map((x, i) => (
          <button key={x.goals.join()} type="button" aria-pressed={g === i} onClick={() => setG(i)}>{comboTitle(x.goals, lang)}</button>
        ))}
      </div>
      <div className={m === 1 ? "res b" : "res"} aria-live="polite">
        <h3>{pick.names[m]}, {comboTitle(c.goals, lang).toLowerCase()}</h3>
        <p>{c[lang].obj}</p>
        <p><strong style={{ color: "var(--ink)" }}>{pick.profileLb} :</strong> {c[lang].profile}</p>
        <p style={{ fontWeight: 600, color: "var(--ink)" }}>{pick.meta[m]}</p>
        <p><a className="btn" href={`/${lang}/programmes/${programSlugs[m]}?objectifs=${c.goals.join(",")}#acheter`}>{pick.go}</a></p>
        <p className="note">{pick.note}</p>
      </div>
    </>
  );
}
