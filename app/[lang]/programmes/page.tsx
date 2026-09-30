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
    title: fr ? "Programmes de prépa physique handball : pré-saison, 1re et 2e partie de saison | 6M Lab" : "Handball physical prep programs: pre-season, first and second half of the season | 6M Lab",
    description: fr ? "La saison de handball en 3 parties : Pré-saison (juillet-août), 1re partie (septembre à Noël), 2e partie (janvier à juin), ou la Saison complète à -20 %. Chaque exercice est animé." : "The handball season in 3 parts: Pre-season (July-August), first half (September to Christmas), second half (January to June), or the Full season at 20% off. Every exercise is animated.",
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
