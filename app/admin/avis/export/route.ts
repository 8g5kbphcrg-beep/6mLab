import { NextResponse } from "next/server";
import { goalName } from "@/lib/goals";
import { paidOrders, stripe } from "@/lib/feedback";

// All orders and answers as a CSV file (opens in Excel / Numbers), behind the admin password.
export const dynamic = "force-dynamic";

export async function GET() {
  const s = stripe();
  if (!s) return new NextResponse("Stripe non configuré", { status: 500 });
  const orders = await paidOrders(s);
  const keys = ["m_at", "m_clear", "m_level", "m_anim", "m_note", "f_at", "f_stars", "f_nps", "f_best", "f_change", "f_improve", "f_text", "f_pub", "f_show", "f_code"];
  const goalKeys = [...new Set(orders.flatMap((o) => Object.keys(o.meta).filter((k) => k.startsWith("fp_"))))];
  const head = ["date", "prenom", "email", "programme", "objectifs", "langue", ...keys, ...goalKeys];
  const cell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const rows = orders.map((o) => [new Date(o.created * 1000).toISOString().slice(0, 10), o.firstName, o.email ?? "", o.program, o.goals.map((g) => goalName(g, "fr")).join(" + "), o.lang, ...keys.map((k) => o.meta[k] ?? ""), ...goalKeys.map((k) => o.meta[k] ?? "")]);
  const csv = "﻿" + [head, ...rows].map((r) => r.map(cell).join(";")).join("\r\n");
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="avis-6mlab-${new Date().toISOString().slice(0, 10)}.csv"` } });
}
