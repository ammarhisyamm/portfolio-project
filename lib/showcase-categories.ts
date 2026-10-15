import type { CategoryImage, HomeCategory } from "@/lib/content";
import { SHOWCASE_GROUPS } from "@/lib/museum/showcase";

/** Adds the portfolio showcase shots (the same set the museum shows) to the
 * classic view's Website, Dashboard and Mobile categories, after any images
 * uploaded through the CMS. */
export function withShowcase(categories: HomeCategory[]): HomeCategory[] {
  return categories.map(category => {
    const name = `${category.key} ${category.label}`.toLowerCase();
    const group = name.includes("mobile") ? "mobile" : name.includes("dashboard") ? "dashboard" : name.includes("web") ? "website" : null;
    if (!group) return category;
    const start = category.images.reduce((max, image) => Math.max(max, image.sort), -1) + 1;
    const known = new Set(category.images.map(image => image.image_url));
    const extra: CategoryImage[] = SHOWCASE_GROUPS[group].filter(item => !known.has(item.src)).map((item, index) => ({
      id: `showcase-${item.src}`, image_url: item.src, thumb_url: item.thumb, alt_text: `${item.title}, ${item.subtitle}`,
      is_primary: false, visible: true, sort: start + index, offset_x: 0, offset_y: 0, rotation: 0, z_order: 0, scroll: group === "website",
    }));
    return { ...category, images: [...category.images, ...extra] };
  });
}
