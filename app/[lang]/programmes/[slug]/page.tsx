import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { programs, programSlugs, type ProgramSlug } from "@/lib/programs";
import BuyForm from "@/components/BuyForm";
import { testMode } from "@/lib/checkout";
import { validGoals } from "@/lib/goals";
import "@/app/programme.css";

type P = { params: Promise<{ lang: string; slug: string }>; searchParams?: Promise<{ paiement?: string; objectifs?: string }> };

export const generateStaticParams = () =>
  (["fr", "en"] as const).flatMap((lang) => programSlugs.map((slug) => ({ lang, slug })));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!(lang in dict) || !(slug in programs[lang as Lang])) return {};
  const p = programs[lang as Lang][slug as ProgramSlug];
  return { title: `${p.name} | 6M Lab`, description: p.pitch, alternates: { canonical: `/${lang}/programmes/${slug}` } };
}

export default async function Programme({ params, searchParams }: P) {
  const { lang, slug } = await params;
  if (!(lang in dict) || !(slug in programs[lang as Lang])) notFound();
  const d = dict[lang as Lang];
  const p = programs[lang as Lang][slug as ProgramSlug];
  const b = p.color === "b";
  const sp = await searchParams;
  const pre = sp?.objectifs?.split(",") ?? [];
  const fr = lang === "fr";
  return (
    <div className="prog">
      <Link className="pback" href={`/${lang}/programmes`}>← {d.cmp.title}</Link>
      <div className="pgrid">
        <header className="phead">
          <span className={b ? "ptag b" : "ptag a"}>{p.tag}</span>
          <h1>{p.name}</h1>
          <p className="pmeta2">{p.duration} · {p.freq}</p>
          <p className="plead">{p.pitch}</p>
          <ul className={b ? "pinc b" : "pinc"}>{p.includes.map((i) => <li key={i}>{i}</li>)}</ul>
        </header>
        <aside className="pside">
          <BuyForm lang={lang as Lang} slug={slug as ProgramSlug} goals={validGoals(pre) ? pre : []} test={testMode} error={sp?.paiement} />
          <p className="pquiz">{fr ? "Tu hésites sur tes objectifs ?" : "Not sure about your goals?"} <Link href={`/${lang}/questionnaire`}>{fr ? "Fais le questionnaire" : "Take the questionnaire"}</Link></p>
        </aside>
        <div className="pmain">
          <section>
            <h2>{fr ? "Le déroulé" : "The breakdown"}</h2>
            {p.phases.map((ph) => (
              <div key={ph.t} className={b ? "phase b" : "phase"}>
                <h3>{ph.t}</h3>
                <p>{ph.d}</p>
              </div>
            ))}
          </section>
          <section>
            <h2>FAQ</h2>
            <div className="faq">
              {p.faq.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </section>
          <p className="note">{d.why.note}</p>
        </div>
      </div>
    </div>
  );
}
