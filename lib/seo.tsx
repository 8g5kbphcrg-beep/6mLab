import { SITE } from "@/lib/dict";
import type { Rating } from "@/lib/reviews";

// Structured data of an offer page (schema.org Product + Offer): the name, description and
// starting price search engines can show next to the page. With a rating (the final questionnaires
// of this offer, lib/reviews.ts), Google can also show the stars.
export const offerLd = (name: string, description: string, cents: number, path: string, rating?: Rating) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name,
  description,
  brand: { "@type": "Brand", name: "6M Lab" },
  category: "Programme de préparation physique",
  offers: { "@type": "Offer", price: (cents / 100).toFixed(2), priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${SITE}${path}` },
  ...(rating?.count ? { aggregateRating: { "@type": "AggregateRating", ratingValue: rating.average.toFixed(1), ratingCount: rating.count, bestRating: 5, worstRating: 1 } } : {}),
});

export const Ld = ({ data }: { data: object }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
