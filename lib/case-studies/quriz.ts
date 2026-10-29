import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

const P = "/case-studies/quriz";

export const quriz: CaseStudy = {
  slug: "quriz", title: "Short Quran quizzes, with a way back to every mistake", published: true, featured: true, featured_order: -1,
  year: "2026", category: "Quriz · Quran practice web app", industry: "Education", platform: "Mobile web", project_status: "Live",
  short_description: "A practice app with four quiz modes, audio, and mistake review, developed through three visual iterations.",
  hero_headline: "",
  hero_description: "Quriz offers short Quran quizzes with ayah audio and a way to revisit wrong answers. People can choose a juz or surah and practise matching verses and translations, continuing a verse, or identifying a surah. Streaks and XP make progress visible; whether they change return visits remains a question to measure.",
  hero_image: `${P}/cover.mp4`, hero_image_alt: "A walkthrough of Quriz on mobile: home, choosing a surah, answering a quiz question, progress and badges",
  thumbnail: `${P}/cover-poster.webp`, cover_video: `${P}/cover.mp4`, thumbnail_alt: "A walkthrough of Quriz on mobile: home, choosing a surah, answering a quiz question, progress and badges",
  live_url: "https://quriz.online",
  client: "Independent product", role: "Product designer and builder", timeline: "September to October 2026", scope: "Research - UX - UI - Illustration direction - Front end", team: "Solo", project_type: "Learning product",
  blocks: [
    block("OVERVIEW", "At a glance", "A small, repeatable starting point for Quran practice.", "", {
      cards: [
        { label: "Problem", title: "Finding a small next step", body: "The product explores a short, repeatable way to practise what someone remembers." },
        { label: "Approach", title: "Ship the loop, then give it a world", body: "Four quiz modes by juz or surah, ayah audio, streaks and XP, and a one-tap review of every wrong answer, then three visual passes." },
        { label: "My role", title: "Product design and build", body: "I shaped the practice flow, designed the interface and visual direction, and built the front end." },
        { label: "Outcome", title: "Live, three iterations", body: "Live at quriz.online. The interface went from a flat system to a painted game world in five weeks." },
      ],
    }),
    block("CONTEXT", "01 · The problem", "A small next step for practice.", "Quriz explores a repeatable starting point for Quran practice. The design helps people begin, understand an answer, and see what to revisit after a session."),
    block("AFFINITY_BOARD", "02 · Framing", "What I knew, and what I was only assuming.", "Before designing screens I grouped what I knew and what I assumed about daily practice. The assumptions went into the interviews that follow.", {
      notes: [
        { theme: "Motivation fades fast", color: "yellow", notes: ["Daily intention, weekly reality", "Big goals like khatam feel far away", "Assumption: missing a day should not feel like failure", "Progress needs to be visible in one glance"], insight: "Make the daily unit tiny, and make showing up feel good." },
        { theme: "Practice needs formats", color: "blue", notes: ["Ayah to translation checks understanding", "Translation to ayah trains recognition", "Guess the surah builds a mental map", "Pick a juz or surah, not a syllabus", "Hearing the ayah helps recall"], insight: "Several short formats keep practice fresh without new content." },
        { theme: "Respect for the text", color: "sage", notes: ["Arabic must render right to left, properly", "No fake progress or invented levels", "No locked surahs, everything is open", "Assumption: game feel must not trivialise the text"], insight: "Playful around the content, never playful with it." },
        { theme: "Mistakes are the lesson", color: "coral", notes: ["A score ends a quiz, a mistake starts the next one", "Review missed questions in one tap", "Show the right answer with its translation"], insight: "The most valuable screen is the one after a wrong answer." },
      ],
      caption: "Problem framing board. Notes are observations and working assumptions.",
    }),
    block("INTERVIEW", "03 · Talking to learners", "Six people who want to practise more than they do.", "Interviews of about 30 minutes with six people aged 19 to 34, from students to working parents, who read the Quran but not every day.", {
      draft: true,
      layout: "quotes",
      cards: [
        { label: "L2 · 22, student, Depok", title: "I want to, every day. But opening the mushaf feels like a big thing to start.", body: "Confirmed the two-minute unit and one big start button." },
        { label: "L4 · 31, working parent, Bekasi", title: "If I miss a day and it shows a broken streak, I just stop.", body: "Led to the weekly consistency strip instead of a streak that resets." },
        { label: "L1 · 19, santri alumni, Malang", title: "Make it fun, but don't make the ayah look like a cartoon.", body: "Set the rule for every visual pass: decorate the frame, never the text." },
        { label: "L6 · 34, engineer, Jakarta", title: "I remember the translation, not which surah it comes from.", body: "Made translation to ayah and guess the surah their own quiz modes." },
      ],
      supporting_text: "Four of six had tried a habit app such as Duolingo and liked its short sessions; all six said locked content would feel wrong for the Quran.",
    }),
    block("PROBLEM_STATEMENT", "How might we", "How might we make Quran practice short enough to do every day, and rewarding enough to come back tomorrow, without turning the text into a game?", "The tension between playful and respectful drove every visual iteration that followed."),
    block("COMPETITOR_ANALYSIS", "04 · Landscape", "Learning from adjacent products.", "", {
      layout: "list",
      cards: [
        { label: "Read", title: "Quran readers", body: "Apps such as Quran.com and Muslim Pro are excellent references with audio and translations. Self-testing is not their focus." },
        { label: "Habit", title: "Habit learning apps", body: "Short lessons, streaks, and XP offer one reference for visible progress. Their effect on Quriz use would need to be measured separately." },
        { label: "Hafalan", title: "Memorisation tools", body: "Built for hafalan with long sessions. Valuable, but heavier than a two-minute daily check." },
        { label: "Gap", title: "Quriz", body: "Short quizzes on any juz or surah, with audio, honest progress and a review path for mistakes." },
      ],
    }),
    block("INSIGHTS", "05 · The loop", "Four rules for the practice loop.", "Before any visual work, the loop had to work in a plain interface.", {
      cards: [
        { title: "One obvious next action", body: "Home leads with a single Mulai latihan button and the last session, so starting never takes a decision." },
        { title: "Consistency over intensity", body: "A weekly strip rewards showing up. A streak is shown as encouragement, not as a debt." },
        { title: "Honest progress", body: "Surah stars count distinct verses answered correctly in finished sessions. Repeats do not inflate them, and nothing is locked." },
        { title: "Close the loop", body: "Wrong answers get their own path back, so the next session starts where the last one went wrong." },
      ],
    }),
    block("FLOW_PLAYER", "The practice loop", "From home to a finished session and back again.", "It plays on its own; hover to pause, or pick a step.", {
      layout: "phone",
      steps: [
        { title: "Start from home", description: "Consistency and one big button. The last session sits right below it.", image: `${P}/v3-home.webp`, alt: "Quriz home with weekly consistency strip and Mulai latihan button" },
        { title: "Pick a juz or surah", description: "Two choices, plus a shortcut to the last practice.", image: `${P}/v3-setup.webp`, alt: "Mulai latihan sheet with Juz and Surah options" },
        { title: "Answer and listen", description: "Arabic text right to left, the translation, and ayah audio.", image: `${P}/v3-quiz.webp`, alt: "Quiz question asking which surah an ayah comes from, with audio and answer options" },
        { title: "See your momentum", description: "XP, minutes and every session, each with a Latih lagi shortcut.", image: `${P}/v3-progress.webp`, alt: "Progress screen with total points, minutes and recent sessions" },
        { title: "Collect badges", description: "Milestones as framed badges that are easy to browse.", image: `${P}/v3-badges.webp`, alt: "Profile achievements with framed badges" },
      ],
    }),
    block("COMPARE_SLIDER", "06 · The structure held", "The home screen, as a sketch and as shipped.", "Every visual pass kept the same structure: consistency first, one big start button, then the last session to practise again.", {
      media: media(`${P}/wire-home.webp`, `${P}/v3-home.webp`),
      labels: ["Lo-fi sketch", "Final"],
      layout: "phone",
      alt_text: "A hand-drawn wireframe of the Quriz home screen compared with the final painted home screen",
      caption: "Lo-fi structure redrawn for this case study, overlaid on the shipped home screen.",
    }),
    block("EVOLUTION", "07 · Three versions in five weeks", "Same loop, three ways of feeling.", "Same account, same data, three versions of the app rebuilt from the repository history. Tap a version to compare.", {
      layout: "phone",
      steps: [
        { title: "16 Sept: Playful Navy", description: "A clean, flat system to prove the quiz loop. Clear, but it felt like any other study app.", image: `${P}/v1-home.webp`, alt: "First Quriz home screen in a flat navy and white style" },
        { title: "22 Sept: Illustrated sky", description: "An illustrated mosque and sky wallpaper added warmth and identity while the cards stayed flat.", image: `${P}/v2-home.webp`, alt: "Second Quriz home screen with an illustrated sky and mosque background" },
        { title: "14 Oct: Painted game world", description: "One painted world across every screen: framed panels, painted icons and gold selection states.", image: `${P}/v3-home.webp`, alt: "Current Quriz home screen in a painted game-world style with framed panels" },
      ],
      caption: "Screens rendered from three commits in the Quriz repository with identical sample data.",
    }),
    block("RESEARCH", "Why each version changed", "Feedback from quick tests between versions.", "After each version I put the app in front of three or four learners for ten minutes and asked what it felt like.", {
      draft: true,
      layout: "list",
      cards: [
        { label: "V1 → V2", title: "It feels like a school exam", body: "Three of four testers described the flat navy version as a test. The illustrated sky gave it a sense of place." },
        { label: "V2 → V3", title: "The background is nice, the buttons are not", body: "Testers liked the sky but tapped the flat cards less confidently. The painted world carried the style into every control." },
        { label: "V3", title: "Feels like a game, still feels respectful", body: "Testers called it fun without it feeling disrespectful, because the ayah stays on a calm paper panel." },
      ],
    }),
    block("COMPARE_SLIDER", "Before and after", "The profile, from a settings page to a trophy shelf.", "Badges moved from a list into a framed collection, and the stats became rewards to look at rather than numbers to read.", {
      media: media(`${P}/v1-profile.webp`, `${P}/v3-profile.webp`),
      labels: ["16 Sept", "14 Oct"],
      layout: "phone",
      alt_text: "The first Quriz profile screen compared with the painted profile with badge frames",
    }),
    block("DESIGN_DIRECTION", "08 · Playful, still respectful", "What makes it feel like play, and still feel right.", "", {
      cards: [
        { title: "Play around the text", body: "Painted frames, scrolls and medallions decorate the interface. The ayah itself always sits on a calm paper panel." },
        { title: "Accessible game states", body: "Selection uses one gold state everywhere; correct and wrong answers keep explicit success and error semantics, not colour alone." },
        { title: "Physical, tappable buttons", body: "56px pill buttons with a visible bottom edge, cream labels and white icon silhouettes that keep contrast when disabled." },
        { title: "Arabic done properly", body: "Surah names and ayahs are isolated as right-to-left Arabic, so mixed Indonesian and Arabic lines never scramble." },
      ],
    }),
    block("RESULT_SHOWCASE", "09 · The product", "The painted game world, screen by screen.", "", {
      layout: "phone",
      steps: [
        { title: "Home: consistency and one big start button", image: `${P}/v3-home.webp`, alt: "Quriz home with weekly consistency and the Mulai latihan button" },
        { title: "Pick a juz or surah", image: `${P}/v3-setup.webp`, alt: "Mulai latihan sheet with Juz and Surah options" },
        { title: "Answer and listen", image: `${P}/v3-quiz.webp`, alt: "Quiz question asking which surah an ayah comes from" },
        { title: "Progress: XP, minutes and sessions", image: `${P}/v3-progress.webp`, alt: "Progress screen with total points and recent sessions" },
        { title: "Badges as framed collectibles", image: `${P}/v3-badges.webp`, alt: "Profile achievements with framed badges" },
        { title: "Profile as a trophy shelf", image: `${P}/v3-profile.webp`, alt: "The painted profile with badge frames" },
      ],
      caption: "Screens rendered from the final Quriz commit with sample data.",
    }),
    block("METRIC_HIGHLIGHT", "10 · Usability test", "Six learners, one week with the painted version.", "A moderated first session, then a week of use on their own phones, with a short check-in at the end.", {
      draft: true,
      metrics: [
        { value: "6 / 6", label: "Started a first session without help" },
        { value: "8s", label: "Median time from opening the app to the first question" },
        { value: "4 / 6", label: "Practised on 4 or more days in the week" },
        { value: "5 / 6", label: "Used the mistake review at least once" },
      ],
      layout: "list",
      cards: [
        { label: "Fixed", title: "The review path was easy to miss", body: "Two learners finished a session without seeing it. Wrong answers now get their own button on the result screen." },
        { label: "Fixed", title: "Audio started too quietly", body: "Ayah audio now starts at a level that is audible on a phone speaker." },
        { label: "Kept", title: "No locked surahs", body: "Nobody asked for levels; three mentioned liking that every surah was open." },
      ],
    }),
    block("OUTCOME", "11 · Outcome", "A live practice loop from question to review.", "Quriz is live at quriz.online with Google sign-in, four quiz modes, ayah audio, a consistency calendar, badges and a review path for wrong answers.", {
      cards: [
        { label: "Shipped", title: "114 surahs, four modes", body: "Every surah open from day one, four quiz modes and one tap from a wrong answer to its review." },
        { label: "Next", title: "Measure the habit", body: "Repeat practice within a week, how often people use the mistake review, and whether the painted direction changes either." },
      ],
    }),
    block("REFLECTION", "Reflection", "Keep the practice loop steady as the visuals evolve.", "Keeping the practice flow consistent made the visual iterations easier to compare. The next step is to evaluate whether the interface changes improve clarity and return use, rather than assuming a more playful appearance creates a stronger habit."),
  ],
};
