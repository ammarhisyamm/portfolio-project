import { cache } from "react";
import { createClient } from "@supabase/supabase-js";
import { trustItems, capabilities, industries } from "./projects";
import { nomory } from "./case-studies/nomory";
import { offstories } from "./case-studies/offstories";
import { quriz } from "./case-studies/quriz";
import { withGraphicDesign } from "./graphic-design";

export type Metric = { value: string; label: string };

/** One frame of a walkthrough or one version in an evolution strip. */
export type CaseStudyStep = { title: string; description?: string; image: string; alt?: string; /** Device frame for this screen; defaults to the block layout. */ frame?: "phone" | "desktop" };

/** A cluster on the research wall: its sticky notes and what they add up to. */
export type CaseStudyNoteGroup = { theme: string; color: string; notes: string[]; insight?: string };

export type CaseStudyCard = { label?: string; title: string; body: string };

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
  /** Structured extras for the interactive blocks. Code-defined studies only; CMS rows leave them empty. */
  steps?: CaseStudyStep[];
  notes?: CaseStudyNoteGroup[];
  cards?: CaseStudyCard[];
  labels?: [string, string];
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
  /** Looping MP4 used as the cover wherever the study is shown; thumbnail stays its still frame. */
  cover_video?: string;
  thumbnail_alt: string;
  /** Public URL of the shipped product, linked from the case study header. */
  live_url?: string;
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
  images: string[];
  logo?: string;
  /** Show the logo as a solid black mark, and its colour on hover. */
  logoBlack?: boolean;
};

export type ExplorationItem = {
  label: string;
  image: string;
  description?: string;
  focalX?: number;
  focalY?: number;
  cropZoom?: number;
  frameRatio?: number | null;
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
  cvUrl: string;
  cvLabel: string;
  gallery: AboutGalleryItem[];
};

export type AboutGalleryItem = {
  image: string;
  alt: string;
  title: string;
  note: string;
  placeholder: boolean;
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

export type BrandingContent = {
  logo: string;
  profilePhoto: string;
};

export type MenuContent = {
  workLabel: string;
};

export type ProcessStep = { title: string; description: string };

export type ProcessContent = {
  intro: string;
  skills: string[];
  tools: string[];
  steps: ProcessStep[];
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
  /** Optional smaller preview for grids; image_url stays the full image. */
  thumb_url?: string;
  /** Full-length page captures scroll in the lightbox instead of shrinking. */
  scroll?: boolean;
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
  branding: BrandingContent;
  menu: MenuContent;
  process: ProcessContent;
};

const DEFAULT_HOME_CATEGORIES: HomeCategory[] = [
  { id: "website", key: "website", label: "Website", sort: 0, images: [] },
  { id: "dashboard", key: "dashboard", label: "Dashboard", sort: 1, images: [] },
  { id: "mobile", key: "mobile", label: "Mobile", sort: 2, images: [] },
];

const CV_WORKING_EXPERIENCE: ExperienceItem[] = [
  {
    company: "Serba Mulia Group",
    role: "UI/UX Designer - Full Time",
    period: "Nov 2024 - Present",
    logo: "/experience-logos/serba-mulia.png",
    points: [
      "Led product design across 5+ business and internal platforms, including Promas, OCR CRM, Pajak Mas, Cashlux, and Synqra.",
      "Redesigned Promas from research through a new design system for cashier, branch manager, and multi-branch workflows.",
      "Built products from zero to one and managed design architecture across 10+ Figma projects.",
    ],
  },
  {
    company: "Let's Vibe Digital",
    role: "UI/UX Designer - Freelance",
    period: "May 2025 - Jul 2026",
    logo: "/experience-logos/lets-vibe-digital.png",
    logoBlack: true,
    points: [
      "Designed responsive web applications for Australian enterprise clients, including Big Rock Developments, RenoPlus, VV Construction, and VSCO Pty.",
      "Delivered the end-to-end design process from visual direction and wireframes to responsive UI and stakeholder revisions.",
    ],
  },
  {
    company: "Caraka Studio",
    role: "UI/UX Designer - Full Time",
    period: "Aug 2024 - Nov 2024",
    logo: "/experience-logos/caraka-studio.svg",
    points: [
      "Created three reusable mobile UI kits for Zenspace IoT, Sporty News, and TRVLEASE Travel, covering 210+ screens.",
      "Delivered two full-cycle client projects from concepts and user flows to high-fidelity design and final delivery.",
    ],
  },
  {
    company: "Serasi Autoraya",
    role: "UI/UX Designer - Full Time",
    period: "Feb 2024 - Jul 2024",
    logo: "/experience-logos/serasi-autoraya.png",
    points: [
      "Led qualitative research for SELOG, a B2B fleet logistics platform, through 10+ interviews and competitor analysis that generated 100+ actionable insights.",
      "Designed the responsive SELOG experience across 14+ screens and a reusable design system with 25+ components.",
      "Presented the product vision and design direction to the Board of Directors to align the digital transformation work.",
    ],
  },
].map((e) => ({ ...e, images: [] }));

const DEFAULT_EXPERIENCE = CV_WORKING_EXPERIENCE;

function cvExperience(items: ExperienceItem[]): ExperienceItem[] {
  const sourceByCompany = new Map(items.map((item) => [item.company, item]));
  return CV_WORKING_EXPERIENCE.map((item) => ({
    ...item,
    images: sourceByCompany.get(item.company)?.images?.filter(Boolean) ?? [],
  }));
}

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
  homeCategories: withGraphicDesign(DEFAULT_HOME_CATEGORIES),
  experience: DEFAULT_EXPERIENCE,
  exploration: DEFAULT_EXPLORATION,
  trust: trustItems.map((label) => ({ label, image: "" })),
  hero: {
    name: "Hisyam",
    title: "Product Designer (UI/UX)",
    headline: "I design thoughtful digital products that make complex experiences feel simple.",
    intro:
      "I help teams turn ideas into clear, useful, and engaging experiences across fintech, SaaS, marketplaces, dashboards, and AI-powered products.",
    available: true,
  },
  about: {
    introTitle: "Hey, I'm Hisyam. I design B2B and AI products that feel simple to use.",
    introBody:
      "Product designer with 4.5+ years of experience, taking products from the first research question to a clean developer handoff.",
    philosophyTitle: "Make the complex legible.",
    philosophyBody:
      "I design with structure and restraint. Every flow, screen, and pattern should earn its place and make the next decision easier for both users and the team building it.",
    background: [
      "In-house, agency, and freelance work across fintech, SaaS, marketplaces, education, security, communication, and AI. I stay involved from strategy and research through interaction, visual design, and developer handoff.",
    ],
    tools:
      "Figma, FigJam, Adobe tools, Photopea, Notion, and AI-assisted design and research tools. I work openly with product, engineering, and stakeholders to turn decisions into momentum.",
    capabilities,
    industries,
    cvUrl: "",
    cvLabel: "Download CV",
    gallery: [
      {
        image: "/about-gallery/desk.jpg",
        alt: "Sample album photo of a sketchbook and coffee by a window",
        title: "A little space to notice",
        note: "This is a sample photo and note. I'll replace it with a moment from my own album soon.",
        placeholder: true,
      },
      {
        image: "/about-gallery/walk.jpg",
        alt: "Sample album photo of a quiet city street",
        title: "Outside the screen",
        note: "A small pause between projects. This sample frame is ready for a real photo and story from my gallery.",
        placeholder: true,
      },
      {
        image: "/about-gallery/coffee.jpg",
        alt: "Sample album photo of coffee cups near a street window",
        title: "The in-between moments",
        note: "Some memories are ordinary in the best way. This sample will become a personal album note when I add my own photo.",
        placeholder: true,
      },
    ],
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
  branding: {
    logo: "",
    profilePhoto: "",
  },
  menu: {
    workLabel: "Playground",
  },
  process: {
    intro: "How I work: what I bring to a team, the skills and tools behind it, and the steps that take a product from question to handoff.",
    skills: [
      "User interviews",
      "Journey mapping",
      "Information architecture",
      "Responsive design",
      "Accessibility",
      "Design tokens",
      "Stakeholder alignment",
    ],
    tools: ["Figma", "FigJam", "Adobe tools", "Photopea", "Notion", "AI-assisted design and research tools"],
    steps: [
      { title: "Understand", description: "Clarify the business context, users, and constraints before anything is drawn. Research, stakeholder interviews, and framing the problem space." },
      { title: "Structure", description: "Map user flows and information architecture. Wireframes turn the messy middle into a usable model the whole team can react to." },
      { title: "Refine", description: "Build the visual system, interaction details, and responsive behavior. Prototypes let teams feel the product before it ships." },
      { title: "Hand off", description: "Design-to-development handoff with documented patterns, specs, and checkpoints so engineering can move with confidence." },
    ],
  },
};

function withProcess(value: unknown): ProcessContent {
  const v = (value ?? {}) as Partial<ProcessContent>;
  const list = (items: unknown, fallback: string[]) => {
    const clean = Array.isArray(items) ? items.filter((item): item is string => typeof item === "string" && item.trim() !== "") : [];
    return clean.length ? clean : fallback;
  };
  const steps = Array.isArray(v.steps) ? v.steps.filter((step) => step && typeof step.title === "string" && step.title.trim()) : [];
  return {
    intro: typeof v.intro === "string" && v.intro.trim() ? v.intro : DEFAULTS.process.intro,
    skills: list(v.skills, DEFAULTS.process.skills),
    tools: list(v.tools, DEFAULTS.process.tools),
    steps: steps.length ? steps.map((step) => ({ title: step.title, description: step.description ?? "" })) : DEFAULTS.process.steps,
  };
}

const caseStudyBlock = (
  block_type: string,
  eyebrow: string,
  heading: string,
  description: string,
  supporting_text = ""
): CaseStudyBlock => ({
  block_type,
  eyebrow,
  heading,
  description,
  supporting_text,
  media: "",
  caption: "",
  alt_text: "",
  metrics: [],
  layout: "",
  visible: true,
});

const PORTFOLIO_CASE_STUDIES: CaseStudy[] = [
  offstories,
  nomory,
  quriz,
  {
    slug: "jeam", title: "Jeam", published: true, featured: true, featured_order: 1,
    year: "2024", category: "Mobile product - Fitness training", industry: "Health and fitness", platform: "Mobile", project_status: "Concept",
    short_description: "A mobile fitness training concept designed around flexible routines, tailored guidance, and motivation between sessions.",
    hero_headline: "A more personal path to everyday fitness.",
    hero_description: "Jeam explores how a trainer-led fitness product can make personalized workout guidance feel flexible, encouraging, and easy to return to.",
    hero_image: "", hero_image_alt: "", thumbnail: "", thumbnail_alt: "", client: "Concept project", role: "UI/UX Designer", timeline: "2024", scope: "Mobile UX - UI design - Product concept", team: "Collaborative project", project_type: "Fitness mobile app",
    blocks: [
      caseStudyBlock("INTRO", "The opportunity", "Fitness guidance should flex around real schedules.", "Jeam is a fitness trainer mobile concept that explores personalized programs, accessible sessions, and the motivation that helps people stay engaged between workouts.", "The work focuses on the mobile experience and product framing rather than making claims about a shipped service."),
      caseStudyBlock("CHALLENGE", "The design problem", "Generic routines and rigid timing are easy to abandon.", "The concept starts from a familiar fitness tension: people need guidance that fits their goals and availability, but not another complex plan to manage. The interface has to make a program feel tailored while keeping the next workout easy to find.", "Motivation also needs to be supportive, not performative."),
      caseStudyBlock("DESIGN_DIRECTION", "Product strategy", "Connect a clear plan with flexible sessions.", "The proposed experience centers on a personalized training path, on-demand workout sessions, and guidance that can adapt to a person’s level and preferences. Community and feedback are treated as optional support layers, not requirements before someone can start.", "This keeps the product useful for both beginners and people returning to a routine."),
      caseStudyBlock("UI_DESIGN", "Interface direction", "Keep movement, progress, and coaching legible at a glance.", "The mobile visual system prioritizes active states, session information, and clear calls to action. High contrast and strong hierarchy help the most important decision stand out: what to do next.", "The final visual direction is documented in the original Behance project."),
      caseStudyBlock("OUTCOME", "Current outcome", "A documented mobile product concept with a public design presentation.", "Jeam is presented as a concept case study. No product adoption or outcome metrics are claimed because a public measurement source was not available during this audit.", "The value of the work is the product framing and interface direction, not an invented business result."),
      caseStudyBlock("REFLECTION", "What comes next", "Test the moments that decide whether a routine becomes a habit.", "A next validation step would compare onboarding confidence, first-session completion, and return behavior across different levels of program personalization."),
    ],
  },
];

function enrichPortfolioCaseStudies(caseStudies: CaseStudy[]) {
  const sourceBySlug = new Map(caseStudies.map((study) => [study.slug, study]));
  const enriched = PORTFOLIO_CASE_STUDIES.map((study) => {
    const source = sourceBySlug.get(study.slug);
    return source ? { ...source, ...study, id: source.id } : study;
  });
  const untouched = caseStudies.filter((study) => !PORTFOLIO_CASE_STUDIES.some((item) => item.slug === study.slug));
  return [...enriched, ...untouched];
}

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
  if (!supabase) return { ...DEFAULTS, caseStudies: enrichPortfolioCaseStudies(DEFAULTS.caseStudies) };
  try {
    const [cs, bl, hc, ci, e, x, t, s] = await Promise.all([
      supabase.from("case_studies").select("*").order("featured_order", { ascending: true }),
      supabase.from("case_study_blocks").select("*").order("sort", { ascending: true }),
      supabase.from("home_categories").select("*").order("sort", { ascending: true }),
      supabase.from("category_images").select("*").order("sort", { ascending: true }),
      supabase.from("experience").select("company,role,period,points,images").order("sort", { ascending: true }),
      supabase.from("exploration").select("label,image_url,description,focal_x,focal_y,crop_zoom,frame_ratio").order("sort", { ascending: true }),
      supabase.from("trust").select("label,image_url").order("sort", { ascending: true }),
      supabase.from("site_content").select("key,value"),
    ]);
    if (cs.error || bl.error || hc.error || ci.error || e.error || x.error || t.error || s.error) {
      return { ...DEFAULTS, caseStudies: enrichPortfolioCaseStudies(DEFAULTS.caseStudies) };
    }

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
      caseStudies: enrichPortfolioCaseStudies(
        (cs.data ?? []).map((r) => rowToCaseStudy(r, blocksByStudy[r.id] ?? []))
      ),
      homeCategories: withGraphicDesign(homeCategories),
      experience: cvExperience(
        (e.data ?? []).map((r) => ({
          company: r.company,
          role: r.role,
          period: r.period,
          points: r.points ?? [],
          images: r.images ?? [],
        }))
      ),
      exploration: (x.data ?? []).map((r) => ({
        label: r.label,
        image: r.image_url ?? "",
        description: r.description ?? "",
        focalX: r.focal_x ?? 50,
        focalY: r.focal_y ?? 50,
        cropZoom: r.crop_zoom ?? 100,
        frameRatio: r.frame_ratio === null ? null : Number(r.frame_ratio),
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
      branding: { ...DEFAULTS.branding, ...(site.branding ?? {}) },
      menu: { ...DEFAULTS.menu, ...(site.menu ?? {}) },
      process: withProcess(site.process),
    };
  } catch {
    return { ...DEFAULTS, caseStudies: enrichPortfolioCaseStudies(DEFAULTS.caseStudies) };
  }
});
