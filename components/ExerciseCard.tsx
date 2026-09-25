import type { Lang } from "@/lib/dict";
import { exercices } from "@/programmes/source/exercices.mjs";
import { animatedFigure, variants } from "@/programmes/source/figures.mjs";
import { exoFor } from "@/programmes/source/lieux.mjs";
import CloseX, { Reopen } from "@/components/CloseX";
import "@/app/exercice.css";

// Opened from the eye icon next to each exercise in the program PDFs: the animation in a large
// white card, closed with the cross in the corner. The PDFs link to /exercices/<id>/<option>:
// the place chosen at checkout (maison, salle), then the silhouette (femme, homme), e.g.
// maison-femme; without an option, every version with the neutral silhouette.
type Ex = { name: string; how: string; cues?: string };
export const exerciseList = exercices as Record<string, Ex>;
export const animatedIds = Object.keys(exerciseList).filter((id) => variants(id).length > 0);
const SEX = { femme: "f", homme: "h" } as const;
export const options = ["maison", "salle", "femme", "homme", ...["maison", "salle"].flatMap((l) => Object.keys(SEX).map((s) => `${l}-${s}`))];
const parse = (option?: string) => {
  const [a, b] = (option ?? "").split("-");
  const lieu = a === "maison" || a === "salle" ? a : undefined;
  const sil = (lieu ? b : a) as keyof typeof SEX | undefined;
  return { lieu, sex: (sil && SEX[sil]) || "n" };
};

const LABELS: Record<string, [string, string]> = { poids: ["Au poids du corps", "Bodyweight"], maison: ["À la maison", "At home"], elastique: ["Avec un élastique", "With a band"], materiel: ["Avec matériel", "With equipment"] };

export default function ExerciseCard({ lang, id, option }: { lang: Lang; id: string; option?: string }) {
  const fr = lang === "fr";
  const { lieu, sex } = parse(option);
  const ex = lieu ? exoFor(exerciseList[id], id, lieu) : { ...exerciseList[id], band: undefined, figs: null };
  const figs = ex.figs ?? variants(id).map((v) => [id, v, LABELS[v]?.[fr ? 0 : 1] ?? v] as [string, string, string]);
  return (
    <div className="exo-back">
      <div className="exo-card" role="dialog" aria-modal="true" aria-labelledby="exo-title">
        <CloseX label={fr ? "Fermer" : "Close"} />
        <h1 id="exo-title">{ex.name}</h1>
        <div className={`exo-anims n${figs.length}`}>
          {figs.map(([fid, v, label]) => (
            <figure key={fid + v}>
              {figs.length > 1 && <figcaption>{label}</figcaption>}
              <div className="exo-svg" dangerouslySetInnerHTML={{ __html: animatedFigure(fid, v, { sex: sex as "f" | "h" | "n" }) ?? "" }} />
            </figure>
          ))}
        </div>
        <p dangerouslySetInnerHTML={{ __html: md(ex.how) }} />
        {ex.band && <p className="exo-cues"><strong>{fr ? "Avec un élastique :" : "With a band:"}</strong> {ex.band}</p>}
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

// **bold** in the texts of lieux.mjs (the rest is escaped).
const md = (s: string) => s.replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
