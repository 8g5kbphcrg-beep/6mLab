"use client";

// Exercise card. Opened from a page of the site (library, free session, tips), the link says so
// with ?retour=<page>: the cross goes back there (in the library, on the exercise). Opened from the
// eye icon of a program PDF, a web page cannot switch back to another app (Mail, Files, Drive), so
// the cross hides the card and explains how to return to the program.
export default function CloseX({ label, back }: { label: string; back?: string }) {
  const close = () => {
    // Always that page, never the previous one of the history (which may be the home page), in
    // place of the card so the phone's back button does not reopen it.
    if (back) return window.location.replace(back);
    document.querySelector(".exo-back")?.classList.add("closed");
  };
  return (
    <button type="button" className="exo-x" onClick={close} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </button>
  );
}

export function Reopen({ label }: { label: string }) {
  return <button type="button" className="exo-again" onClick={() => document.querySelector(".exo-back")?.classList.remove("closed")}>{label}</button>;
}
