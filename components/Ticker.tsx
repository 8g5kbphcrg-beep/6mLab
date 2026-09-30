import type { Lang } from "@/lib/dict";

// Band under the home hero: what the programs work on, scrolling by. The list is written twice
// so the loop is seamless; the copy is hidden from screen readers.
const words = {
  fr: ["Pré-saison", "Explosivité", "Prévention des blessures", "Puissance", "Condition physique", "Saison complète", "Appuis", "Gainage"],
  en: ["Pre-season", "Explosiveness", "Injury prevention", "Power", "Fitness", "Full season", "Footwork", "Core"],
};

export default function Ticker({ lang }: { lang: Lang }) {
  const w = words[lang];
  return (
    <div className="ticker">
      <div className="ticker-t">
        <ul>{w.map((x) => <li key={x}>{x}</li>)}</ul>
        <ul aria-hidden="true">{w.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
    </div>
  );
}
