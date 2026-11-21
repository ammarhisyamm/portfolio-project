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

type CoverDetail = { src: string; kind: "desktop" | "phone"; alt: string };

/**
 * Two close-ups shown under each cover on the home page, so a card shows the product
 * at a glance (a whole flow above, two telling screens below) before anyone opens it.
 */
const COVER_DETAILS: Record<string, CoverDetail[]> = {
  synqra: [
    { src: "/case-studies/synqra/board.webp", kind: "desktop", alt: "Synqra board with review items by stage" },
    { src: "/case-studies/synqra/mobile-flow.webp", kind: "phone", alt: "Synqra on mobile" },
  ],
  offstories: [
    { src: "/case-studies/offstories/budget.webp", kind: "desktop", alt: "OffStories budget view" },
    { src: "/case-studies/offstories/mobile-dashboard.webp", kind: "phone", alt: "OffStories dashboard on mobile" },
  ],
  nomory: [
    { src: "/case-studies/nomory/screen-calendar.webp", kind: "phone", alt: "Nomory calendar with meal photos on each day" },
    { src: "/case-studies/nomory/screen-meal.webp", kind: "phone", alt: "A saved meal memory in Nomory" },
  ],
  quriz: [
    { src: "/case-studies/quriz/v3-quiz.webp", kind: "phone", alt: "A Quriz question with four answers" },
    { src: "/case-studies/quriz/v3-badges.webp", kind: "phone", alt: "Quriz badges earned for practice" },
  ],
};

export function coverDetails(slug: string): CoverDetail[] {
  return COVER_DETAILS[slug] ?? [];
}
