import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales } from "@/lib/dict";
import { exercices } from "@/programmes/source/exercices.mjs";
import { animatedFigure, variants } from "@/programmes/source/figures.mjs";
import CloseX from "@/components/CloseX";
import "@/app/exercice.css";

// Opened from the eye icon next to each exercise in the program PDFs: the animation in a large
// white card, closed with the cross in the corner.
type Ex = { name: string; how: string; cues?: string };
const all = exercices as Record<string, Ex>;
const ids = Object.keys(all).filter((id) => variants(id).length > 0);

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((lang) => ids.map((id) => ({ lang, id })));

type P = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  return { title: `${all[id]?.name ?? "Exercice"} | 6M Lab`, robots: { index: false } };
}

export default async function Exercice({ params }: P) {
  const { lang, id } = await params;
  const ex = all[id];
  if (!ex || !ids.includes(id)) notFound();
  const fr = lang === "fr";
  const vs = variants(id) as ("poids" | "materiel")[];
  const label = { poids: fr ? "Au poids du corps" : "Bodyweight", materiel: fr ? "Avec matériel" : "With equipment" };
  return (
    <div className="exo-back">
      <div className="exo-card" role="dialog" aria-modal="true" aria-labelledby="exo-title">
        <CloseX home={`/${lang}`} label={fr ? "Fermer" : "Close"} />
        <h1 id="exo-title">{ex.name}</h1>
        <div className={`exo-anims n${vs.length}`}>
          {vs.map((v) => (
            <figure key={v}>
              {vs.length > 1 && <figcaption>{label[v]}</figcaption>}
              <div className="exo-svg" dangerouslySetInnerHTML={{ __html: animatedFigure(id, v) ?? "" }} />
            </figure>
          ))}
        </div>
        <p>{ex.how}</p>
        {ex.cues && <p className="exo-cues"><strong>{fr ? "Points clés :" : "Key points:"}</strong> {ex.cues}</p>}
      </div>
    </div>
  );
}
