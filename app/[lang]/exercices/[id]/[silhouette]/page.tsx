import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import ExerciseCard, { animatedIds, exerciseList, silhouettes, type Silhouette } from "@/components/ExerciseCard";

// The animation of one exercise with the silhouette chosen at checkout (femme or homme).
export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((lang) => animatedIds.flatMap((id) => Object.keys(silhouettes).map((silhouette) => ({ lang, id, silhouette }))));

type P = { params: Promise<{ lang: string; id: string; silhouette: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  return { title: `${exerciseList[id]?.name ?? "Exercice"} | 6M Lab`, robots: { index: false } };
}

export default async function ExerciceSilhouette({ params }: P) {
  const { lang, id, silhouette } = await params;
  if (!animatedIds.includes(id) || !(silhouette in silhouettes)) notFound();
  return <ExerciseCard lang={lang as Lang} id={id} silhouette={silhouette as Silhouette} />;
}
