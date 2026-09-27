"use client";

// Exercise card. Opened from a page of the site (library, free session, tips), the link says so
// with ?retour=<page>: the cross goes back there. Opened from the eye icon of a program PDF, a web
// page cannot switch back to another app (Mail, Files, Drive), so the cross hides the card and
// explains how to return to the program.
export default function CloseX({ label, back }: { label: string; back?: string }) {
  const close = () => {
    if (back) {
      // Going back in history keeps the scroll position of that page (e.g. the library), but only
      // when the previous page is one of the site's: reached inside the site (the page first loaded
      // in this tab is another one), or loaded from a link of the site.
      let inSite = false;
      try {
        const first = (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined)?.name;
        inSite = (!!first && first !== window.location.href) || (!!document.referrer && new URL(document.referrer).origin === window.location.origin);
      } catch {}
      if (inSite && window.history.length > 1) return window.history.back();
      return window.location.assign(back);
    }
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
