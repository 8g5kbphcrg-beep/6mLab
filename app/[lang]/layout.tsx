import type { Metadata } from "next";
import { Anton, Bebas_Neue, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dict, locales, OPEN, SITE, type Lang } from "@/lib/dict";
import { legalPaths } from "@/lib/legal";
import Defs from "@/components/Defs";
import Logo, { Lockup } from "@/components/Logo";
import Enhance from "@/components/Enhance";
import ThemeToggle from "@/components/ThemeToggle";
import { Splash, Transition } from "@/components/Brand";
import { splashScript } from "@/lib/brand";
import { Analytics } from "@vercel/analytics/next";
import Track from "@/components/Track";
import BackButton from "@/components/BackButton";
import "../globals.css";

const display = Anton({ subsets: ["latin"], weight: "400", variable: "--font-display" });
const text = Inter({ subsets: ["latin"], variable: "--font-text" });
const slogan = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-slogan" });

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in dict)) return {};
  const d = dict[lang as Lang];
  return {
    metadataBase: new URL(SITE),
    // iOS turns the test card number into a phone link otherwise.
    formatDetection: { telephone: false },
    title: d.title,
    description: d.desc,
    alternates: { canonical: `/${lang}`, languages: { fr: "/fr", en: "/en" } },
    openGraph: { title: d.title, description: d.desc, siteName: "6M Lab", locale: lang === "fr" ? "fr_FR" : "en_GB", type: "website" },
    // Before the launch, no page may be indexed (lib/dict.ts OPEN).
    ...(!OPEN && { robots: { index: false, follow: false } }),
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!(lang in dict)) notFound();
  const d = dict[lang as Lang];
  const other = lang === "fr" ? "en" : "fr";
  const fr = lang === "fr";
  const links: [string, string][] = [
    // Home: the page where one chooses between sport-specific prep and fitness & well-being.
    [`/${lang}`, fr ? "Accueil" : "Home"],
    ...(fr ? [["/fr/conseils", "Conseils"] as [string, string]] : []),
    [fr ? "/fr/a-propos" : "/en/about", fr ? "À propos" : "About"],
    [`/${lang}/contact`, "Contact"],
    // Customer area: the exercise animations, opened with the order reference (lib/access.ts).
    [`/${lang}/exercices`, fr ? "Espace client" : "Customer area"],
  ];
  return (
    <html lang={lang} className={`${display.variable} ${text.variable} ${slogan.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies the theme chosen with the theme button before the page paints (no flash). */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}` }} />
        <script dangerouslySetInnerHTML={{ __html: splashScript }} />
      </head>
      <body>
        <noscript><style>{".rv,.rise{opacity:1!important;transform:none!important}.splash{display:none!important}"}</style></noscript>
        <Splash />
        <Transition paying={fr ? "Redirection vers le paiement sécurisé…" : "Taking you to secure payment…"} />
        <Defs />
        <a className="skip" href="#main">{d.nav.skip}</a>
        <header className="bar">
          <div className="bar-l">
            <BackButton label={fr ? "Revenir à la page précédente" : "Back to the previous page"} />
            <Link href={`/${lang}`} className="logo" aria-label="6M Lab"><Logo /></Link>
          </div>
          <nav className="navd" aria-label="Navigation">
            {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
            <Link className="lang" href={`/${other}`} hrefLang={other} lang={other}>{d.nav.other}</Link>
            <a className="btn btn-s" href={`/${lang}#formules`}>{fr ? "Choisir mon programme" : "Choose my program"}</a>
          </nav>
          <ThemeToggle fr={fr} />
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
              <Link href={`/${lang}`} className="logo" aria-label="6M Lab"><Lockup size={54} /></Link>
              <p>{d.hero.foot}</p>
            </div>
            <nav aria-label={fr ? "Site" : "Site"}>
              <p className="flab">{fr ? "Site" : "Site"}</p>
              {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
              <a href={`/${lang}/clubs`}>{fr ? "Clubs et entraîneurs" : "Clubs and coaches"}</a>
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
        {/* Audience without cookies: Vercel Web Analytics (visits, pages, sources, devices) and the
            purchase funnel counted by the site (components/Track.tsx, admin page /admin/audience). */}
        <Analytics />
        <Track />
      </body>
    </html>
  );
}
