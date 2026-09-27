import { redirect } from "next/navigation";

// /admin opens the audience and sales page.
export default function Admin() {
  redirect("/admin/audience");
}
