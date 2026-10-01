import type { ReactNode } from "react";
import type { Lang } from "@/lib/dict";
import { watermark } from "@/lib/access-page";
import ProtectShield from "@/components/ProtectShield";
import "@/app/protect.css";

// Around the paid content (animations and libraries): see components/ProtectShield.tsx.
export default async function Protected({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <ProtectShield lang={lang} mark={await watermark()}>{children}</ProtectShield>;
}
