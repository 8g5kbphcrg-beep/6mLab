import Nav from "../Nav";
import { DOCS } from "@/lib/admin-docs";
import { CLUB_PREREQ } from "@/lib/club-prereq";
import { listClubCodes } from "@/lib/club-access";
import { clubPdfs } from "@/lib/club-pdfs";

// Clubs: how to answer a quote request, the working documents, the follow-up sheet to print, and
// the rules decided for every club program, and the access codes that open the animations for a
// team (lib/club-access.ts).
export const metadata = { title: "Clubs | Admin 6M Lab" };
export const dynamic = "force-dynamic";

const RULES = [
  "Niveaux proposés : U15 départemental et régional ; U17 filles et U18 garçons départemental, régional et national ; seniors régional, national et pro (pas de seniors départemental).",
  "Musculation avec charges à partir des U17 filles et U18 garçons (légères à modérées) ; en U15, poids du corps, élastiques et apprentissage des gestes.",
  "Séance de prépa dédiée de 75 min : activation 12 min, motricité 18 min, renforcement 25 min (4 ateliers de 6 min, 2 exercices en alternance), course 15 min, retour au calme 5 min.",
  "Organisation avec 1 terrain et 2 cages : ateliers, colonnes ou vagues ; le temps d'attente compte comme récupération.",
  "Pré-saison : semaines 1 à 4 en autonomie (reprise du club début août), semaines 5 à 8 en club. Variante si reprise mi-juillet.",
  "U17 filles et U18 garçons nationaux, seniors : footing le mardi et le jeudi pendant l'autonomie (30 min, puis 10-10-10, 15-15-15 soutenu, 15-15-15 rapide, sans pause).",
  "Tests obligatoires à partir du régional (reprise, fin de pré-saison, trêve), conseillés en départemental.",
  "Gardiens : avec le groupe pour ce qui sert à tous, dans la cage pour les situations avec ballon, ateliers spécifiques en remplacement ; 30 tirs maximum chacun par séance de prépa ; Copenhague 3 fois par semaine en pré-saison.",
  "Chaque programme rappelle au coach que chaque séance demande une préparation, et que chaque exercice se réadapte (effectif du jour, matériel) en gardant l'idée de base : qualité travaillée, intensité, temps d'effort et de récupération.",
  "Postes : pas de différenciation en U15 départemental, plusieurs postes en U15 régional, postes fixes à partir des U17/U18 régionaux et en seniors.",
];

export default async function Clubs({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code: made } = await searchParams;
  const codes = await listClubCodes(), pdfs = await clubPdfs();
  const fmt = (ms: number) => new Date(ms).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" });
  const season = new Date().getMonth() >= 6 ? new Date().getFullYear() + 1 : new Date().getFullYear();
  const empty = Object.entries(CLUB_PREREQ).filter(([, p]) => p.fr.length === 0).map(([k]) => k);
  return (
    <main>
      <Nav here="clubs" />
      <h1>Clubs</h1>
      <p className="sub">Tout pour répondre à une demande de devis et construire le programme d'une équipe.</p>

      <h2>Répondre à une demande de devis</h2>
      <div className="card"><ol className="steps">
        <li><b>La demande arrive par email</b> (« Demande club : … ») avec la filière, la catégorie, le niveau, le nombre de joueurs de champ et de gardiens, la période, les installations et le matériel. Répondre à cet email écrit directement au coach.</li>
        <li><b>Vérifie le niveau</b> : si l'équipe est loin des acquis attendus pour son niveau, propose le niveau en dessous.</li>
        <li><b>Échange avec le coach</b> : date de reprise, jours d'entraînement, matchs amicaux, premier match, matériel réel (nombre de plots, barres, caisses…).</li>
        <li><b>Envoie le devis</b> sous 48 heures.</li>
        <li><b>Une fois validé</b>, le programme se construit à partir de l'exemple U18 et de la Méthode Clubs, dans une conversation avec Claude : colle la demande et tes échanges avec le coach. Tu relis avant l'envoi.</li>
        <li><b>Crée le code d'accès aux animations</b> de l'équipe (plus bas) et écris-le dans les documents, à l'emplacement « Code animations ».</li>
        <li><b>Fais produire les 4 PDF</b> par Claude (« sors les PDF du programme de [club] avec le code CLUB-… ») : après la validation de la PR, ils sont à télécharger plus bas, dans « Programmes clubs en PDF ».</li>
        <li><b>Envoie au coach, sur une seule adresse</b>, les 4 documents : document du coach, autonomie joueurs, autonomie gardiens, et la fiche de suivi (à générer ci-dessous avec son effectif).</li>
      </ol></div>

      <h2>Documents</h2>
      <div className="cards">
        {DOCS.filter((d) => d.section === "clubs").map((d) => <a key={d.slug} className="card" href={`/admin/docs/${d.slug}`}><h3>{d.title}</h3><p>{d.what}</p></a>)}
      </div>

      <h2>Fiche de suivi à imprimer</h2>
      <form className="form" method="get" action="/admin/clubs/fiche">
        <label className="f">Équipe (en-tête de la fiche)<input name="equipe" placeholder="U18 garçons national" maxLength={60} /></label>
        <label className="f">Joueurs de champ<input name="champ" type="number" min={1} max={60} defaultValue={14} required /></label>
        <label className="f">Gardiens<input name="gardiens" type="number" min={0} max={10} defaultValue={2} required /></label>
        <label className="f">Footings mardi et jeudi<select name="footings" defaultValue="oui"><option value="oui">Oui (U17 F / U18 M national, seniors)</option><option value="non">Non</option></select></label>
        <button type="submit">Créer la fiche</button>
      </form>

      <h2 id="pdf">Programmes clubs en PDF</h2>
      <div className="card">
        <p className="muted">Les 4 documents d'un programme, prêts à envoyer au coach : document du coach, autonomie joueurs, autonomie gardiens, fiche de suivi (une ligne par joueur du devis). L'œil de chaque exercice est un lien vers la bibliothèque clubs, et le code de l'équipe est déjà écrit dedans. Ils sont produits par Claude avec <code>npm run clubs-pdf</code>.</p>
        {pdfs.length ? <ul className="todo">{pdfs.map((p) => (
          <li key={p.dossier}><b>{p.titre}</b> <span className="tag">{p.date}{p.code ? ` · ${p.code}` : ""}</span><br />
            {p.files.map((f) => <a key={f} href={`/admin/clubs/pdf/${p.dossier}/${f}`} style={{ marginRight: 12 }}>{({ "1": "Document du coach", "2": "Autonomie joueurs", "3": "Autonomie gardiens", "4": "Fiche de suivi" } as Record<string, string>)[f[0]] ?? f} (PDF)</a>)}
          </li>
        ))}</ul> : <p className="muted">Aucun programme exporté pour l'instant.</p>}
      </div>

      <h2 id="codes">Codes d'accès aux animations</h2>
      <div className="card">
        <p className="muted">Un code par équipe. Les joueurs le saisissent sur la page d'un exercice (l'œil des documents) : les animations s'ouvrent sur leur téléphone jusqu'à la date de fin, sur le nombre d'appareils prévu. « Libérer » vide la liste des appareils (nouvelle saison, changement de téléphone) ; « Supprimer » coupe l'accès tout de suite.</p>
        {made && made !== "erreur" && <p className="alerts" style={{ padding: 10, borderRadius: 10 }}>Code créé : <b style={{ fontSize: 18, letterSpacing: 2 }}>{made}</b> (à écrire dans les documents du coach).</p>}
        {made === "erreur" && <p className="muted"><b>Le code n'a pas pu être créé</b> (nom du club et date de fin dans le futur obligatoires, et Redis branché).</p>}
        <form className="form" method="post" action="/admin/clubs/codes">
          <input type="hidden" name="action" value="create" />
          <label className="f">Club<input name="club" required maxLength={80} placeholder="HBC Exemple" /></label>
          <label className="f">Équipe<input name="team" maxLength={60} placeholder="U18 garçons national" /></label>
          <label className="f">Fin de l'accès<input name="end" type="date" required defaultValue={`${season}-06-30`} /></label>
          <label className="f">Appareils au plus<input name="max" type="number" min={1} max={80} defaultValue={30} required /></label>
          <button type="submit">Créer le code</button>
        </form>
        {codes.length > 0 && <div className="tw"><table>
          <thead><tr><th>Code</th><th>Club, équipe</th><th>Fin</th><th>Appareils</th><th></th></tr></thead>
          <tbody>{codes.map((c) => (
            <tr key={c.code}>
              <td><b>{c.code}</b></td><td>{c.club}{c.team ? `, ${c.team}` : ""}</td>
              <td>{fmt(c.end)}{c.end < Date.now() ? " (terminé)" : ""}</td><td>{c.devices.length} / {c.max}</td>
              <td>
                <form method="post" action="/admin/clubs/codes"><input type="hidden" name="code" value={c.code} /><button className="ghost" name="action" value="free">Libérer</button></form>{" "}
                <form method="post" action="/admin/clubs/codes"><input type="hidden" name="code" value={c.code} /><button className="ghost" name="action" value="delete">Supprimer</button></form>
              </td>
            </tr>
          ))}</tbody>
        </table></div>}
      </div>

      <h2>Les règles décidées</h2>
      <div className="card"><ul>{RULES.map((r) => <li key={r}>{r}</li>)}</ul><p className="muted">Le détail et les sources sont dans la Méthode Clubs.</p></div>

      <h2>Acquis attendus par niveau</h2>
      <div className="card"><p>{empty.length ? <>Encore <b>{empty.length}</b> listes à écrire (le « i » du formulaire de devis affiche « liste à venir » en attendant) : <span className="muted">{empty.join(", ")}</span>.</> : "Toutes les listes sont écrites."}</p></div>
    </main>
  );
}
