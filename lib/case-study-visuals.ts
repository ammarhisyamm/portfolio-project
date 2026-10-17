/**
 * Editorial covers prevent CMS entries without uploaded media from falling
 * back to a generic placeholder. They are intentionally contextual imagery,
 * not recreated product screens, and can be replaced per-project in the CMS.
 */
const FALLBACK_COVERS: Record<string, string> = {
  offstories: "/case-studies/offstories/cover-poster.webp",
  nomory: "/case-studies/nomory-cover.webp",
  quriz: "/case-studies/quriz-cover.webp",
  jeam: "/case-studies/jeam-cover.webp",
};

export function caseStudyCover(slug: string) {
  return FALLBACK_COVERS[slug] ?? "";
}
