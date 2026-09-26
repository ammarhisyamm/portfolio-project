export type CanvasItem = {
  slug: string;
  title: string;
  category: string;
  year: string;
  image: string;
  description?: string;
  focalX?: number;
  focalY?: number;
  cropZoom?: number;
  frameRatio?: number | null;
};
