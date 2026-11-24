import type { Metadata } from "next";
import { Sparkles } from "lucide-react";

import GitHubActivity from "@/components/GitHubActivity";
import AboutPhotoCarousel from "@/components/AboutPhotoCarousel";
import { getContent } from "@/lib/content";
import { industryMeta } from "@/lib/industry-meta";
import { capabilityMeta } from "@/lib/capability-meta";
import { toolLogos } from "@/lib/tool-logos";

export const metadata: Metadata = {
  title: "About Ammar Hisyam Fakhrudin | Product Designer",
  description: "Meet Hisyam, a product designer in Jakarta. Read how I work, where I have worked, and the products I build on my own.",
  alternates: { canonical: "/about-us" },
};

export default async function AboutUsPage() {
  const { about, socials } = await getContent();
  const githubUrl = socials.items.find((item) => item.type === "github")?.href ?? "";
  const username = githubUrl.match(/github\.com\/([^/?#]+)/i)?.[1] ?? "ammarhisyamm";

  const industryLabels: Record<string, string> = {
    Enterprise: "Internal tools",
    Fintech: "Financial services",
  };
  // These sectors appear in the Website, Dashboard and Mobile exploration collections.
  const exploredSectors = [
    "Logistics", "Travel", "Real estate", "Healthcare", "Food & beverage",
    "Retail", "Sports", "Events", "Gaming", "Media", "Recruitment",
    "Fundraising", "Home services", "Creative services",
  ];
  const sectors = [...new Set([...about.industries, ...exploredSectors])];

  return (
    <div className="page-stack grid pb-16 pt-3">
      <section className="panel p-5 sm:p-8">
        <span className="kicker">About</span>
        <h1 className="t-display mt-3 max-w-[600px]">
          {about.introTitle}
        </h1>
        <p className="t-lede mt-4">{about.introBody}</p>
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="approach-title">
        <span className="kicker">How I work</span>
        <h2 id="approach-title" className="t-title mt-3">
          {about.philosophyTitle}
        </h2>
        <p className="t-lede mt-3">{about.philosophyBody}</p>
        <div className="mt-7 border-t border-line pt-6">
          <h3 className="t-h3">Background</h3>
          <div className="mt-3 grid max-w-[640px] gap-3 text-[14.5px] leading-[1.65] text-sub">
            {about.background.map((item, index) => <p key={`${index}-${item}`}>{item}</p>)}
          </div>
        </div>
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="capabilities-title">
        <div>
          <h2 id="capabilities-title" className="t-title">How I can help</h2>
          <p className="t-lede mt-2">From understanding the people involved to getting the design built.</p>
        </div>
        {[
          { title: "Understand the problem", items: ["Product strategy", "UX research", "Competitor analysis", "Product audits"] },
          { title: "Shape the experience", items: ["User flows and information architecture", "Wireframing", "Prototyping", "Interaction design"] },
          { title: "Design and refine", items: ["Visual design", "Design systems", "Usability testing", "Design-to-development handoff", "Developer handoff"] },
        ].map((group) => {
          const items = group.items.filter((item) => about.capabilities.includes(item));
          return items.length ? <div key={group.title} className="mt-6 border-t border-line pt-5">
            <h3 className="kicker">{group.title}</h3>
            <div className="mt-3 flex flex-wrap gap-2.5">{items.map((item) => {
              const meta = capabilityMeta[item.toLowerCase()] ?? { icon: Sparkles, tone: "slate" };
              const Icon = meta.icon;
              return <span key={item} className="about-skill-chip" data-tone={meta.tone}><Icon size={16} strokeWidth={1.9} aria-hidden="true" />{item}</span>;
            })}</div>
          </div> : null;
        })}
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="industries-title">
        <div>
          <h2 id="industries-title" className="t-title">Products and sectors</h2>
          <p className="t-lede mt-2">Areas I’ve designed for in projects and explorations.</p>
        </div>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {sectors.map((sector) => {
            const Icon = industryMeta[sector.toLowerCase()] ?? Sparkles;
            return (
              <li key={sector} className="about-industry-chip">
                <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                {industryLabels[sector] ?? sector}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="panel p-5 sm:p-8" aria-labelledby="tools-title">
        <div>
          <h2 id="tools-title" className="t-title">Tools and collaboration</h2>
          <p className="t-lede mt-2">Tools I use to map ideas, design interfaces, build prototypes, and work with the team.</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3" aria-label="Design and collaboration tools">
          {toolLogos.map((tool) => (
            <span key={tool.name} className="about-tool-logo" data-name={tool.name} title={tool.name} role="img" aria-label={tool.name} tabIndex={0}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tool.src} alt="" aria-hidden="true" />
            </span>
          ))}
        </div>
      </section>

      <GitHubActivity username={username} />

      <AboutPhotoCarousel items={about.gallery ?? []} />
    </div>
  );
}
