import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

const P = "/case-studies/synqra";

export const synqra: CaseStudy = {
  slug: "synqra", title: "Turning review meetings into work a team finishes", published: true, featured: true, featured_order: -4,
  year: "2026", category: "Synqra · Internal review and feedback platform", industry: "Internal tools", platform: "Web app and marketing site", project_status: "Pilot",
  short_description: "One place for an IT team to log review meetings, turn feedback into owned tasks and see every revision through to done.",
  hero_headline: "",
  hero_description: "Review feedback at our internal IT team lived in Word notes, Excel trackers, Drive folders and group chats, so revisions surfaced late and nobody could trace who owned what. Synqra turns meeting notes into assigned review items, then tracks them on one board until they are finished.",
  hero_image: `${P}/cover.mp4`, hero_image_alt: "A walkthrough of Synqra: meeting notes become four AI-extracted review items, which are created as tasks and appear on the board, with the Synqra website on mobile alongside",
  thumbnail: `${P}/cover-poster.webp`, cover_video: `${P}/cover.mp4`, thumbnail_alt: "A walkthrough of Synqra: meeting notes become four AI-extracted review items, which are created as tasks and appear on the board, with the Synqra website on mobile alongside",
  live_url: "https://synqra-eight.vercel.app/website",
  client: "Serba Mulia, internal IT team", role: "Product researcher and business analyst", timeline: "May 2026 to now", scope: "Research - Validation - PRD - UX flows - Front end", team: "Two people, with Erlangga Dermawan (product designer)", project_type: "Internal B2B tool",
  blocks: [
    block("OVERVIEW", "At a glance", "From scattered notes to one source of truth.", "", {
      cards: [
        { label: "Problem", title: "Feedback gets lost", body: "Review results were written in different formats and stored in different places, so revisions were found late and follow-ups slipped." },
        { label: "Approach", title: "Notes become owned tasks", body: "Write meeting notes from a template, let the AI pull out review items, then assign an owner, priority and due date in one pass." },
        { label: "My role", title: "Research to requirements", body: "Validated the current review workflow, compared tools, wrote the PRD and defined the flows and success metrics, then built the front end." },
        { label: "Outcome", title: "In pilot", body: "Running as a pilot with the internal IT team since May 2026, with a public product site. Success targets are set for the first three months." },
      ],
    }),
    block("RESULT_SHOWCASE", "The result", "The finished product, screen by screen.", "The dashboard on desktop and the marketing site on mobile. How it got here follows below.", {
      layout: "desktop",
      steps: [
        { title: "Overview: what needs attention today", image: `${P}/overview.webp`, alt: "Synqra overview with reviews that need attention, meetings, stage progress and a project summary" },
        { title: "Start a meeting from a template", image: `${P}/meeting-templates.webp`, alt: "New meeting screen with eight note templates such as meeting notes, daily standup and client review" },
        { title: "AI review: check items before they become tasks", image: `${P}/ai-review.webp`, alt: "AI review listing extracted action items grouped by assignee with severity, status and due date" },
        { title: "Board across five review stages", image: `${P}/board.webp`, alt: "Kanban board with Planning, Review, In Progress and Final columns of review items" },
        { title: "Task detail with owner and schedule", image: `${P}/task-detail.webp`, alt: "Task drawer with status, phase, priority, team, assignee, reporter and dates" },
        { title: "Meetings and their action items", image: `${P}/meetings.webp`, alt: "Meetings list with the selected meeting's notes and action items grouped by person" },
        { title: "Reports across projects", image: `${P}/reports.webp`, alt: "Reports page with project health, on-track and at-risk counts and task overview" },
        { title: "Website: hero", image: `${P}/website.webp`, alt: "Synqra marketing site hero: Turn meeting notes into work your team finishes" },
        { title: "Website on mobile", image: `${P}/mobile-website.webp`, frame: "phone", alt: "Synqra marketing site hero on a phone" },
        { title: "Website: from note to done", image: `${P}/mobile-flow.webp`, frame: "phone", alt: "Mobile site section showing a meeting note flowing through five stages" },
      ],
      caption: "All screens use sample data for a fictional project.",
    }),
    block("CONTEXT", "The opportunity", "Every review ended in a document nobody could find.", "Our IT team runs review meetings for every release. The decisions were sound, but the documentation was not: there was no standard format, feedback was written wherever was closest, and the follow-up lived in someone's memory. When a revision surfaced late, nobody could tell which meeting it came from or who had agreed to fix it."),
    block("COMPARE_SLIDER", "Before and after", "From four tools to one board.", "Drag across the screen. On the left, a typical review cycle spread across a Word document, an Excel tracker, a Drive folder and a group chat; on the right, the same work in Synqra.", {
      media: media(`${P}/before-scattered.webp`, `${P}/board.webp`),
      labels: ["Before: scattered", "After: one board"],
      layout: "desktop",
      alt_text: "Overlapping Word notes, an Excel tracker with broken cells, a Drive folder of duplicate files and a chat asking who owns what, compared with the Synqra board",
      caption: "The before state is recreated for illustration from the tools the team used. The after state is the product with sample data.",
    }),
    block("AFFINITY_BOARD", "Validation", "Checking the problem before choosing a solution.", "To make sure the problem was real and not an assumption, I walked through the current documentation flow with the team and sorted what we found. Three root causes came out of it.", {
      notes: [
        { theme: "No standard format", color: "yellow", notes: ["Review results written in Word or Excel, whichever was open", "Every note taker had their own structure", "Action items mixed into discussion text", "No fields for owner or due date"], insight: "Documentation was not standardised, so it could not be tracked." },
        { theme: "Storage is scattered", color: "blue", notes: ["Files spread between Google Drive and local folders", "Several 'final' versions of the same notes", "Follow-ups asked and answered in chat", "No single place to check status"], insight: "Information never lived in one source." },
        { theme: "History is untraceable", color: "coral", notes: ["Hard to find which meeting a revision came from", "Changes to feedback were not recorded", "Hard to evaluate the process later", "Progress per action item was hard to see"], insight: "Without a history, the team could not learn from past reviews." },
        { theme: "What it costs", color: "sage", notes: ["Revisions discovered late", "Rework from feedback that was missed", "Unpredictable revision cycles delay projects", "Less transparency between teams"], insight: "The cost shows up as rework and late delivery, not as a missing document." },
      ],
      caption: "Findings from validating the review workflow with the internal IT team, grouped into the three root causes from the project deck and their impact.",
    }),
    block("INSIGHTS", "Key insights", "What the validation changed.", "", {
      cards: [
        { title: "Structure at the moment of writing", body: "Templates give every meeting the same shape, so notes are consistent before anyone thinks about tracking." },
        { title: "Extraction, not data entry", body: "People will not retype notes into a tracker. The system should pull review items out of the notes they already write." },
        { title: "An owner and a date, always", body: "A review item without a PIC and a deadline is just a remark. Assignment happens in the same step as extraction." },
        { title: "History by default", body: "Every item keeps its source meeting and its status changes, so the team can trace and evaluate later." },
      ],
    }),
    block("PROBLEM_STATEMENT", "How might we", "How might we turn every review meeting into owned, trackable work, without asking the team to keep a second document?", "The constraint mattered most: anything that added work after the meeting would be skipped within a week."),
    block("COMPETITOR_ANALYSIS", "Landscape", "Learning from the tools the team already knew.", "", {
      cards: [
        { label: "Notion", title: "Flexible, but blank", body: "Works for docs, databases or simple notes on desktop and mobile. That flexibility means each team has to design its own structure and workflow first." },
        { label: "ClickUp", title: "Complete, but heavy", body: "Strong task management, and its AI can turn meeting notes into tasks. New users face many options, and the AI is limited without a paid plan." },
        { label: "Word, Excel and Drive", title: "Familiar, but disconnected", body: "Everyone already uses them, but notes, trackers and files never link up, and status lives in chat." },
        { label: "Synqra", title: "Opinionated and focused", body: "Built only for review meetings: templates, AI extraction, owners and a five-stage board, with nothing to configure first." },
      ],
    }),
    block("EVOLUTION", "Process", "Four stages, from requirements to evaluation.", "The project follows the plan in the deck. Tap a stage to see what it produced.", {
      layout: "desktop",
      steps: [
        { title: "Planning", description: "Identified the division's needs, set the system scope and wrote the PRD.", image: `${P}/before-scattered.webp`, alt: "The scattered review tools the requirements started from" },
        { title: "Design", description: "Validated the current workflow, mapped the review flow and confirmed what users needed.", image: `${P}/meeting-templates.webp`, alt: "Meeting templates that standardise how reviews are written" },
        { title: "Implementation", description: "Turned the validated flow into screens, a prototype and a working dashboard.", image: `${P}/board.webp`, alt: "The Synqra board in the working product" },
        { title: "Evaluation", description: "Measure the pilot against the targets and decide what the next iteration fixes.", image: `${P}/reports.webp`, alt: "Reports used to monitor project health during the pilot" },
      ],
      caption: "Evaluation is ongoing; the pilot started in May 2026.",
    }),
    block("FLOW_PLAYER", "Key flow", "From meeting notes to the board.", "The core loop in five steps. It plays on its own; hover to pause, or pick a step.", {
      layout: "desktop",
      steps: [
        { title: "Write the notes", description: "Start from a template and write decisions and follow-ups as usual.", image: `${P}/meeting-notes.webp`, alt: "Meeting editor with client feedback, approvals and follow-ups written in the notes" },
        { title: "Let the AI read them", description: "One click sends the notes for extraction of tasks, owners and priorities.", image: `${P}/ai-extracting.webp`, alt: "Extracting action items state while the AI analyses the meeting notes" },
        { title: "Review before saving", description: "Check each item, its assignee, severity and due date, and untick anything wrong.", image: `${P}/ai-review.webp`, alt: "AI review with four extracted items grouped by assignee" },
        { title: "Create in one pass", description: "Selected items become tasks linked to the meeting they came from.", image: `${P}/tasks-created.webp`, alt: "Confirmation that four tasks were created from the meeting" },
        { title: "Track to done", description: "New items land on the board with an owner, a priority and a date.", image: `${P}/board.webp`, alt: "Board showing the newly created review items in Planning" },
      ],
    }),
    block("DESIGN_DIRECTION", "Design decisions", "Calm software for a team with a lot going on.", "", {
      cards: [
        { title: "The AI suggests, people decide", body: "Extracted items always pass through a review screen. Nothing reaches the board until someone confirms the owner and the date." },
        { title: "Attention before everything else", body: "The overview opens on blockers and overdue items, so the first thing anyone sees is what needs them." },
        { title: "Five stages, no custom setup", body: "Planning, Review, In Progress, Final and Completed match how the team already talks about revisions." },
        { title: "Quiet visual system", body: "A grey canvas, a white workspace, one navy action colour and semantic colour only for state, so priority stands out." },
      ],
    }),
    block("METRIC_HIGHLIGHT", "Success targets", "What the pilot is measured against.", "Targets for the first three months, not results yet. They are logged automatically from submit times, status changes and resolution history, then checked by the project owner and the manager.", {
      metrics: [
        { value: ">60%", label: "Target: reviews logged before execution starts, up from under 20%" },
        { value: "−40%", label: "Target: unplanned revision cycles, from 100% down to 60%" },
        { value: "4 / 5", label: "Target: reviewer satisfaction score" },
        { value: "3 months", label: "Pilot window before the first evaluation" },
      ],
    }),
    block("OUTCOME", "Outcome", "A working review loop, live as a pilot.", "Synqra runs with meeting templates, AI extraction of review items, a five-stage board, task details with owners and dates, reports across projects and a public product site. Next steps from the deck: make Synqra the standard place to record reviews, update the meeting and handover SOP, and monitor weekly with the project owner and monthly with the manager.", { supporting_text: "The biggest risk is the team drifting back to manual notes. The mitigation is to make Synqra the required source of review data and to watch adoption every week." }),
    block("REFLECTION", "Reflection", "Validate the habit before automating it.", "The most useful work happened before any screen: proving that the problem was format, storage and history, not a lack of tools. That made the product narrow on purpose. The open question for the pilot is whether extraction saves enough time that the team stops keeping its own notes on the side."),
  ],
};
