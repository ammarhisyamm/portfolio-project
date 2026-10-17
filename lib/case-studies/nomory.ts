import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

const P = "/case-studies/nomory";

export const nomory: CaseStudy = {
  slug: "nomory", title: "Nomory", published: true, featured: true, featured_order: -2,
  year: "2026", category: "Mobile web app - Food diary", industry: "Consumer lifestyle", platform: "Installable web app (PWA)", project_status: "Live",
  short_description: "A private food diary that turns everyday meal photos into memories worth returning to.",
  hero_headline: "Making everyday meals easier to remember.",
  hero_description: "Nomory keeps the story around a meal, not only the photo: when it happened, where, what it cost and why it mattered. Capture takes a photo and a name; everything else is optional and comes back later through a calendar, a memory archive and search.",
  hero_image: `${P}/hero.webp`, hero_image_alt: "Nomory screens showing the daily diary with a streak, a meal memory and the calendar of meal photos",
  thumbnail: `${P}/hero.webp`, thumbnail_alt: "Nomory food diary screens",
  client: "Independent product", role: "Product designer and builder", timeline: "September 2026", scope: "UX - UI - Interaction design - Front end", team: "Solo", project_type: "Consumer product",
  blocks: [
    block("OVERVIEW", "At a glance", "Lighter than a log, more useful than a camera roll.", "", {
      cards: [
        { label: "Problem", title: "Food photos lose their story", body: "Meal photos sit between receipts and screenshots. A month later nobody remembers where it was, who was there or what it cost." },
        { label: "Approach", title: "Photo first, details later", body: "Save a meal in two taps, add context only if you want, then get it back through a calendar, an archive and search." },
        { label: "My role", title: "End to end", body: "Problem framing, UX, UI, motion and the front end, including local-first storage and optional cloud sync, across 144 commits." },
        { label: "Outcome", title: "Live and installable", body: "Live at nomory.site as an installable web app. It works without an account; signing in syncs memories across devices." },
      ],
    }),
    block("CONTEXT", "The opportunity", "We photograph food all the time, and almost never look again.", "A camera roll is a great place to collect meal photos and a poor place to remember them. Calorie trackers ask for too much and frame food as a number. Nomory sits in between: a personal diary where the meal is a small memory, not a data entry."),
    block("COMPARE_SLIDER", "Before and after", "From a camera roll to a diary.", "Drag across the screen. On the left, meal photos lost among screenshots and receipts; on the right, the same day in Nomory.", {
      media: media(`${P}/before-camera-roll.webp`, `${P}/screen-today.webp`),
      labels: ["Before: camera roll", "After: Nomory"],
      layout: "phone",
      alt_text: "A cluttered photo gallery with meal photos mixed with screenshots, compared with the Nomory daily diary",
      caption: "The before state is recreated for illustration. The after state is the live product with sample data.",
    }),
    block("AFFINITY_BOARD", "Research", "Framing the problem on a wall of notes.", "I started by writing down what goes wrong between taking a meal photo and wanting it back later, then sorted the notes. Notes marked as assumptions are still to be validated with people who keep food diaries.", {
      notes: [
        { theme: "The context disappears", color: "coral", notes: ["Where was this pasta?", "Who was there?", "What did it cost?", "The photo keeps the plate, not the moment"], insight: "The valuable part of a meal memory is the context, and that is what a gallery drops." },
        { theme: "Logging feels like homework", color: "yellow", notes: ["Calorie apps frame food as a number", "Long forms get skipped after a week", "Assumption: one required field is the limit", "Capture happens at the table, one-handed"], insight: "Capture must be faster than the moment passes; detail has to be optional." },
        { theme: "Recall needs a way in", color: "blue", notes: ["People remember by day, not by file name", "Search by place or dish, not by date", "Scrolling the camera roll is the only index", "Seeing a streak is a reason to open the app"], insight: "Give several doors back in: a day, a place, a dish." },
        { theme: "It is personal", color: "sage", notes: ["Food photos are private by default", "Assumption: people try it before signing up", "Sync should be a choice, not a gate"], insight: "Local first, account optional, nothing public." },
      ],
      caption: "Problem framing board. Notes are observations and working assumptions; the assumptions are flagged for validation.",
    }),
    block("INSIGHTS", "Key insights", "What the board turned into.", "", {
      cards: [
        { title: "Photo first, details later", body: "The only required step is the photo. Date and time are filled in for you; a name is enough to save." },
        { title: "Memories, not entries", body: "The photo leads every screen. Metadata stays one level down, so browsing feels like an album, not a spreadsheet." },
        { title: "Many ways back", body: "Today, Calendar, Memories and Search each answer a different recall question: what now, which day, what happened, where was that." },
        { title: "Private until you choose", body: "It works locally with no account. Signing in only adds sync across devices." },
      ],
    }),
    block("PROBLEM_STATEMENT", "How might we", "How might we make saving a meal faster than the moment passes, and make finding it again feel like opening a photo album?", "Two moments mattered equally: a capture with almost no friction, and a recall that rewards people for having captured."),
    block("COMPETITOR_ANALYSIS", "Landscape", "Between a gallery and a tracker.", "", {
      cards: [
        { label: "Photo galleries", title: "Effortless, but contextless", body: "Everything is captured, nothing is organised. Meals are mixed with screenshots and receipts." },
        { label: "Calorie trackers", title: "Structured, but clinical", body: "Rich logging, framed around nutrition targets. Too much effort for people who only want to remember." },
        { label: "Journaling apps", title: "Flexible, but blank", body: "A blank page asks people to write. Food rarely gets more than a photo." },
        { label: "Nomory", title: "A diary built for meals", body: "Photo-first capture, optional context, and recall by day, archive or search." },
      ],
    }),
    block("COMPARE_SLIDER", "Wireframe to interface", "The diary started as a sketch.", "The first sketch fixed the order: a greeting, the streak, then today's meals, with one add button that is always reachable. The shipped screen kept the same order.", {
      media: media(`${P}/wire-today.webp`, `${P}/screen-today.webp`),
      labels: ["Lo-fi sketch", "Final"],
      layout: "phone",
      alt_text: "A hand-drawn wireframe of the Nomory daily diary compared with the final screen",
      caption: "Lo-fi structure redrawn for this case study, overlaid on the shipped screen.",
    }),
    block("FLOW_PLAYER", "Key flow", "From photo to memory, step by step.", "Capture first, then find it again. It plays on its own; hover to pause, or pick a step.", {
      layout: "phone",
      steps: [
        { title: "Start with a photo", description: "The intro sets the promise: no calorie counting, no long forms.", image: `${P}/onboarding-1.webp`, alt: "Nomory onboarding screen titled Start with a photo" },
        { title: "Open the diary", description: "A greeting, the streak, and today's meals.", image: `${P}/screen-today.webp`, alt: "Nomory daily diary with a four-day streak and today's meals" },
        { title: "Add a meal", description: "Take a photo or pick one. Date and time are saved for you.", image: `${P}/screen-add.webp`, alt: "Add a meal sheet with Take a photo and Choose from gallery" },
        { title: "Add what matters", description: "A name is enough. Menu items, price, place and notes are optional.", image: `${P}/screen-form.webp`, alt: "Meal details form with photo preview, meal title and optional fields" },
        { title: "A memory, not a record", description: "The photo leads; date, price, rating, place and note sit below.", image: `${P}/screen-meal.webp`, alt: "Meal detail for tomato basil pasta with date, price, rating, note and location" },
        { title: "Find it by day", description: "The calendar shows each day by the meals you had.", image: `${P}/screen-calendar.webp`, alt: "Calendar with meal photo thumbnails on each day" },
        { title: "Browse the archive", description: "Every meal grouped by day, with a summary of what you saved.", image: `${P}/screen-memories.webp`, alt: "Memories archive grouped by day with meals saved and total spent" },
        { title: "Or just search", description: "By dish, note or place.", image: `${P}/screen-search.webp`, alt: "Search screen with a field for meal name, note or location" },
      ],
    }),
    block("DESIGN_DIRECTION", "Design decisions", "Small choices that keep it light.", "", {
      cards: [
        { title: "One required field", body: "Only a photo and a name are needed to save. Date and time are filled in automatically, so the form never blocks capture." },
        { title: "A streak that encourages", body: "The weekly streak sits at the top of the diary as a quiet reason to come back, not a penalty for missing a day." },
        { title: "Memories that flip", body: "Memory cards open with a shared-element flip, so revisiting a meal feels like picking up a photo, not opening a record." },
        { title: "Local first, sync optional", body: "Meals are stored on the device without an account. Signing in reconciles local memories into the cloud and keeps devices in step." },
      ],
    }),
    block("SCREEN_GALLERY", "Final design", "Onboarding and the profile.", "", {
      layout: "phone",
      media: media(`${P}/onboarding-1.webp`, `${P}/onboarding-2.webp`, `${P}/onboarding-3.webp`, `${P}/screen-profile.webp`),
      steps: [
        { title: "Capture", image: "", alt: "Onboarding step one: start with a photo" },
        { title: "Remember", image: "", alt: "Onboarding step two: your meals find their place, organised by day" },
        { title: "Look back", image: "", alt: "Onboarding step three: come back to what mattered" },
        { title: "Profile and saved meals", image: "", alt: "Profile screen with a grid of saved meals" },
      ],
      caption: "All screens use sample data.",
    }),
    block("METRIC_HIGHLIGHT", "By the numbers", "Built and refined in one month.", "Project facts from the repository. Usage metrics are not claimed here.", {
      metrics: [
        { value: "144", label: "Commits in September 2026" },
        { value: "1", label: "Required field to save a meal" },
        { value: "4", label: "Ways back in: Today, Calendar, Memories, Search" },
        { value: "0", label: "Accounts needed to start" },
      ],
    }),
    block("OUTCOME", "Outcome", "A live diary with a complete capture-to-recall loop.", "Nomory is live at nomory.site as an installable web app. It can be used locally without an account, and signed-in users sync memories across devices.", { supporting_text: "Next, I want to measure whether saved meals lead to return visits over 7 and 30 days, and which optional details people actually fill in." }),
    block("REFLECTION", "Reflection", "The smallest details may be the reason someone returns.", "The temptation with a diary is to ask for more fields. Every iteration went the other way: fewer required steps and richer ways back in. The next step is to test which optional prompts improve recall without slowing capture."),
  ],
};
