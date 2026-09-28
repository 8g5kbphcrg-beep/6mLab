"use client";
import { useState } from "react";

// Copies a text (a ready-made answer) to paste into an email.
export default function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="ghost" onClick={async () => {
      try { await navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); } catch {}
    }}>{done ? "Copié ✓" : label}</button>
  );
}
