import { BookOpen, BriefcaseBusiness, Building2, CalendarDays, Cloud, Gamepad2, HandHeart, Heart, HeartPulse, House, Landmark, MessageCircle, Palette, Plane, Podcast, ShoppingBag, Sparkles, Truck, Trophy, Users, Utensils, type LucideIcon } from "lucide-react";

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
  logistics: Truck,
  travel: Plane,
  "real estate": Building2,
  healthcare: HeartPulse,
  "food & beverage": Utensils,
  retail: ShoppingBag,
  sports: Trophy,
  events: CalendarDays,
  gaming: Gamepad2,
  media: Podcast,
  recruitment: Users,
  fundraising: HandHeart,
  "home services": House,
  "creative services": Palette,
};
