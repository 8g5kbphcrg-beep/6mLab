import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import Scene from "@/components/Scene";
import Picker from "@/components/Picker";
import ProgramCards from "@/components/ProgramCards";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const d = dict[lang as Lang];
  const fr = lang === "fr";
  const d3 = (n: number) => ({ "--d": n }) as React.CSSProperties;
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1 className="rise">{d.hero.h1}</h1>
            <p className="lead rise" style={d3(2)}>{d.hero.sub}</p>
            <div className="hcta rise" style={d3(3)}>
              <a className="btn" href="#formules">{d.hero.cta}</a>
              <a className="btn btn-ghost" href={`/${lang}/questionnaire`}>{fr ? "Trouver mon programme" : "Find my program"}</a>
            </div>
            <ul className="trust rise" style={d3(4)}>
              <li>{fr ? "Conçu par un joueur, étudiant en STAPS" : "Built by a player studying sport science"}</li>
              <li>{fr ? "Sans matériel obligatoire" : "No equipment required"}</li>
              <li>{fr ? "Paiement sécurisé" : "Secure payment"}</li>
            </ul>
          </div>
          <Scene />
        </div>
      </section>

      <section id="formules" className="sec wrap">
        <header className="shead">
          <h2>{d.cmp.title}</h2>
          <p>{d.cmp.sub}</p>
        </header>
        <ProgramCards lang={lang as Lang} />
      </section>

      <section id="objectif" className="band">
        <div className="sec wrap">
          <Picker lang={lang as Lang} pick={d.pick} />
          <p className="more">{fr ? "Tu hésites ?" : "Not sure?"} <a href={`/${lang}/questionnaire`}>{fr ? "Fais le questionnaire complet" : "Take the full questionnaire"}</a></p>
        </div>
      </section>

      <section className="sec wrap">
        <header className="shead"><h2>{d.how.title}</h2></header>
        <ol className="steps">{d.how.steps.map((s, i) => <li key={s} className="rv" style={d3(i)}>{s}</li>)}</ol>
      </section>

      <section className="band">
        <div className="sec wrap">
          <header className="shead"><h2>{d.why.title}</h2></header>
          <ul className="why">
            {d.why.items.map((w) => <li className="rv" key={w[0]}><strong>{w[0]}</strong><span>{w[1]}</span></li>)}
          </ul>
          <p className="note">{d.why.note}</p>
        </div>
      </section>

      <section className="sec wrap">
        <div className="endcta">
          <h2>{fr ? "Prêt pour ta saison ?" : "Ready for your season?"}</h2>
          <p>{fr ? "Choisis ta formule et tes objectifs, reçois ton programme par email." : "Pick your program and goals, get your plan by email."}</p>
          <a className="btn" href={`/${lang}/programmes`}>{fr ? "Voir les programmes" : "See the programs"}</a>
        </div>
      </section>
    </>
  );
}
