import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getContent, type CaseStudy } from "@/lib/content";
import CaseStudyBlockView from "@/components/CaseStudyBlockView";
import Media from "@/components/Media";
import Reveal from "@/components/Reveal";
import CategoryGallery from "@/components/CategoryGallery";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const content = await getContent();
  const cs = content.caseStudies.find((c) => c.slug === slug && c.published);
  const cat = content.homeCategories.find((c) => c.key === slug);
  if (cs) return { title: cs.title, description: cs.short_description || cs.hero_description || undefined };
  if (cat) return { title: cat.label, description: `${cat.label} — design exploration archive` };
  return { title: "Work" };
}

function projectInfo(cs: CaseStudy): [string, string][] {
  const rows: [string, string][] = [];
  const fields: [string, string][] = [
    ["Client", cs.client],
    ["Role", cs.role],
    ["Timeline", cs.timeline],
    ["Scope", cs.scope],
    ["Team", cs.team],
    ["Platform", cs.platform],
    ["Project type", cs.project_type],
    ["Year", cs.year],
    ["Industry", cs.industry],
    ["Status", cs.project_status],
  ];
  for (const [label, value] of fields) {
    if (value && value.trim()) rows.push([label, value]);
  }
  return rows;
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const content = await getContent();
  const published = content.caseStudies.filter((c) => c.published);
  const cs = published.find((c) => c.slug === slug);

  if (!cs) {
    const cat = content.homeCategories.find((c) => c.key === slug);
    if (!cat) notFound();
    return <CategoryGallery cat={cat} />;
  }

  const ordered = [...published].sort((a, b) => a.featured_order - b.featured_order);
  const idx = ordered.findIndex((c) => c.slug === slug);
  const next = ordered.length > 1 ? ordered[(idx + 1) % ordered.length] : null;
  const blocks = cs.blocks.filter((b) => b.visible);
  const info = projectInfo(cs);

  const meta = [cs.category, cs.year, cs.platform, cs.project_status].filter(Boolean).join(" · ");
  const heroImage = cs.hero_image || cs.thumbnail;

  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <div className="grid gap-3 md:gap-4">
        <Link
          href="/work"
          className="flex w-fit items-center gap-1.5 px-0.5 text-[13px] text-sub no-underline transition-colors hover:text-ink"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to work
        </Link>

        <Reveal className="panel grid gap-5 p-5 sm:p-8">
          {meta && <span className="kicker">{meta}</span>}
          <h1 className="text-[clamp(26px,4vw,32px)] font-normal leading-[1.08] tracking-[-0.05em]">
            {cs.hero_headline || cs.title}
          </h1>
          {cs.hero_description && (
            <p className="max-w-[640px] text-[15px] leading-[1.7] text-sub sm:text-[16px]">
              {cs.hero_description}
            </p>
          )}
        </Reveal>

        {heroImage && (
          <div className="aspect-[16/9] w-full overflow-hidden rounded-[18px] border border-line bg-bg sm:rounded-[24px]">
            <Media
              src={heroImage}
              alt={cs.hero_image_alt || cs.hero_description || `Visual for ${cs.title}`}
              label={cs.title}
            />
          </div>
        )}

        {info.length > 0 && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8">
            {info.map(([label, value]) => (
              <div key={label} className="grid content-start gap-1.5">
                <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted">{label}</span>
                <span className="text-[13px] leading-relaxed text-ink">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {blocks.length > 0 && (
        <div className="grid gap-3 md:gap-4">
          {blocks.map((b, i) => (
            <CaseStudyBlockView key={`${i}-${b.block_type}`} block={b} />
          ))}
        </div>
      )}

      {next && (
        <Link
          href={`/work/${next.slug}`}
          className="group mt-4 flex flex-col gap-5 overflow-hidden rounded-[18px] border border-line bg-panel p-5 transition-colors duration-300 hover:border-line-strong sm:rounded-[22px] sm:p-8 lg:rounded-[24px] lg:p-10"
        >
          <span className="kicker">Next case study</span>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="grid gap-3">
              <h2 className="text-[clamp(24px,4vw,32px)] font-normal leading-[1.1] tracking-[-0.05em]">
                {next.title}
              </h2>
              {next.short_description && (
                <p className="max-w-[520px] text-[14px] leading-relaxed text-sub">{next.short_description}</p>
              )}
            </div>
            <span className="grid h-12 w-12 place-items-center rounded-full border border-line-strong transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowRight size={18} aria-hidden="true" />
            </span>
          </div>
          {next.thumbnail && (
            <div className="aspect-[16/8] w-full overflow-hidden rounded-[14px] border border-line bg-bg sm:rounded-[18px]">
              <Media
                src={next.thumbnail}
                alt={next.thumbnail_alt || `Visual for ${next.title}`}
                label={next.title}
                imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />
            </div>
          )}
        </Link>
      )}
    </div>
  );
}