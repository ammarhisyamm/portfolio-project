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

export const projects: Project[] = [
  {
    slug: "gadai-mulia",
    title: "Gadai Mulia",
    category: "Fintech / Mobile Application",
    filters: ["Fintech", "Mobile"],
    role: "Product design, UX/UI",
    year: "2024",
    image: "",
    desc: "A digital pawnbroking and financial service experience designed to make transactions more accessible and understandable.",
  },
  {
    slug: "synqra",
    title: "Synqra",
    category: "SaaS / Productivity",
    filters: ["SaaS", "Web"],
    role: "Product strategy, UX/UI",
    year: "2024",
    image: "",
    desc: "A meeting notes and workflow platform that helps teams turn discussions into actionable work.",
  },
  {
    slug: "drawtopia",
    title: "Drawtopia",
    category: "AI / Creative Platform",
    filters: ["AI", "Web"],
    role: "Interaction design, visual system",
    year: "2023",
    image: "",
    desc: "An AI-assisted story-generation experience that helps users create imaginative content.",
  },
  {
    slug: "task-sharing",
    title: "Task-sharing platform",
    category: "Marketplace / Gig Economy",
    filters: ["Marketplace", "Mobile"],
    role: "UX research, end-to-end design",
    year: "2023",
    image: "",
    desc: "A platform connecting people who need tasks completed with trusted service providers.",
  },
  {
    slug: "threat-intelligence",
    title: "Threat intelligence dashboard",
    category: "Enterprise / Data Visualization",
    filters: ["Enterprise", "Web"],
    role: "Information architecture, UI",
    year: "2022",
    image: "",
    desc: "A structured dashboard for monitoring threats, incidents, and security information.",
  },
  {
    slug: "omnichannel",
    title: "Omnichannel communication platform",
    category: "SaaS / Communication",
    filters: ["SaaS", "Web"],
    role: "Product design, design system",
    year: "2022",
    image: "",
    desc: "A unified communication product for managing conversations across multiple channels.",
  },
  {
    slug: "wedding-dashboard",
    title: "Wedding planning dashboard",
    category: "Lifestyle / Web Application",
    filters: ["Web", "Mobile"],
    role: "UX/UI design",
    year: "2021",
    image: "",
    desc: "A planning workspace for organizing wedding tasks, vendors, schedules, and budgets.",
  },
  {
    slug: "english-learning",
    title: "TOEFL & IELTS learning platform",
    category: "Education / Learning Platform",
    filters: ["Education", "Mobile", "Web"],
    role: "UX/UI design, prototyping",
    year: "2021",
    image: "",
    desc: "A focused learning platform for users preparing for English proficiency examinations.",
  },
];

export const FILTERS = ["All", "Fintech", "SaaS", "Mobile", "Web", "AI", "Enterprise", "Marketplace", "Education"];

export const homeSpans = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-4",
  "lg:col-span-6",
  "lg:col-span-6",
  "lg:col-span-12",
];

export const trustItems = [
  "Serba Mulia Group",
  "Peak Haven",
  "Gadai Mulia",
  "Synqra",
  "Drawtopia",
  "Base44",
  "Fintech products",
  "SaaS platforms",
  "AI-powered tools",
];

export const capabilities = [
  "Product strategy",
  "UX research",
  "User flows & IA",
  "Wireframing",
  "Prototyping",
  "Interaction design",
  "Visual design",
  "Design systems",
  "Usability testing",
  "Design handoff",
  "Competitor analysis",
  "Product audits",
];

export const industries = [
  "Fintech",
  "SaaS",
  "Marketplaces",
  "Education",
  "Enterprise",
  "Communication",
  "AI products",
  "Lifestyle",
];