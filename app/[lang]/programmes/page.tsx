import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import ProgramCards from "@/components/ProgramCards";

// Rebuilt every hour at most, so the recommended formula follows the calendar.
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in dict)) return {};
  return { title: `${dict[lang as Lang].cmp.title} | 6M Lab`, alternates: { canonical: `/${lang}/programmes` } };
}

export default async function Programmes({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const d = dict[lang as Lang];
  return (
    <div className="sec wrap">
      <header className="shead page">
        <h1>{d.cmp.title}</h1>
        <p>{d.cmp.sub}</p>
      </header>
      <ProgramCards lang={lang as Lang} />
    </div>
  );
}
