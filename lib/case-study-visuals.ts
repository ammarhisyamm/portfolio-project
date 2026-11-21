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
 * Card covers for the home page: a close crop of one telling screen on a light studio
 * mockup, each study with a prop in its own colour (scenes generated with GPT Image, real
 * screens composited onto the device), so the list never reads like one template repeated.
 */
const CARD_COVERS: Record<string, { src: string; alt: string }> = {
  synqra: { src: "/case-studies/synqra/card.webp", alt: "Synqra's AI review screen on a laptop resting on a cobalt blue ribbon" },
  offstories: { src: "/case-studies/offstories/card.webp", alt: "The OffStories dashboard on a laptop and phone, counting down 210 days to the wedding" },
  nomory: { src: "/case-studies/nomory/card.webp", alt: "Close-up of Nomory's diary on a phone: good morning, two memories today and a four day streak" },
  quriz: { src: "/case-studies/quriz/card.webp", alt: "Close-up of the Quriz home screen on a phone, with the consistency week and a start button" },
  jeam: { src: "/case-studies/jeam/card.webp", alt: "Close-up of Jeam's run summary on a phone: 5 km, 45 minutes and calories per kilometre" },
};

export function cardCover(slug: string) {
  return CARD_COVERS[slug];
}
