import type { Lang } from "@/lib/dict";
import { FRIEND_PERCENT, POINTS_FOR_REWARD, POINTS_PER_FRIEND, SPONSOR_PERCENT } from "@/lib/referral";
import "@/app/referral.css";

// Referral between teammates (lib/referral.ts), on the home page: a ticket with the 3 steps and
// a sample code, so buyers know about it before and after ordering.
const text = (f: number, s: number, pp: number, pr: number) => ({
  fr: {
    k: "Parrainage", h: "Entre coéquipiers, tout le monde paie moins cher",
    steps: [["Tu commandes", "Tu reçois ton code de parrainage personnel."], ["Tu le passes à tes coéquipiers", `Ils ont -${f} % sur leur programme.`], ["Tu gagnes des points", `${pp} points par coéquipier qui commande. À ${pr} points, -${s} % sur ton prochain programme.`]],
    tag: [`-${f} %`, "pour eux", `${pp} pts`, "pour toi"],
    code: "Ton code", sample: "TONPRÉNOM-7MQD", cta: "Voir les programmes", already: "Déjà client ? Ton code est dans ton email de confirmation et dans ta", lib: "bibliothèque d'exercices",
  },
  en: {
    k: "Referral", h: "Between teammates, everyone pays less",
    steps: [["You order", "You get your personal referral code."], ["You pass it to your teammates", `They get ${f}% off their program.`], ["You earn points", `${pp} points per teammate who orders. At ${pr} points, ${s}% off your next program.`]],
    tag: [`${f}%`, "off for them", `${pp} pts`, "for you"],
    code: "Your code", sample: "YOURNAME-7MQD", cta: "See the programs", already: "Already a customer? Your code is in your confirmation email and in your", lib: "exercise library",
  },
});

export default function ReferralBand({ lang }: { lang: Lang }) {
  const t = text(FRIEND_PERCENT, SPONSOR_PERCENT, POINTS_PER_FRIEND, POINTS_FOR_REWARD)[lang];
  return (
    <section className="sec wrap" aria-labelledby="par-h">
      <div className="parb">
        <div className="parb-txt">
          <p className="parb-k">{t.k}</p>
          <h2 id="par-h">{t.h}</h2>
          <ol className="parb-steps">{t.steps.map(([h, p]) => <li key={h}><strong>{h}</strong><span>{p}</span></li>)}</ol>
          <a className="btn parb-btn" href="#formules">{t.cta} →</a>
          <p className="parb-al">{t.already} <a href={`/${lang}/exercices`}>{t.lib}</a>.</p>
        </div>
        <div className="parb-vis" aria-hidden="true">
          <p className="parb-code"><span>{t.code}</span><b>{t.sample}</b></p>
          <p className="parb-tag"><b>{t.tag[0]}</b> {t.tag[1]}<span>+</span><b>{t.tag[2]}</b> {t.tag[3]}</p>
        </div>
      </div>
    </section>
  );
}
