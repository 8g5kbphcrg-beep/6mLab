import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dict, locales, SITE, type Lang } from "@/lib/dict";
import Defs from "@/components/Defs";
import Enhance from "@/components/Enhance";
import "../globals.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const text = Inter({ subsets: ["latin"], variable: "--font-text" });

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in dict)) return {};
  const d = dict[lang as Lang];
  return {
    metadataBase: new URL(SITE),
    title: d.title,
    description: d.desc,
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
    openGraph: { title: d.title, description: d.desc, siteName: "6M Lab", locale: lang === "fr" ? "fr_FR" : "en_GB", type: "website" },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const d = dict[lang as Lang];
  const other = lang === "fr" ? "en" : "fr";
  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`}>
      <body>
        <noscript><style>{".rv,.rise{opacity:1!important;transform:none!important}"}</style></noscript>
        <Defs />
        <a className="skip" href="#main">{d.nav.skip}</a>
        <header className="bar">
          <Link href={`/${lang}`} className="logo" aria-label="6M Lab">6M<b>Lab</b></Link>
          <nav aria-label="Navigation">
            <a className="h" href={`/${lang}#formules`}>{d.nav.cmp}</a>
            <a className="h" href={`/${lang}#objectif`}>{d.nav.goal}</a>
            {lang === "fr" && <a className="h" href="/fr/conseils">Conseils</a>}
{lang === "fr" ? <><a className="h" href="/fr/a-propos">À propos</a><a className="h" href="/fr/contact">Contact</a></> : <><a className="h" href="/en/about">About</a><a className="h" href="/en/contact">Contact</a></>}
            <Link className="lang" href={`/${other}`} hrefLang={other} lang={other}>{d.nav.other}</Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="foot"><p>© {new Date().getFullYear()} 6M Lab</p></footer>
        <Enhance cta={d.hero.cta} />
      </body>
    </html>
  );
}
