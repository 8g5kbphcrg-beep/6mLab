"use client";

// Exercise card (opened from the eye icon in the program PDFs). A web page cannot switch back to
// another app (Mail, Files, Drive), and going back or closing the tab would land on an unrelated
// page, so the cross hides the card and explains how to return to the program. Only when the
// card was opened from the 6M Lab site itself does it go back.
export default function CloseX({ label }: { label: string }) {
  const close = () => {
    let fromSite = false;
    try { fromSite = !!document.referrer && new URL(document.referrer).origin === window.location.origin; } catch {}
    if (fromSite && window.history.length > 1) return window.history.back();
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
