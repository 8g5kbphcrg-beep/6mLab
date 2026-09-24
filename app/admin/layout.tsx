import type { Metadata } from "next";
import "../admin.css";

// Private pages for 6M Lab (password: ADMIN_PASSWORD, checked in middleware.ts).
export const metadata: Metadata = { title: "Admin | 6M Lab", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body className="adm">{children}</body></html>;
}
