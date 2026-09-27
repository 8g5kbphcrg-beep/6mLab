"use client";
import { useState } from "react";
import type { Lang } from "@/lib/dict";

// Team fields of the club quote form (app/[lang]/clubs): the side (girls or boys), then the age
// category, which differs between the two (youth ends at U17 for girls, U18 for boys), then the
// level of play for seniors only. From U15: younger players do not train the same way.
const text = {
  fr: {
    side: "Filière", sides: { f: "Féminine", m: "Masculine" },
    cat: "Catégorie", cats: { f: ["U15 (13-14 ans)", "U17 (15-16 ans)", "Seniors"], m: ["U15 (13-14 ans)", "U18 (15-17 ans)", "Seniors"] },
    level: "Niveau", levels: ["Départemental", "Régional", "National", "Professionnel"],
    from: "Les programmes pour les clubs commencent à partir des U15.",
  },
  en: {
    side: "Team", sides: { f: "Women / girls", m: "Men / boys" },
    cat: "Age group", cats: { f: ["U15 (13-14)", "U17 (15-16)", "Seniors"], m: ["U15 (13-14)", "U18 (15-17)", "Seniors"] },
    level: "Level", levels: ["County", "Regional", "National", "Professional"],
    from: "Club programs start from U15.",
  },
};

export default function ClubTeam({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [side, setSide] = useState<"f" | "m" | "">("");
  const [cat, setCat] = useState("");
  const senior = cat === t.cats.f[2];
  return (
    <fieldset className="cf-team">
      <legend className="cf-lab">{t.side}</legend>
      <div className="cf-chips">
        {(["f", "m"] as const).map((k) => (
          <label key={k} className="cf-chip">
            <input type="radio" name="side" value={t.sides[k]} required checked={side === k} onChange={() => { setSide(k); setCat(""); }} />{t.sides[k]}
          </label>
        ))}
      </div>
      {side && (
        <div className="cf-row">
          <label className="cf-field">{t.cat}
            <select name="category" required value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="" disabled>—</option>
              {t.cats[side].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          {senior && (
            <label className="cf-field">{t.level}
              <select name="level" required defaultValue=""><option value="" disabled>—</option>{t.levels.map((l) => <option key={l}>{l}</option>)}</select>
            </label>
          )}
        </div>
      )}
      <p className="note">{t.from}</p>
    </fieldset>
  );
}
