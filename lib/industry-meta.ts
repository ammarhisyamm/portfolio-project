import { BookOpen, BriefcaseBusiness, Cloud, Heart, Landmark, MessageCircle, Sparkles, type LucideIcon } from "lucide-react";

/** Icon for each industry, shared by the classic About page and the museum. */
export const industryMeta: Record<string, LucideIcon> = {
  fintech: Landmark,
  saas: Cloud,
  marketplaces: BriefcaseBusiness,
  education: BookOpen,
  enterprise: BriefcaseBusiness,
  communication: MessageCircle,
  "ai products": Sparkles,
  lifestyle: Heart,
};
