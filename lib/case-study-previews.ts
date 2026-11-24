/** Real product screens, framed close enough to read instead of distant device renders. */
export type CoverScreen = { src: string; alt: string; width: number; height: number };
export type CaseStudyPreview = { kind: "desktop" | "mobile"; background: string; screens: CoverScreen[] };
const screen = (project: string, file: string, alt: string, width = 780, height = 1688): CoverScreen => ({
  src: `/case-studies/${project}/${file}.webp`, alt, width, height,
});
const PREVIEWS: Record<string, CaseStudyPreview> = {
  synqra: {
    kind: "desktop", background: "linear-gradient(135deg, #dce7ff, #8faeff 55%, #547cf4)",
    screens: [
      screen("synqra", "ai-review", "Synqra: review AI-extracted actions and assign task owners", 1600, 1000),
      screen("synqra", "board", "Synqra: the team's revision board", 1600, 1000),
    ],
  },
  offstories: {
    kind: "desktop", background: "linear-gradient(135deg, #f9e5dc, #edc9cd 55%, #c9b8e7)",
    screens: [
      screen("offstories", "dashboard", "OffStories: wedding countdown, checklist and budget overview", 1600, 1000),
      screen("offstories", "budget", "OffStories: wedding budget and spending details", 1600, 1000),
    ],
  },
  nomory: {
    kind: "mobile", background: "linear-gradient(135deg, #ffe7cb, #ffc590 50%, #f69c59)",
    screens: [
      screen("nomory", "screen-calendar", "Nomory: a calendar of meal memories"),
      screen("nomory", "screen-today", "Nomory: today's meals and daily streak"),
      screen("nomory", "screen-meal", "Nomory: a saved meal and its story"),
    ],
  },
  quriz: {
    kind: "mobile", background: "linear-gradient(135deg, #d6edff, #c9d8fc 50%, #b7a8e5)",
    screens: [
      screen("quriz", "v3-progress", "Quriz: learning progress and consistency"),
      screen("quriz", "v3-home", "Quriz: daily practice and learning shortcuts"),
      screen("quriz", "v3-quiz", "Quriz: a Quran practice question"),
    ],
  },
  jeam: {
    kind: "mobile", background: "linear-gradient(135deg, #ffe1c6, #ffc38a 48%, #ec8d50)",
    screens: [
      screen("jeam", "running", "Jeam: live running activity", 391, 846),
      screen("jeam", "home", "Jeam: weekly activity, streak and challenges", 277, 599),
      screen("jeam", "discover", "Jeam: discover community activity", 277, 599),
    ],
  },
};
export function caseStudyPreview(slug: string) { return PREVIEWS[slug]; }
