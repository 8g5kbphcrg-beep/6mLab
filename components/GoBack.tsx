"use client";

// "Not yet" on the access confirmation: back to where the customer came from (the program PDF,
// the website), or to the home page when there is nothing to go back to.
export default function GoBack({ home, label }: { home: string; label: string }) {
  return (
    <a className="acc-later" href={home} onClick={(e) => { if (window.history.length > 1) { e.preventDefault(); window.history.back(); } }}>{label}</a>
  );
}
