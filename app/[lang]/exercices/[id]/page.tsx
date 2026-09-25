import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import ExerciseCard, { animatedIds, exerciseList } from "@/components/ExerciseCard";

// The animation of one exercise, every version with the neutral silhouette (tips pages). The
// program PDFs link to the customer's place and silhouette: /exercices/<id>/maison-femme…
export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((lang) => animatedIds.map((id) => ({ lang, id })));

type P = { params: Promise<{ lang: string; id: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  return { title: `${exerciseList[id]?.name ?? "Exercice"} | 6M Lab`, robots: { index: false } };
}

export default async function Exercice({ params }: P) {
  const { lang, id } = await params;
  if (!animatedIds.includes(id)) notFound();
  return <ExerciseCard lang={lang as Lang} id={id} />;
}
