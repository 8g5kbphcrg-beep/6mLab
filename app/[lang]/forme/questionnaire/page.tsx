import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import FormeQuiz from "@/components/FormeQuiz";
import "@/app/home.css";
import "@/app/forme.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const fr = lang === "fr";
  return {
    title: fr ? "Trouve ton programme Forme & bien-être | 6M Lab" : "Find your Fitness & well-being program | 6M Lab",
    description: fr ? "10 questions pour un programme adapté à ton objectif, ton niveau, ton lieu et ton temps disponible." : "10 questions for a program adapted to your goal, level, place and available time.",
    alternates: { canonical: `/${lang}/forme/questionnaire` },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  return <FormeQuiz lang={lang as Lang} />;
}
