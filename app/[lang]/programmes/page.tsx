import Link from "next/link";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { programs, programSlugs } from "@/lib/programs";
import "@/app/programme.css";

export default async function Programmes({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const d = dict[lang as Lang];
  const p = programs[lang as Lang];
  return (
    <div className="prog">
      <h1>{d.cmp.title}</h1>
      <p>{d.cmp.sub}</p>
      <div className="plist">
        {programSlugs.map((s) => (
          <Link key={s} href={`/${lang}/programmes/${s}`} className={p[s].color === "b" ? "plink b" : "plink"}>
            <h2>{p[s].name}</h2>
            <p>{p[s].duration} · {p[s].freq}</p>
            <span className="pprice" style={{ fontSize: "1.6rem" }}>{d.cmp.price[p[s].idx]}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
