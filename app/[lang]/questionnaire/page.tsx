import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import Quiz from "@/components/Quiz";
import { testMode } from "@/lib/checkout";
import { PARTS, quote } from "@/lib/season-parts";

// Rebuilt every hour at most: the offer (and a pro-rata price) follows the date.
export const revalidate = 3600;

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const quotes = Object.fromEntries([...PARTS, "pack" as const].map((k) => [k, quote(k)])) as Parameters<typeof Quiz>[0]["quotes"];
  return <Quiz lang={lang as Lang} test={testMode} quotes={quotes} />;
}
