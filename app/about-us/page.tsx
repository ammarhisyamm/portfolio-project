import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Crosshair,
  FileSearch,
  Heart,
  Landmark,
  Layers3,
  MessageCircle,
  MousePointer2,
  Palette,
  PanelsTopLeft,
  Play,
  Search,
  Sparkles,
  UserRoundCheck,
  type LucideIcon,
} from "lucide-react";
import GitHubActivity from "@/components/GitHubActivity";
import AboutPhotoCarousel from "@/components/AboutPhotoCarousel";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Hisyam's background, design approach, capabilities, and recent work on GitHub.",
};

type ItemMeta = { icon: LucideIcon; tone: string };

const capabilityMeta: Record<string, ItemMeta> = {
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

const industryMeta: Record<string, LucideIcon> = {
  fintech: Landmark,
  saas: Cloud,
  marketplaces: BriefcaseBusiness,
  education: BookOpen,
  enterprise: BriefcaseBusiness,
  communication: MessageCircle,
  "ai products": Sparkles,
  lifestyle: Heart,
};

const toolLogos = [
  { name: "Figma", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/figma.svg" },
  { name: "Notion", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/notion.svg" },
  { name: "Slack", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/slack.svg" },
  { name: "Adobe", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/adobe.svg" },
  { name: "Photopea", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/photopea.svg" },
  { name: "OpenAI", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openai.svg" },
  { name: "Miro", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/miro.svg" },
  { name: "GitHub", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg" },
  { name: "Jira", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/jira.svg" },
  { name: "Jitter", src: "https://jitter.video/favicon.svg" },
  { name: "Framer", src: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/framer.svg" },
  { name: "OpenCode", src: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/opencode.svg" },
  { name: "Whimsical", src: "https://cdn.brandfetch.io/whimsical.com/w/128/h/128/theme/light/icon" },
];

export default async function AboutUsPage() {
  const { about, socials } = await getContent();
  const githubUrl = socials.items.find((item) => item.type === "github")?.href ?? "";
  const username = githubUrl.match(/github\.com\/([^/?#]+)/i)?.[1] ?? "ammarhisyamm";

  return (
    <div className="page-stack grid pb-16 pt-3">
      <section className="panel p-5 sm:p-8">
        <span className="kicker">About Us</span>
        <h1 className="mt-5 max-w-[640px] text-[clamp(26px,4vw,32px)] font-normal leading-[1.12] tracking-[-0.05em]">
          {about.introTitle}
        </h1>
        <p className="mt-5 max-w-[60ch] leading-relaxed text-sub">{about.introBody}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">Get in touch</Link>
          {about.cvUrl && (
            <a className="btn btn-secondary" href={about.cvUrl} target="_blank" rel="noreferrer">
              {about.cvLabel || "View CV"}
            </a>
          )}
        </div>
      </section>

      <AboutPhotoCarousel items={about.gallery ?? []} />

      <section className="panel p-5 sm:p-8" aria-labelledby="approach-title">
        <span className="kicker">How I work</span>
        <h2 id="approach-title" className="mt-4 text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">
          {about.philosophyTitle}
        </h2>
        <p className="mt-4 leading-relaxed text-sub">{about.philosophyBody}</p>
        <div className="mt-7 border-t border-line pt-6">
          <h3 className="text-base font-medium">Background</h3>
          <div className="mt-3 grid gap-3 text-sm leading-relaxed text-sub">
            {about.background.map((item, index) => <p key={`${index}-${item}`}>{item}</p>)}
          </div>
        </div>
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="capabilities-title">
        <div>
          <h2 id="capabilities-title" className="text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">Capabilities</h2>
          <p className="mt-1 text-sm text-sub">What I help with across the product lifecycle.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-2.5">
          {about.capabilities.map((item) => {
            const meta = capabilityMeta[item.toLowerCase()] ?? { icon: Sparkles, tone: "slate" };
            const Icon = meta.icon;
            return (
              <span key={item} className="about-skill-chip" data-tone={meta.tone}>
                <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
                {item}
              </span>
            );
          })}
        </div>
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="industries-title">
        <div>
          <h2 id="industries-title" className="text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">Industries</h2>
          <p className="mt-1 text-sm text-sub">Domains I&apos;ve designed for.</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {about.industries.map((item) => {
            const Icon = industryMeta[item.toLowerCase()] ?? Sparkles;
            return <span key={item} className="about-industry-chip"><Icon size={15} strokeWidth={1.8} aria-hidden="true" />{item}</span>;
          })}
        </div>
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="tools-title">
        <div>
          <h2 id="tools-title" className="text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">Tools and collaboration</h2>
          <p className="mt-1 text-sm text-sub">Tools I use to design, research, and collaborate.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3" aria-label="Design and collaboration tools">
          {toolLogos.map((tool) => (
            <span key={tool.name} className="about-tool-logo" data-name={tool.name} title={tool.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tool.src} alt={tool.name} />
            </span>
          ))}
        </div>
      </section>

      <GitHubActivity username={username} />
    </div>
  );
}
