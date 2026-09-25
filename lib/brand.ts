export { SLOGAN } from "@/lib/mark.mjs";

// Runs before the page paints: shows the opening screen (components/Brand.tsx) every time someone
// arrives on the home page from outside the site; elsewhere, at most every 30 minutes, so it
// does not come back on every page or every eye icon of the programs.
export const splashScript = `try{var h=/^\\/(fr|en)?\\/?$/.test(location.pathname),r=document.referrer,x=!r||new URL(r).host!==location.host,s=+localStorage.getItem("splashAt")||0;if(!(h&&x)&&Date.now()-s<18e5)document.documentElement.classList.add("splash-seen");else localStorage.setItem("splashAt",Date.now())}catch(e){document.documentElement.classList.add("splash-seen")}`;
