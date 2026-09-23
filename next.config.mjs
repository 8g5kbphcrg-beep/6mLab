export default {
  poweredByHeader: false,
  // The program PDFs are read from disk by the Stripe webhook, never served as pages.
  outputFileTracingIncludes: { "/api/stripe/webhook": ["./programmes/**/*.pdf"] },
};
