"use client";
import { useEffect, useState } from "react";
import type { Lang } from "@/lib/dict";
import { CAT_KEYS, CLUB_PREREQ, LEVEL_KEYS } from "@/lib/club-prereq";

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
    info: "Pour chaque catégorie et chaque niveau de jeu, le programme part du principe que certains acquis sont déjà en place (par exemple, des U15 en départemental ont déjà un premier bagage physique et technique). Si certains joueurs du groupe sont très débutants et loin de ces acquis, le programme ne peut pas combler cet écart à lui seul : c'est à l'entraîneur d'adapter pour eux.",
    infoL: "Ce que suppose le niveau choisi",
    soon: "La liste des acquis attendus pour ce niveau arrive bientôt. En attendant : le programme part du principe que ton équipe a déjà le bagage physique et technique habituel de cette catégorie et de ce niveau.",
    expect: "Acquis attendus", pick: "Choisis une catégorie et un niveau pour voir les acquis attendus.",
    advice: "Ton équipe n'a pas la plupart de ces acquis ? Choisis le niveau en dessous. Si même le premier niveau ne correspond pas, le programme ne sera pas adapté à ton groupe pour l'instant, et mieux vaut ne pas demander de devis.",
    lvl: "Le programme est calibré sur ce niveau. Prendre un niveau au-dessus de celui de ton équipe est possible, mais en ayant bien conscience du niveau réel de ton effectif.",
  },
  en: {
    side: "Team", sides: { f: "Women / girls", m: "Men / boys" },
    cat: "Age group", cats: { f: ["U15 (13-14)", "U17 (15-16)", "Seniors"], m: ["U15 (13-14)", "U18 (15-17)", "Seniors"] },
    level: "Level", levels: ["County", "Regional", "National", "Professional"],
    from: "Club programs start from U15.",
    u15: "U15: weight training is not recommended at this age. The program uses bodyweight (coordination, core, footwork, prevention), even if the club has a weight room.",
    info: "For each age group and level of play, the program assumes some prerequisites are already in place (for example, county-level U15s already have a first physical and technical background). If some players in the group are complete beginners, far from those prerequisites, the program cannot close that gap on its own: the coach has to adapt for them.",
    infoL: "What the chosen level assumes",
    soon: "The list of expected prerequisites for this level is coming soon. Meanwhile: the program assumes your team already has the usual physical and technical background of this age group and level.",
    expect: "Expected prerequisites", pick: "Choose an age group and a level to see the expected prerequisites.",
    advice: "Your team lacks most of these prerequisites? Choose the level below. If even the first level does not fit, the program will not suit your group for now, and it is better not to ask for a quote.",
    lvl: "The program is calibrated on this level. Choosing a level above your team's is possible, but only with a clear view of your squad's real level.",
  },
};

export default function ClubTeam({ lang }: { lang: Lang }) {
  const t = text[lang];
  const [side, setSide] = useState<"f" | "m" | "">("");
  const [cat, setCat] = useState("");
  const [lvl, setLvl] = useState("");
  // The "i" next to the level: what the level assumes, in a box over the form (Escape, the cross,
  // the backdrop or the "i" again close it).
  const [info, setInfo] = useState(false);
  useEffect(() => {
    if (!info) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setInfo(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [info]);
  // Levels open to each age group: U15 up to regional, U17 girls and U18 boys up to national,
  // seniors up to professional.
  const idx = side ? t.cats[side].indexOf(cat) : -1;
  const levels = t.levels.slice(0, [2, 3, 4][idx] ?? 0);
  // Prerequisites of the chosen side, age group and level (lib/club-prereq.ts).
  const li = t.levels.indexOf(lvl);
  const prereq = side && idx >= 0 && li >= 0 ? CLUB_PREREQ[`${side}-${CAT_KEYS[side][idx]}-${LEVEL_KEYS[li]}`]?.[lang] ?? [] : null;
  return (
    <fieldset className="cf-team">
      <legend className="cf-lab">{t.side}</legend>
      <div className="cf-chips">
        {(["f", "m"] as const).map((k) => (
          <label key={k} className="cf-chip">
            <input type="radio" name="side" value={t.sides[k]} required checked={side === k} onChange={() => { setSide(k); setCat(""); setLvl(""); }} />{t.sides[k]}
          </label>
        ))}
      </div>
      {side && (
        <div className="cf-row">
          <label className="cf-field">{t.cat}
            <select name="category" required value={cat} onChange={(e) => { setCat(e.target.value); setLvl(""); }}>
              <option value="" disabled>—</option>
              {t.cats[side].map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          {levels.length > 0 && (
            <div className="cf-field">
              <span className="cf-lvl">
                <label htmlFor="cf-level">{t.level}</label>
                <button type="button" className="cf-i" aria-label={t.infoL} title={t.infoL} aria-expanded={info} onClick={() => setInfo(!info)}>i</button>
              </span>
              <select id="cf-level" name="level" required value={lvl} onChange={(e) => setLvl(e.target.value)}><option value="" disabled>—</option>{levels.map((l) => <option key={l}>{l}</option>)}</select>
            </div>
          )}
        </div>
      )}
      {info && (
        <div className="cf-pop" onClick={() => setInfo(false)}>
          <div className="cf-pop-box" role="dialog" aria-modal="true" aria-labelledby="cf-pop-t" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="cf-pop-x" aria-label={lang === "fr" ? "Fermer" : "Close"} onClick={() => setInfo(false)}>×</button>
            {prereq ? (
              // A level is chosen: its prerequisites (or, until the list is written, a note).
              <>
                <p className="cf-pop-t" id="cf-pop-t"><span className="cf-i on" aria-hidden="true">i</span>{t.expect} : {cat}, {lvl}</p>
                {prereq.length ? <ul className="cf-pop-l">{prereq.map((x) => <li key={x}>{x}</li>)}</ul> : <p className="cf-pop-soon">{t.soon}</p>}
                <p className="cf-pop-adv">{t.advice}</p>
              </>
            ) : (
              <>
                <p className="cf-pop-t" id="cf-pop-t"><span className="cf-i on" aria-hidden="true">i</span>{t.infoL}</p>
                <p>{t.info}</p>
                <p className="cf-pop-adv">{t.pick}</p>
              </>
            )}
          </div>
        </div>
      )}
      {idx === 0 && <p className="cf-warn" role="note">⚠ {t.u15}</p>}
      {levels.length > 0 && <p className="note">{t.lvl}</p>}
      <p className="note">{t.from}</p>
    </fieldset>
  );
}
