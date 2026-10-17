import type { CategoryImage, HomeCategory } from "@/lib/content";

const P = "/graphic-design";

/** Pages from the 2024 graphic design portfolio, in feed order; the first three are the stack preview. */
const PAGES: Array<[page: string, alt: string]> = [
  ["12", "Ghulam Muslim Kids Wear logo on a photo of children playing"],
  ["16", "Ruang Suara Kreasi logo mark"],
  ["20", "Organoo Studio logo mark"],
  ["05", "Organoo Studio Instagram feed: digital marketing tips and service posts"],
  ["06", "Organoo Studio Instagram feed: order process, services and pricing posts"],
  ["07", "Ruang Suara Kreasi Instagram feed for a self-development podcast"],
  ["08", "designjam.id Instagram feed for a UI/UX design community"],
  ["09", "Ghulam Instagram feed for a children's Muslim clothing brand"],
  ["10", "Pesona Manis Nusantehra Instagram feed for a food and beverage brand"],
  ["15", "Ghulam brand applied to Instagram story and post templates"],
  ["19", "Ruang Suara Kreasi billboard mockup"],
  ["22", "Organoo Studio logo on white, green and dark backgrounds"],
  ["23", "Organoo Studio agency website on a laptop mockup"],
  ["26", "Pitch deck for the Ghulam Muslim Kids Wear hiring team"],
  ["28", "Pitch deck for the Design Jam Academy webinar on object-oriented UX"],
  ["30", "Pitch deck for a mentoring session about style guides"],
  ["32", "Pitch deck for a mentoring session about effective landing pages"],
];

const GRAPHIC_DESIGN_IMAGES: CategoryImage[] = PAGES.map(([page, alt], i) => ({
  id: `graphic-${page}`,
  image_url: `${P}/page-${page}.webp`,
  thumb_url: `${P}/page-${page}-thumb.webp`,
  alt_text: alt,
  is_primary: i === 0,
  visible: true,
  sort: i,
  offset_x: 0,
  offset_y: 0,
  rotation: 0,
  z_order: 0,
}));

/** Adds the code-defined graphic design work to the CMS "graphic" category, creating it when the CMS has none. */
export function withGraphicDesign(categories: HomeCategory[]): HomeCategory[] {
  const existing = categories.find((c) => c.key === "graphic");
  if (!existing) {
    return [...categories, { id: "graphic", key: "graphic", label: "Graphic Design", sort: categories.length, images: GRAPHIC_DESIGN_IMAGES }];
  }
  const offset = existing.images.reduce((max, img) => Math.max(max, img.sort + 1), 0);
  return categories.map((c) =>
    c === existing ? { ...c, images: [...c.images, ...GRAPHIC_DESIGN_IMAGES.map((img) => ({ ...img, is_primary: img.is_primary && existing.images.length === 0, sort: img.sort + offset }))] } : c
  );
}
