import type { Lang } from "@/lib/dict";
import { animatedFigure, variants } from "@/programmes/source/figures.mjs";
import { exercices } from "@/programmes/source/exercices.mjs";
import { MARK_VIEWBOX, markSvg } from "@/lib/mark.mjs";
import ProductVideo from "@/components/ProductVideo";

// Home page sections: what the customer receives, who is behind 6M Lab, the free session and a
// word for parents.

const names = exercices as Record<string, { name: string }>;
const demos = ["squat-jump", "skater-hop", "nordic"];

export function Product({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  return (
    <section className="sec wrap" id="contenu">
      <header className="shead">
        <h2>{fr ? "Ce que tu reçois" : "What you get"}</h2>
        <p>{fr ? "Un vrai programme, pas une liste d'exercices." : "A real program, not a list of exercises."}</p>
      </header>
      <div className="prod">
        {/* The program as the customer gets it. In French, the 30-second video (its pages, the eye of
            an exercise, the animations; scripts/demo-video.mjs). In English, whose PDF pages differ:
            the real pages turned one after the other, then the eye opening an animation (CSS only,
            16 s loop). */}
        {fr ? <ProductVideo caption="Le programme en 30 secondes" /> : <figure className="flip">
          <div className="flip-dev">
            <div className="flip-scr">
              {[["f1-couverture", fr ? "Couverture du programme Pré-saison" : "Pre-season program cover"],
                ["f2-guide", fr ? "Page du guide : quand commencer" : "Guide page: when to start"],
                ["f3-seance", fr ? "Une séance écrite en entier" : "A session written out in full"],
                ["f4-fiche", fr ? "La fiche d'un exercice" : "An exercise sheet"]].map(([f, alt], i) => (
                <img key={f} className={`flip-p s${i + 1}`} src={`/apercu/${f}.jpg`} alt={alt} width={620} height={878} loading="lazy" />
              ))}
              <div className="flip-anim s5" aria-hidden="true">
                <span className="flip-tap" />
                <div className="flip-card">
                  <div dangerouslySetInnerHTML={{ __html: animatedFigure("squat-jump", "poids") ?? "" }} />
                  <span>{names["squat-jump"]?.name}</span>
                </div>
              </div>
            </div>
          </div>
          <figcaption>
            <ol className="flip-steps">
              <li className="t1">{fr ? "Ton guide : le programme expliqué" : "Your guide: the program explained"}</li>
              <li className="t2">{fr ? "Tes séances, écrites en entier, semaine par semaine" : "Your sessions, written out in full, week by week"}</li>
              <li className="t3">{fr ? "La fiche de chaque exercice : touche l'œil, il s'anime" : "A sheet for every exercise: tap the eye, it comes to life"}</li>
            </ol>
          </figcaption>
        </figure>}
        <div>
          <p className="prod-lab">{fr ? "Chaque exercice est animé" : "Every exercise is animated"}</p>
          <div className="prod-anims">
            {demos.map((id) => (
              <figure key={id}>
                <div dangerouslySetInnerHTML={{ __html: animatedFigure(id, "poids") ?? "" }} />
                <figcaption>{names[id]?.name}</figcaption>
              </figure>
            ))}
          </div>
          <ul className="prod-list">
            <li><strong>{fr ? "Pensé pour le handball" : "Built for handball"}</strong>{fr ? "Sauts, appuis, changements de direction, tirs." : "Jumps, footwork, changes of direction, throws."}</li>
            <li><strong>{fr ? "Charge planifiée" : "Planned load"}</strong>{fr ? "Des semaines construites pour progresser sans t'épuiser." : "Weeks built to make you progress without wearing you out."}</li>
            <li><strong>{fr ? "Prévention intégrée" : "Injury prevention built in"}</strong>{fr ? "Épaules, genoux et chevilles travaillés à chaque séance." : "Shoulders, knees and ankles trained in every session."}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function Founder({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  return (
    <section className="band">
      <div className="sec wrap founder">
        <svg className="founder-mark" viewBox={MARK_VIEWBOX} aria-hidden="true" dangerouslySetInnerHTML={{ __html: markSvg() }} />
        <div>
          <p className="founder-k">{fr ? "Qui est derrière 6M Lab" : "Who is behind 6M Lab"}</p>
          <h2>{fr ? "Moi, c'est Raphaël" : "I'm Raphaël"}</h2>
          <p>{fr
            ? "J'ai passé 5 ans en structures de haut niveau en handball : 5 entraînements par semaine, aux côtés de joueurs de centres de formation, dont certains jouent aujourd'hui en pro."
            : "I spent 5 years in elite-level handball programs: 5 training sessions a week, alongside academy players, some of whom now play professionally."}</p>
          <p>{fr
            ? "Cet été, j'ai assuré la préparation physique de l'équipe que j'entraîne. 6M Lab, c'est cette exigence, rendue accessible à tous."
            : "This summer, I ran the physical preparation of the team I coach. 6M Lab brings that standard to everyone."}</p>
          <ul className="founder-facts">
            <li>{fr ? "5 ans en structures de haut niveau" : "5 years at elite level"}</li>
            <li>{fr ? "Entraîneur et préparateur physique" : "Coach and strength coach"}</li>
            <li>{fr ? "Formation STAPS, entraînement sportif" : "Sport science training (coaching)"}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

// The free session form (home page, tips pages).
export function FreeSessionForm({ lang, title }: { lang: Lang; title?: string }) {
  const fr = lang === "fr";
  return (
    <form className="free" method="post" action="/api/seance-gratuite" data-lead="seance">
      <input type="hidden" name="lang" value={lang} />
      <input className="sr" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div>
        <p className="free-k">{fr ? "Gratuit" : "Free"}</p>
        <h2>{title ?? (fr ? "Teste une séance avant d'acheter" : "Try a session before you buy")}</h2>
        <p>{fr
          ? "Reçois par email une séance de 15 minutes de prévention des blessures pour le handball, avec les animations de chaque exercice."
          : "Get a 15-minute injury prevention session for handball by email, with an animation for every exercise."}</p>
      </div>
      <div className="free-f">
        <label className="sr" htmlFor={`free-email-${title ? "b" : "a"}`}>Email</label>
        <input id={`free-email-${title ? "b" : "a"}`} name="email" type="email" required autoComplete="email" placeholder={fr ? "Ton adresse email" : "Your email address"} />
        <button className="btn" type="submit">{fr ? "Recevoir ma séance" : "Send me the session"}</button>
        <p className="note">{fr ? "Pas de spam : la séance, 3 conseils de préparation, puis un email aux moments clés de la saison (reprise, rentrée, trêve). Désinscription en un clic." : "No spam: the session, 3 training tips, then one email at the key moments of the season (restart, back to school, winter break). Unsubscribe in one click."}</p>
      </div>
    </form>
  );
}

// A taste of the free session: 3 of its 8 exercises, the most striking in motion. The other
// animations are for customers (lib/access.ts).
const TEASER = ["saut-reception", "nordic", "gainage-lateral"];
export function FreeSession({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  return (
    <section className="sec wrap" id="seance-gratuite">
      <FreeSessionForm lang={lang} />
      <div className="teaser">
        <p className="teaser-t">{fr ? "Un aperçu de ce qui t'attend dans la séance gratuite" : "A preview of what's in the free session"}</p>
        <div className="teaser-g">
          {TEASER.map((id) => (
            <figure key={id}>
              <div className="teaser-fig" aria-hidden="true" dangerouslySetInnerHTML={{ __html: animatedFigure(id, variants(id)[0]) ?? "" }} />
              <figcaption>{names[id]?.name}</figcaption>
            </figure>
          ))}
        </div>
        <p className="teaser-link"><a href={`/${lang}/exercices/seance-gratuite`}>{fr ? "Voir les 8 animations de la séance gratuite →" : "See the free session's 8 animations →"}</a></p>
        <p className="note">{fr ? "Et 5 autres exercices pour tes genoux, tes chevilles, tes hanches et tes épaules. Les +60 animations complètes sont réservées aux clients des programmes." : "And 5 more exercises for your knees, ankles, hips and shoulders. The full library of 60+ animations is for program customers."}</p>
      </div>
    </section>
  );
}

export function Parents({ lang }: { lang: Lang }) {
  const fr = lang === "fr";
  const items: [string, string][] = fr
    ? [
        ["Une progression encadrée", "Chaque séance propose une version allégée pour débuter, et la charge augmente semaine après semaine."],
        ["Pas de charges lourdes obligatoires", "Tout le programme fonctionne au poids du corps. Le matériel est une option."],
        ["La prévention au cœur du programme", "Genoux, chevilles et épaules sont travaillés à chaque séance."],
        ["Un paiement unique et sécurisé", "Paiement par Stripe, sans abonnement. Une question ? Tu peux nous écrire directement."],
      ]
    : [
        ["Structured progression", "Every session has a lighter version for beginners, and the load increases week by week."],
        ["No heavy weights required", "The whole program works with bodyweight. Equipment is optional."],
        ["Injury prevention at the core", "Knees, ankles and shoulders are trained in every session."],
        ["One secure payment", "Paid through Stripe, no subscription. Any question? Write to us directly."],
      ];
  return (
    <section className="band">
      <div className="sec wrap">
        <header className="shead">
          <h2>{fr ? "Pour les parents" : "For parents"}</h2>
          <p>{fr ? "Ton enfant veut progresser ? Voici comment le programme le protège." : "Your child wants to improve? Here is how the program keeps them safe."}</p>
        </header>
        <ul className="plist">
          {items.map(([t, d]) => <li key={t}><strong>{t}.</strong> {d}</li>)}
        </ul>
        <p className="note">{fr ? "Les moins de 18 ans commandent avec l'accord d'un parent. " : "Under-18s order with a parent's consent. "}<a href={`/${lang}/contact`}>{fr ? "Nous contacter" : "Contact us"}</a></p>
      </div>
    </section>
  );
}
