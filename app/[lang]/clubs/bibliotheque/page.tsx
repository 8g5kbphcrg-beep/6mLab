import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import { animatedIds, exName } from "@/components/ExerciseCard";
import AccessGate from "@/components/AccessGate";
import Protected from "@/components/Protected";
import LibrarySearch from "@/components/LibrarySearch";
import { accessInfo } from "@/lib/access-page";
import { CLUB_EXERCISES, CLUB_GROUPS, clubItem, FAMILIES } from "@/lib/library";
import "@/app/library.css";

// Club library: for a team's players and staff, opened with the team's club code
// (lib/club-access.ts). The collective drills, goalkeeper drills, tests and running, then the
// individual exercises of the club programs (lib/library.ts).
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Bibliothèque clubs | 6M Lab", robots: { index: false } };

type P = { params: Promise<{ lang: string }>; searchParams: Promise<{ acces?: string }> };

export default async function ClubLibrary({ params, searchParams }: P) {
  const { lang } = await params;
  if (!(locales as readonly string[]).includes(lang)) notFound();
  const l = lang as Lang, fr = l === "fr";
  const acc = await accessInfo();
  if (acc?.kind === "client") redirect(`/${l}/exercices`);
  if (!acc) return <AccessGate lang={l} next={`/${l}/clubs/bibliotheque`} state={(await searchParams).acces} club />;
  const endDate = new Date(acc.end).toLocaleDateString(fr ? "fr-FR" : "en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const families = FAMILIES.map(([a, b, ids]) => [fr ? a : b, ids.filter((id) => CLUB_EXERCISES.includes(id) && animatedIds.includes(id))] as const).filter(([, ids]) => ids.length);
  const back = `?retour=/${l}/clubs/bibliotheque`;
  return (
    <Protected lang={l}>
    <div className="lib wrap">
      <p className="lib-k">{fr ? "Programme club" : "Club program"}</p>
      <h1>{fr ? "Bibliothèque clubs" : "Club library"}</h1>
      <p className="lib-acc">{fr ? `Accès de ton équipe ouvert jusqu'au ${endDate}.` : `Your team's access is open until ${endDate}.`}{fr ? "" : " Drill texts are in French."}</p>
      {/* Same search as the individual library; drills get a "dr-" prefix ("bonds" is both a drill and an exercise). */}
      <LibrarySearch fr={fr} items={[
        ...CLUB_GROUPS.flatMap(([, , ids]) => ids.map((id) => [`dr-${id}`, clubItem(id)?.name ?? id] as [string, string])),
        ...families.flatMap(([, ids]) => ids.map((id) => [id, exName(id, fr ? "fr" : "en")] as [string, string])),
      ]} />
      {CLUB_GROUPS.map(([a, b, ids]) => (
        <section key={a}>
          <h2>{fr ? a : b}</h2>
          <ul className="lib-grid">
            {ids.map((id) => <li key={id} id={`ex-dr-${id}`}><Link href={`/${l}/clubs/bibliotheque/${id}`}>{clubItem(id)?.name}<span aria-hidden="true">→</span></Link></li>)}
          </ul>
        </section>
      ))}
      {families.map(([name, ids]) => (
        <section key={name}>
          <h2>{name}</h2>
          <ul className="lib-grid">
            {ids.map((id) => <li key={id} id={`ex-${id}`}><Link href={`/${l}/exercices/${id}${back}`}>{exName(id, fr ? "fr" : "en")}<span aria-hidden="true">→</span></Link></li>)}
          </ul>
        </section>
      ))}
    </div>
    </Protected>
  );
}
