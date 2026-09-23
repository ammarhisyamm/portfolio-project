import type { Metadata } from "next";
import Link from "next/link";
import GitHubActivity from "@/components/GitHubActivity";
import { getContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Hisyam's background, design approach, capabilities, and recent work on GitHub.",
};

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
        <h2 id="capabilities-title" className="text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">Capabilities</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {about.capabilities.map((item) => <span key={item} className="rounded-full border border-line bg-bg px-3 py-2 text-xs text-sub">{item}</span>)}
        </div>
        <div className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium">Industries</h3>
            <p className="mt-3 text-sm leading-relaxed text-sub">{about.industries.join(", ")}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium">Tools and collaboration</h3>
            <p className="mt-3 text-sm leading-relaxed text-sub">{about.tools}</p>
          </div>
        </div>
      </section>

      <GitHubActivity username={username} />
    </div>
  );
}
