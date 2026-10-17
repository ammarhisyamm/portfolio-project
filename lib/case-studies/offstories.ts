import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

const P = "/case-studies/offstories";

export const offstories: CaseStudy = {
  slug: "offstories", title: "One calm place to plan a wedding together", published: true, featured: true, featured_order: -3,
  year: "2026", category: "OffStories · Wedding planning web app", industry: "Consumer lifestyle", platform: "Web, desktop and mobile", project_status: "Live",
  short_description: "A calm, shared workspace where Indonesian couples plan their wedding together instead of across spreadsheets and group chats.",
  hero_headline: "",
  hero_description: "OffStories brings the checklist, budget, vendors, guests, timeline and notes into one workspace for two. A short guided setup turns a few answers into a first plan that already understands akad, resepsi, adat and Rupiah.",
  hero_image: `${P}/cover.mp4`, hero_image_alt: "A walkthrough of OffStories: the seven-question smart setup on desktop, then the dashboard, checklist and budget, with the mobile app alongside",
  thumbnail: `${P}/cover-poster.webp`, cover_video: `${P}/cover.mp4`, thumbnail_alt: "A walkthrough of OffStories: the seven-question smart setup on desktop, then the dashboard, checklist and budget, with the mobile app alongside",
  client: "Independent product", role: "Product designer and builder", timeline: "June to October 2026", scope: "Research - UX - UI - Onboarding - Front end", team: "Solo", project_type: "Collaborative web app",
  blocks: [
    block("OVERVIEW", "At a glance", "A planner that knows how an Indonesian wedding works.", "", {
      cards: [
        { label: "Problem", title: "Planning is scattered", body: "Budgets live in spreadsheets, decisions in family group chats, quotes in DMs. One partner ends up relaying everything." },
        { label: "Approach", title: "One shared workspace", body: "Checklist, budget, vendors, guests and timeline in one place, opened by a seven-question setup that drafts the first plan." },
        { label: "My role", title: "End to end", body: "Desk research, information architecture, onboarding, interface design and the front end, across 215 commits." },
        { label: "Outcome", title: "Live and free", body: "Live at offstories.fun with partner invites, RSVP links, a public invitation page and an English and Indonesian interface." },
      ],
    }),
    block("CONTEXT", "The opportunity", "Couples plan for months, with tools that were never built for it.", "A typical Indonesian wedding has two ceremonies, two families, a few hundred guests and a budget in the hundreds of millions of Rupiah. Most couples run it from a spreadsheet and a WhatsApp group, and the spreadsheet is always one version behind the chat."),
    block("COMPARE_SLIDER", "Before and after", "From five places to one.", "Drag across the screen. On the left is the planning stack most couples already use; on the right is the same wedding inside OffStories.", {
      media: media(`${P}/before-scattered.webp`, `${P}/dashboard.webp`),
      labels: ["Before: scattered", "After: one workspace"],
      layout: "desktop",
      alt_text: "A budget spreadsheet with broken totals and a busy family group chat, compared with the OffStories dashboard",
      caption: "The before state is recreated for illustration from common planning tools. The after state is the live product with sample data.",
    }),
    block("AFFINITY_BOARD", "Research", "Desk research, sorted into four themes.", "I started with what a planning tool would need to know: what an Indonesian wedding actually costs, which ceremonies it includes, and where the coordination breaks. Each note is a finding; the board sorts them the way I did.", {
      notes: [
        { theme: "Information lives everywhere", color: "coral", notes: ["Budget in a spreadsheet, decisions in a group chat", "Three versions of the guest list", "Vendor quotes buried in DMs and PDFs", "One partner becomes the family messenger"], insight: "The gap is not another tool. It is one shared source of truth." },
        { theme: "Indonesian weddings have their own shape", color: "yellow", notes: ["Akad and resepsi can be on different days", "8 adat traditions, each with its own prosesi", "Seserahan is its own shopping list and budget", "KUA is free in office hours, paid outside them"], insight: "Generic planners skip the steps couples worry about most." },
        { theme: "Money is the anxiety", color: "sage", notes: ["Catering runs Rp20k to Rp150k per guest", "200 guests often lands near Rp150 to 250 million", "Catering is about 40% of the budget, venue about 25%", "Dates before Ramadan book up first", "Families often split costs per side"], insight: "Couples need a realistic number on day one, before talking to a vendor." },
        { theme: "Starting is the hardest part", color: "blue", notes: ["A long generic checklist feels like homework", "Nobody knows what to do first", "Setup forms ask for things not decided yet"], insight: "Ask a few questions, then hand back a plan instead of an empty canvas." },
      ],
      caption: "Notes combine desk research (wedding pricing for 2024 to 2025 across 12 cities, adat processions) with observations of how couples coordinate today. The pricing became the setup's budget defaults.",
    }),
    block("INSIGHTS", "Key insights", "What the research changed.", "", {
      cards: [
        { title: "Shared, not forwarded", body: "Both partners need their own login to the same plan, so nobody has to relay updates between families." },
        { title: "Local knowledge is the feature", body: "Akad, resepsi, adat processions, seserahan and KUA belong in the defaults, not in a notes field." },
        { title: "A number calms people down", body: "A per-city, per-guest estimate gives couples a realistic budget before the first vendor call." },
        { title: "Momentum beats completeness", body: "Showing one next best step does more for a stressed couple than a list of every task." },
      ],
    }),
    block("PROBLEM_STATEMENT", "How might we", "How might we give two people, and their families, one calm place that already knows how an Indonesian wedding works?", "Calm was the design principle: every screen should lower the temperature of a stressful project, not add another dashboard to worry about."),
    block("COMPETITOR_ANALYSIS", "Landscape", "Where existing options fall short.", "", {
      cards: [
        { label: "Spreadsheets and chats", title: "Flexible, but fragile", body: "Free and familiar, but there is no structure, no shared state, and totals break the moment someone edits a copy." },
        { label: "Wedding marketplaces", title: "Built for discovery", body: "Great for finding vendors and inspiration, not for running your own plan, budget and guest list." },
        { label: "Global planners", title: "Polished, but foreign", body: "Strong checklists and budgets, designed around Western ceremonies, USD and a single wedding day." },
        { label: "OffStories", title: "Private and local", body: "A shared workspace for two, with Indonesian ceremonies, adat and Rupiah built into the first plan." },
      ],
    }),
    block("COMPARE_SLIDER", "Wireframe to interface", "The dashboard started as boxes on paper.", "The first sketch fixed the hierarchy before any styling: the date first, four health numbers, then one suggestion. The final design kept that order almost exactly.", {
      media: media(`${P}/wire-dashboard.webp`, `${P}/dashboard.webp`),
      labels: ["Lo-fi sketch", "Final"],
      layout: "desktop",
      alt_text: "A hand-drawn wireframe of the dashboard compared with the final OffStories dashboard",
      caption: "Lo-fi structure redrawn for this case study, overlaid on the shipped dashboard.",
    }),
    block("FLOW_PLAYER", "Key flow", "Smart Wedding Setup: seven questions to a first plan.", "Couples choose between a blank canvas and a guided setup. Each answer returns a short planning note, so the form feels like talking to a planner. It plays on its own; hover to pause, or pick a step.", {
      layout: "desktop",
      steps: [
        { title: "Choose a start", description: "A blank canvas, or a guided setup that drafts the plan for you.", image: `${P}/setup-0.webp`, alt: "OffStories setup asking how the couple would like to start, with Blank canvas and Smart Wedding Setup options" },
        { title: "Names and date", description: "Only the two things every plan needs before the questions start.", image: `${P}/setup-1.webp`, alt: "Setup form with both partners' names and the akad date" },
        { title: "City and venue", description: "Each answer returns a practical note: what it means and what to do next.", image: `${P}/setup-2.webp`, alt: "Location question with Jakarta selected and planning notes about the city and venue type" },
        { title: "Guests per side", description: "Split by family, so catering, venue capacity and RSVPs are planned correctly.", image: `${P}/setup-3.webp`, alt: "Guest count slider at 250 guests split 125 and 125 between both families" },
        { title: "Wedding style", description: "Traditional, modern, intimate, outdoor or destination, with what each choice implies.", image: `${P}/setup-4.webp`, alt: "Wedding style options with Traditional Wedding selected and a planning note" },
        { title: "Plan ready", description: "A summary and budget estimate. The timeline, checklist and budget lines are already created.", image: `${P}/setup-5.webp`, alt: "Plan ready screen with a wedding summary and a Rp250,000,000 budget estimate" },
        { title: "The workspace", description: "The dashboard opens with a countdown and the next best step.", image: `${P}/dashboard.webp`, alt: "OffStories dashboard with countdown, progress, budget, vendors and guests" },
      ],
    }),
    block("DESIGN_DIRECTION", "Design decisions", "Five decisions that shaped the product.", "", {
      cards: [
        { title: "Answers come back as advice", body: "Every setup question returns a planning note with a next step. The setup grew from five to seven questions after research, and each one earns its place by giving something back." },
        { title: "A countdown, then one next step", body: "The dashboard leads with the date and a single suggested action, not the full checklist. Detail is one click away." },
        { title: "Two accounts, one workspace", body: "A partner joins by email invite as an editor with their own login. No shared passwords, and nobody is the messenger." },
        { title: "Local by default", body: "Rupiah, akad and resepsi dates, adat processions, a seserahan tracker, KUA tasks and an Indonesian language switch." },
        { title: "Calm over alarming", body: "Warm off-white surfaces, soft gradients and quiet type. Colour is saved for money that is paid, committed or due." },
      ],
    }),
    block("SCREEN_GALLERY", "Final design", "The rest of the workspace.", "", {
      layout: "desktop",
      media: media(`${P}/checklist.webp`, `${P}/budget.webp`, `${P}/guests.webp`, `${P}/timeline.webp`),
      steps: [
        { title: "Checklist with progress per category", image: "", alt: "Master checklist with progress by category and tasks marked done" },
        { title: "Budget: paid, committed, remaining", image: "", alt: "Budget tracker with paid, committed and remaining totals" },
        { title: "Guests with RSVP and side", image: "", alt: "Guest list with invited, confirmed, pending and declined counts" },
        { title: "Timeline and milestones", image: "", alt: "Timeline with milestones by month" },
      ],
      caption: "All screens use sample data for a fictional couple.",
    }),
    block("SCREEN_GALLERY", "On mobile", "The same plan, in your pocket.", "Most updates happen on the go, between vendor visits and family calls, so every screen is built mobile-first.", {
      layout: "phone",
      media: media(`${P}/mobile-dashboard.webp`, `${P}/mobile-checklist.webp`, `${P}/mobile-budget.webp`, `${P}/mobile-guests.webp`),
      steps: [
        { title: "Dashboard", image: "", alt: "Mobile dashboard with the countdown and planning progress" },
        { title: "Checklist", image: "", alt: "Mobile checklist with progress by category" },
        { title: "Budget", image: "", alt: "Mobile budget tracker with paid, committed and remaining totals" },
        { title: "Guests", image: "", alt: "Mobile guest list with RSVP counts" },
      ],
    }),
    block("METRIC_HIGHLIGHT", "By the numbers", "Built and shipped, then refined.", "Project facts from the repository. Usage metrics are not claimed here.", {
      metrics: [
        { value: "215", label: "Commits from June to October 2026" },
        { value: "7", label: "Setup questions, up from 5 after research" },
        { value: "12", label: "Cities with local per-guest pricing" },
        { value: "8", label: "Adat traditions with their processions" },
      ],
    }),
    block("OUTCOME", "Outcome", "A live, free workspace for two.", "OffStories is live at offstories.fun. Couples can run the smart setup, invite a partner, send RSVP links, publish an invitation page, track gifts and export their data.", { supporting_text: "Next, I want to measure setup completion, partner invite acceptance and weekly active workspaces, and interview couples who finish their wedding inside the product." }),
    block("REFLECTION", "Reflection", "Localisation is a product decision, not a translation.", "The biggest improvement did not come from the interface. It came from encoding how Indonesian weddings really work into the defaults. The trade-off was a longer setup, which I offset by making every question return something useful. The next step is to test that trade-off with real couples."),
  ],
};
