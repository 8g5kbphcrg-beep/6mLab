import Nav from "../Nav";
import { DOCS } from "@/lib/admin-docs";
import { CLUB_PREREQ } from "@/lib/club-prereq";

// Clubs: how to answer a quote request, the working documents, the follow-up sheet to print, and
// the rules decided for every club program.
export const metadata = { title: "Clubs | Admin 6M Lab" };

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

export default function Clubs() {
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

      <h2>Les règles décidées</h2>
      <div className="card"><ul>{RULES.map((r) => <li key={r}>{r}</li>)}</ul><p className="muted">Le détail et les sources sont dans la Méthode Clubs.</p></div>

      <h2>Acquis attendus par niveau</h2>
      <div className="card"><p>{empty.length ? <>Encore <b>{empty.length}</b> listes à écrire (le « i » du formulaire de devis affiche « liste à venir » en attendant) : <span className="muted">{empty.join(", ")}</span>.</> : "Toutes les listes sont écrites."}</p></div>
    </main>
  );
}
