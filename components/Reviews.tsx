import type { Lang } from "@/lib/dict";
import { programs } from "@/lib/programs";
import { getReviews } from "@/lib/reviews";

// Customer reviews (verified buyers), with the average of every final questionnaire. Shown only
// once at least one review has been published from the admin page.
export default async function Reviews({ lang }: { lang: Lang }) {
  const { count, average, reviews } = await getReviews();
  if (!reviews.length) return null;
  const fr = lang === "fr";
  const avg = average.toFixed(1).replace(".", fr ? "," : ".");
  const ld = {
    "@context": "https://schema.org", "@type": "Product", name: fr ? "Programmes de préparation physique handball 6M Lab" : "6M Lab handball training programs", brand: { "@type": "Brand", name: "6M Lab" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: average.toFixed(1), reviewCount: count, bestRating: 5, worstRating: 1 },
    review: reviews.slice(0, 10).map((r) => ({ "@type": "Review", author: { "@type": "Person", name: r.firstName }, datePublished: r.date, reviewBody: r.text, reviewRating: { "@type": "Rating", ratingValue: r.stars, bestRating: 5 } })),
  };
  return (
    <section className="sec wrap revs" aria-labelledby="revs-t">
      <header className="shead">
        <h2 id="revs-t">{fr ? "Ils se sont préparés avec 6M Lab" : "They trained with 6M Lab"}</h2>
        <p><span className="rstars" aria-hidden="true">★★★★★</span> <strong>{avg} / 5</strong> · {fr ? `${count} avis d'acheteurs vérifiés` : `${count} verified buyer review${count > 1 ? "s" : ""}`}</p>
      </header>
      <ul className="rlist">
        {reviews.slice(0, 9).map((r) => (
          <li key={r.id}>
            <span className="rstars" aria-label={`${r.stars}/5`}>{"★".repeat(r.stars)}<span className="off">{"★".repeat(5 - r.stars)}</span></span>
            <p>« {r.text} »</p>
            <p className="rby"><strong>{r.firstName}</strong> · {programs[lang][r.program]?.name} · {new Date(r.date).toLocaleDateString(fr ? "fr-FR" : "en-GB", { month: "long", year: "numeric" })}</p>
          </li>
        ))}
      </ul>
      <p className="note">{fr ? "Avis recueillis par email auprès des acheteurs, à la fin de leur programme. Un code de réduction est offert pour avoir répondu, quel que soit l'avis. Les avis ne sont pas modifiés ; seuls ceux dont l'auteur a accepté la publication sont affichés." : "Reviews collected by email from buyers at the end of their program. A discount code is offered for answering, whatever the feedback. Reviews are not edited; only those whose author agreed to publication are shown."}</p>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </section>
  );
}
