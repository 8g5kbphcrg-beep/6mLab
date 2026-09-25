import { bodySvg } from "@/lib/body";
import type { Sex } from "@/lib/forme";

// Fat, muscle and muscle definition of each silhouette of the questionnaire.
const CUR = [[0, 0.1, 0.15], [0.3, 0.2, 0.05], [0.55, 0.2, 0], [0.8, 0.2, 0], [1, 0.2, 0]];
const TARGET = [[0.05, 0.15, 0.3], [0.12, 0.3, 0.5], [0.08, 0.55, 0.75], [0.07, 1.05, 0.95], [0.05, 1.6, 1]];

// A body silhouette for the fitness questionnaire (current or target body type).
export default function Silhouette({ sex, kind, i }: { sex: Sex; kind: "cur" | "target"; i: number }) {
  const [fat, muscle, def] = (kind === "cur" ? CUR : TARGET)[i];
  return <span className="sil" aria-hidden="true" dangerouslySetInnerHTML={{ __html: bodySvg({ sex, fat, muscle, def }, `${sex}${kind}${i}`) }} />;
}
