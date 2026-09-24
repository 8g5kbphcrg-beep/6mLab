import type { Lang } from "@/lib/dict";
import { goalsTitle, suggestions, type GoalId } from "@/lib/goals";

// Suggested pairs of goals, each with what it builds; a tap selects both goals.
export default function Suggestions({ lang, sel, onPick, extra }: { lang: Lang; sel: GoalId[]; onPick: (g: GoalId[]) => void; extra?: string }) {
  const fr = lang === "fr";
  return (
    <div className="sugg">
      <p className="lab">{fr ? "Combinaisons conseillées" : "Suggested combinations"}{extra && <span className="sugg-x"> · {extra}</span>}</p>
      <div className="sugg-list">
        {suggestions.map((s) => {
          const on = s.goals.every((g) => sel.includes(g)) && sel.length === 2;
          return (
            <button key={s.goals.join()} type="button" className="sugg-c" aria-pressed={on} onClick={() => onPick(s.goals)}>
              <strong>{goalsTitle(s.goals, lang)}</strong>
              <span>{s[lang].gain}</span>
              <em>{s[lang].who}</em>
            </button>
          );
        })}
      </div>
    </div>
  );
}
