"use client";

// Closes the exercise card: back to the program if the page was opened from it (history),
// otherwise closes the tab, and as a last resort goes to the home page.
export default function CloseX({ home, label }: { home: string; label: string }) {
  const close = () => {
    if (window.history.length > 1) return window.history.back();
    window.close();
    setTimeout(() => { window.location.href = home; }, 300);
  };
  return (
    <button type="button" className="exo-x" onClick={close} aria-label={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </button>
  );
}
