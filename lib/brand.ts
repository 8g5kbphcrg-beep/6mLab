export { SLOGAN } from "@/lib/mark.mjs";

// Runs before the page paints: hides the opening screen (components/Brand.tsx) when it was shown
// less than 30 minutes ago, so it appears on arrival but not on every page or every eye icon.
export const splashScript = `try{var s=+localStorage.getItem("splashAt")||0;if(Date.now()-s<18e5)document.documentElement.classList.add("splash-seen");else localStorage.setItem("splashAt",Date.now())}catch(e){document.documentElement.classList.add("splash-seen")}`;
