import { notFound } from "next/navigation";

// Any address that matches no page: the 6M Lab "page not found" (app/[lang]/not-found.tsx),
// inside the site's header and footer.
export default function Rest() {
  notFound();
}
