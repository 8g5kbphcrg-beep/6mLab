// Links between the admin pages.
export default function Nav({ here }: { here: "audience" | "avis" }) {
  return (
    <p className="sub" style={{ display: "flex", gap: 16 }}>
      {here === "audience" ? <b>Audience & ventes</b> : <a href="/admin/audience">Audience & ventes</a>}
      {here === "avis" ? <b>Avis & commandes</b> : <a href="/admin/avis">Avis & commandes</a>}
    </p>
  );
}
