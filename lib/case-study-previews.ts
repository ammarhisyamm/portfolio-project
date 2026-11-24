type CoverPreview = {
  kind: "desktop" | "mobile";
  scene: string;
  screen: string;
  alt: string;
};

const PREVIEWS: Record<string, CoverPreview> = {
  synqra: {
    kind: "desktop",
    scene: "/case-studies/synqra/cover-scene.webp",
    screen: "/case-studies/synqra/ai-review.webp",
    alt: "Synqra’s AI review dashboard against a blue glass studio backdrop",
  },
  offstories: {
    kind: "desktop",
    scene: "/case-studies/offstories/cover-scene.webp",
    screen: "/case-studies/offstories/dashboard.webp",
    alt: "OffStories’ wedding planning dashboard against a table dressed in ivory linen and flowers",
  },
  nomory: {
    kind: "mobile",
    scene: "/case-studies/nomory/cover-scene.webp",
    screen: "/case-studies/nomory/screen-today.webp",
    alt: "Nomory’s meal diary on a phone framed by coffee, toast and morning light",
  },
  quriz: {
    kind: "mobile",
    scene: "/case-studies/quriz/cover-scene.webp",
    screen: "/case-studies/quriz/v3-home.webp",
    alt: "Quriz’s practice screen on a phone in a sunlit room with an ivory arch and patterned tiles",
  },
};

export function caseStudyPreview(slug: string) {
  return PREVIEWS[slug];
}
