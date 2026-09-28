import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import ExerciseCard, { animatedIds, exName, exerciseList } from "@/components/ExerciseCard";
import AccessGate from "@/components/AccessGate";
import { FREE_EXERCISES } from "@/lib/access";
import { allowed, backPath, type Gate } from "@/lib/access-page";

// The animation of one exercise, every version with the neutral silhouette (library, tips). The
// program PDFs link to the customer's place and silhouette: /exercices/<id>/maison-femme… For
// customers only (lib/access.ts), except the exercises of the free session.
export const dynamic = "force-dynamic";

type P = { params: Promise<{ lang: string; id: string }>; searchParams: Promise<Gate> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id, lang } = await params;
  return { title: `${exerciseList[id] ? exName(id, lang === "en" ? "en" : "fr") : "Exercice"} | 6M Lab`, robots: { index: false } };
}

export default async function Exercice({ params, searchParams }: P) {
  const { lang, id } = await params;
  if (!(locales as readonly string[]).includes(lang) || !animatedIds.includes(id)) notFound();
  const g = await searchParams;
  if (!FREE_EXERCISES.includes(id) && !(await allowed(id))) {
    return <AccessGate lang={lang as Lang} next={`/${lang}/exercices/${id}`} state={g.acces} />;
  }
  return <ExerciseCard lang={lang as Lang} id={id} back={backPath(g.retour)} />;
}
