import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import ExerciseCard, { animatedIds, exName, exerciseList, options } from "@/components/ExerciseCard";
import AccessGate from "@/components/AccessGate";
import { FREE_EXERCISES } from "@/lib/access";
import { accessEnd, backPath, type Gate } from "@/lib/access-page";

// The animation of one exercise as the customer does it: place (maison, salle) and silhouette
// (femme, homme), from the eye icons of the program PDFs. For customers only (lib/access.ts),
// except the exercises of the free session.
export const dynamic = "force-dynamic";

type P = { params: Promise<{ lang: string; id: string; option: string }>; searchParams: Promise<Gate> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id, lang } = await params;
  return { title: `${exerciseList[id] ? exName(id, lang === "en" ? "en" : "fr") : "Exercice"} | 6M Lab`, robots: { index: false } };
}

export default async function ExerciceOption({ params, searchParams }: P) {
  const { lang, id, option } = await params;
  if (!(locales as readonly string[]).includes(lang) || !animatedIds.includes(id) || !options.includes(option)) notFound();
  const g = await searchParams;
  if (!FREE_EXERCISES.includes(id) && !(await accessEnd())) {
    return <AccessGate lang={lang as Lang} next={`/${lang}/exercices/${id}/${option}`} />;
  }
  return <ExerciseCard lang={lang as Lang} id={id} option={option} back={backPath(g.retour)} />;
}
