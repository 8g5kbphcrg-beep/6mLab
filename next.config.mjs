export default {
  poweredByHeader: false,
  // The program PDFs are read from disk by the Stripe webhook, never served as pages.
  outputFileTracingIncludes: { "/api/stripe/webhook": ["./programmes/**/*.pdf"] },
  // Before the launch (SITE_PUBLIC=oui, see lib/dict.ts), every response tells search engines
  // not to index it, images and files included.
  async headers() {
    return process.env.SITE_PUBLIC === "oui" ? [] : [{ source: "/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] }];
  },
};
