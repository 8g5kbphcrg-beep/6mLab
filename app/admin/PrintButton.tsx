"use client";
// Opens the browser's print window (print on paper, or save as PDF).
export default function PrintButton({ label = "Imprimer ou enregistrer en PDF" }: { label?: string }) {
  return <button type="button" onClick={() => window.print()}>{label}</button>;
}
