import type { MuseumExhibit, ShowcaseItem } from "./types";

// Hisyam's collected portfolio shots, exported from the "Work" Figma file and
// served from /public/showcase. Thumbnails are cropped previews; the full image
// keeps the whole page (landing pages are full length).
type Row = [slug: string, title: string, subtitle: string];
const items = (kind: string, rows: Row[]): ShowcaseItem[] => rows.map(([slug, title, subtitle]) => ({
  title, subtitle, src: `/showcase/${kind}/${slug}.webp`, thumb: `/showcase/${kind}/${slug}-thumb.webp`,
}));

const WEB = items("web", [
  ["valoras", "Valoras", "Banking"],
  ["kosta", "Kosta", "Mentorship"],
  ["epic-adventure", "Epic Adventure", "Travel marketplace"],
  ["finova", "Finova", "Personal finance"],
  ["elite-alps", "Elite", "Alpine travel"],
  ["logistics", "Freight", "Logistics"],
  ["calmann", "Calmann", "Field ops SaaS"],
  ["trading", "Markets", "Trading platform"],
  ["havenseek", "HavenSeek", "Real estate"],
  ["miktagony", "Miktagony", "Creative agency"],
  ["seneleco", "Seneleco", "Home services"],
  ["wild-yeast", "Wild Yeast Co", "Bakery"],
  ["prestige", "Prestige Residences", "Property"],
  ["pizzaria", "Pizzaria", "Restaurant"],
  ["acecourt", "Acecourt", "Sports retail"],
  ["nova-coffee", "Nova Coffee Co", "Cafe"],
  ["hollow-grounds", "Hollow Grounds", "Coffee roaster"],
  ["lumiere", "Lumière Events", "Events"],
  ["brand-studio", "Visual Power", "Brand studio"],
  ["starsbots", "StarsBots", "AI support SaaS"],
]);
const DASHBOARD = items("dashboard", [
  ["polumo-chat", "Polumo", "Therapist workspace, session chat"],
  ["polumo-clients", "Polumo", "Client list"],
  ["kola-contacts", "Kola", "Donor CRM, contact details"],
  ["kola-dashboard", "Kola", "Donor CRM, fundraising dashboard"],
  ["docktly", "Docktly", "Document tools dashboard"],
  ["speckle-calendar", "Speckle", "Coaching sessions calendar"],
  ["speckle-inbox", "Speckle", "Coaching notes inbox"],
  ["speckle-settings", "Speckle", "Profile and availability"],
  ["almanac", "Almanac", "AI resource search"],
]);
const MOBILE = items("mobile", [
  ["shipping", "Shipping tracker", "Logistics"],
  ["speaking", "Public speaking course", "Education"],
  ["doctor", "Doctor consultation", "Health"],
  ["game-tracker", "Game tracker", "Gaming"],
  ["finance", "Personal finance", "Fintech"],
  ["crypto", "Crypto wallet", "Fintech"],
  ["travel", "Trip planner", "Travel"],
  ["spnewsr", "Spnewsr", "Sports news"],
  ["dengarno", "Dengarno", "Podcasts"],
  ["bookstore", "Bookstore", "Reading"],
  ["jobs", "Job search", "Careers"],
  ["food", "Food delivery", "Food"],
  ["grocery", "Grocery", "Commerce"],
]);

export const DRIBBBLE = "https://dribbble.com/hisyamfakhrudin";

export const SHOWCASE: MuseumExhibit[] = [
  { id: "showcase-web", room: "playground", title: "Websites", subtitle: `Desktop / ${WEB.length} landing pages`, description: "Landing pages for banking, travel, property, food and SaaS brands. Open one to scroll the full page.", image: WEB[0].thumb, showcase: WEB, action: "Browse the websites" },
  { id: "showcase-dashboard", room: "playground", title: "Dashboards", subtitle: `Web apps / ${DASHBOARD.length} screens`, description: "Workspaces for therapists, coaches, fundraisers and document teams: dense data kept calm and readable.", image: DASHBOARD[0].thumb, showcase: DASHBOARD, action: "Browse the dashboards" },
  { id: "showcase-mobile", room: "playground", title: "Mobile apps", subtitle: `iOS / ${MOBILE.length} apps`, description: "App concepts across fintech, health, travel, media and commerce. More shots live on Dribbble.", image: MOBILE[5].thumb, showcase: MOBILE, action: "More on Dribbble", href: DRIBBBLE, external: true },
];
