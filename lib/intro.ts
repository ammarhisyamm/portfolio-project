export const INTRO_KEY = "hisyam.intro.seen.v2";

export function shouldPlayIntro() {
  const query = new URLSearchParams(location.search);
  if (location.pathname !== "/" || query.has("work")) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  let seen = false;
  let museum = false;
  try {
    seen = sessionStorage.getItem("hisyam.intro.seen.v2") === "1";
    museum = sessionStorage.getItem("hisyam.portfolio.view.v1") === "museum";
  } catch { /* The intro still works when session storage is unavailable. */ }
  return !seen && (query.get("view") === "classic" || (!museum && query.get("museum") !== "1" && query.get("entrance") !== "1"));
}

export const INTRO_BOOTSTRAP = `if ((${shouldPlayIntro.toString()})()) {
  document.documentElement.setAttribute("data-intro", "play");
  setTimeout(function () {
    if (document.documentElement.getAttribute("data-intro") === "play") {
      document.documentElement.removeAttribute("data-intro");
    }
  }, 5000);
}`;
