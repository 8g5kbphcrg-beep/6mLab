export default {
  poweredByHeader: false,
  // The program PDFs (French, and English in programmes/en/) are read from disk by the Stripe
  // webhook and the free session, never served as pages.
  outputFileTracingIncludes: { "/api/stripe/webhook": ["./programmes/**/*.pdf"], "/api/seance-gratuite": ["./programmes/seance-decouverte.pdf", "./programmes/en/seance-decouverte.pdf"],
    // Admin: the working documents, the PDFs of an order for sending by hand, and the club
    // programs exported as PDFs (scripts/clubs-pdf.mjs).
    "/admin/docs/[slug]": ["./private/docs/*.html"], "/admin/clubs": ["./private/clubs/**/*"], "/admin/clubs/pdf/[dossier]/[fichier]": ["./private/clubs/**/*.pdf"], "/admin/programmes/fichier": ["./programmes/**/*.pdf"] },
  // Browser protections on every response: HTTPS only, no page of the site shown inside another
  // site (against look-alike pages), no guessing of file types, no full address sent to other
  // sites, no camera, microphone or location. Before the launch (SITE_PUBLIC=oui, see
  // lib/dict.ts), every response also tells search engines not to index it, files included.
  // The Maintien en saison became the 1re partie de saison (lib/season-parts.ts).
  async redirects() {
    return [{ source: "/:lang(fr|en)/programmes/maintien-saison", destination: "/:lang/programmes/premiere-partie", permanent: true }];
  },
  async headers() {
    const safe = [
      { key: "Strict-Transport-Security", value: "max-age=63072000" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Content-Security-Policy", value: "frame-ancestors 'self'; base-uri 'self'; object-src 'none'" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    const closed = process.env.SITE_PUBLIC === "oui" ? [] : [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [{ source: "/:path*", headers: [...safe, ...closed] }];
  },
};
