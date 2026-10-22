import type { CategoryImage, HomeCategory } from "@/lib/content";
import { SHOWCASE_GROUPS } from "@/lib/museum/showcase";

/** Early CMS uploads the showcase replaced: three Website shots that repeat
 * showcase pages (Elite, the trading site) and three mobile screens that were
 * uploaded to Dashboard. Later CMS uploads still show. */
const RETIRED_UPLOADS = [
  "1787049093255-74bam6.png",
  "1787049105343-03xgq8.png",
  "1787049119247-rxc5x7.png",
  "1787049309413-j5148j.png",
  "1787049317993-fhlywe.png",
  "1787049323788-6cbm3r.png",
];

/** Adds the portfolio showcase shots (the same set the museum shows) to the
 * classic view's Website, Dashboard and Mobile categories, after any images
 * uploaded through the CMS. */
export function withShowcase(categories: HomeCategory[]): HomeCategory[] {
  return categories.map(category => {
    const name = `${category.key} ${category.label}`.toLowerCase();
    const group = name.includes("mobile") ? "mobile" : name.includes("dashboard") ? "dashboard" : name.includes("web") ? "website" : null;
    if (!group) return category;
    const images = category.images.filter(image => !RETIRED_UPLOADS.some(file => image.image_url.endsWith(file)));
    const start = images.reduce((max, image) => Math.max(max, image.sort), -1) + 1;
    const known = new Set(images.map(image => image.image_url));
    const extra: CategoryImage[] = SHOWCASE_GROUPS[group].filter(item => !known.has(item.src)).map((item, index) => ({
      id: `showcase-${item.src}`, image_url: item.src, thumb_url: item.thumb, alt_text: `${item.title}, ${item.subtitle}`,
      is_primary: false, visible: true, sort: start + index, offset_x: 0, offset_y: 0, rotation: 0, z_order: 0, scroll: group === "website",
    }));
    return { ...category, images: [...images, ...extra] };
  });
}
