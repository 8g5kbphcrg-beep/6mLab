import Nav from "../../Nav";
import { figureIds, variants } from "@/programmes/source/figures.mjs";
import { exercices } from "@/programmes/source/exercices.mjs";

// Every animation, in all its versions, with the exercise's text: to check a drawing against what
// the programs say.
export const metadata = { title: "Animations | Admin 6M Lab" };
const LABELS: Record<string, string> = { poids: "Poids du corps", maison: "Maison", elastique: "Élastique", materiel: "Matériel" };
const ex = exercices as Record<string, { name: string; how: string; cues?: string }>;

export default function Animations() {
  const ids = figureIds.filter((id: string) => ex[id]);
  return (
    <main>
      <Nav here="programmes" />
      <h1>Toutes les animations</h1>
      <p className="sub">{ids.length} exercices : touche un exercice pour voir ses animations. Le texte est celui de la fiche (les versions maison et salle peuvent avoir leur propre texte dans les PDF).</p>
      <div className="grid">
        {ids.map((id: string) => (
          <details className="card" key={id} id={id}>
            <summary><b>{ex[id].name}</b> <span className="muted">({variants(id).map((v: string) => LABELS[v] ?? v).join(", ")})</span></summary>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0" }}>
              {variants(id).map((v: string) => (
                <figure key={v} style={{ margin: 0, flex: "1 1 140px" }}>
                  <iframe title={`${ex[id].name} (${LABELS[v] ?? v})`} loading="lazy" src={`/admin/programmes/animation?id=${id}&v=${v}`} style={{ width: "100%", height: 200, border: 0, borderRadius: 8 }} />
                  <figcaption className="muted" style={{ fontSize: 12 }}>{LABELS[v] ?? v}</figcaption>
                </figure>
              ))}
            </div>
            <p style={{ fontSize: 13, margin: 0 }}>{ex[id].how}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
