import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import GitHubActivity from "@/components/GitHubActivity";
import AboutPhotoCarousel from "@/components/AboutPhotoCarousel";
import { getContent } from "@/lib/content";
import { industryMeta } from "@/lib/industry-meta";
import { capabilityMeta } from "@/lib/capability-meta";
import { toolLogos } from "@/lib/tool-logos";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about Hisyam's background, design approach, capabilities, and recent work on GitHub.",
};

export default async function AboutUsPage() {
  const { about, socials, contact, experience } = await getContent();
  const current = experience.find((item) => /present/i.test(item.period));
  const facts = [
    current && { label: "Currently", value: `${current.role.split(" - ")[0]} at ${current.company}` },
    contact.location && { label: "Based in", value: contact.location },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact));
  const githubUrl = socials.items.find((item) => item.type === "github")?.href ?? "";
  const username = githubUrl.match(/github\.com\/([^/?#]+)/i)?.[1] ?? "ammarhisyamm";

  return (
    <div className="page-stack grid pb-16 pt-3">
      <section className="panel p-5 sm:p-8">
        <span className="kicker">About</span>
        <h1 className="mt-5 max-w-[560px] text-balance text-[clamp(28px,4.4vw,36px)] font-normal leading-[1.1] tracking-[-0.05em]">
          {about.introTitle}
        </h1>
        <p className="mt-4 max-w-[52ch] leading-relaxed text-sub">{about.introBody}</p>
        {facts.length > 0 && (
          <dl className="mt-6 grid gap-x-8 gap-y-3 border-t border-line pt-5 sm:grid-cols-2">
            {facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-[11px] uppercase tracking-[0.02em] text-muted">{fact.label}</dt>
                <dd className="mt-1 text-sm">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/contact" className="btn btn-primary">Get in touch</Link>
          {about.cvUrl && (
            <a className="btn btn-secondary" href={about.cvUrl} target="_blank" rel="noreferrer">
              {about.cvLabel || "View CV"}
            </a>
          )}
        </div>
      </section>

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
