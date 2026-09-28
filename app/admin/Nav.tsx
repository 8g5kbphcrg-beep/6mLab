// The admin sections, at the top of every admin page.
const SECTIONS = [
  ["accueil", "/admin", "Accueil"],
  ["audience", "/admin/audience", "Audience & ventes"],
  ["avis", "/admin/avis", "Commandes & avis"],
  ["programmes", "/admin/programmes", "Programmes"],
  ["clubs", "/admin/clubs", "Clubs"],
  ["reponses", "/admin/reponses", "Réponses types"],
  ["memo", "/admin/memo", "Aide-mémoire"],
] as const;
export type Section = (typeof SECTIONS)[number][0];

export default function Nav({ here }: { here: Section }) {
  return (
    <nav className="adm-nav" aria-label="Espace 6M Lab">
      <b className="adm-brand">6M Lab</b>
      {SECTIONS.map(([id, href, label]) => (id === here ? <span key={id} aria-current="page">{label}</span> : <a key={id} href={href}>{label}</a>))}
    </nav>
  );
}
