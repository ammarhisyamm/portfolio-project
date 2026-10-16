import {
  Accessibility,
  Bot,
  Brush,
  FileText,
  Handshake,
  Image as ImageIcon,
  Layers,
  MessagesSquare,
  Network,
  Palette,
  PenTool,
  Route,
  Smartphone,
  Sparkles,
  StickyNote,
  type LucideIcon,
} from "lucide-react";

/** Order matters: the first pattern that matches the label wins. */
const RULES: [RegExp, LucideIcon][] = [
  [/\bai\b|assisted/i, Bot],
  [/figjam/i, StickyNote],
  [/figma/i, PenTool],
  [/adobe/i, Brush],
  [/photopea/i, ImageIcon],
  [/notion/i, FileText],
  [/interview/i, MessagesSquare],
  [/journey|mapping|flow/i, Route],
  [/information|architecture/i, Network],
  [/responsive|mobile/i, Smartphone],
  [/accessib/i, Accessibility],
  [/token|visual|brand|colou?r/i, Palette],
  [/stakeholder|alignment|handoff|hand off/i, Handshake],
  [/system|component|prototype|interaction/i, Layers],
];

export function ProcessIcon({ label, fallback: Fallback = Sparkles }: { label: string; fallback?: LucideIcon }) {
  const Icon = RULES.find(([pattern]) => pattern.test(label))?.[1] ?? Fallback;
  return <Icon size={14} strokeWidth={1.8} aria-hidden="true" className="shrink-0" />;
}
