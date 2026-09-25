import type { Lang } from "@/lib/dict";
import { exercices } from "@/programmes/source/exercices.mjs";
import { animatedFigure, variants } from "@/programmes/source/figures.mjs";
import CloseX, { Reopen } from "@/components/CloseX";
import "@/app/exercice.css";

// Opened from the eye icon next to each exercise in the program PDFs: the animation in a large
// white card, closed with the cross in the corner. The figure matches the silhouette chosen at
// checkout: /exercices/<id>/femme or /homme, neutral without it.
type Ex = { name: string; how: string; cues?: string };
export const exerciseList = exercices as Record<string, Ex>;
export const animatedIds = Object.keys(exerciseList).filter((id) => variants(id).length > 0);
export const silhouettes = { femme: "f", homme: "h" } as const;
export type Silhouette = keyof typeof silhouettes;

export default function ExerciseCard({ lang, id, silhouette }: { lang: Lang; id: string; silhouette?: Silhouette }) {
  const ex = exerciseList[id];
  const fr = lang === "fr";
  const sex = silhouette ? silhouettes[silhouette] : "n";
  const vs = variants(id) as ("poids" | "materiel")[];
  const label = { poids: fr ? "Au poids du corps" : "Bodyweight", materiel: fr ? "Avec matériel" : "With equipment" };
  return (
    <div className="exo-back">
      <div className="exo-card" role="dialog" aria-modal="true" aria-labelledby="exo-title">
        <CloseX label={fr ? "Fermer" : "Close"} />
        <h1 id="exo-title">{ex.name}</h1>
        <div className={`exo-anims n${vs.length}`}>
          {vs.map((v) => (
            <figure key={v}>
              {vs.length > 1 && <figcaption>{label[v]}</figcaption>}
              <div className="exo-svg" dangerouslySetInnerHTML={{ __html: animatedFigure(id, v, { sex }) ?? "" }} />
            </figure>
          ))}
        </div>
        <p>{ex.how}</p>
        {ex.cues && <p className="exo-cues"><strong>{fr ? "Points clés :" : "Key points:"}</strong> {ex.cues}</p>}
      </div>
      <div className="exo-back-msg" role="status">
        <p className="exo-back-t">{fr ? "Pour revenir à ton programme" : "To go back to your program"}</p>
        <p><strong>iPhone :</strong> {fr ? "touche « ◀ Mail » ou « ◀ Fichiers » tout en haut à gauche de l'écran." : "tap “◀ Mail” or “◀ Files” at the very top left of the screen."}</p>
        <p><strong>Android :</strong> {fr ? "utilise le bouton ou le geste retour de ton téléphone." : "use your phone's back button or gesture."}</p>
        <Reopen label={fr ? "Revoir l'animation" : "Watch the animation again"} />
      </div>
    </div>
  );
}
