import { notFound } from "next/navigation";
import { dict, type Lang } from "@/lib/dict";
import Quiz from "@/components/Quiz";
import { testMode } from "@/lib/checkout";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  return <Quiz lang={lang as Lang} test={testMode} />;
}
