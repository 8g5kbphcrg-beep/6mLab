"use client";
import { useState } from "react";

// Search in the exercise library. Typing is never interrupted: the matching exercises are
// suggested under the field as you type; tapping one fills in its full name. Enter (or "Find")
// then scrolls to that exercise and makes its card pulse, so it stands out among the others.
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const score = (name: string, q: string) => {
  const n = norm(name);
  if (n === q) return 0;
  if (n.startsWith(q)) return 1;
  if (n.split(" ").some((w) => w.startsWith(q))) return 2;
  if (n.includes(q)) return 3;
  return q.split(" ").every((w) => n.includes(w)) ? 4 : -1;
};

export default function LibrarySearch({ items, fr }: { items: [string, string][]; fr: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [miss, setMiss] = useState(false);
  const nq = norm(q);
  const hits = nq ? items.map((it) => [it, score(it[1], nq)] as const).filter(([, s]) => s >= 0).sort((a, b) => a[1] - b[1] || a[0][1].length - b[0][1].length).slice(0, 6).map(([it]) => it) : [];
  const go = (id: string) => {
    const el = document.getElementById(`ex-${id}`);
    if (!el) return;
    (document.activeElement as HTMLElement | null)?.blur();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("hit");
    void el.offsetWidth;
    el.classList.add("hit");
    setTimeout(() => el.classList.remove("hit"), 3200);
  };
  return (
    <form className="lib-search" role="search" autoComplete="off"
      onSubmit={(e) => { e.preventDefault(); const hit = hits[0]; setOpen(false); setMiss(!hit); if (hit) { setQ(hit[1]); go(hit[0]); } }}>
      <label className="sr" htmlFor="lib-q">{fr ? "Rechercher un exercice" : "Search for an exercise"}</label>
      <input id="lib-q" type="search" value={q} enterKeyHint="search" autoCorrect="off" autoCapitalize="none" spellCheck={false}
        placeholder={fr ? "Rechercher un exercice (ex. : squat, nordic, gainage…)" : "Search for an exercise (e.g. squat, nordic, plank…)"}
        role="combobox" aria-autocomplete="list" aria-controls="lib-sugg" aria-expanded={open && hits.length > 0}
        onChange={(e) => { setQ(e.target.value); setOpen(true); setMiss(false); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} />
      <button className="btn" type="submit">{fr ? "Trouver" : "Find"}</button>
      {open && hits.length > 0 && !(hits.length === 1 && norm(hits[0][1]) === nq) && (
        <ul className="lib-sugg" id="lib-sugg" role="listbox">
          {hits.map(([id, name]) => (
            <li key={id} role="option" aria-selected="false">
              {/* onMouseDown: fills the field before the input loses focus. */}
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => { setQ(name); setOpen(false); (document.getElementById("lib-q") as HTMLInputElement | null)?.focus(); }}>{name}</button>
            </li>
          ))}
        </ul>
      )}
      {miss && <p className="lib-miss" role="status">{fr ? "Aucun exercice ne correspond. Essaie un autre mot." : "No exercise matches. Try another word."}</p>}
    </form>
  );
}
