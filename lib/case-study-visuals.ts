/**
 * Editorial covers prevent CMS entries without uploaded media from falling
 * back to a generic placeholder. They are intentionally contextual imagery,
 * not recreated product screens, and can be replaced per-project in the CMS.
 */
const FALLBACK_COVERS: Record<string, string> = {
  nomory: "/case-studies/nomory-cover.png",
  quriz: "/case-studies/quriz-cover.png",
  jeam: "/case-studies/jeam-cover.png",
};

export function caseStudyCover(slug: string) {
  return FALLBACK_COVERS[slug] ?? "";
}
