import LegalPage, { legalMetadata } from "@/components/LegalPage";

type P = { params: Promise<{ lang: string }> };

export const metadata = legalMetadata("en", "notice");

export default function Page({ params }: P) {
  return <LegalPage params={params} lang="en" doc="notice" />;
}
