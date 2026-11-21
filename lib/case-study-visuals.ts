/**
 * Editorial covers prevent CMS entries without uploaded media from falling
 * back to a generic placeholder. They are intentionally contextual imagery,
 * not recreated product screens, and can be replaced per-project in the CMS.
 */
const FALLBACK_COVERS: Record<string, string> = {
  synqra: "/case-studies/synqra/cover-poster.webp",
  offstories: "/case-studies/offstories/cover-poster.webp",
  nomory: "/case-studies/nomory-cover.webp",
  quriz: "/case-studies/quriz-cover.webp",
  jeam: "/case-studies/jeam/cover-poster.webp",
};

export function caseStudyCover(slug: string) {
  return FALLBACK_COVERS[slug] ?? "";
}

/**
 * Card covers for the home page: each study plays its own flow inside a light studio
 * mockup with its own colour (generated with GPT Image, real screens composited onto the device), so
 * the list never reads like one template repeated. `poster` is the still for the first
 * paint and for reduced motion.
 */
const CARD_COVERS: Record<string, { video: string; poster: string; alt: string }> = {
  synqra: { video: "/case-studies/synqra/card.mp4", poster: "/case-studies/synqra/card.webp", alt: "Synqra on a laptop resting on a cobalt blue ribbon, moving from meeting notes to AI review to the project board" },
  offstories: { video: "/case-studies/offstories/card.mp4", poster: "/case-studies/offstories/card.webp", alt: "OffStories on a laptop and phone on a blush arch plinth, stepping through setup, dashboard and budget" },
  nomory: { video: "/case-studies/nomory/card.mp4", poster: "/case-studies/nomory/card.webp", alt: "Nomory on a phone tilted on a tomato orange ledge, moving from today's diary to saving a meal and the calendar" },
  quriz: { video: "/case-studies/quriz/card.mp4", poster: "/case-studies/quriz/card.webp", alt: "Quriz on a phone floating over a glass pedestal in pale blue water, moving from home to a quiz, progress and badges" },
  jeam: { video: "/case-studies/jeam/card.mp4", poster: "/case-studies/jeam/card.webp", alt: "Jeam on a phone balanced on stacked orange blocks, moving from home to a run and its result" },
};

export function cardCover(slug: string) {
  return CARD_COVERS[slug];
}
