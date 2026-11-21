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
 * Card covers for the home page: the device floats over a gradient in the study's own
 * colours (scenes generated with GPT Image, real screens composited onto the device), with
 * one or two real UI components lifted out of the product and floated beside it, so each
 * card shows the work up close and the list never reads like one template repeated.
 */
const CARD_COVERS: Record<string, { src: string; alt: string }> = {
  synqra: { src: "/case-studies/synqra/cover-card.webp", alt: "Synqra's AI review on a laptop over a cobalt gradient, with an extracted action item and the Create 4 items button floating beside it" },
  offstories: { src: "/case-studies/offstories/cover-card.webp", alt: "The OffStories dashboard on a laptop over a peach and lilac gradient, with the wedding countdown and remaining budget floating beside it" },
  nomory: { src: "/case-studies/nomory/cover-card.webp", alt: "Nomory's diary on a phone over a tangerine gradient, with the four day streak and an oat latte memory floating beside it" },
  quriz: { src: "/case-studies/quriz/cover-card.webp", alt: "The Quriz home screen on a phone over a sky to lavender gradient, with the consistency week and the start practice button floating beside it" },
  jeam: { src: "/case-studies/jeam/cover-card.webp", alt: "Jeam's run summary on a phone wrapped in an orange ribbon, with the calories chart and total distance floating beside it" },
};

export function cardCover(slug: string) {
  return CARD_COVERS[slug];
}
