"use client";
import { useState } from "react";
import type { Lang } from "@/lib/dict";

// Team fields of the club quote form (app/[lang]/clubs): the side (girls or boys), then the age
// category, which differs between the two (youth ends at U17 for girls, U18 for boys), then the
// level of play open to that category. From U15: younger players do not train the same way.
const text = {
  fr: {
    side: "Filière", sides: { f: "Féminine", m: "Masculine" },
    cat: "Catégorie", cats: { f: ["U15 (13-14 ans)", "U17 (15-16 ans)", "Seniors"], m: ["U15 (13-14 ans)", "U18 (15-17 ans)", "Seniors"] },
    level: "Niveau", levels: ["Départemental", "Régional", "National", "Professionnel"],
    from: "Les programmes pour les clubs commencent à partir des U15.",
    u15: "U15 : la musculation n'est pas recommandée à cet âge. Le programme travaille au poids du corps (coordination, gainage, appuis, prévention), même si le club a une salle de musculation.",
    lvl: "Le programme est calibré sur ce niveau. Prendre un niveau au-dessus de celui de ton équipe est possible, mais en ayant bien conscience du niveau réel de ton effectif.",
  },
  en: {
    side: "Team", sides: { f: "Women / girls", m: "Men / boys" },
    cat: "Age group", cats: { f: ["U15 (13-14)", "U17 (15-16)", "Seniors"], m: ["U15 (13-14)", "U18 (15-17)", "Seniors"] },
    level: "Level", levels: ["County", "Regional", "National", "Professional"],
    from: "Club programs start from U15.",
    u15: "U15: weight training is not recommended at this age. The program uses bodyweight (coordination, core, footwork, prevention), even if the club has a weight room.",
    lvl: "The program is calibrated on this level. Choosing a level above your team's is possible, but only with a clear view of your squad's real level.",
  },
};

export default function ClubTeam({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [side, setSide] = useState<"f" | "m" | "">("");
  const [cat, setCat] = useState("");
  // Levels open to each age group: U15 up to regional, U17 girls and U18 boys up to national,
  // seniors up to professional.
  const idx = side ? t.cats[side].indexOf(cat) : -1;
  const levels = t.levels.slice(0, [2, 3, 4][idx] ?? 0);
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
          {levels.length > 0 && (
            <label className="cf-field">{t.level}
              <select key={cat} name="level" required defaultValue=""><option value="" disabled>—</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
            </label>
          )}
        </div>
      )}
      {idx === 0 && <p className="cf-warn" role="note">⚠ {t.u15}</p>}
      {levels.length > 0 && <p className="note">{t.lvl}</p>}
      <p className="note">{t.from}</p>
    </fieldset>
  );
}
