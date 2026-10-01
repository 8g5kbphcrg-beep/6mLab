import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import { animatedIds, exName } from "@/components/ExerciseCard";
import AccessGate from "@/components/AccessGate";
import Protected from "@/components/Protected";
import LibrarySearch from "@/components/LibrarySearch";
import { accessInfo, type Gate } from "@/lib/access-page";
import { FAMILIES } from "@/lib/library";
import { redirect } from "next/navigation";
import "@/app/library.css";

// Individual library: every animated exercise, by family (lib/library.ts), for customers of the
// individual programs (the dashboard is in espace-client; clubs have their own library). For customers only, while their access
// lasts (lib/access.ts); each exercise opens its page with every version (home, gym, band).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bibliothèque d'exercices | 6M Lab", robots: { index: false } };


type P = { params: Promise<{ lang: string }>; searchParams: Promise<Gate> };

export default async function Library({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const l = lang as Lang, fr = l === "fr";
  const acc = await accessInfo();
  // A club code opens the club library, not this one (lib/library.ts).
  if (acc?.kind === "club") redirect(`/${l}/clubs/bibliotheque`);
  if (!acc) return <AccessGate lang={l} next={`/${l}/exercices`} state={(await searchParams).acces} />;
  const end = acc.end;
  const days = Math.ceil((end - Date.now()) / 86400000);
  const endDate = new Date(end).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const listed = new Set(FAMILIES.flatMap((f) => f[2]));
  const families = [...FAMILIES, ["Autres", "Others", animatedIds.filter((id) => !listed.has(id))] as [string, string, string[]]]
    .map(([a, b, ids]) => [fr ? a : b, ids.filter((id) => animatedIds.includes(id))] as const)
    .filter(([, ids]) => ids.length);
  return (
    <Protected lang={l}>
    <div className="lib wrap">
      <p className="lib-k"><a href={`/${l}/espace-client`}>{fr ? "Espace client" : "Customer area"}</a></p>
      <h1>{fr ? "Bibliothèque d'exercices" : "Exercise library"}</h1>
      <p className="lib-acc">{fr ? `Accès ouvert jusqu'au ${endDate} (encore ${days} jour${days > 1 ? "s" : ""}).` : `Access open until ${endDate} (${days} day${days > 1 ? "s" : ""} left).`}</p>
      <LibrarySearch fr={fr} items={families.flatMap(([, ids]) => ids.map((id) => [id, exName(id, fr ? "fr" : "en")] as [string, string]))} />
      {families.map(([name, ids]) => (
        <section key={name}>
          <h2>{name}</h2>
          <ul className="lib-grid">
            {ids.map((id) => (
              <li key={id} id={`ex-${id}`}><Link href={`/${l}/exercices/${id}?retour=/${l}/exercices`}>{exName(id, fr ? "fr" : "en")}<span aria-hidden="true">→</span></Link></li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    </Protected>
  );
}
