import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import ExerciseCard, { animatedIds, exerciseList, options } from "@/components/ExerciseCard";

// The animation of one exercise as the customer does it: place (maison, salle) and silhouette
// (femme, homme), from the eye icons of the program PDFs.
export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((lang) => animatedIds.flatMap((id) => options.map((option) => ({ lang, id, option }))));

type P = { params: Promise<{ lang: string; id: string; option: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  return { title: `${exerciseList[id]?.name ?? "Exercice"} | 6M Lab`, robots: { index: false } };
}

export default async function ExerciceOption({ params }: P) {
  const { lang, id, option } = await params;
  if (!animatedIds.includes(id) || !options.includes(option)) notFound();
  return <ExerciseCard lang={lang as Lang} id={id} option={option} />;
}
