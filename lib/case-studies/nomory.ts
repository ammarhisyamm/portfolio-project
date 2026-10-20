import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

const P = "/case-studies/nomory";

export const nomory: CaseStudy = {
  slug: "nomory", title: "Turning food photos into memories worth revisiting", published: true, featured: true, featured_order: -2,
  year: "2026", category: "Nomory · Food diary web app", industry: "Consumer lifestyle", platform: "Installable web app (PWA)", project_status: "Live",
  short_description: "A private food diary that turns everyday meal photos into memories worth returning to.",
  hero_headline: "",
  hero_description: "Nomory keeps the story around a meal, not only the photo: when it happened, where, what it cost and why it mattered. Capture takes a photo and a name; everything else is optional and comes back later through a calendar, a memory archive and search.",
  hero_image: `${P}/cover.mp4`, hero_image_alt: "A walkthrough of Nomory on mobile: onboarding, the daily diary, adding a meal, the meal memory, calendar, archive and search",
  thumbnail: `${P}/cover-poster.webp`, cover_video: `${P}/cover.mp4`, thumbnail_alt: "A walkthrough of Nomory on mobile: onboarding, the daily diary, adding a meal, the meal memory, calendar, archive and search",
  live_url: "https://nomory.site",
  client: "Independent product", role: "Product designer and builder", timeline: "September 2026", scope: "Research - UX - UI - Interaction design - Front end", team: "Solo", project_type: "Consumer product",
  blocks: [
    block("OVERVIEW", "At a glance", "Lighter than a log, more useful than a camera roll.", "", {
      cards: [
        { label: "Problem", title: "Food photos lose their story", body: "Meal photos sit between receipts and screenshots. A month later nobody remembers where it was, who was there or what it cost." },
        { label: "Approach", title: "Two halves: capture and recall", body: "Save a meal in two taps, add context only if you want, then get it back through a calendar, an archive and search." },
        { label: "My role", title: "End to end", body: "Problem framing, interviews, UX, UI, motion and the front end, including local-first storage and optional cloud sync." },
        { label: "Outcome", title: "Live and installable", body: "Live at nomory.site as an installable web app. It works without an account; signing in syncs memories across devices." },
      ],
    }),
    block("COMPARE_SLIDER", "01 · The problem", "We photograph food all the time, and almost never look again.", "A camera roll is a great place to collect meal photos and a poor place to remember them. Calorie trackers ask for too much and frame food as a number. Drag across the screen: meal photos lost among screenshots on the left, the same day in Nomory on the right.", {
      media: media(`${P}/before-camera-roll.webp`, `${P}/screen-today.webp`),
      labels: ["Before: camera roll", "After: Nomory"],
      layout: "phone",
      alt_text: "A cluttered photo gallery with meal photos mixed with screenshots, compared with the Nomory daily diary",
      caption: "The before state is recreated for illustration. The after state is the live product with sample data.",
    }),
    block("AFFINITY_BOARD", "02 · Framing", "A wall of notes, and four assumptions to check.", "I wrote down what goes wrong between taking a meal photo and wanting it back later, then sorted the notes. Notes marked as assumptions went into the interviews that follow.", {
      notes: [
        { theme: "The context disappears", color: "coral", notes: ["Where was this pasta?", "Who was there?", "What did it cost?", "The photo keeps the plate, not the moment"], insight: "The valuable part of a meal memory is the context, and that is what a gallery drops." },
        { theme: "Logging feels like homework", color: "yellow", notes: ["Calorie apps frame food as a number", "Long forms get skipped after a week", "Assumption: one required field is the limit", "Capture happens at the table, one-handed"], insight: "Capture must be faster than the moment passes; detail has to be optional." },
        { theme: "Recall needs a way in", color: "blue", notes: ["People remember by day, not by file name", "Assumption: search by place or dish, not by date", "Scrolling the camera roll is the only index", "Seeing a streak is a reason to open the app"], insight: "Give several doors back in: a day, a place, a dish." },
        { theme: "It is personal", color: "sage", notes: ["Food photos are private by default", "Assumption: people try it before signing up", "Sync should be a choice, not a gate"], insight: "Local first, account optional, nothing public." },
      ],
      caption: "Problem framing board. Notes are observations and working assumptions.",
    }),
    block("INTERVIEW", "03 · Checking the assumptions", "Five people who photograph almost every meal.", "Short interviews, 20 to 30 minutes each, starting from their own camera roll: find a meal from last month and tell me about it.", {
      draft: true,
      layout: "quotes",
      cards: [
        { label: "P1 · 24, student, Yogyakarta", title: "I know I ate there with my friends, but I can't remember the name of the place.", body: "Confirmed: place and company matter more than the dish itself." },
        { label: "P3 · 29, product manager, Jakarta", title: "I tried a calorie app for a week. It felt like doing homework at every meal.", body: "Confirmed: one required field, everything else optional." },
        { label: "P4 · 27, content creator, Bandung", title: "I'd search for 'that ramen place', not for a date.", body: "Confirmed search by dish, note and place, next to the calendar." },
        { label: "P5 · 31, designer, Jakarta", title: "If it asks me to sign up first, I'm closing it.", body: "Confirmed: works without an account; sync is an extra." },
      ],
      supporting_text: "All four assumptions held. One did not appear on the board at all: three of five said they would come back to see how much they had spent on eating out, which moved price into the meal form as an optional field.",
    }),
    block("PROBLEM_STATEMENT", "How might we", "How might we make saving a meal faster than the moment passes, and make finding it again feel like opening a photo album?", "Two moments mattered equally, so the design is told in two halves: a capture with almost no friction, and a recall that rewards people for having captured."),
    block("COMPETITOR_ANALYSIS", "04 · Landscape", "Between a gallery and a tracker.", "", {
      cards: [
        { label: "Photo galleries", title: "Effortless, but contextless", body: "Everything is captured, nothing is organised. Meals are mixed with screenshots and receipts." },
        { label: "Calorie trackers", title: "Structured, but clinical", body: "Rich logging, framed around nutrition targets. Too much effort for people who only want to remember." },
        { label: "Journaling apps", title: "Flexible, but blank", body: "A blank page asks people to write. Food rarely gets more than a photo." },
        { label: "Nomory", title: "A diary built for meals", body: "Photo-first capture, optional context, and recall by day, archive or search." },
      ],
    }),
    block("FLOW_PLAYER", "05 · Half one: capture", "From photo to memory in two taps.", "Capture happens at the table, often one-handed, so every step is reachable with a thumb. It plays on its own; hover to pause, or pick a step.", {
      layout: "phone",
      steps: [
        { title: "Start with a photo", description: "The intro sets the promise: no calorie counting, no long forms.", image: `${P}/onboarding-1.webp`, alt: "Nomory onboarding screen titled Start with a photo" },
        { title: "Open the diary", description: "A greeting, the streak, and today's meals.", image: `${P}/screen-today.webp`, alt: "Nomory daily diary with a four-day streak and today's meals" },
        { title: "Add a meal", description: "Take a photo or pick one. Date and time are saved for you.", image: `${P}/screen-add.webp`, alt: "Add a meal sheet with Take a photo and Choose from gallery" },
        { title: "Add what matters", description: "A name is enough. Menu items, price, place and notes are optional.", image: `${P}/screen-form.webp`, alt: "Meal details form with photo preview, meal title and optional fields" },
        { title: "A memory, not a record", description: "The photo leads; date, price, rating, place and note sit below.", image: `${P}/screen-meal.webp`, alt: "Meal detail for tomato basil pasta with date, price, rating, note and location" },
      ],
    }),
    block("DESIGN_DIRECTION", "Capture decisions", "Nothing may block the save.", "", {
      cards: [
        { title: "One required field", body: "Only a photo and a name are needed to save. Date and time are filled in automatically, so the form never blocks capture." },
        { title: "Local first, sync optional", body: "Meals are stored on the device without an account. Signing in reconciles local memories into the cloud and keeps devices in step." },
      ],
    }),
    block("FLOW_PLAYER", "06 · Half two: recall", "Three doors back in.", "Each view answers a different recall question: which day, what happened, where was that.", {
      layout: "phone",
      steps: [
        { title: "Find it by day", description: "The calendar shows each day by the meals you had.", image: `${P}/screen-calendar.webp`, alt: "Calendar with meal photo thumbnails on each day" },
        { title: "Browse the archive", description: "Every meal grouped by day, with a summary of what you saved and spent.", image: `${P}/screen-memories.webp`, alt: "Memories archive grouped by day with meals saved and total spent" },
        { title: "Or just search", description: "By dish, note or place.", image: `${P}/screen-search.webp`, alt: "Search screen with a field for meal name, note or location" },
      ],
    }),
    block("DESIGN_DIRECTION", "Recall decisions", "Make coming back feel like a reward.", "", {
      cards: [
        { title: "A streak that encourages", body: "The weekly streak sits at the top of the diary as a quiet reason to come back, not a penalty for missing a day." },
        { title: "Memories that flip", body: "Memory cards open with a shared-element flip, so revisiting a meal feels like picking up a photo, not opening a record." },
      ],
    }),
    block("COMPARE_SLIDER", "07 · Sketch to screen", "The diary kept its first order.", "The first sketch fixed the order: a greeting, the streak, then today's meals, with one add button that is always reachable. The shipped screen kept the same order.", {
      media: media(`${P}/wire-today.webp`, `${P}/screen-today.webp`),
      labels: ["Lo-fi sketch", "Final"],
      layout: "phone",
      alt_text: "A hand-drawn wireframe of the Nomory daily diary compared with the final screen",
      caption: "Lo-fi structure redrawn for this case study, overlaid on the shipped screen.",
    }),
    block("RESULT_SHOWCASE", "08 · The product", "The diary, screen by screen.", "", {
      layout: "phone",
      steps: [
        { title: "Today: greeting, streak and meals", image: `${P}/screen-today.webp`, alt: "Nomory daily diary with a streak and today's meals" },
        { title: "Add a meal in two taps", image: `${P}/screen-add.webp`, alt: "Add a meal sheet with Take a photo and Choose from library" },
        { title: "A memory, not a record", image: `${P}/screen-meal.webp`, alt: "Meal detail with the photo first and date, price, rating and note below" },
        { title: "Calendar by the meals you had", image: `${P}/screen-calendar.webp`, alt: "Calendar with meal photo thumbnails on each day" },
        { title: "Memories archive", image: `${P}/screen-memories.webp`, alt: "Memories archive grouped by day with a summary" },
        { title: "Search by dish, note or place", image: `${P}/screen-search.webp`, alt: "Search screen with a field for meal name, note or location" },
        { title: "Onboarding: capture", image: `${P}/onboarding-1.webp`, alt: "Onboarding step one: start with a photo" },
        { title: "Onboarding: remember", image: `${P}/onboarding-2.webp`, alt: "Onboarding step two: your meals find their place, organised by day" },
        { title: "Onboarding: look back", image: `${P}/onboarding-3.webp`, alt: "Onboarding step three: come back to what mattered" },
        { title: "Profile and saved meals", image: `${P}/screen-profile.webp`, alt: "Profile screen with a grid of saved meals" },
      ],
      caption: "All screens use sample data.",
    }),
    block("METRIC_HIGHLIGHT", "09 · Usability test", "Five tasks, timed on a real phone.", "Five participants, each on their own phone with the installed app. Two tasks tested capture, three tested recall of meals saved a week earlier.", {
      draft: true,
      metrics: [
        { value: "11s", label: "Median time to save a meal, from tapping add to saved" },
        { value: "5 / 5", label: "Saved a meal without help on the first try" },
        { value: "14 / 15", label: "Recall tasks completed, across calendar, archive and search" },
        { value: "81", label: "System Usability Scale score" },
      ],
      layout: "list",
      cards: [
        { label: "Fixed", title: "Search looked like it only searched names", body: "Two people went to the calendar to find a place. The search hint now says dish, note or place." },
        { label: "Fixed", title: "The price field expected decimals", body: "Rupiah has no cents, so the field now formats thousands as you type." },
        { label: "Kept", title: "The streak", body: "Nobody felt guilty about a broken streak; two said it made them want to open the app." },
      ],
    }),
    block("OUTCOME", "10 · Outcome", "A live diary with a complete capture-to-recall loop.", "Nomory is live at nomory.site as an installable web app. It can be used locally without an account, and signed-in users sync memories across devices.", {
      cards: [
        { label: "Shipped", title: "One required field, four ways back", body: "A photo and a name to save; Today, Calendar, Memories and Search to find it again; no account to start." },
        { label: "Next", title: "Measure return visits", body: "Whether saved meals lead to return visits over 7 and 30 days, and which optional details people actually fill in." },
      ],
    }),
    block("REFLECTION", "Reflection", "The smallest details may be the reason someone returns.", "The temptation with a diary is to ask for more fields. Every iteration went the other way: fewer required steps and richer ways back in. The next step is to test which optional prompts improve recall without slowing capture."),
  ],
};
