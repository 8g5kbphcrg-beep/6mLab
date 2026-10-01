import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { locales, type Lang } from "@/lib/dict";
import AccessGate from "@/components/AccessGate";
import Protected from "@/components/Protected";
import { accessInfo } from "@/lib/access-page";
import { clubItem } from "@/lib/library";
import { COL, DR, drillSVG } from "@/lib/club-drills";
import "@/app/library.css";

// One item of the club library (lib/library.ts): a drill with its animated diagram, its legend,
// how it works, the organisation and the key points; or a running / cool-down text. The eye of
// the club documents links here. Opened with the team's club code (lib/club-access.ts).
export const dynamic = "force-dynamic";

type P = { params: Promise<{ lang: string; id: string }>; searchParams: Promise<{ acces?: string }> };

export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { id } = await params;
  return { title: `${clubItem(id)?.name ?? "Situation"} | 6M Lab`, robots: { index: false } };
}

export default async function ClubItem({ params, searchParams }: P) {
  const { lang, id } = await params;
  const item = clubItem(id);
  if (!(locales as readonly string[]).includes(lang) || !item) notFound();
  const l = lang as Lang, fr = l === "fr";
  if ((await accessInfo())?.kind !== "club") return <AccessGate lang={l} next={`/${l}/clubs/bibliotheque/${id}`} state={(await searchParams).acces} club />;
  const d = DR[id];
  return (
    <Protected lang={l}>
    <div className="lib wrap drill-page">
      <p className="lib-k"><Link href={`/${l}/clubs/bibliotheque`}>← {fr ? "Bibliothèque clubs" : "Club library"}</Link></p>
      <h1>{item.name}</h1>
      {d && <>
        <div className="drill-fig" dangerouslySetInnerHTML={{ __html: drillSVG(d) }} />
        <ul className="drill-legend">{d.legend.map(([c, t]) => <li key={t}><i style={{ background: COL[c] }} />{t}</li>)}</ul>
      </>}
      <p>{item.how}</p>
      {d?.org && <p className="drill-org"><b>{fr ? "Organisation et rotations :" : "Organisation and rotations:"}</b> {d.org}</p>}
      {item.cues && <p className="drill-cues"><b>{fr ? "Points clés :" : "Key points:"}</b> {item.cues}</p>}
    </div>
    </Protected>
  );
}
