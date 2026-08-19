import { ArrowUpRight } from "lucide-react";
import type { CaseStudyBlock } from "@/lib/content";
import Media from "./Media";

const ARTICLE_TYPES = new Set([
  "INTRO",
  "CHALLENGE",
  "CONTEXT",
  "RESEARCH",
  "INTERVIEW",
  "COMPETITOR_ANALYSIS",
  "INSIGHTS",
  "DESIGN_DIRECTION",
  "USER_FLOW",
  "INFORMATION_ARCHITECTURE",
  "WIREFRAMES",
  "EXPLORATION",
  "INTERACTION_DESIGN",
  "UI_DESIGN",
  "DESIGN_SYSTEM",
  "OUTCOME",
  "REFLECTION",
]);

function mediaList(block: CaseStudyBlock): string[] {
  return (block.media ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasContent(block: CaseStudyBlock): boolean {
  return Boolean(
    block.eyebrow ||
      block.heading ||
      block.description ||
      block.supporting_text ||
      block.caption ||
      (block.media ?? "").trim() ||
      (block.metrics?.length ?? 0) > 0
  );
}

function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (url.includes("figma.com")) return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(url)}`;
  return null;
}

export default function CaseStudyBlockView({ block }: { block: CaseStudyBlock }) {
  if (!block.visible || !hasContent(block)) return null;
  const medias = mediaList(block);
  const text = (
    <div className="grid gap-4">
      {block.heading && (
        <h2 className="text-[clamp(24px,3vw,34px)] font-normal leading-[1.12] tracking-[-0.05em]">
          {block.heading}
        </h2>
      )}
      {block.description && (
        <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>
      )}
      {block.supporting_text && (
        <p className="max-w-[560px] border-l border-line-strong pl-4 text-[13px] leading-[1.65] text-muted">
          {block.supporting_text}
        </p>
      )}
    </div>
  );

  const figure = (src: string, overlay?: string, className?: string) => (
    <figure className={className}>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[14px] border border-line bg-bg sm:rounded-[18px]">
        <Media src={src} alt={block.alt_text || block.caption || "Case study visual"} label={block.caption || "Media"} />
        {overlay && (
          <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-3 py-1  text-[10px] uppercase tracking-[0.08em] text-white backdrop-blur">
            {overlay}
          </span>
        )}
      </div>
      {block.caption && (
        <figcaption className="mt-2.5  text-[11px] leading-relaxed tracking-[0.02em] text-muted">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );

  switch (block.block_type) {
    case "METRIC_HIGHLIGHT":
      return (
        <section className="grid gap-3 md:gap-4">
          <div className="grid gap-4 border-t border-line pt-8">
            <span className="kicker">{block.eyebrow || "Metrics"}</span>
            <div className="grid gap-4">
              {block.heading && <h2 className="text-[clamp(24px,3vw,34px)] leading-[1.12] tracking-[-0.05em]">{block.heading}</h2>}
              {block.description && <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
            </div>
          </div>
          {(block.metrics?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
              {block.metrics.map((m, i) => (
                <div key={i} className="rounded-[14px] border border-line bg-panel p-5 sm:rounded-[18px]">
                  <div className="text-[clamp(28px,3.6vw,46px)] font-medium leading-none tracking-[-0.05em]">{m.value}</div>
                  <div className="mt-3  text-[11px] uppercase tracking-[0.02em] text-muted">{m.label}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      );

    case "QUOTE":
      return (
        <section className="grid gap-3 md:gap-4">
          <div className="grid gap-4 border-t border-line pt-8">
            <span className="kicker">{block.eyebrow || "Quote"}</span>
            <figure className="grid gap-5">
              <blockquote className="text-[clamp(22px,3vw,32px)] font-normal leading-[1.25] tracking-[-0.04em]">
                {block.description || block.heading}
              </blockquote>
              {block.supporting_text && (
                <figcaption className=" text-[11px] uppercase tracking-[0.02em] text-muted">
                  — {block.supporting_text}
                </figcaption>
              )}
            </figure>
          </div>
        </section>
      );

    case "IMAGE_GALLERY":
      return (
        <section className="grid gap-3 md:gap-4">
          <div className="grid gap-4 border-t border-line pt-8">
            <span className="kicker">{block.eyebrow || "Gallery"}</span>
            <div className="grid gap-4">
              {block.heading && <h2 className="text-[clamp(24px,3vw,34px)] leading-[1.12] tracking-[-0.05em]">{block.heading}</h2>}
              {block.description && <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
            </div>
          </div>
          {medias.length > 0 && (
            <div className={`grid gap-3 md:gap-4 ${medias.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {medias.map((m, i) => (
                <figure key={i}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[14px] border border-line bg-bg sm:rounded-[18px]">
                    <Media src={m} alt={block.alt_text || `${block.heading || "Gallery"} ${i + 1}`} label={block.caption || "Media"} />
                  </div>
                  {block.caption && i === 0 && (
                    <figcaption className="mt-2.5  text-[11px] leading-relaxed text-muted">{block.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          )}
        </section>
      );

    case "FULL_WIDTH_MEDIA":
      return medias.length ? (
        <figure className="grid gap-2">
          <div className="aspect-[16/9] w-full overflow-hidden rounded-[14px] border border-line bg-bg sm:rounded-[18px]">
            <Media src={medias[0]} alt={block.alt_text || block.caption || "Full-width media"} label={block.caption || "Media"} />
          </div>
          {block.caption && (
            <figcaption className="px-1  text-[11px] leading-relaxed text-muted">{block.caption}</figcaption>
          )}
        </figure>
      ) : null;

    case "TEXT_WITH_MEDIA": {
      if (!medias.length) {
        return (
          <section className="grid gap-3 md:gap-4">
            <div className="grid gap-4 border-t border-line pt-8">
              <span className="kicker">{block.eyebrow || "Detail"}</span>
              {text}
            </div>
          </section>
        );
      }
      const reversed = block.layout === "left";
      return (
        <section className="grid gap-3 md:gap-4">
          <div className="grid gap-6">
            <div className="grid gap-4">
              <span className="kicker">{block.eyebrow || "Detail"}</span>
              {text}
            </div>
            {figure(medias[0])}
          </div>
        </section>
      );
    }

    case "BEFORE_AFTER":
      return medias.length > 0 ? (
        <section className="grid gap-3 md:gap-4">
          <div className="grid gap-4 border-t border-line pt-8">
            <span className="kicker">{block.eyebrow || "Before / After"}</span>
            <div className="grid gap-4">
              {block.heading && <h2 className="text-[clamp(24px,3vw,34px)] leading-[1.12] tracking-[-0.05em]">{block.heading}</h2>}
              {block.description && <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 md:gap-4">
            {medias.slice(0, 2).map((m, i) => figure(m, i === 0 ? "Before" : "After"))}
          </div>
        </section>
      ) : null;

    case "VIDEO": {
      const url = embedUrl(medias[0] ?? "");
      if (!url) return null;
      return (
        <section className="grid gap-3 md:gap-4">
          <div className="grid gap-4 border-t border-line pt-8">
            <span className="kicker">{block.eyebrow || "Video"}</span>
            <div className="grid gap-4">
              {block.heading && <h2 className="text-[clamp(24px,3vw,34px)] leading-[1.12] tracking-[-0.05em]">{block.heading}</h2>}
              {block.description && <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
            </div>
          </div>
          <figure>
            <div className="aspect-video w-full overflow-hidden rounded-[14px] border border-line bg-panel sm:rounded-[18px]">
              <iframe
                src={url}
                title={block.heading || "Video"}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {block.caption && (
              <figcaption className="mt-2.5  text-[11px] leading-relaxed text-muted">{block.caption}</figcaption>
            )}
          </figure>
        </section>
      );
    }

    case "PROTOTYPE": {
      const url = embedUrl(medias[0] ?? "");
      if (url) {
        return (
          <section className="grid gap-3 md:gap-4">
            <div className="grid gap-4 border-t border-line pt-8">
              <span className="kicker">{block.eyebrow || "Prototype"}</span>
              <div className="grid gap-4">
                {block.heading && <h2 className="text-[clamp(24px,3vw,34px)] leading-[1.12] tracking-[-0.05em]">{block.heading}</h2>}
                {block.description && <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
              </div>
            </div>
            <div className="grid gap-3 md:gap-4">
              <figure>
                <div className="aspect-video w-full overflow-hidden rounded-[14px] border border-line bg-panel sm:rounded-[18px]">
                  <iframe src={url} title={block.heading || "Prototype"} className="h-full w-full" allowFullScreen />
                </div>
                {block.caption && <figcaption className="mt-2.5  text-[11px] text-muted">{block.caption}</figcaption>}
              </figure>
              {medias[0] && (
                <a
                  href={medias[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-fit items-center gap-1.5 border-b border-line-strong pb-1 text-[13px] text-ink no-underline transition-colors hover:border-ink"
                >
                  Open prototype
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              )}
            </div>
          </section>
        );
      }
      if (medias[0]) return figure(medias[0]);
      return null;
    }

    default:
      if (!ARTICLE_TYPES.has(block.block_type)) return null;
      return (
        <section className="grid gap-3 md:gap-4">
          <div className="grid gap-4 border-t border-line pt-8">
            <span className="kicker">{block.eyebrow || block.block_type.replaceAll("_", " ")}</span>
            <div className="grid gap-4">
              {block.heading && <h2 className="text-[clamp(24px,3vw,34px)] leading-[1.12] tracking-[-0.05em]">{block.heading}</h2>}
              {block.description && <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
              {block.supporting_text && (
                <p className="max-w-[560px] border-l border-line-strong pl-4 text-[13px] leading-[1.65] text-muted">
                  {block.supporting_text}
                </p>
              )}
            </div>
          </div>
          {medias.length > 0 && (
            <div className={`grid gap-3 md:gap-4 ${medias.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {medias.map((m, i) => figure(m))}
            </div>
          )}
        </section>
      );
  }
}