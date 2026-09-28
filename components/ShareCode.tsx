"use client";
import { useState } from "react";

// Customer area: copy or share the referral code (lib/referral.ts). Share opens the phone's share
// sheet (WhatsApp, Messages, Instagram…); where it does not exist, the message is copied instead.
export default function ShareCode({ code, text, fr }: { code: string; text: string; fr: boolean }) {
  const [done, setDone] = useState<"" | "code" | "msg">("");
  const copy = async (v: string, what: "code" | "msg") => {
    try { await navigator.clipboard.writeText(v); setDone(what); setTimeout(() => setDone(""), 2200); } catch {}
  };
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ text }); return; } catch { return; } }
    copy(text, "msg");
  };
  return (
    <div className="sc">
      <button type="button" className="btn sc-share" onClick={share}>{fr ? "Partager à mes coéquipiers" : "Share with my teammates"}</button>
      <button type="button" className="sc-copy" onClick={() => copy(code, "code")}>{done === "code" ? (fr ? "Code copié ✓" : "Code copied ✓") : (fr ? "Copier le code" : "Copy the code")}</button>
      <a className="sc-wa" href={`https://wa.me/?text=${encodeURIComponent(text)}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
      <p className="sc-live" role="status">{done === "msg" ? (fr ? "Message copié : colle-le dans ta conversation d'équipe." : "Message copied: paste it into your team chat.") : ""}</p>
    </div>
  );
}
