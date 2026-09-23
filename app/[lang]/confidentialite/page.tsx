import LegalPage, { legalMetadata } from "@/components/LegalPage";

type P = { params: Promise<{ lang: string }> };

export const metadata = legalMetadata("fr", "privacy");

export default function Page({ params }: P) {
  return <LegalPage params={params} lang="fr" doc="privacy" />;
}
