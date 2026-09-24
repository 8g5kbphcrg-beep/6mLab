import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import { programs } from "@/lib/programs";
import { PROMO_PERCENT, questions, stripe, toOrder, validToken, type Stage } from "@/lib/feedback";
import "@/app/pages.css";
import "@/app/avis.css";

// Feedback questionnaire, opened from the link in the feedback emails (personal, signed link).
export const metadata: Metadata = { title: "Ton avis | 6M Lab", robots: { index: false } };
export const dynamic = "force-dynamic";

type P = { params: Promise<{ lang: string; id: string }>; searchParams: Promise<{ etape?: string; t?: string; erreur?: string }> };

export default async function Avis({ params, searchParams }: P) {
  const { lang, id } = await params;
  if (!(lang in dict)) notFound();
  const fr = (lang as Lang) === "fr";
  const { etape, t = "", erreur } = await searchParams;
  const stage: Stage = etape === "2" ? "end" : "mid";
  const s = stripe();
  if (!s || !validToken(id, stage, t)) return <Msg title={fr ? "Lien invalide" : "Invalid link"} text={fr ? "Ce lien de questionnaire n'est pas valide. Utilise le bouton reçu par email, ou réponds directement à l'email." : "This questionnaire link is not valid. Use the button in the email, or simply reply to the email."} />;
  let o;
  try { o = toOrder(await s.paymentIntents.retrieve(id)); } catch { notFound(); }
  const done = stage === "mid" ? o.meta.m_at : o.meta.f_at;
  if (done) {
    return stage === "mid"
      ? <Msg title={fr ? "Merci !" : "Thank you!"} text={fr ? "Tes réponses sont bien enregistrées. Si tu as signalé un problème, on te répond par email." : "Your answers have been saved. If you reported a problem, we will reply by email."} />
      : <Msg title={fr ? "Merci pour ton avis !" : "Thank you for your feedback!"} text={fr ? `Voici ton code de -${PROMO_PERCENT} % sur ton prochain programme, valable un an (il t'a aussi été envoyé par email) :` : `Here is your ${PROMO_PERCENT}% discount code for your next program, valid for one year (also sent by email):`} code={o.meta.f_code} lang={lang} />;
  }
  const qs = questions(stage, o.goals);
  const p = programs[lang as Lang][o.program];
  return (
    <div className="pg avis">
      <p className="lab">{p.name}</p>
      <h1>{stage === "mid" ? (fr ? `${o.firstName}, comment ça se passe ?` : `${o.firstName}, how is it going?`) : (fr ? `${o.firstName}, ton avis` : `${o.firstName}, your feedback`)}</h1>
      <p>{stage === "mid" ? (fr ? "4 questions, 1 minute." : "4 questions, 1 minute.") : (fr ? `2 minutes. À la fin, ton code de -${PROMO_PERCENT} % sur ton prochain programme, quel que soit ton avis.` : `2 minutes. At the end, your ${PROMO_PERCENT}% discount code for your next program, whatever your feedback.`)}</p>
      {erreur && <p className="berr" role="alert">{fr ? "Réponds aux questions obligatoires (sans mention « facultatif »)." : "Please answer the required questions (not marked \"optional\")."}</p>}
      <form className="avf" method="post" action="/api/avis">
        <input type="hidden" name="pi" value={id} /><input type="hidden" name="stage" value={stage} /><input type="hidden" name="t" value={t} /><input type="hidden" name="lang" value={lang} />
        {qs.map((q) => (
          <fieldset key={q.key} className="avq">
            {q.kind !== "consent" && <legend>{fr ? q.fr : q.en}{q.optional && <span> · {fr ? "facultatif" : "optional"}</span>}</legend>}
            {q.kind === "choice" && <div className="avopts">{q.opts!.map(([v, f, e]) => <label key={v} className="avchip"><input type="radio" name={q.key} value={v} required />{fr ? f : e}</label>)}</div>}
            {q.kind === "stars" && <div className="avstars">{[5, 4, 3, 2, 1].map((n) => <Fragment key={n}><input type="radio" id={`s${n}`} name={q.key} value={n} required /><label htmlFor={`s${n}`} title={`${n}/5`}>★</label></Fragment>)}</div>}
            {q.kind === "nps" && <><div className="avnps">{Array.from({ length: 11 }, (_, n) => <label key={n}><input type="radio" name={q.key} value={n} required /><span>{n}</span></label>)}</div><p className="avscale"><span>{fr ? "Pas du tout" : "Not at all"}</span><span>{fr ? "Sans hésiter" : "Definitely"}</span></p></>}
            {q.kind === "text" && <textarea name={q.key} maxLength={480} rows={q.key === "f_text" ? 4 : 2} />}
            {q.kind === "consent" && <label className="bconsent"><input type="checkbox" name={q.key} /><span>{fr ? q.fr : q.en}</span></label>}
          </fieldset>
        ))}
        <button type="submit" className="btn">{fr ? "Envoyer" : "Send"}</button>
        <p className="note">{fr ? "Tes réponses servent à améliorer les programmes. Ton témoignage n'est publié qu'avec ton accord, avec ton prénom seulement." : "Your answers help us improve the programs. Your review is only published with your consent, with your first name only."}</p>
      </form>
    </div>
  );
}

function Msg({ title, text, code, lang }: { title: string; text: string; code?: string; lang?: string }) {
  return (
    <div className="pg avis">
      <h1>{title}</h1><p>{text}</p>
      {code && <><p className="avcode">{code}</p><p><a className="btn" href={`/${lang}/programmes`}>{lang === "en" ? "See the programs" : "Voir les programmes"}</a></p></>}
    </div>
  );
}
