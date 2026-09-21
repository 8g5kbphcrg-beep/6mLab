import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import Scene from "@/components/Scene";
import Picker from "@/components/Picker";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const d = dict[lang as Lang];
  const [rowFocus, rowDur, rowFreq] = d.cmp.rows;
  const row = (r: string[]) => (
    <>
      <div className="lb">{r[0]}</div>
      <div className="c a rv">{r[1]}</div>
      <div className="c b rv">{r[2]}</div>
    </>
  );
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div>
            <h1 className="rise">{d.hero.h1}</h1>
            <p className="lead rise" style={{ "--d": 2 } as React.CSSProperties}>{d.hero.sub}</p>
            <a className="btn rise" style={{ "--d": 3 } as React.CSSProperties} href="#formules">{d.hero.cta}</a>
            <p className="trust rise" style={{ "--d": 4 } as React.CSSProperties}>{d.hero.trust}</p>
          </div>
          <Scene />
        </div>
      </section>

      <section id="formules" className="sec wrap">
        <h2>{d.cmp.title}</h2>
        <p style={{ color: "var(--muted)" }}>{d.cmp.sub}</p>
        <div className="cmp">
          {d.cmp.heads.map((h, i) => (
            <div key={h[0]} className={i ? "hd b" : "hd a"}><h3>{h[0]}</h3><p>{h[1]}</p></div>
          ))}
          {row(rowFocus)}
          {row(rowDur)}
          {row(rowFreq)}
          <div className="lb">{d.cmp.goalsLb}</div>
          <div className="c all rv">{d.goals.map((g) => <span key={g[0]}>{g[0]}</span>)}</div>
          <div className="lb">{d.cmp.priceLb}</div>
          <div className="c a pr rv">{d.cmp.price[0]}</div>
          <div className="c b pr rv">{d.cmp.price[1]}</div>
          <div className="ft">
            <a className="btn a" href="#objectif" data-pick="0">{d.cmp.choose[0]}</a>
            <a className="btn b" href="#objectif" data-pick="1">{d.cmp.choose[1]}</a>
          </div>
        </div>
      </section>

      <section id="objectif" className="band">
        <div className="sec wrap"><Picker pick={d.pick} goals={d.goals} /></div>
      </section>

      <section className="sec wrap">
        <h2>{d.how.title}</h2>
        <ol className="steps">{d.how.steps.map((s) => <li key={s}>{s}</li>)}</ol>
      </section>

      <section className="band">
        <div className="sec wrap">
          <h2>{d.why.title}</h2>
          <ul className="why">
            {d.why.items.map((w) => <li className="rv" key={w[0]}><strong>{w[0]}</strong><span>{w[1]}</span></li>)}
          </ul>
          <p className="note">{d.why.note}</p>
        </div>
      </section>
    </>
  );
}
