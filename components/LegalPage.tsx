import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Lang } from "@/lib/dict";
import { legal, legalPaths, owner, updated, type LegalDoc } from "@/lib/legal";
import "@/app/pages.css";

// Owner details still to fill in, highlighted wherever they appear.
const todo = Object.values(owner).filter((v) => v.startsWith("["));
const split = new RegExp(`(${todo.map((t) => t.replace(/[[\]]/g, "\\$&")).join("|") || "$^"})`);

function Text({ s }: { s: string }) {
  return <>{s.split(split).map((part, i) => (todo.includes(part) ? <mark key={i} className="todo">{part}</mark> : part))}</>;
}

export function legalMetadata(lang: Lang, doc: LegalDoc): Metadata {
  const d = legal[lang][doc];
  return { title: `${d.title} | 6M Lab`, description: d.desc, alternates: { canonical: legalPaths[lang][doc] } };
}

export default async function LegalPage({ params, lang, doc }: { params: Promise<{ lang: string }>; lang: Lang; doc: LegalDoc }) {
  if ((await params).lang !== lang) notFound();
  const d = legal[lang][doc];
  const fr = lang === "fr";
  const other = fr ? "en" : "fr";
  return (
    <div className="pg legal">
      <h1>{d.title}</h1>
      <p className="note">{fr ? "Dernière mise à jour" : "Last updated"} : {updated[lang]} · <Link href={legalPaths[other][doc]} hrefLang={other} lang={other}>{fr ? "English version" : "Version française"}</Link></p>
      {d.intro && <p>{d.intro}</p>}
      {d.sections.map((s) => (
        <section key={s.h}>
          <h2>{s.h}</h2>
          {s.body.map((b, i) => Array.isArray(b)
            ? <ul key={i}>{b.map((li) => <li key={li}><Text s={li} /></li>)}</ul>
            : <p key={i}><Text s={b} /></p>)}
        </section>
      ))}
      {doc !== "privacy" && <p><Link href={legalPaths[lang].privacy}>{fr ? "Politique de confidentialité" : "Privacy policy"}</Link></p>}
    </div>
  );
}
