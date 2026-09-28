import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import ProgramCards from "@/components/ProgramCards";
import ClubBand from "@/components/ClubBand";

// Rebuilt every hour at most, so the recommended formula follows the calendar.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in dict)) return {};
  const fr = lang === "fr";
  return {
    title: fr ? "Programmes de prépa physique handball : pré-saison, maintien, pack | 6M Lab" : "Handball physical prep programs: pre-season, in-season, pack | 6M Lab",
    description: fr ? "Compare les formules 6M Lab : Pré-saison (8 semaines), Maintien en saison (12 semaines) ou le Pack Saison complète. Chaque exercice est animé." : "Compare the 6M Lab programs: Pre-season (8 weeks), In-season maintenance (12 weeks) or the Full season pack. Every exercise is animated.",
    alternates: { canonical: `/${lang}/programmes`, languages: { fr: "/fr/programmes", en: "/en/programmes" } },
  };
}

export default async function Programmes({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const d = dict[lang as Lang];
  return (
    <>
      <div className="sec wrap">
        <header className="shead page">
          <h1>{d.cmp.title}</h1>
          <p>{d.cmp.sub}</p>
        </header>
        <ProgramCards lang={lang as Lang} top />
      </div>
      <ClubBand lang={lang as Lang} />
    </>
  );
}
