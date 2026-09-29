import Nav from "../Nav";
import CopyButton from "../CopyButton";
import { REPLIES, REPLY_HOURS } from "@/lib/replies";

// Ready-made answers (lib/replies.ts): copy, replace the [brackets], send. The site announces a
// reply within REPLY_HOURS hours (Contact page, FAQ, emails).
export default function Replies() {
  return (
    <main>
      <Nav here="reponses" />
      <h1>Réponses types</h1>
      <p className="sub">Le site annonce une réponse sous {REPLY_HOURS} heures (page Contact, FAQ, emails). Copie la réponse, remplace ce qui est entre [crochets], puis envoie. Les chiffres (durées, pourcentages) suivent les règles du site.</p>
      <div className="card">
        <h2 className="ct">Pour tenir les {REPLY_HOURS} heures</h2>
        <ul className="todo">
          <li>Un passage par jour dans la boîte mail, à heure fixe (par exemple le soir).</li>
          <li>Si la réponse demande du travail (devis club, cas particulier), envoie tout de suite un accusé de réception avec un délai, puis la vraie réponse.</li>
          <li>Pense à l'accueil de l'admin : les alertes et le journal des connexions expliquent la plupart des « ça ne marche pas ».</li>
        </ul>
      </div>
      <nav className="card" aria-label="Sommaire">
        <ul className="todo">{REPLIES.map((r) => <li key={r.id}><a href={`#${r.id}`}>{r.t}</a></li>)}</ul>
      </nav>
      {REPLIES.map((r) => (
        <section key={r.id} id={r.id} className="card reply">
          <h2 className="ct">{r.t}</h2>
          <p className="muted">{r.when}</p>
          <details open>
            <summary>Français</summary>
            <CopyButton text={r.fr} />
            <pre>{r.fr}</pre>
          </details>
          <details>
            <summary>English</summary>
            <CopyButton text={r.en} />
            <pre>{r.en}</pre>
          </details>
        </section>
      ))}
    </main>
  );
}
