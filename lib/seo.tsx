import { SITE } from "@/lib/dict";

// Structured data of an offer page (schema.org Product + Offer): the name, description and
// starting price search engines can show next to the page.
export const offerLd = (name: string, description: string, cents: number, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name,
  description,
  brand: { "@type": "Brand", name: "6M Lab" },
  category: "Programme de préparation physique",
  offers: { "@type": "Offer", price: (cents / 100).toFixed(2), priceCurrency: "EUR", availability: "https://schema.org/InStock", url: `${SITE}${path}` },
});

export const Ld = ({ data }: { data: object }) => <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
