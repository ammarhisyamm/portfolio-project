import { BarChart3, Code2, Crosshair, FileSearch, Layers3, MousePointer2, Palette, PanelsTopLeft, Play, Search, UserRoundCheck, type LucideIcon } from "lucide-react";

export type ItemMeta = { icon: LucideIcon; tone: string };

export const capabilityMeta: Record<string, ItemMeta> = {
  "product strategy": { icon: Crosshair, tone: "sky" },
  "ux research": { icon: Search, tone: "violet" },
  "user flows & ia": { icon: FileSearch, tone: "amber" },
  "user flows and information architecture": { icon: FileSearch, tone: "amber" },
  wireframing: { icon: PanelsTopLeft, tone: "slate" },
  prototyping: { icon: Play, tone: "mint" },
  "interaction design": { icon: MousePointer2, tone: "rose" },
  "visual design": { icon: Palette, tone: "gold" },
  "design systems": { icon: Layers3, tone: "blue" },
  "usability testing": { icon: UserRoundCheck, tone: "lilac" },
  "design handoff": { icon: Code2, tone: "slate" },
  "design-to-development handoff": { icon: Code2, tone: "slate" },
  "competitor analysis": { icon: BarChart3, tone: "mint" },
};
