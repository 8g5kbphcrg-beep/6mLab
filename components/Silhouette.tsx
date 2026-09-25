import { bodyFor, silhouettePaths, type Sex } from "@/lib/forme";

// A body silhouette for the fitness questionnaire (current or target body type).
export default function Silhouette({ sex, kind, i }: { sex: Sex; kind: "cur" | "target"; i: number }) {
  const p = silhouettePaths(bodyFor(sex, kind, i));
  return (
    <svg viewBox="0 0 100 200" className="sil" aria-hidden="true">
      <circle cx="50" cy="20" r="11" />
      {sex === "f" && <path d="M39 18 Q40 6 50 7 Q61 6 62 19 Q63 30 58 34 L56 26 Q50 12 44 26 L42 34 Q37 30 39 18 Z" className="hair" />}
      <path d={p.torso} />
      {p.arms.map((d, k) => <path key={`a${k}`} d={d} />)}
      {p.legs.map((d, k) => <path key={`l${k}`} d={d} />)}
    </svg>
  );
}
