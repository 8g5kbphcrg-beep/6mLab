import { access } from "node:fs/promises";
import Nav from "../Nav";
import { orderFiles } from "@/lib/email";
import { goalIds, goalName, validGoals, type GoalId } from "@/lib/goals";
import { programs, type ProgramSlug } from "@/lib/programs";
import type { Lang } from "@/lib/dict";

// Programs: the PDFs of an order, ready to send by hand (same files and same personal stamp as
// the automatic email), the free session, and every animation on one page.
export const dynamic = "force-dynamic";

type Q = Record<string, string | undefined>;
const PROGS = [["pre-saison", "Pré-saison"], ["premiere-partie", "1re partie de saison"], ["deuxieme-partie", "2e partie de saison"]] as const;

export default async function Programmes({ searchParams }: { searchParams: Promise<Q> }) {
  const q = await searchParams;
  const goals = (q.g ? q.g.split(",") : [q.g1, q.g2]).filter((x): x is string => !!x);
  const prog = PROGS.some(([v]) => v === q.prog) ? q.prog! : "";
  const ok = !!prog && validGoals(goals);
  const plang: Lang = q.plang === "en" ? "en" : "fr";
  const files = ok ? orderFiles({ program: prog as ProgramSlug, goals: goals as GoalId[], running: q.course === "oui", gender: q.genre ?? "", lieu: q.lieu === "salle" ? "salle" : "maison", plang }) : [];
  const exists = await Promise.all(files.map((f) => access(f.path).then(() => true, () => false)));
  const link = (path: string, name: string) => `/admin/programmes/fichier?${new URLSearchParams({ f: path.split("/programmes/")[1] ?? "", n: name, prenom: q.prenom ?? "", ref: q.ref ?? "", lang: plang })}`;
  const sel = (name: string, label: string, opts: readonly (readonly [string, string])[], value = "") => (
    <label className="f">{label}<select name={name} defaultValue={value}>{opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
  );
  const goalOpts = goalIds.map((g) => [g, goalName(g, "fr")] as const);
  return (
    <main>
      <Nav here="programmes" />
      <h1>Programmes</h1>
      <p className="sub">Les PDF d'une commande, prêts à envoyer à la main : les mêmes fichiers et le même tampon (prénom et référence en bas de chaque page) que l'envoi automatique. Depuis Commandes & avis, le lien « PDF » de chaque commande remplit ce formulaire pour toi.</p>

      <h2>Retrouver les PDF d'une commande</h2>
      <form className="form" method="get">
        {sel("prog", "Programme", [["", "—"], ...PROGS], prog)}
        {sel("g1", "Objectif 1", [["", "—"], ...goalOpts], goals[0])}
        {sel("g2", "Objectif 2 (facultatif)", [["", "Aucun"], ...goalOpts], goals[1])}
        {sel("lieu", "Lieu", [["maison", "Maison"], ["salle", "Salle"]], q.lieu)}
        {sel("genre", "Silhouette (genre)", [["", "Neutre"], ["femme", "Femme"], ["homme", "Homme"]], q.genre)}
        {sel("plang", "Langue du PDF", [["fr", "Français"], ["en", "English"]], plang)}
        {sel("course", "Option course", [["", "Non"], ["oui", "Oui"]], q.course)}
        <label className="f">Prénom du client<input name="prenom" defaultValue={q.prenom} maxLength={40} /></label>
        <label className="f">Référence<input name="ref" defaultValue={q.ref} maxLength={20} /></label>
        <button type="submit">Afficher les fichiers</button>
      </form>
      {ok ? (
        <div className="card" style={{ marginTop: 10 }}>
          <b>{programs.fr[prog as ProgramSlug].name} · {goals.map((g) => goalName(g as GoalId, "fr")).join(" + ")}</b>
          <ul>{files.map((f, i) => <li key={f.path}>{exists[i] ? <a href={link(f.path, f.filename)} target="_blank">{f.filename}</a> : <span className="muted">{f.filename} (pas encore disponible)</span>}</li>)}</ul>
          <p className="muted">Ouvre chaque fichier, puis enregistre-le et joins-le à ta réponse au client.</p>
        </div>
      ) : (goals.length > 0 || prog) && <p className="muted">Choisis un programme et 1 ou 2 objectifs différents.</p>}

      <h2>Séance gratuite</h2>
      <div className="card"><ul>
        <li><a href="/admin/programmes/fichier?f=seance-decouverte.pdf&n=6M-Lab-seance-decouverte.pdf" target="_blank">Séance découverte (français)</a></li>
        <li><a href="/admin/programmes/fichier?f=en/seance-decouverte.pdf&n=6M-Lab-free-session.pdf" target="_blank">Free session (anglais)</a></li>
        <li><a href="/fr/exercices/seance-gratuite" target="_blank">La page des 8 animations de la séance gratuite</a></li>
      </ul></div>

      <h2>Animations</h2>
      <div className="card"><p><a href="/admin/programmes/animations">Toutes les animations sur une page</a> : chaque exercice, dans toutes ses versions (poids du corps, maison, élastique, matériel), avec son texte. Pour vérifier qu'une animation correspond bien à ce qui est écrit.</p></div>
    </main>
  );
}
