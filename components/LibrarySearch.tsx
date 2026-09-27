"use client";
import { useState } from "react";

// Search in the exercise library: typing an exercise's name (or picking a suggestion) scrolls to
// it and makes its card pulse, so it stands out among the others.
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export default function LibrarySearch({ items, fr }: { items: [string, string][]; fr: boolean }) {
  const [miss, setMiss] = useState(false);
  const find = (q: string, exact: boolean) => {
    const n = norm(q);
    if (!n) return null;
    return items.find(([, name]) => norm(name) === n) ?? (exact ? null : items.find(([, name]) => norm(name).startsWith(n)) ?? items.find(([, name]) => norm(name).includes(n)) ?? items.find(([, name]) => n.split(" ").every((w) => norm(name).includes(w))) ?? null);
  };
  const go = (id: string) => {
    const el = document.getElementById(`ex-${id}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.remove("hit");
    void el.offsetWidth;
    el.classList.add("hit");
    setTimeout(() => el.classList.remove("hit"), 3200);
    el.querySelector("a")?.focus({ preventScroll: true });
  };
  return (
    <form className="lib-search" role="search" onSubmit={(e) => { e.preventDefault(); const q = new FormData(e.currentTarget).get("q") as string; const hit = find(q, false); setMiss(!hit); if (hit) go(hit[0]); }}>
      <label className="sr" htmlFor="lib-q">{fr ? "Rechercher un exercice" : "Search for an exercise"}</label>
      <input id="lib-q" name="q" type="search" list="lib-names" autoComplete="off" placeholder={fr ? "Rechercher un exercice (ex. : squat, nordic, gainage…)" : "Search for an exercise (e.g. squat, nordic, plank…)"}
        onChange={(e) => { setMiss(false); const hit = find(e.target.value, true); if (hit) go(hit[0]); }} />
      <button className="btn" type="submit">{fr ? "Trouver" : "Find"}</button>
      <datalist id="lib-names">{items.map(([id, name]) => <option key={id} value={name} />)}</datalist>
      {miss && <p className="lib-miss" role="status">{fr ? "Aucun exercice ne correspond. Essaie un autre mot." : "No exercise matches. Try another word."}</p>}
    </form>
  );
}
