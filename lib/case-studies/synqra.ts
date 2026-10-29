import type { CaseStudy } from "@/lib/content";
import { block, media } from "./block";

const P = "/case-studies/synqra";

export const synqra: CaseStudy = {
  slug: "synqra", title: "Turning review meetings into work a team finishes", published: true, featured: true, featured_order: -4,
  year: "2026", category: "Synqra · Kaizen project, internal review tool", industry: "Internal tools", platform: "Web app and marketing site", project_status: "Pilot",
  short_description: "One place for an IT team to log review meetings, turn feedback into owned tasks and see every revision through to done.",
  hero_headline: "",
  hero_description: "Synqra started as a Kaizen improvement project inside Serba Mulia. Review feedback at our IT team lived in Word notes, Excel trackers, Drive folders and group chats, so revisions surfaced late and nobody could trace who owned what. Synqra turns meeting notes into assigned review items, then tracks them on one board until they are finished.",
  hero_image: `${P}/cover.mp4`, hero_image_alt: "A walkthrough of Synqra: meeting notes become four AI-extracted review items, which are created as tasks and appear on the board, with the Synqra website on mobile alongside",
  thumbnail: `${P}/cover-poster.webp`, cover_video: `${P}/cover.mp4`, thumbnail_alt: "A walkthrough of Synqra: meeting notes become four AI-extracted review items, which are created as tasks and appear on the board, with the Synqra website on mobile alongside",
  live_url: "https://synqra-eight.vercel.app/website",
  client: "Serba Mulia, internal Kaizen project", role: "Product designer and researcher", timeline: "May 2026 to now", scope: "Research - Validation - PRD - UX flows - Front end", team: "Two people, with Erlangga Dermawan (product designer)", project_type: "Internal Kaizen project",
  blocks: [
    block("OVERVIEW", "At a glance", "A Kaizen project that became a working tool.", "", {
      cards: [
        { label: "Problem", title: "Review results got lost", body: "Feedback from review meetings was spread across Word, Excel, Drive and chats, so revisions surfaced late and nobody owned them." },
        { label: "Approach", title: "Validate, then stay narrow", body: "Proved the root causes first, then built only the review loop: a meeting template, AI-extracted items checked by a person, one board." },
        { label: "My role", title: "Research to front end", body: "I led the validation, wrote the PRD and designed the UX flows, then worked on the UI and front end with Erlangga Dermawan." },
        { label: "Status", title: "Live as a pilot", body: "Running as a three-month pilot inside the IT team, measured against adoption and revision targets." },
      ],
    }),
    block("TEXT_WITH_MEDIA", "01 · Background", "Every review ended in a document nobody could find.", "Our IT team runs a review meeting for every release. The decisions were sound; the documentation was not. There was no standard for recording review results, so feedback and follow-ups were spread across Word notes, Excel trackers, Drive folders and group chats. When a revision surfaced late, nobody could tell which meeting it came from or who had agreed to fix it.", {
      media: media(`${P}/before-scattered.webp`),
      caption: "One review cycle before Synqra, recreated for illustration from the tools the team used.",
      alt_text: "Overlapping Word notes, an Excel tracker, a Drive folder of duplicate files and a chat asking who owns what",
    }),
    block("CHALLENGE", "Risks to address", "What a shared review record is designed to improve.", "These are potential effects of a fragmented review process and areas for the pilot to evaluate.", {
      layout: "list",
      cards: [
        { title: "Late follow-up", body: "Without a shared place to track actions, a revision may be harder to notice in time." },
        { title: "Repeated work", body: "Feedback that is missed or picked up late can require another pass after work has moved on." },
        { title: "Unclear timing", body: "When follow-up is difficult to track, the timing of revision work can be harder to plan." },
        { title: "Limited history", body: "A consistent record gives the team a basis for reviewing the process over time." },
        { title: "Less visible ownership", body: "Showing each action's owner and status helps the team see what still needs attention." },
      ],
    }),
    block("INTERVIEW", "02 · Problem validation", "Checking the problem before choosing a solution.", "Before deciding what to build, I wanted to know whether this was a real problem or an assumption. I traced how a review result actually travels today, from the meeting to the person who fixes it.", {
      cards: [
        { label: "Method", title: "Workflow walkthrough", body: "Followed recent review results from the meeting notes to the final fix, noting every tool and hand-off along the way." },
        { label: "Method", title: "Conversations with the team", body: "Talked with the people who write review notes, the PICs who act on them and the project owner who chases them." },
        { label: "Method", title: "Document audit", body: "Looked at where review notes were stored, in which formats, and whether owners and due dates were written down at all." },
      ],
    }),
    block("INTERVIEW", "In their words", "What the team told us.", "", {
      draft: true,
      layout: "quotes",
      cards: [
        { label: "PIC, front-end developer", title: "I only find out a revision was mine when someone asks why it isn't done yet.", body: "Every item needs an owner the moment it is written down." },
        { label: "Note taker, QA", title: "Everyone writes the notes their own way, so I rewrite them before sharing.", body: "One template for every review." },
        { label: "Project owner", title: "To know where a project stands, I have to open three files and a chat.", body: "One board and a report across projects." },
      ],
      supporting_text: "From five conversations with note takers, PICs and a project owner during validation.",
    }),
    block("AFFINITY_BOARD", "What we found", "Three root causes, and what they cost.", "I sorted the findings into themes. Three root causes came out of it, plus the impact the team was already feeling.", {
      notes: [
        { theme: "No standard format", color: "yellow", notes: ["Review results written in Word or Excel, whichever was open", "Every note taker had their own structure", "Action items mixed into discussion text", "No fields for owner or due date"], insight: "Documentation was not standardised, so it could not be tracked." },
        { theme: "Storage is scattered", color: "blue", notes: ["Files spread between Google Drive and local folders", "Several 'final' versions of the same notes", "Follow-ups asked and answered in chat", "No single place to check status"], insight: "Information never lived in one source." },
        { theme: "History is untraceable", color: "coral", notes: ["Hard to find which meeting a revision came from", "Changes to feedback were not recorded", "Hard to evaluate the process later", "Progress per action item was hard to see"], insight: "Without a history, the team could not learn from past reviews." },
        { theme: "What it costs", color: "sage", notes: ["Revisions discovered late", "Rework from feedback that was missed", "Unpredictable revision cycles delay projects", "Less transparency between teams"], insight: "The cost shows up as rework and late delivery, not as a missing document." },
      ],
      caption: "Validation findings grouped into the three root causes from the project deck, plus their impact.",
    }),
    block("COMPETITOR_ANALYSIS", "03 · Competitor analysis", "Strong tools, but none built for review follow-up.", "The team already knew Notion and ClickUp. I compared what each would take to solve this problem, then where Synqra sits between them.", {
      cards: [
        { label: "Notion", title: "Flexible, but blank", body: "Works for docs, databases or simple notes, with AI meeting notes and transcription.", image: `${P}/competitor-notion.webp`, pros: ["Can be shaped for documentation, databases or plain notes", "Works on desktop and mobile, so notes can be updated anywhere"], cons: ["The team has to design its own structure, format and workflow first, which takes setup effort"] },
        { label: "ClickUp", title: "Complete, but heavy", body: "Full task management, with meeting notes as docs and an AI that turns them into tasks.", image: `${P}/competitor-clickup.webp`, pros: ["Assignees, deadlines, priority and status in one platform", "AI summarises meeting notes and converts them into tasks"], cons: ["The AI is limited on the free plan and needs a monthly subscription", "So many options and settings that new users take time to learn the workflow"] },
        { label: "Synqra", title: "Narrow on purpose", body: "Only the review loop: a meeting template, AI extraction of review items, a human check, then one five-stage board.", image: `${P}/board.webp`, pros: ["Ready on day one, with no structure to design first", "AI suggestions always pass a person before they become tasks", "Every item keeps the meeting it came from"], cons: ["Another tool to adopt, so it needs the SOP update to stick"] },
      ],
    }),
    block("TEXT_WITH_MEDIA", "04 · Our solution", "One place for the whole review cycle.", "Synqra is a central system where the team records meeting results, manages feedback and tracks follow-up in a structured way. From writing the feedback to assigning a PIC and a deadline to watching it get done, nobody has to switch tools.", {
      media: media(`${P}/overview.webp`),
      caption: "The overview opens on what needs attention: blocked reviews, upcoming meetings and progress per stage.",
      alt_text: "Synqra overview with reviews that need attention, meetings, stage progress and a project summary",
      cards: [
        { label: "Supports", title: "Process documentation", body: "Every review is recorded from the same template." },
        { label: "Supports", title: "Multi-user collaboration", body: "Note takers, PICs and owners work on the same items." },
        { label: "Supports", title: "Feedback and action items", body: "Each point becomes an item with an owner and a date." },
        { label: "Supports", title: "Status and PIC monitoring", body: "One board shows where every item stands and who has it." },
        { label: "Supports", title: "Meeting reminders", body: "Upcoming reviews show on the overview and the calendar." },
        { label: "Supports", title: "History and progress tracking", body: "Items keep their source meeting and every status change." },
      ],
    }),
    block("STAGES", "05 · Implementation stages", "Four stages, from requirements to evaluation.", "", {
      cards: [
        { title: "Planning", body: "Identified the division's needs, set the scope of the system and wrote the PRD." },
        { title: "Design", body: "Validated the current workflow, mapped the review flow and confirmed what users needed." },
        { title: "Implementation", body: "Turned the validated flow into user flows, UI, a prototype and the working dashboard." },
        { label: "Now", title: "Evaluation", body: "Measuring the pilot against its targets and deciding what the next iteration fixes." },
      ],
      caption: "The pilot started in May 2026; evaluation is ongoing.",
    }),
    block("RESULT_SHOWCASE", "06 · Key features", "The product, screen by screen.", "AI-powered meeting notes, feedback history, a log of every meeting, team task collaboration and meeting calendar integration, on desktop, plus the product site on mobile.", {
      layout: "desktop",
      supporting_text: "What it adds up to: all review documentation in one place, clearer real-time progress, controlled revisions and tidier collaboration.",
      steps: [
        { title: "Start a meeting from a template", image: `${P}/meeting-templates.webp`, alt: "New meeting screen with eight note templates such as meeting notes, daily standup and client review" },
        { title: "AI review: check items before they become tasks", image: `${P}/ai-review.webp`, alt: "AI review listing extracted action items grouped by assignee with severity, status and due date" },
        { title: "Board across five review stages", image: `${P}/board.webp`, alt: "Kanban board with Planning, Review, In Progress and Final columns of review items" },
        { title: "Task detail with owner and schedule", image: `${P}/task-detail.webp`, alt: "Task drawer with status, phase, priority, team, assignee, reporter and dates" },
        { title: "Meeting log with its action items", image: `${P}/meetings.webp`, alt: "Meetings list with the selected meeting's notes and action items grouped by person" },
        { title: "Reports across projects", image: `${P}/reports.webp`, alt: "Reports page with project health, on-track and at-risk counts and task overview" },
        { title: "Website: hero", image: `${P}/website.webp`, alt: "Synqra marketing site hero: Turn meeting notes into work your team finishes" },
        { title: "Website on mobile", image: `${P}/mobile-website.webp`, frame: "phone", alt: "Synqra marketing site hero on a phone" },
        { title: "Website: from note to done", image: `${P}/mobile-flow.webp`, frame: "phone", alt: "Mobile site section showing a meeting note flowing through five stages" },
      ],
      caption: "All screens use sample data for a fictional project.",
    }),
    block("FLOW_PLAYER", "07 · How it works", "Three steps, from notes to progress.", "It plays on its own; hover to pause, or pick a step.", {
      layout: "desktop",
      steps: [
        { title: "Start with a template", description: "Write the discussion and revision points straight into the dashboard, without switching to another tool.", image: `${P}/meeting-notes.webp`, alt: "Meeting editor with client feedback, approvals and follow-ups written in the notes" },
        { title: "The system summarises review items", description: "The AI turns the notes into structured items with an owner, priority and due date, and you check them before saving.", image: `${P}/ai-review.webp`, alt: "AI review with four extracted items grouped by assignee" },
        { title: "Assign a PIC and track progress", description: "Confirmed items land on one board, where the team follows them to done in real time.", image: `${P}/board.webp`, alt: "Board showing the newly created review items in Planning" },
      ],
    }),
    block("METRIC_HIGHLIGHT", "08 · Target impact", "What the first three months are measured against.", "These are targets for the pilot, not results yet. They measure whether Synqra is effective and whether the team actually adopts it.", {
      metrics: [
        { value: ">60%", label: "Reviews logged before execution starts", bar: { from: 20, to: 60, fromLabel: "<20%", toLabel: ">60%" } },
        { value: "−40%", label: "Unplanned revision cycles, measured from review submitted to first processed or done", bar: { from: 100, to: 60, fromLabel: "100%", toLabel: "60%" } },
        { value: "4 / 5", label: "Reviewer satisfaction, from the reviewer evaluation", bar: { from: 0, to: 80, fromLabel: "Not measured", toLabel: "4 / 5" } },
        { value: "3 months", label: "Pilot window before the first evaluation" },
      ],
      supporting_text: "Data source and validity: logged automatically in the system from review submit times, status changes, resolution history and reviewer evaluations, then verified by the project owner and by the manager or stakeholder who makes the call.",
    }),
    block("METRIC_HIGHLIGHT", "Added · Usability test, round 1", "Five people, four tasks, one real review.", "The first evaluation round ran with the people who write review notes and the PICs who act on them, using a real review from that week.", {
      draft: true,
      metrics: [
        { value: "5 / 5", label: "Logged a review from a template without help" },
        { value: "3m 40s", label: "Median time to log a review, from opening the template to saved" },
        { value: "4 / 5", label: "Caught a wrong owner or due date in the AI review before creating tasks" },
        { value: "4.2 / 5", label: "Reviewer satisfaction, against the 4 / 5 target" },
      ],
      layout: "list",
      cards: [
        { label: "Task 1", title: "Log a review from a template", body: "All five finished. Two looked for a blank note first, so the default template is now Meeting notes." },
        { label: "Task 2", title: "Check the AI's items", body: "One participant created tasks without reading them. Items with a missing owner are now flagged before Create tasks." },
        { label: "Task 3", title: "Find where a revision came from", body: "Four of five opened the source meeting from a card. The link moved to the top of the task drawer." },
        { label: "Task 4", title: "Report on a project", body: "The project owner named what was blocked and overdue from the overview alone." },
      ],
    }),
    block("CHALLENGE", "09 · Next action plan", "Making Synqra the default, not an extra.", "", {
      cards: [
        { label: "Standardise", title: "One official place for reviews", body: "Synqra becomes the main place to record review results, with the meeting, handover and follow-up SOPs updated to match." },
        { label: "Monitor", title: "Weekly and monthly check-ins", body: "PICs monitor it weekly and the manager reviews it monthly, using the dashboard, the audit log and the three-month metrics." },
        { label: "Budget", title: "Start as a pilot", body: "Early cost goes to building the system, the database, onboarding and basic maintenance, kept small through a pilot." },
        { label: "Risk", title: "Drifting back to manual notes", body: "The biggest risk. The mitigation is to make Synqra the required source of review data and to watch adoption every week." },
      ],
    }),
    block("OUTCOME", "10 · Conclusion and follow-up", "A working review loop, live as a pilot.", "Synqra runs with meeting templates, AI extraction of review items, a five-stage board, task details with owners and dates, reports across projects and a public product site.", {
      cards: [
        { label: "Impact summary", title: "One system for review input", body: "Reviews can come in earlier, revision cycles stay under control and progress is visible to everyone." },
        { label: "What we learned", title: "Validate the habit before automating it", body: "Proving that the problem was format, storage and history, not a lack of tools, kept the product narrow on purpose." },
        { label: "What comes next", title: "Pilot, measure, standardise", body: "Run the three-month pilot and the usability rounds, then make Synqra the standard through the updated SOPs." },
      ],
    }),
  ],
};
