import type { ExplorationItem, HomeCategory } from "./content";

export type IntroExploration = { src: string; position?: string };
/** Local showcase thumbnails keep the intro light; CMS explorations take priority. */
export const INTRO_EXPLORATIONS: IntroExploration[] = [
  { src: "/showcase/web/elite-alps-thumb.webp" },
  { src: "/showcase/mobile/finance-thumb.webp" },
  { src: "/showcase/web/valoras-thumb.webp" },
  { src: "/showcase/mobile/travel-thumb.webp" },
  { src: "/showcase/web/lumiere-thumb.webp" },
];
export function introExplorations(exploration: ExplorationItem[], categories: HomeCategory[]): IntroExploration[] {
  const cms = exploration.filter(item => item.image && !/\.(mp4|webm|mov)([?#]|$)/i.test(item.image)).map(item => ({
    src: item.image, position: `${item.focalX ?? 50}% ${item.focalY ?? 50}%`,
  }));
  const webAndMobile = categories.filter(category => /web|mobile/i.test(`${category.key} ${category.label}`)).flatMap(category =>
    category.images.filter(item => item.visible && item.image_url).map(item => ({ src: item.thumb_url || item.image_url }))
  );
  return [...cms, ...webAndMobile, ...INTRO_EXPLORATIONS].filter((item, index, items) => items.findIndex(other => other.src === item.src) === index).slice(0, 5);
}
