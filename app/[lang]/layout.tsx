import type { Metadata } from "next";
import { Anton, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dict, locales, SITE, type Lang } from "@/lib/dict";
import { legalPaths } from "@/lib/legal";
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
  const fr = lang === "fr";
  const links: [string, string][] = [
    [`/${lang}/programmes`, fr ? "Programmes" : "Programs"],
    [`/${lang}#objectif`, d.nav.goal],
    ...(fr ? [["/fr/conseils", "Conseils"] as [string, string]] : []),
    [fr ? "/fr/a-propos" : "/en/about", fr ? "À propos" : "About"],
    [`/${lang}/contact`, "Contact"],
  ];
  return (
    <html lang={lang} className={`${display.variable} ${text.variable}`}>
      <body>
        <noscript><style>{".rv,.rise{opacity:1!important;transform:none!important}"}</style></noscript>
        <Defs />
        <a className="skip" href="#main">{d.nav.skip}</a>
        <header className="bar">
          <Link href={`/${lang}`} className="logo" aria-label="6M Lab">6M<b>Lab</b></Link>
          <nav className="navd" aria-label="Navigation">
            {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
            <Link className="lang" href={`/${other}`} hrefLang={other} lang={other}>{d.nav.other}</Link>
            <a className="btn btn-s" href={`/${lang}/programmes`}>{fr ? "Voir les programmes" : "See the programs"}</a>
          </nav>
          <details className="menu">
            <summary aria-label="Menu"><span /></summary>
            <nav aria-label="Navigation">
              {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
              <a href={`/${other}`} hrefLang={other} lang={other}>{fr ? "English" : "Français"}</a>
            </nav>
          </details>
        </header>
        <main id="main">{children}</main>
        <footer className="foot">
          <div className="fwrap">
            <div>
              <Link href={`/${lang}`} className="logo" aria-label="6M Lab">6M<b>Lab</b></Link>
              <p>{d.hero.trust}</p>
            </div>
            <nav aria-label={fr ? "Site" : "Site"}>
              <p className="flab">{fr ? "Site" : "Site"}</p>
              {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
            </nav>
            <nav aria-label={fr ? "Informations légales" : "Legal"}>
              <p className="flab">{fr ? "Informations légales" : "Legal"}</p>
              <Link href={legalPaths[lang as Lang].notice}>{fr ? "Mentions légales" : "Legal notice"}</Link>
              <Link href={legalPaths[lang as Lang].privacy}>{fr ? "Confidentialité" : "Privacy"}</Link>
              <Link href={legalPaths[lang as Lang].cgv}>{fr ? "CGV" : "Terms of sale"}</Link>
            </nav>
          </div>
          <p className="fcopy">© {new Date().getFullYear()} 6M Lab</p>
        </footer>
        <Enhance cta={d.hero.cta} />
      </body>
    </html>
  );
}
