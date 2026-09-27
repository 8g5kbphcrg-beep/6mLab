import type { Lang } from "@/lib/dict";
import { CLUB_GEAR, CLUB_PLACES, CLUB_WHEN } from "@/lib/club-equipment";

// Quote form: where the team can train and with what, and when each is available (tick
// pre-season, season, or both; nothing ticked: not available).
export default function ClubEquipment({ lang }: { lang: Lang }) {
  const fr = lang === "fr", i = fr ? 1 : 2;
  const rows = (title: string, list: readonly (readonly [string, string, string])[]) => (
    <div className="ceq-g">
      <p className="ceq-t">{title}</p>
      {list.map((r) => (
        <div key={r[0]} className="ceq-r" role="group" aria-label={r[i]}>
          <span className="ceq-n">{r[i]}</span>
          <span className="ceq-w">
            {CLUB_WHEN.map((w) => (
              <label key={w[0]} className="ceq-c"><input type="checkbox" name={`eq_${r[0]}`} value={w[0]} />{w[i]}</label>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
  return (
    <fieldset className="ceq">
      <legend className="cf-lab">{fr ? "Tes installations et ton matériel" : "Your facilities and equipment"}</legend>
      <p className="note">{fr ? "Coche quand tu y as accès : en pré-saison, en saison, ou les deux. Ne coche rien si tu n'y as pas accès. Les séances seront construites avec ce que tu as." : "Tick when you have access: pre-season, season, or both. Tick nothing if you don't have it. The sessions will be built with what you have."}</p>
      {rows(fr ? "Où t'entraînes-tu ?" : "Where do you train?", CLUB_PLACES)}
      {rows(fr ? "Matériel" : "Equipment", CLUB_GEAR)}
      <label className="cf-field">{fr ? "Autre matériel (facultatif)" : "Other equipment (optional)"}<input name="eq_autre" maxLength={200} placeholder={fr ? "Ex. : ballons de hand pour tous, chasubles, sacs lestés" : "E.g. a ball each, bibs, sandbags"} /></label>
    </fieldset>
  );
}
