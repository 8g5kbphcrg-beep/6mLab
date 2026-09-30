import { NextResponse } from "next/server";
import { makeBackup } from "@/lib/backup";
import { backupName } from "@/lib/email";

// A backup of the site's data, downloaded now (lib/backup.ts), behind the admin password (proxy.ts).
export const dynamic = "force-dynamic";

export async function GET() {
  const { date, file } = await makeBackup();
  return new NextResponse(new Uint8Array(file), {
    headers: { "Content-Type": "application/gzip", "Content-Disposition": `attachment; filename="${backupName(date)}"`, "Cache-Control": "no-store" },
  });
}
