import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { trustItems, capabilities, industries } from "./projects";

export type Metric = { value: string; label: string };

export type CaseStudyBlock = {
  block_type: string;
  eyebrow: string;
  heading: string;
  description: string;
  supporting_text: string;
  media: string;
  caption: string;
  alt_text: string;
  metrics: Metric[];
  layout: string;
  visible: boolean;
};

export type CaseStudy = {
  id?: string;
  slug: string;
  title: string;
  published: boolean;
  featured: boolean;
  featured_order: number;
  year: string;
  category: string;
  industry: string;
  platform: string;
  project_status: string;
  short_description: string;
  hero_headline: string;
  hero_description: string;
  hero_image: string;
  hero_image_alt: string;
  thumbnail: string;
  thumbnail_alt: string;
  client: string;
  role: string;
  timeline: string;
  scope: string;
  team: string;
  project_type: string;
  blocks: CaseStudyBlock[];
};

export type ExperienceItem = {
  company: string;
  role: string;
  period: string;
  points: string[];
};

export type ExplorationItem = {
  label: string;
  image: string;
};

export type SocialLink = {
  label: string;
  href: string;
  type: string;
};

export type FooterLink = {
  label: string;
  href: string;
};

export type AboutContent = {
  introTitle: string;
  introBody: string;
  philosophyTitle: string;
  philosophyBody: string;
  background: string[];
  tools: string;
  capabilities: string[];
  industries: string[];
};

export type ContactContent = {
  email: string;
  location: string;
  whatsapp: string;
  available: boolean;
  note: string;
};

export type FooterContent = {
  heading: string;
  note: string;
  email: string;
  links: FooterLink[];
};

export type TrustItem = {
  label: string;
  image: string;
};

export type CategoryImage = {
  id?: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  visible: boolean;
  sort: number;
  offset_x: number;
  offset_y: number;
  rotation: number;
  z_order: number;
};

export type HomeCategory = {
  id?: string;
  key: string;
  label: string;
  sort: number;
  images: CategoryImage[];
};

export type SiteContent = {
  caseStudies: CaseStudy[];
  homeCategories: HomeCategory[];
  experience: ExperienceItem[];
  exploration: ExplorationItem[];
  trust: TrustItem[];
  hero: {
    name: string;
    title: string;
    headline: string;
    intro: string;
    available: boolean;
  };
  about: AboutContent;
  contact: ContactContent;
  socials: {
    items: SocialLink[];
  };
  footer: FooterContent;
};

const DEFAULT_HOME_CATEGORIES: HomeCategory[] = [
  { id: "website", key: "website", label: "Website", sort: 0, images: [] },
  { id: "dashboard", key: "dashboard", label: "Dashboard", sort: 1, images: [] },
  { id: "mobile", key: "mobile", label: "Mobile", sort: 2, images: [] },
];

const DEFAULT_EXPERIENCE: ExperienceItem[] = [
  {
    company: "Serba Mulia Group",
    role: "Product & UX/UI design",
    period: "2021 — Present",
    points: [
      "Lead product design across the group's digital products and platforms.",
      "Built and maintained a scalable design system shared by multiple teams.",
      "Translated business goals into clear, usable product experiences.",
      "Worked closely with product and engineering on design-to-development handoff.",
    ],
  },
  {
    company: "Peak Haven",
    role: "Digital product design",
    period: "2019 — 2021",
    points: [
      "Designed end-to-end digital experiences for hospitality and lifestyle products.",
      "Ran discovery and user research to shape the product roadmap.",
      "Delivered prototypes and specs that kept development teams moving fast.",
    ],
  },
  {
    company: "Gadai Mulia",
    role: "Fintech product design",
    period: "2017 — 2019",
    points: [
      "Designed a digital pawnbroking experience that made financial services more accessible.",
      "Simplified complex transaction flows into clear, step-by-step journeys.",
      "Contributed to the product's information architecture and visual system.",
    ],
  },
  {
    company: "Synqra",
    role: "SaaS product design",
    period: "2015 — 2017",
    points: [
      "Designed a meeting notes and workflow platform for teams.",
      "Turned discussions into actionable work through structured flows and templates.",
      "Collaborated with early customers to validate and refine the core experience.",
    ],
  },
  {
    company: "Drawtopia",
    role: "AI creative platform",
    period: "2013 — 2015",
    points: [
      "Designed an AI-assisted story-generation experience for creative users.",
      "Explored interaction patterns for AI output and user control.",
      "Built the visual system that gave the product its distinctive editorial feel.",
    ],
  },
  {
    company: "Base44",
    role: "AI productivity tools",
    period: "2011 — 2013",
    points: [
      "Designed AI-powered productivity tools for knowledge workers.",
      "Prototyped and tested early concepts for AI-assisted workflows.",
      "Helped define the product's design language and component library.",
    ],
  },
];

const DEFAULT_EXPLORATION: ExplorationItem[] = [
  "Exploration 01 — Mobile banking",
  "Exploration 02 — Onboarding flow",
  "Exploration 03 — Dashboard UI",
  "Exploration 04 — Design tokens",
  "Exploration 05 — Checkout journey",
  "Exploration 06 — AI chat interface",
  "Exploration 07 — Mobile menu",
  "Exploration 08 — Data visualization",
].map((label) => ({ label, image: "" }));

const DEFAULT_CASE_STUDIES: CaseStudy[] = [
  {
    id: "selog",
    slug: "selog",
    title: "SELOG",
    published: true,
    featured: true,
    featured_order: 0,
    year: "2024",
    category: "B2B · Logistics · Product Design",
    industry: "Logistics",
    platform: "Web · Mobile",
    project_status: "Shipped",
    short_description: "Turning logistics complexity into a clearer B2B experience.",
    hero_headline: "Turning logistics complexity into a clearer B2B experience.",
    hero_description:
      "Redesigning SELOG's web and mobile platform end-to-end — from research and information architecture to a reusable design system.",
    hero_image: "",
    hero_image_alt: "",
    thumbnail: "",
    thumbnail_alt: "",
    client: "SELOG",
    role: "UI/UX Designer",
    timeline: "Feb 2024 — Jul 2024",
    scope: "UX Research · Competitor Analysis · Product Design · Responsive Design · Design System",
    team: "",
    project_type: "B2B platform",
    blocks: [
      {
        block_type: "METRIC_HIGHLIGHT",
        eyebrow: "Overview",
        heading: "A logistics experience grounded in research",
        description:
          "As UI/UX Designer, I took SELOG's product design from research through to shipped interfaces — letting user input steer the direction.",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [
          { value: "10+", label: "User interviews" },
          { value: "100+", label: "Actionable insights" },
          { value: "~75%", label: "Design decisions informed by research" },
          { value: "14+", label: "Screens" },
          { value: "25+", label: "Reusable components" },
        ],
        layout: "",
        visible: true,
      },
      {
        block_type: "RESEARCH",
        eyebrow: "01 · Research",
        heading: "Listening before designing",
        description:
          "10+ user interviews were run to understand how teams move goods, documents, and information through the platform. Roughly 75% of the design decisions trace back to what these sessions surfaced.",
        supporting_text: "[Add research insight here]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "CHALLENGE",
        eyebrow: "02 · Challenge",
        heading: "A dense operational workflow, made legible",
        description:
          "The brief spanned UX research, competitor analysis, product design, responsive design, and a design system — compressed into a single product arc.",
        supporting_text: "[Add project challenge]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "OUTCOME",
        eyebrow: "03 · Outcome",
        heading: "Delivered, and presented to the board",
        description:
          "14+ screens and a 25+ component design system were delivered, and the research and design direction were presented directly to the Board of Directors.",
        supporting_text: "[Add final outcome here]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
    ],
  },
  {
    id: "pajak-mas",
    slug: "pajak-mas",
    title: "PAJAK MAS",
    published: true,
    featured: true,
    featured_order: 1,
    year: "",
    category: "Fintech · Product Design",
    industry: "Fintech",
    platform: "Web · Mobile",
    project_status: "0→1 Product",
    short_description: "Designing a tax platform from zero to one.",
    hero_headline: "Designing a tax experience from zero to one.",
    hero_description:
      "A 0→1 fintech product where every screen, flow, and component was designed from a blank canvas.",
    hero_image: "",
    hero_image_alt: "",
    thumbnail: "",
    thumbnail_alt: "",
    client: "",
    role: "UI/UX Designer",
    timeline: "",
    scope: "Product Design · UX/UI · Responsive Design · Design System",
    team: "",
    project_type: "0→1 Product",
    blocks: [
      {
        block_type: "INTRO",
        eyebrow: "Overview",
        heading: "A 0→1 fintech product",
        description:
          "PAJAK MAS started from zero. As UI/UX Designer I worked the product from first principles — flows, screens, and a visual system built to scale.",
        supporting_text: "[Add a short overview of the product]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "DESIGN_DIRECTION",
        eyebrow: "01 · Direction",
        heading: "[Add the design direction]",
        description: "[Add project challenge]",
        supporting_text: "[Add supporting detail]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "UI_DESIGN",
        eyebrow: "02 · UI",
        heading: "[Add screen highlights]",
        description: "[Add key screens and how they solve user needs]",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "OUTCOME",
        eyebrow: "03 · Outcome",
        heading: "[Add final outcome here]",
        description: "[Add what was delivered and the result]",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
    ],
  },
  {
    id: "synqra",
    slug: "synqra",
    title: "SYNQRA",
    published: true,
    featured: true,
    featured_order: 2,
    year: "",
    category: "SaaS · Product Design",
    industry: "SaaS",
    platform: "Web",
    project_status: "0→1 Product",
    short_description: "A 0→1 SaaS product designed from the ground up.",
    hero_headline: "Designing a 0→1 SaaS product from the ground up.",
    hero_description:
      "SYNQRA is a SaaS product built from zero — every decision, from structure to components, designed for a new product team.",
    hero_image: "",
    hero_image_alt: "",
    thumbnail: "",
    thumbnail_alt: "",
    client: "",
    role: "UI/UX Designer",
    timeline: "",
    scope: "Product Design · UX/UI · Interaction Design · Design System",
    team: "",
    project_type: "0→1 Product",
    blocks: [
      {
        block_type: "INTRO",
        eyebrow: "Overview",
        heading: "A 0→1 SaaS product",
        description:
          "As UI/UX Designer I shaped SYNQRA from the first screens onward — defining the experience, interactions, and system that would carry the product.",
        supporting_text: "[Add a short overview of the product]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "RESEARCH",
        eyebrow: "01 · Research",
        heading: "[Add the research focus]",
        description: "[Add research insight here]",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "DESIGN_SYSTEM",
        eyebrow: "02 · System",
        heading: "[Add design system details]",
        description: "[Add the system built for the product]",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "OUTCOME",
        eyebrow: "03 · Outcome",
        heading: "[Add final outcome here]",
        description: "[Add what was delivered and the result]",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
    ],
  },
  {
    id: "promas",
    slug: "promas",
    title: "PROMAS",
    published: true,
    featured: true,
    featured_order: 3,
    year: "",
    category: "Enterprise · Operational Platform · Product Design",
    industry: "Enterprise",
    platform: "Web",
    project_status: "",
    short_description: "An operational platform designed around how branch teams actually work.",
    hero_headline: "An operational platform for the people running it.",
    hero_description:
      "PROMAS is an enterprise operational platform used by cashiers, branch managers, and multi-branch teams — designed around the work they do every day.",
    hero_image: "",
    hero_image_alt: "",
    thumbnail: "",
    thumbnail_alt: "",
    client: "",
    role: "UI/UX Designer",
    timeline: "",
    scope: "Product Design · UX Research · Competitor Analysis · Interaction Design · Design System (from scratch)",
    team: "",
    project_type: "Enterprise · Operational Platform",
    blocks: [
      {
        block_type: "METRIC_HIGHLIGHT",
        eyebrow: "Overview",
        heading: "Designing for the whole branch, not just the dashboard",
        description:
          "Led product design for an enterprise operational platform — supporting cashiers at the counter, branch managers, and teams across multiple branches.",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [
          { value: "120", label: "Interview questions prepared" },
          { value: "0→1", label: "Design system built from scratch" },
        ],
        layout: "",
        visible: true,
      },
      {
        block_type: "RESEARCH",
        eyebrow: "01 · Research",
        heading: "Competitors first, users second",
        description:
          "Competitor research grounded the initial direction, supported by a 120-question interview script prepared for user research across branch roles.",
        supporting_text: "[Add research insight here]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "DESIGN_SYSTEM",
        eyebrow: "02 · System",
        heading: "A design system from the ground up",
        description:
          "Built the platform's design system from scratch — tokens, components, and patterns sized for a large operational surface.",
        supporting_text: "[Add design system details here]",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
      {
        block_type: "OUTCOME",
        eyebrow: "03 · Outcome",
        heading: "[Add final outcome here]",
        description: "[Add what was delivered and the result]",
        supporting_text: "",
        media: "",
        caption: "",
        alt_text: "",
        metrics: [],
        layout: "",
        visible: true,
      },
    ],
  },
];

export const DEFAULTS: SiteContent = {
  caseStudies: DEFAULT_CASE_STUDIES,
  homeCategories: DEFAULT_HOME_CATEGORIES,
  experience: DEFAULT_EXPERIENCE,
  exploration: DEFAULT_EXPLORATION,
  trust: trustItems.map((label) => ({ label, image: "" })),
  hero: {
    name: "Hisyam",
    title: "Senior UX/UI & Product Designer",
    headline: "I design thoughtful digital products that make complex experiences feel simple.",
    intro:
      "I help teams turn ideas into clear, useful, and engaging experiences across fintech, SaaS, marketplaces, dashboards, and AI-powered products.",
    available: true,
  },
  about: {
    introTitle:
      "Hey, I'm Hisyam — a strategy-driven product designer with more than 15 years of experience creating scalable digital experiences.",
    introBody:
      "I enjoy shaping a product from the early question through to a considered interface and a practical handoff. My work is grounded in attention to people, business context, and the small details that make a product feel trustworthy.",
    philosophyTitle: "Complexity should be resolved long before it reaches the interface.",
    philosophyBody:
      "I design with structure and restraint. Every layout, flow, and pattern should earn its place and make the next decision easier for both users and the team building it.",
    background: [
      "More than 15 years across product teams, agencies, and client work — spanning fintech, SaaS, marketplaces, education, security, communication, and AI-powered platforms.",
      "From strategy and research to interaction, visual systems, and developer handoff, I stay involved across the full arc of a product.",
    ],
    tools:
      "Figma, FigJam, Adobe tools, Photopea, Notion, and AI-assisted design and research tools. I work openly with product, engineering, and stakeholders to turn decisions into momentum.",
    capabilities,
    industries,
  },
  contact: {
    email: "hello@hisyam.design",
    location: "Jakarta, Indonesia",
    whatsapp: "#",
    available: true,
    note: "Based in Jakarta, Indonesia. Working with teams around the world.",
  },
  socials: {
    items: [
      { label: "LinkedIn", href: "#", type: "linkedin" },
      { label: "Behance", href: "#", type: "behance" },
      { label: "Dribbble", href: "#", type: "dribbble" },
      { label: "GitHub", href: "#", type: "github" },
    ],
  },
  footer: {
    heading: "Let's work together",
    note: "Have a thoughtful problem to solve?",
    email: "hello@hisyam.design",
    links: [
      { label: "LinkedIn", href: "#" },
      { label: "Behance", href: "#" },
    ],
  },
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase =
  supabaseUrl && supabaseAnon ? createClient(supabaseUrl, supabaseAnon) : null;

function rowToCaseStudy(r: Record<string, unknown>, blocks: CaseStudyBlock[]): CaseStudy {
  return {
    id: (r.id as string) ?? undefined,
    slug: (r.slug as string) ?? "",
    title: (r.title as string) ?? "",
    published: (r.published as boolean) ?? true,
    featured: (r.featured as boolean) ?? false,
    featured_order: (r.featured_order as number) ?? 0,
    year: (r.year as string) ?? "",
    category: (r.category as string) ?? "",
    industry: (r.industry as string) ?? "",
    platform: (r.platform as string) ?? "",
    project_status: (r.project_status as string) ?? "",
    short_description: (r.short_description as string) ?? "",
    hero_headline: (r.hero_headline as string) ?? "",
    hero_description: (r.hero_description as string) ?? "",
    hero_image: (r.hero_image as string) ?? "",
    hero_image_alt: (r.hero_image_alt as string) ?? "",
    thumbnail: (r.thumbnail as string) ?? "",
    thumbnail_alt: (r.thumbnail_alt as string) ?? "",
    client: (r.client as string) ?? "",
    role: (r.role as string) ?? "",
    timeline: (r.timeline as string) ?? "",
    scope: (r.scope as string) ?? "",
    team: (r.team as string) ?? "",
    project_type: (r.project_type as string) ?? "",
    blocks,
  };
}

function rowToBlock(r: Record<string, unknown>): CaseStudyBlock {
  return {
    block_type: (r.block_type as string) ?? "",
    eyebrow: (r.eyebrow as string) ?? "",
    heading: (r.heading as string) ?? "",
    description: (r.description as string) ?? "",
    supporting_text: (r.supporting_text as string) ?? "",
    media: (r.media as string) ?? "",
    caption: (r.caption as string) ?? "",
    alt_text: (r.alt_text as string) ?? "",
    metrics: (r.metrics as Metric[]) ?? [],
    layout: (r.layout as string) ?? "",
    visible: (r.visible as boolean) ?? true,
  };
}

export const getContent = cache(async (): Promise<SiteContent> => {
  if (!supabase) return DEFAULTS;
  try {
    const [cs, bl, hc, ci, e, x, t, s] = await Promise.all([
      supabase.from("case_studies").select("*").order("featured_order", { ascending: true }),
      supabase.from("case_study_blocks").select("*").order("sort", { ascending: true }),
      supabase.from("home_categories").select("*").order("sort", { ascending: true }),
      supabase.from("category_images").select("*").order("sort", { ascending: true }),
      supabase.from("experience").select("company,role,period,points").order("sort", { ascending: true }),
      supabase.from("exploration").select("label,image_url").order("sort", { ascending: true }),
      supabase.from("trust").select("label,image_url").order("sort", { ascending: true }),
      supabase.from("site_content").select("key,value"),
    ]);
    if (cs.error || bl.error || hc.error || ci.error || e.error || x.error || t.error || s.error) return DEFAULTS;

    const blocksByStudy: Record<string, CaseStudyBlock[]> = {};
    for (const b of bl.data ?? []) {
      const key = b.case_study_id;
      if (!blocksByStudy[key]) blocksByStudy[key] = [];
      blocksByStudy[key].push(rowToBlock(b));
    }

    const imagesByCat: Record<string, CategoryImage[]> = {};
    for (const img of ci.data ?? []) {
      const key = img.category_key;
      if (!imagesByCat[key]) imagesByCat[key] = [];
      imagesByCat[key].push({
        id: img.id ?? undefined,
        image_url: img.image_url ?? "",
        alt_text: img.alt_text ?? "",
        is_primary: img.is_primary ?? false,
        visible: img.visible ?? true,
        sort: img.sort ?? 0,
        offset_x: img.offset_x ?? 0,
        offset_y: img.offset_y ?? 0,
        rotation: img.rotation ?? 0,
        z_order: img.z_order ?? 0,
      });
    }
    const homeCategories: HomeCategory[] = (hc.data ?? []).map((r) => ({
      id: r.id ?? undefined,
      key: r.key ?? "",
      label: r.label ?? r.key ?? "",
      sort: r.sort ?? 0,
      images: imagesByCat[r.key] ?? [],
    }));

    const site: Record<string, unknown> = {};
    for (const row of s.data ?? []) site[row.key] = row.value;

    return {
      caseStudies: (cs.data ?? []).map((r) => rowToCaseStudy(r, blocksByStudy[r.id] ?? [])),
      homeCategories,
      experience: (e.data ?? []).map((r) => ({
        company: r.company,
        role: r.role,
        period: r.period,
        points: r.points ?? [],
      })),
      exploration: (x.data ?? []).map((r) => ({
        label: r.label,
        image: r.image_url ?? "",
      })),
      trust: (t.data ?? []).map((r) => ({
        label: r.label,
        image: r.image_url ?? "",
      })),
      hero: { ...DEFAULTS.hero, ...(site.hero ?? {}) },
      about: { ...DEFAULTS.about, ...(site.about ?? {}) },
      contact: { ...DEFAULTS.contact, ...(site.contact ?? {}) },
      socials: { ...DEFAULTS.socials, ...(site.socials ?? {}) },
      footer: { ...DEFAULTS.footer, ...(site.footer ?? {}) },
    };
  } catch {
    return DEFAULTS;
  }
});
