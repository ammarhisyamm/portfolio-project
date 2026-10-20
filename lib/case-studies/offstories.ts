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
  live_url: "https://offstories.fun",
  client: "Independent product", role: "Product designer and builder", timeline: "June to October 2026", scope: "Research - UX - UI - Onboarding - Front end", team: "Solo", project_type: "Collaborative web app",
  blocks: [
    block("OVERVIEW", "At a glance", "A planner that knows how an Indonesian wedding works.", "", {
      cards: [
        { label: "Problem", title: "Planning is scattered", body: "Budgets live in spreadsheets, decisions in family group chats, quotes in DMs. One partner ends up relaying everything." },
        { label: "Approach", title: "One shared workspace", body: "Checklist, budget, vendors, guests and timeline in one place, opened by a seven-question setup that drafts the first plan." },
        { label: "My role", title: "End to end", body: "Desk research, interviews, information architecture, onboarding and interface design, then I built the front end myself." },
        { label: "Outcome", title: "Live and free", body: "Live at offstories.fun with partner invites, RSVP links, a public invitation page and an English and Indonesian interface." },
      ],
    }),
    block("COMPARE_SLIDER", "01 · The problem", "Five places, one wedding.", "A typical Indonesian wedding has two ceremonies, two families, a few hundred guests and a budget in the hundreds of millions of Rupiah. Most couples run it from a spreadsheet and a WhatsApp group, and the spreadsheet is always one version behind the chat. Drag across the screen to see the same wedding inside OffStories.", {
      media: media(`${P}/before-scattered.webp`, `${P}/dashboard.webp`),
      labels: ["Before: scattered", "After: one workspace"],
      layout: "desktop",
      alt_text: "A budget spreadsheet with broken totals and a busy family group chat, compared with the OffStories dashboard",
      caption: "The before state is recreated for illustration from common planning tools. The after state is the live product with sample data.",
    }),
    block("AFFINITY_BOARD", "02 · Desk research", "What a planning tool would need to know.", "I started with the facts a planner can't fake: what an Indonesian wedding actually costs, which ceremonies it includes, and where the coordination breaks. Each note is a finding; the board sorts them the way I did.", {
      notes: [
        { theme: "Information lives everywhere", color: "coral", notes: ["Budget in a spreadsheet, decisions in a group chat", "Three versions of the guest list", "Vendor quotes buried in DMs and PDFs", "One partner becomes the family messenger"], insight: "The gap is not another tool. It is one shared source of truth." },
        { theme: "Indonesian weddings have their own shape", color: "yellow", notes: ["Akad and resepsi can be on different days", "8 adat traditions, each with its own prosesi", "Seserahan is its own shopping list and budget", "KUA is free in office hours, paid outside them"], insight: "Generic planners skip the steps couples worry about most." },
        { theme: "Money is the anxiety", color: "sage", notes: ["Catering runs Rp20k to Rp150k per guest", "200 guests often lands near Rp150 to 250 million", "Catering is about 40% of the budget, venue about 25%", "Dates before Ramadan book up first", "Families often split costs per side"], insight: "Couples need a realistic number on day one, before talking to a vendor." },
        { theme: "Starting is the hardest part", color: "blue", notes: ["A long generic checklist feels like homework", "Nobody knows what to do first", "Setup forms ask for things not decided yet"], insight: "Ask a few questions, then hand back a plan instead of an empty canvas." },
      ],
      caption: "Desk research on wedding pricing for 2024 to 2025 across 12 cities and on adat processions. The pricing became the setup's budget defaults.",
    }),
    block("INTERVIEW", "03 · Talking to couples", "Six couples, and the same sentence again and again.", "I interviewed six couples who were planning, or had just finished, a wedding in Jakarta, Bandung and Surabaya. Each session was 30 to 45 minutes, walking through the tools they used and the last thing that went wrong.", {
      draft: true,
      layout: "quotes",
      cards: [
        { label: "Couple 2 · Bride, Jakarta, 8 months out", title: "I'm not planning a wedding, I'm forwarding messages between my mum and his mum.", body: "Led to two accounts on one workspace, so nobody has to be the messenger." },
        { label: "Couple 4 · Groom, Bandung, 3 months out", title: "We had a budget in Excel, but nobody trusted the total anymore.", body: "Led to paid, committed and remaining as the only three money states." },
        { label: "Couple 1 · Bride, Surabaya, married in March", title: "The apps I tried kept asking about a bridal shower. We needed seserahan and the KUA.", body: "Confirmed that local ceremonies belong in the defaults, not in a notes field." },
        { label: "Couple 5 · Groom, Jakarta, 11 months out", title: "I didn't need every task. I needed to know what to do this week.", body: "Led to the dashboard's single next best step." },
      ],
      supporting_text: "Five of the six couples kept their main plan in a spreadsheet; all six coordinated decisions in WhatsApp groups with family.",
    }),
    block("INSIGHTS", "From research to principles", "What the research changed.", "", {
      cards: [
        { title: "Shared, not forwarded", body: "Both partners need their own login to the same plan, so nobody has to relay updates between families." },
        { title: "Local knowledge is the feature", body: "Akad, resepsi, adat processions, seserahan and KUA belong in the defaults, not in a notes field." },
        { title: "A number calms people down", body: "A per-city, per-guest estimate gives couples a realistic budget before the first vendor call." },
        { title: "Momentum beats completeness", body: "Showing one next best step does more for a stressed couple than a list of every task." },
      ],
    }),
    block("PROBLEM_STATEMENT", "The principle", "How might we give two people, and their families, one calm place that already knows how an Indonesian wedding works?", "Calm became the test for every screen: it should lower the temperature of a stressful project, not add another dashboard to worry about."),
    block("COMPETITOR_ANALYSIS", "04 · Landscape", "Where existing options fall short.", "", {
      layout: "list",
      cards: [
        { label: "Sheets", title: "Spreadsheets and chats", body: "Free and familiar, but there is no structure, no shared state, and totals break the moment someone edits a copy." },
        { label: "Market", title: "Wedding marketplaces", body: "Great for finding vendors and inspiration, not for running your own plan, budget and guest list." },
        { label: "Global", title: "International planners", body: "Strong checklists and budgets, designed around Western ceremonies, USD and a single wedding day." },
        { label: "Gap", title: "OffStories", body: "A private workspace for two, with Indonesian ceremonies, adat and Rupiah built into the first plan." },
      ],
    }),
    block("FLOW_PLAYER", "05 · The first five minutes", "Seven questions to a first plan.", "Research said starting was the hardest part, so onboarding got the most design time. Couples choose between a blank canvas and a guided setup, and every answer returns a short planning note, so the form feels like talking to a planner. It plays on its own; hover to pause, or pick a step.", {
      layout: "desktop",
      steps: [
        { title: "Choose a start", description: "A blank canvas, or a guided setup that drafts the plan for you.", image: `${P}/setup-0.webp`, alt: "OffStories setup asking how the couple would like to start, with Blank canvas and Smart Wedding Setup options" },
        { title: "Names and date", description: "Only the two things every plan needs before the questions start.", image: `${P}/setup-1.webp`, alt: "Setup form with both partners' names and the akad date" },
        { title: "City and venue", description: "Each answer returns a practical note: what it means and what to do next.", image: `${P}/setup-2.webp`, alt: "Location question with Jakarta selected and planning notes about the city and venue type" },
        { title: "Guests per side", description: "Split by family, so catering, venue capacity and RSVPs are planned correctly.", image: `${P}/setup-3.webp`, alt: "Guest count slider at 250 guests split 125 and 125 between both families" },
        { title: "Wedding style", description: "Traditional, modern, intimate, outdoor or destination, with what each choice implies.", image: `${P}/setup-4.webp`, alt: "Wedding style options with Traditional Wedding selected and a planning note" },
        { title: "Plan ready", description: "A summary and budget estimate. The timeline, checklist and budget lines are already created.", image: `${P}/setup-5.webp`, alt: "Plan ready screen with a wedding summary and a Rp250,000,000 budget estimate" },
      ],
    }),
    block("COMPARE_SLIDER", "06 · The dashboard", "Date first, then one next step.", "The first sketch fixed the hierarchy before any styling: the date, four health numbers, then one suggestion. The full checklist is one click away, never the first thing a couple sees. The final design kept that order almost exactly.", {
      media: media(`${P}/wire-dashboard.webp`, `${P}/dashboard.webp`),
      labels: ["Lo-fi sketch", "Final"],
      layout: "desktop",
      alt_text: "A hand-drawn wireframe of the dashboard compared with the final OffStories dashboard",
      caption: "Lo-fi structure redrawn for this case study, overlaid on the shipped dashboard.",
    }),
    block("DESIGN_DIRECTION", "07 · Decisions", "Four calls that shaped the rest of the product.", "", {
      cards: [
        { title: "Answers come back as advice", body: "Every setup question returns a planning note with a next step. The setup grew from five to seven questions after research, and each one earns its place by giving something back." },
        { title: "Two accounts, one workspace", body: "A partner joins by email invite as an editor with their own login. No shared passwords, and nobody is the messenger." },
        { title: "Local by default", body: "Rupiah, akad and resepsi dates, adat processions, a seserahan tracker, KUA tasks and an Indonesian language switch." },
        { title: "Calm over alarming", body: "Warm off-white surfaces, soft gradients and quiet type. Colour is saved for money that is paid, committed or due." },
      ],
    }),
    block("RESULT_SHOWCASE", "08 · The product", "The workspace, screen by screen.", "Built mobile-first, because most updates happen between vendor visits and family calls.", {
      layout: "desktop",
      steps: [
        { title: "Dashboard: countdown and the next best step", image: `${P}/dashboard.webp`, alt: "OffStories dashboard with countdown, progress, budget, vendors and guests" },
        { title: "Budget: paid, committed, remaining", image: `${P}/budget.webp`, alt: "Budget tracker with paid, committed and remaining totals" },
        { title: "Checklist with progress per category", image: `${P}/checklist.webp`, alt: "Master checklist with progress by category and tasks marked done" },
        { title: "Guests with RSVP and side", image: `${P}/guests.webp`, alt: "Guest list with invited, confirmed, pending and declined counts" },
        { title: "Timeline and milestones", image: `${P}/timeline.webp`, alt: "Timeline with milestones by month" },
        { title: "Mobile: dashboard", image: `${P}/mobile-dashboard.webp`, frame: "phone", alt: "Mobile dashboard with the countdown and planning progress" },
        { title: "Mobile: checklist", image: `${P}/mobile-checklist.webp`, frame: "phone", alt: "Mobile checklist with progress by category" },
        { title: "Mobile: budget", image: `${P}/mobile-budget.webp`, frame: "phone", alt: "Mobile budget tracker with paid, committed and remaining totals" },
        { title: "Mobile: guests", image: `${P}/mobile-guests.webp`, frame: "phone", alt: "Mobile guest list with RSVP counts" },
      ],
      caption: "All screens use sample data for a fictional couple.",
    }),
    block("METRIC_HIGHLIGHT", "09 · Usability test", "Five couples, from first visit to a first plan.", "Moderated remote sessions with five couples who had not seen the product. Each couple ran the setup, invited their partner and answered three questions from the dashboard.", {
      draft: true,
      metrics: [
        { value: "5 / 5", label: "Finished the smart setup without help" },
        { value: "4m 30s", label: "Median time from first screen to plan ready" },
        { value: "3 / 5", label: "Found the partner invite on the first try, before the fix below" },
        { value: "78", label: "System Usability Scale score, above the 68 average" },
      ],
      layout: "list",
      cards: [
        { label: "Fixed", title: "The partner invite was hidden in settings", body: "Two couples looked for it on the dashboard. It now appears on the plan ready screen and as the first next step." },
        { label: "Fixed", title: "Committed money read as paid", body: "Three people added up committed and paid. Committed now has its own colour and a one-line explanation." },
        { label: "Kept", title: "Seven questions felt short", body: "Nobody asked to skip a question, because every answer returned a note. The longer setup stayed." },
      ],
    }),
    block("OUTCOME", "10 · Outcome", "A live, free workspace for two.", "OffStories is live at offstories.fun. Couples can run the smart setup, invite a partner, send RSVP links, publish an invitation page, track gifts and export their data.", {
      cards: [
        { label: "Research in the defaults", title: "12 cities, 8 adat traditions", body: "Per-guest pricing for 12 cities and the processions of 8 adat traditions are built into the first plan." },
        { label: "Next", title: "Measure the real thing", body: "Track setup completion, partner invite acceptance and weekly active workspaces, then interview couples who finish their wedding inside the product." },
      ],
    }),
    block("REFLECTION", "Reflection", "Localisation is a product decision, not a translation.", "The biggest improvement did not come from the interface. It came from encoding how Indonesian weddings really work into the defaults. The trade-off was a longer setup, which I offset by making every question return something useful, and the usability test was the first real check of that trade-off."),
  ],
};
