import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import Scene from "@/components/Scene";
import ProgramCards from "@/components/ProgramCards";
import { SLOGAN } from "@/lib/brand";
import Reviews from "@/components/Reviews";
import { Founder, FreeSession, Parents, Product } from "@/components/HomeSections";
import "@/app/home.css";

// Rebuilt every hour at most, to show newly published reviews and the formula that fits the calendar.
export const revalidate = 3600;

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
            <p className="slogan rise">{SLOGAN}</p>
            <h1 className="rise">{d.hero.h1}</h1>
            <p className="lead rise" style={d3(2)}>{d.hero.sub}</p>
            <div className="hcta rise" style={d3(3)}>
              <a className="btn" href="#formules">{d.hero.cta}</a>
            </div>
            <p className="hquiz rise" style={d3(3)}>{fr ? "Pas sûr de ton choix ?" : "Not sure?"} <a href={`/${lang}/questionnaire`}>{fr ? "Trouve ton programme en 1 minute" : "Find your program in 1 minute"}</a></p>
            <ul className="trust rise" style={d3(4)}>
              <li>{d.hero.trust}</li>
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
        <ProgramCards lang={lang as Lang} shared={false} />
      </section>

      <Product lang={lang as Lang} />
      <Founder lang={lang as Lang} />
      <Reviews lang={lang as Lang} />
      <FreeSession lang={lang as Lang} />
      <Parents lang={lang as Lang} />

      <section className="sec wrap">
        <div className="endcta">
          <h2>{fr ? "Ta saison commence ici" : "Ready for your season?"}</h2>
          <p>{fr ? "Choisis ta formule et tes objectifs, reçois ton programme par email." : "Pick your program and goals, get your plan by email."}</p>
          <a className="btn" href={`/${lang}/programmes`}>{fr ? "Voir les programmes" : "See the programs"}</a>
        </div>
        <p className="note" style={{ marginTop: "1rem" }}>{d.why.note}</p>
      </section>
    </>
  );
}
