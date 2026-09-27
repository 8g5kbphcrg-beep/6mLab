import type { Lang } from "@/lib/dict";
import { Anim } from "@/components/BlogBits";
import "@/app/clubband.css";

// Clubs and coaches, right after the offers (home, handball and programs pages): whole teams are
// a big source of sales, and coaches without a strength coach save their preparation time.
const text = {
  fr: {
    k: "Clubs et entraîneurs", h: "Toute ton équipe prête, sans passer tes soirées à écrire les séances",
    p: "Pas de préparateur physique au club\u00a0? Les séances de ton groupe sont écrites, planifiées sur ton calendrier et chaque exercice est animé. Toi, tu gardes ton temps pour le terrain.",
    l: ["Des situations de prépa ludiques, proches du hand, pensées pour le groupe", "Avec le matériel du club : plots, échelles, haies, médecine-balls", "Des U15 aux seniors, filière féminine ou masculine", "Tarif de groupe, devis sous 48\u00a0heures"],
    cta: "Demander un devis pour mon équipe",
  },
  en: {
    k: "Clubs and coaches", h: "Your whole team ready, without spending your evenings writing sessions",
    p: "No strength coach at the club? Your group's sessions are written out, planned around your calendar, and every exercise is animated. You keep your time for the court.",
    l: ["Fun, handball-like conditioning drills built for the group", "With the club's equipment: cones, ladders, hurdles, medicine balls", "From U15 to seniors, women's or men's teams", "Group pricing, quote within 48 hours"],
    cta: "Get a quote for my team",
  },
};

export default function ClubBand({ lang }: { lang: Lang }) {
  const t = text[lang];
  return (
    <section className="sec wrap" aria-labelledby="club-h">
      <div className="clubb">
        <div className="clubb-txt">
          <p className="clubb-k">{t.k}</p>
          <h2 id="club-h">{t.h}</h2>
          <p className="clubb-p">{t.p}</p>
          <ul className="clubb-l">{t.l.map((x) => <li key={x}>{x}</li>)}</ul>
          <a className="btn clubb-btn" href={`/${lang}/clubs`} data-go>{t.cta} →</a>
        </div>
        <div className="clubb-team" aria-hidden="true">
          {["squat-jump", "squat-jump", "squat-jump"].map((id, i) => <Anim key={i} id={id} className={`clubb-fig f${i}`} />)}
        </div>
      </div>
    </section>
  );
}
