import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { programs, programSlugs, type ProgramSlug } from "@/lib/programs";
import "@/app/programme.css";

type P = { params: Promise<{ lang: string; slug: string }> };

export const generateStaticParams = () =>
  (["fr", "en"] as const).flatMap((lang) => programSlugs.map((slug) => ({ lang, slug })));

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!(lang in dict) || !(slug in programs[lang as Lang])) return {};
  const p = programs[lang as Lang][slug as ProgramSlug];
  return { title: `${p.name} | 6M Lab`, description: p.pitch, alternates: { canonical: `/${lang}/programmes/${slug}` } };
}

export default async function Programme({ params }: P) {
  const { lang, slug } = await params;
  if (!(lang in dict) || !(slug in programs[lang as Lang])) notFound();
  const d = dict[lang as Lang];
  const p = programs[lang as Lang][slug as ProgramSlug];
  const b = p.color === "b";
  return (
    <div className="prog">
      <Link className="pback" href={`/${lang}/programmes`}>← {d.cmp.title}</Link>
      <p><span className={b ? "ptag b" : "ptag a"}>{p.tag}</span></p>
      <h1>{p.name}</h1>
      <p className="pmeta2">{p.duration} · {p.freq}</p>
      <p className="pprice">{d.cmp.price[p.idx]}</p>
      <p>{p.pitch}</p>
      <ul className={b ? "pinc b" : "pinc"}>{p.includes.map((i) => <li key={i}>{i}</li>)}</ul>
      <h2>{lang === "fr" ? "Le déroulé" : "The breakdown"}</h2>
      {p.phases.map((ph) => (
        <div key={ph.t} className={b ? "phase b" : "phase"}>
          <h3>{ph.t}</h3>
          <p>{ph.d}</p>
        </div>
      ))}
      <h2>FAQ</h2>
      <div className="faq">
        {p.faq.map((f) => (
          <details key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
      <p className="note" style={{ marginTop: "1.5rem" }}>{d.why.note}</p>
      <p style={{ marginTop: "2rem" }}>
        <Link className="btn" href={`/${lang}/questionnaire`}>{lang === "fr" ? "Trouver mon objectif" : "Find my goal"}</Link>
      </p>
    </div>
  );
}
