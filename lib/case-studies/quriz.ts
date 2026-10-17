import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

const P = "/case-studies/quriz";

export const quriz: CaseStudy = {
  slug: "quriz", title: "Quran practice in two minutes a day", published: true, featured: true, featured_order: -1,
  year: "2026", category: "Quriz · Quran practice web app", industry: "Education", platform: "Mobile web", project_status: "Live",
  short_description: "Short daily Quran quizzes with streaks, XP and a path back to every mistake, redesigned three times in five weeks.",
  hero_headline: "",
  hero_description: "Quriz turns Quran practice into short quizzes: match an ayah to its translation, find the ayah from a translation, continue a verse or guess the surah. Streaks and XP bring people back; a review path turns mistakes into the next session.",
  hero_image: `${P}/cover.mp4`, hero_image_alt: "A walkthrough of Quriz on mobile: home, choosing a surah, answering a quiz question, progress and badges",
  thumbnail: `${P}/cover-poster.webp`, cover_video: `${P}/cover.mp4`, thumbnail_alt: "A walkthrough of Quriz on mobile: home, choosing a surah, answering a quiz question, progress and badges",
  client: "Independent product", role: "Product designer and builder", timeline: "September to October 2026", scope: "UX - UI - Illustration direction - Front end", team: "Solo", project_type: "Learning product",
  blocks: [
    block("OVERVIEW", "At a glance", "A two-minute habit, not a course.", "", {
      cards: [
        { label: "Problem", title: "Practice has no daily shape", body: "Quran apps are excellent for reading and listening, but there is rarely a small, repeatable way to check what you remember." },
        { label: "Approach", title: "Short quizzes, real feedback", body: "Four quiz modes by juz or surah, ayah audio, streaks and XP, and a one-tap review of every wrong answer." },
        { label: "My role", title: "End to end", body: "Product framing, UX, UI, illustration direction for the game world, and the front end, across 143 commits." },
        { label: "Outcome", title: "Live, three iterations", body: "Live at quriz.online. The interface went from a flat system to a painted game world in five weeks." },
      ],
    }),
    block("CONTEXT", "The opportunity", "Good intentions, no small next step.", "Many people want to stay close to the Quran every day, but the available tools ask for a big commitment: read a whole page, follow a course, memorise a surah. Quriz asks for two minutes and a few taps, then shows what to practise next."),
    block("AFFINITY_BOARD", "Research", "Framing the problem on a wall of notes.", "Before designing screens I grouped what I knew and what I assumed about daily practice. Notes marked as assumptions are the ones the product still needs to validate.", {
      notes: [
        { theme: "Motivation fades fast", color: "yellow", notes: ["Daily intention, weekly reality", "Big goals like khatam feel far away", "Assumption: missing a day should not feel like failure", "Progress needs to be visible in one glance"], insight: "Make the daily unit tiny, and make showing up feel good." },
        { theme: "Practice needs formats", color: "blue", notes: ["Ayah to translation checks understanding", "Translation to ayah trains recognition", "Guess the surah builds a mental map", "Pick a juz or surah, not a syllabus", "Hearing the ayah helps recall"], insight: "Several short formats keep practice fresh without new content." },
        { theme: "Respect for the text", color: "sage", notes: ["Arabic must render right to left, properly", "No fake progress or invented levels", "No locked surahs, everything is open", "Game feel must not trivialise the text"], insight: "Playful around the content, never playful with it." },
        { theme: "Mistakes are the lesson", color: "coral", notes: ["A score ends a quiz, a mistake starts the next one", "Review missed questions in one tap", "Show the right answer with its translation"], insight: "The most valuable screen is the one after a wrong answer." },
      ],
      caption: "Problem framing board. Notes are observations and working assumptions; the assumptions are flagged for validation with learners.",
    }),
    block("INSIGHTS", "Key insights", "Four principles for the practice loop.", "", {
      cards: [
        { title: "One obvious next action", body: "Home leads with a single Mulai latihan button and the last session, so starting never takes a decision." },
        { title: "Consistency over intensity", body: "A weekly strip rewards showing up. A streak is shown as encouragement, not as a debt." },
        { title: "Honest progress", body: "Surah stars count distinct verses answered correctly in finished sessions. Repeats do not inflate them, and nothing is locked." },
        { title: "Close the loop", body: "Wrong answers get their own path back, so the next session starts where the last one went wrong." },
      ],
    }),
    block("PROBLEM_STATEMENT", "How might we", "How might we make Quran practice short enough to do every day, and rewarding enough to come back tomorrow, without turning the text into a game?", "The tension between playful and respectful drove every visual iteration that followed."),
    block("COMPETITOR_ANALYSIS", "Landscape", "Learning from adjacent products.", "", {
      cards: [
        { label: "Quran readers", title: "Reading and listening", body: "Apps such as Quran.com and Muslim Pro are excellent references with audio and translations. Self-testing is not their focus." },
        { label: "Habit learning apps", title: "The loop to borrow", body: "The Duolingo pattern of short lessons, streaks and XP proves that small daily units bring people back." },
        { label: "Memorisation tools", title: "Deep, but demanding", body: "Built for hafalan with long sessions. Valuable, but heavier than a two-minute daily check." },
        { label: "Quriz", title: "Daily self-testing", body: "Short quizzes on any juz or surah, with audio, honest progress and a review path for mistakes." },
      ],
    }),
    block("COMPARE_SLIDER", "Wireframe to interface", "The home screen, as a sketch and as shipped.", "The structure held through every visual pass: consistency first, one big start button, then the last session to practise again.", {
      media: media(`${P}/wire-home.webp`, `${P}/v3-home.webp`),
      labels: ["Lo-fi sketch", "Final"],
      layout: "phone",
      alt_text: "A hand-drawn wireframe of the Quriz home screen compared with the final painted home screen",
      caption: "Lo-fi structure redrawn for this case study, overlaid on the shipped home screen.",
    }),
    block("EVOLUTION", "Iterations", "Three visual directions in five weeks.", "Same account, same data, three versions of the app rebuilt from the repository history. Tap a version to compare.", {
      layout: "phone",
      steps: [
        { title: "16 Sept: Playful Navy", description: "A clean, flat system to prove the quiz loop. Clear, but it felt like any other study app.", image: `${P}/v1-home.webp`, alt: "First Quriz home screen in a flat navy and white style" },
        { title: "22 Sept: Illustrated sky", description: "An illustrated mosque and sky wallpaper added warmth and identity while the cards stayed flat.", image: `${P}/v2-home.webp`, alt: "Second Quriz home screen with an illustrated sky and mosque background" },
        { title: "14 Oct: Painted game world", description: "One painted world across every screen: framed panels, painted icons and gold selection states.", image: `${P}/v3-home.webp`, alt: "Current Quriz home screen in a painted game-world style with framed panels" },
      ],
      caption: "Screens rendered from three commits in the Quriz repository with identical sample data.",
    }),
    block("COMPARE_SLIDER", "Before and after", "The profile, from a settings page to a trophy shelf.", "Badges moved from a list into a framed collection, and the stats became rewards to look at rather than numbers to read.", {
      media: media(`${P}/v1-profile.webp`, `${P}/v3-profile.webp`),
      labels: ["16 Sept", "14 Oct"],
      layout: "phone",
      alt_text: "The first Quriz profile screen compared with the painted profile with badge frames",
    }),
    block("FLOW_PLAYER", "Key flow", "The practice loop, step by step.", "From home to a finished session and back again. It plays on its own; hover to pause, or pick a step.", {
      layout: "phone",
      steps: [
        { title: "Start from home", description: "Consistency and one big button. The last session sits right below it.", image: `${P}/v3-home.webp`, alt: "Quriz home with weekly consistency strip and Mulai latihan button" },
        { title: "Pick a juz or surah", description: "Two choices, plus a shortcut to the last practice.", image: `${P}/v3-setup.webp`, alt: "Mulai latihan sheet with Juz and Surah options" },
        { title: "Answer and listen", description: "Arabic text right to left, the translation, and ayah audio.", image: `${P}/v3-quiz.webp`, alt: "Quiz question asking which surah an ayah comes from, with audio and answer options" },
        { title: "See your momentum", description: "XP, minutes and every session, each with a Latih lagi shortcut.", image: `${P}/v3-progress.webp`, alt: "Progress screen with total points, minutes and recent sessions" },
        { title: "Collect badges", description: "Milestones as framed badges that are easy to browse.", image: `${P}/v3-badges.webp`, alt: "Profile achievements with framed badges" },
      ],
    }),
    block("DESIGN_DIRECTION", "Design decisions", "What makes it feel like play, and still feel right.", "", {
      cards: [
        { title: "Play around the text", body: "Painted frames, scrolls and medallions decorate the interface. The ayah itself always sits on a calm paper panel." },
        { title: "Accessible game states", body: "Selection uses one gold state everywhere; correct and wrong answers keep explicit success and error semantics, not colour alone." },
        { title: "Physical, tappable buttons", body: "56px pill buttons with a visible bottom edge, cream labels and white icon silhouettes that keep contrast when disabled." },
        { title: "Arabic done properly", body: "Surah names and ayahs are isolated as right-to-left Arabic, so mixed Indonesian and Arabic lines never scramble." },
      ],
    }),
    block("METRIC_HIGHLIGHT", "By the numbers", "Five weeks of iteration.", "Project facts from the repository. Usage metrics are not claimed here.", {
      metrics: [
        { value: "143", label: "Commits from September to October 2026" },
        { value: "3", label: "Visual directions shipped" },
        { value: "4", label: "Quiz modes" },
        { value: "114", label: "Surahs open from day one" },
      ],
    }),
    block("OUTCOME", "Outcome", "A live practice loop from question to review.", "Quriz is live at quriz.online with Google sign-in, four quiz modes, ayah audio, a consistency calendar, badges and a review path for wrong answers.", { supporting_text: "Next, I want to measure repeat practice within a week, how often people use the mistake review, and whether the painted direction changes either." }),
    block("REFLECTION", "Reflection", "Ship the loop first, then give it a world.", "Proving the quiz loop in a plain system made the later visual work safer: every redesign kept the same structure and changed only how it felt. The next question is whether the game world improves return visits, which is something to test rather than assume."),
  ],
};
