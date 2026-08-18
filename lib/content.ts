import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { projects, trustItems, capabilities, industries } from "./projects";

export type Project = {
  slug: string;
  title: string;
  category: string;
  filters: string[];
  role: string;
  year: string;
  image: string;
  desc: string;
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

export type SiteContent = {
  projects: Project[];
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

export const DEFAULTS: SiteContent = {
  projects,
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

export const getContent = cache(async (): Promise<SiteContent> => {
  if (!supabase) return DEFAULTS;
  try {
    const [p, e, x, t, s] = await Promise.all([
      supabase
        .from("projects")
        .select("slug,title,category,filters,role,year,image_url,desc")
        .order("sort", { ascending: true }),
      supabase.from("experience").select("company,role,period,points").order("sort", { ascending: true }),
      supabase.from("exploration").select("label,image_url").order("sort", { ascending: true }),
      supabase.from("trust").select("label,image_url").order("sort", { ascending: true }),
      supabase.from("site_content").select("key,value"),
    ]);
    if (p.error || e.error || x.error || t.error || s.error) return DEFAULTS;

    const site: Record<string, any> = {};
    for (const row of s.data ?? []) site[row.key] = row.value;

    return {
      projects: (p.data ?? []).map((r) => ({
        slug: r.slug,
        title: r.title,
        category: r.category,
        filters: r.filters ?? [],
        role: r.role,
        year: r.year,
        image: r.image_url ?? "",
        desc: r.desc ?? "",
      })),
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