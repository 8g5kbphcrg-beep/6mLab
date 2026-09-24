"use client";

// Exercise card (opened from the eye icon in the program PDFs). The cross goes back to the PDF
// when it is in the same app (history), otherwise tries to close the tab. A web page cannot
// switch back to another app (Mail, Files, Drive): in that case the card hides and a message
// explains how to return to the program.
export default function CloseX({ label }: { label: string }) {
  const close = () => {
    // If the page is still here shortly after, going back and closing did not work.
    setTimeout(() => document.querySelector(".exo-back")?.classList.add("closed"), 400);
    if (window.history.length > 1) window.history.back();
    else window.close();
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
