import type { CaseStudyBlock } from "@/lib/content";

/** Shorthand for code-defined case study blocks; empty fields stay empty so the renderer skips them. */
export function block(
  block_type: string,
  eyebrow: string,
  heading: string,
  description = "",
  extra: Partial<CaseStudyBlock> = {}
): CaseStudyBlock {
  return {
    block_type,
    eyebrow,
    heading,
    description,
    supporting_text: "",
    media: "",
    caption: "",
    alt_text: "",
    metrics: [],
    layout: "",
    visible: true,
    ...extra,
  };
}

export const media = (...paths: string[]) => paths.join("\n");
