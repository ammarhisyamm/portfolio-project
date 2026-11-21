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
 * Card covers for the home page: one composed mockup per study, each with its own
 * colour, device and idea, so the list never reads like one template repeated.
 * The walkthrough videos stay as the hero inside each case study.
 */
const CARD_COVERS: Record<string, { src: string; alt: string }> = {
  synqra: { src: "/case-studies/synqra/card.webp", alt: "Synqra's AI review card listing four action items beside the project board" },
  offstories: { src: "/case-studies/offstories/card.webp", alt: "OffStories counting down 210 days to a wedding, with the mobile dashboard and checklist" },
  nomory: { src: "/case-studies/nomory/card.webp", alt: "Three Nomory screens fanned out: calendar, today's meals and a saved pasta memory" },
  quriz: { src: "/case-studies/quriz/card.webp", alt: "A Quriz question answered correctly, with streak and XP cards around it" },
  jeam: { src: "/case-studies/jeam/card.webp", alt: "A grid of Jeam screens, from the home feed to a finished run" },
};

export function cardCover(slug: string) {
  return CARD_COVERS[slug];
}
