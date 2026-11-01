import type { ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import type { CaseStudyBlock, CaseStudyCard } from "@/lib/content";
import Media from "./Media";
import AffinityBoard from "./case-study/AffinityBoard";
import CompareSlider from "./case-study/CompareSlider";
import DeviceFrame from "./case-study/DeviceFrame";
import FlowPlayer from "./case-study/FlowPlayer";
import ResultShowcase from "./case-study/ResultShowcase";
import ThemeTabs from "./case-study/ThemeTabs";

/*
 * Every case study block renders through here. Code-defined studies pick a
 * `variant` per block so no two studies tell their story in the same shape;
 * CMS blocks have no variant and fall back to the default treatment.
 * Light mode only: surfaces stay white or warm grey, and hierarchy comes from
 * type size, weight and spacing rather than dark panels.
 */

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
  "PERSONA",
]);

/** A divider that stays visible on both the page grey and white panels. */
const RULE = "border-[#e4e4e4]";
const LABEL = "text-[11px] uppercase tracking-[0.08em] text-muted";
const H3 = "text-[16px] font-medium leading-snug tracking-[-0.02em] text-ink";
const BODY = "text-[14px] leading-[1.65] text-sub";

function mediaList(block: CaseStudyBlock): string[] {
  return (block.media ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function hasContent(block: CaseStudyBlock): boolean {
  return Boolean(
    block.steps?.length ||
      block.notes?.length ||
      block.cards?.length ||
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

const pad = (i: number) => String(i + 1).padStart(2, "0");
/** Odd counts let the last card span the row so a grid never ends with a gap. */
const lastSpans = (all: unknown[], i: number, min = 2) => all.length > min && all.length % 2 === 1 && i === all.length - 1;

/** The card collections, one shape per variant. */
function Cards({ cards, variant, layout, numbered }: { cards: CaseStudyCard[]; variant?: string; layout: string; numbered: boolean }) {
  switch (variant) {
    case "numerals":
      return (
        <ol className={`grid border-t ${RULE}`}>
          {cards.map((card, i) => (
            <li key={card.title} className={`grid grid-cols-[56px_1fr] gap-4 border-b ${RULE} py-6 sm:grid-cols-[88px_1fr]`}>
              <span aria-hidden="true" className="text-[clamp(30px,4vw,44px)] font-light leading-none tracking-[-0.04em] text-muted">{pad(i)}</span>
              <div className="grid gap-1.5">
                <h3 className="text-[18px] font-medium leading-snug tracking-[-0.02em] text-ink">{card.title}</h3>
                <p className={BODY}>{card.body}</p>
              </div>
            </li>
          ))}
        </ol>
      );

    case "annotations":
      return (
        <div className={`grid gap-6 ${cards.length > 1 ? "sm:grid-cols-2 sm:gap-8" : ""}`}>
          {cards.map((card) => (
            <div key={card.title} className="grid content-start gap-2 border-t-2 border-ink pt-4">
              <h3 className={H3}>{card.title}</h3>
              <p className={BODY}>{card.body}</p>
            </div>
          ))}
        </div>
      );

    case "statements":
      return (
        <div className="grid gap-8">
          {cards.map((card) => (
            <div key={card.title} className="grid max-w-[600px] gap-2">
              <h3 className="text-[clamp(20px,2.6vw,24px)] font-normal leading-[1.2] tracking-[-0.035em] text-ink">{card.title}</h3>
              <p className={BODY}>{card.body}</p>
            </div>
          ))}
        </div>
      );

    case "spec":
      return (
        <dl className={`grid border-t ${RULE}`}>
          {cards.map((card) => (
            <div key={card.title} className={`grid gap-1.5 border-b ${RULE} py-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] sm:gap-8`}>
              <dt className="text-[18px] font-normal leading-snug tracking-[-0.025em] text-ink">{card.title}</dt>
              <dd className={BODY}>{card.body}</dd>
            </div>
          ))}
        </dl>
      );

    case "checks":
      return (
        <ul className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
          {cards.map((card) => (
            <li key={card.title} className="grid grid-cols-[28px_1fr] gap-3">
              <span aria-hidden="true" className="mt-0.5 grid h-7 w-7 place-items-center rounded-full border border-[#d9d9d9] bg-panel text-ink">
                <Check size={14} strokeWidth={2} />
              </span>
              <div className="grid gap-1">
                <h3 className="text-[15px] font-medium leading-snug tracking-[-0.015em] text-ink">{card.title}</h3>
                <p className="text-[13.5px] leading-[1.6] text-sub">{card.body}</p>
              </div>
            </li>
          ))}
        </ul>
      );

    case "bullets":
      return (
        <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
          {cards.map((card, i, all) => (
            <li key={card.title} className={`text-[14px] leading-[1.65] text-sub ${lastSpans(all, i, 1) ? "sm:col-span-2 sm:max-w-[50%]" : ""}`}>
              <span className="font-medium text-ink">{card.title}.</span> {card.body}
            </li>
          ))}
        </ul>
      );

    case "sequence":
      return (
        <ol className="grid gap-5 sm:grid-cols-3 sm:gap-0">
          {cards.map((card, i) => (
            <li key={card.title} className={`relative grid content-start gap-2 sm:pr-8 ${i > 0 ? "sm:pl-6" : ""}`}>
              <span className="flex items-center gap-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-ink text-[12px] tabular-nums text-ink">{i + 1}</span>
                {i < cards.length - 1 && <ArrowRight size={14} aria-hidden="true" className="hidden text-muted sm:block" />}
              </span>
              <span className={LABEL}>{card.label}</span>
              <h3 className={H3}>{card.title}</h3>
              <p className="text-[13.5px] leading-[1.6] text-sub">{card.body}</p>
            </li>
          ))}
        </ol>
      );

    case "columns":
      return (
        <div className={`grid gap-6 sm:gap-0 sm:divide-x sm:divide-[#e4e4e4] ${cards.length >= 3 ? "sm:grid-cols-3" : cards.length === 2 ? "sm:grid-cols-2" : ""}`}>
          {cards.map((card, i) => (
            <div key={card.title} className={`grid content-start gap-2 ${i > 0 ? "sm:pl-6" : ""} ${i < cards.length - 1 ? "sm:pr-6" : ""}`}>
              {card.label && <span className={LABEL}>{card.label}</span>}
              <h3 className={H3}>{card.title}</h3>
              <p className="text-[13.5px] leading-[1.6] text-sub">{card.body}</p>
            </div>
          ))}
        </div>
      );

    case "labelled":
      return (
        <div className={`grid border-t ${RULE}`}>
          {cards.map((card) => (
            <div key={card.title} className={`grid gap-2 border-b ${RULE} py-5`}>
              <span className="w-fit rounded-full bg-panel px-2.5 py-1 text-[11px] uppercase tracking-[0.06em] text-sub">{card.label}</span>
              <h3 className={H3}>{card.title}</h3>
              <p className={`${BODY} max-w-[600px]`}>{card.body}</p>
            </div>
          ))}
        </div>
      );

    case "highlight": {
      const [lead, ...rest] = cards;
      return (
        <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr]">
          <div className="grid content-start gap-3 rounded-[18px] bg-panel p-6 sm:p-7">
            {lead.label && <span className={LABEL}>{lead.label}</span>}
            <h3 className="text-[clamp(26px,3.6vw,34px)] font-normal leading-[1.08] tracking-[-0.045em] text-ink">{lead.title}</h3>
            <p className={BODY}>{lead.body}</p>
          </div>
          <div className="grid content-start gap-5 sm:pt-7">
            {rest.map((card) => (
              <div key={card.title} className="grid gap-2">
                {card.label && <span className={LABEL}>{card.label}</span>}
                <h3 className={H3}>{card.title}</h3>
                <p className={BODY}>{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    case "ledger":
      return (
        <dl className={`grid border-y ${RULE}`}>
          {cards.map((card, i) => (
            <div key={card.title} className={`grid gap-2 py-5 sm:grid-cols-[120px_1fr] sm:gap-6 ${i > 0 ? `border-t ${RULE}` : ""}`}>
              <dt className={`${LABEL} sm:pt-1`}>{card.label}</dt>
              <dd className="grid gap-1.5">
                <span className="text-[18px] leading-snug tracking-[-0.025em] text-ink">{card.title}</span>
                <span className={BODY}>{card.body}</span>
              </dd>
            </div>
          ))}
        </dl>
      );

    case "now-next":
      return (
        <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr]">
          {cards.map((card, i) => (
            <div key={card.title} className="contents">
              {i > 0 && (
                <span aria-hidden="true" className="grid place-items-center text-muted">
                  <ArrowRight size={18} className="rotate-90 sm:rotate-0" />
                </span>
              )}
              <div className={`grid content-start gap-2 rounded-[18px] p-6 ${i === 0 ? "bg-panel" : "border border-dashed border-[#cfcfcf]"}`}>
                {card.label && <span className={LABEL}>{card.label}</span>}
                <h3 className="text-[18px] font-medium leading-snug tracking-[-0.02em] text-ink">{card.title}</h3>
                <p className={BODY}>{card.body}</p>
              </div>
            </div>
          ))}
        </div>
      );

    case "facts":
      return (
        <dl className="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className={`grid content-start gap-1.5 border-t ${RULE} pt-4`}>
              <dt className={LABEL}>{card.label}</dt>
              <dd className="grid gap-1.5">
                <span className="text-[17px] font-medium leading-snug tracking-[-0.02em] text-ink">{card.title}</span>
                <span className="text-[13px] leading-[1.6] text-sub">{card.body}</span>
              </dd>
            </div>
          ))}
        </dl>
      );

    case "measures":
      return (
        <ol className="grid gap-3">
          {cards.map((card, i) => (
            <li key={card.title} className="grid gap-3 rounded-[16px] bg-panel p-5 sm:grid-cols-[1fr_1.1fr] sm:gap-6 sm:p-6">
              <div className="grid content-start gap-1.5">
                <span className="text-[11px] tabular-nums tracking-[0.08em] text-muted">MEASURE {pad(i)}</span>
                <h3 className="text-[17px] font-medium leading-snug tracking-[-0.02em] text-ink">{card.title}</h3>
              </div>
              <p className={`${BODY} sm:border-l sm:border-[#e4e4e4] sm:pl-6`}>{card.body}</p>
            </li>
          ))}
        </ol>
      );

    case "table": {
      // A comparison table: what each option is good at, and where it falls short.
      const rows = cards.filter((c) => c.pros?.length || c.cons?.length);
      return (
        <div className="rounded-[16px] bg-panel">
          {/* Phones get the same comparison stacked, so nothing hides behind a sideways scroll. */}
          <ul className="grid sm:hidden">
            {rows.map((card, i) => (
              <li key={card.title} className={`grid gap-3 p-5 ${i > 0 ? `border-t ${RULE}` : ""}`}>
                <div>
                  <span className="block text-[15px] font-medium leading-snug text-ink">{card.title}</span>
                  <span className="mt-1 block text-[12.5px] leading-[1.55] text-sub">{card.body}</span>
                </div>
                <p className="text-[13.5px] leading-[1.6] text-ink"><span className={`${LABEL} mr-2`}>Borrowed</span>{card.pros?.join(" ")}</p>
                <p className="text-[13.5px] leading-[1.6] text-sub"><span className={`${LABEL} mr-2`}>Left out</span>{card.cons?.join(" ")}</p>
              </li>
            ))}
          </ul>
          <table className="hidden w-full border-collapse text-left sm:table">
            <thead>
              <tr className={`border-b ${RULE}`}>
                <th scope="col" className={`${LABEL} px-5 py-3.5 font-normal`}>Option</th>
                <th scope="col" className={`${LABEL} px-5 py-3.5 font-normal`}>Borrowed</th>
                <th scope="col" className={`${LABEL} px-5 py-3.5 font-normal`}>Left out</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((card) => (
                <tr key={card.title} className={`border-b ${RULE} align-top last:border-b-0`}>
                  <th scope="row" className="w-[30%] px-5 py-4 font-normal">
                    <span className="block text-[15px] font-medium leading-snug text-ink">{card.title}</span>
                    <span className="mt-1 block text-[12.5px] leading-[1.55] text-sub">{card.body}</span>
                  </th>
                  <td className="px-5 py-4 text-[13.5px] leading-[1.6] text-ink">{card.pros?.join(" ")}</td>
                  <td className="px-5 py-4 text-[13.5px] leading-[1.6] text-sub">{card.cons?.join(" ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    case "spectrum": {
      // A qualitative dot plot: each option on one effort axis.
      return (
        <div className="grid gap-5 rounded-[18px] bg-panel p-5 sm:p-7">
          <div className="flex justify-between gap-4 text-[11.5px] leading-snug text-muted sm:pl-[170px]">
            <span>Effortless, little context</span>
            <span className="text-right">Structured, more effort</span>
          </div>
          <ul className="grid gap-5">
            {cards.map((card) => {
              const own = card.position !== undefined && /nomory/i.test(card.label ?? "");
              return (
                <li key={card.title} className="grid gap-2 sm:grid-cols-[150px_1fr] sm:items-center sm:gap-5">
                  <span className={`text-[14px] leading-snug ${own ? "font-medium text-ink" : "text-sub"}`}>{card.label}</span>
                  <span className="relative block h-5" aria-hidden="true">
                    <span className="absolute inset-x-0 top-1/2 h-px bg-[#dcdcdc]" />
                    <span
                      className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${own ? "h-4 w-4 bg-ink ring-4 ring-[#e9e9e9]" : "h-3 w-3 border-2 border-[#8a8a8a] bg-panel"}`}
                      style={{ left: `${Math.min(97, Math.max(3, card.position ?? 50))}%` }}
                    />
                  </span>
                  <p className="text-[13.5px] leading-[1.6] text-sub sm:col-start-2">
                    <span className="font-medium text-ink">{card.title}.</span> {card.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }

    case "questions":
      return (
        <ul className="grid gap-6">
          {cards.map((card) => (
            <li key={card.title} className="grid gap-1.5 border-l-2 border-[#d4d4d4] pl-5">
              <h3 className="text-[clamp(18px,2.4vw,21px)] font-normal leading-[1.3] tracking-[-0.03em] text-ink">{card.title}</h3>
              <p className={BODY}>{card.body}</p>
            </li>
          ))}
        </ul>
      );
  }

  if (layout === "quotes") {
    return (
      <div className={`grid gap-3 ${cards.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {cards.map((card, i, all) => (
          <figure key={card.title} className={`grid content-start gap-4 rounded-[18px] bg-panel p-6 ${lastSpans(all, i, 1) ? "sm:col-span-2" : ""}`}>
            <blockquote className="text-[17px] leading-[1.45] tracking-[-0.02em] text-ink">“{card.title}”</blockquote>
            {card.label && <figcaption className={LABEL}>{card.label}</figcaption>}
            {card.body && <p className={`border-t ${RULE} pt-3 text-[13px] leading-[1.6] text-sub`}>{card.body}</p>}
          </figure>
        ))}
      </div>
    );
  }

  if (layout === "list") {
    return (
      <ol className={`grid border-t ${RULE}`}>
        {cards.map((card, i) => (
          <li key={card.title} className={`grid gap-1 border-b ${RULE} py-5 sm:grid-cols-[64px_200px_1fr] sm:gap-5`}>
            <span className={`${LABEL} sm:pt-0.5`}>{card.label || pad(i)}</span>
            <h3 className="text-[15px] font-medium leading-snug tracking-[-0.02em] text-ink">{card.title}</h3>
            <p className="text-[14px] leading-[1.65] text-sub">{card.body}</p>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <div className={`grid gap-3 ${cards.length > 2 ? "sm:grid-cols-2" : ""}`}>
      {cards.map((card, i, all) => (
        <div key={card.title} className={`grid content-start gap-2 rounded-[18px] bg-panel p-6 ${lastSpans(all, i) ? "sm:col-span-2" : ""}`}>
          {card.image && (
            <div className="relative -mx-2 -mt-2 mb-2 aspect-[16/10] overflow-hidden rounded-[12px] border border-line bg-bg">
              <img src={card.image} alt={`${card.label || card.title} screenshot`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
            </div>
          )}
          {(card.label || numbered) && <span className={LABEL}>{card.label || pad(i)}</span>}
          <h3 className={H3}>{card.title}</h3>
          <p className={BODY}>{card.body}</p>
          {[["Strengths", "+", card.pros], ["Gaps", "−", card.cons]].map(([title, mark, items]) =>
            (items as string[] | undefined)?.length ? (
              <div key={title as string} className={`mt-2 grid gap-1.5 border-t ${RULE} pt-3`}>
                <span className={LABEL}>{title as string}</span>
                {(items as string[]).map((item) => (
                  <p key={item} className="grid grid-cols-[14px_1fr] text-[13.5px] leading-[1.55] text-sub">
                    <span aria-hidden="true" className="text-ink">{mark as string}</span>
                    {item}
                  </p>
                ))}
              </div>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
}

/** A light, outlined label for a screen. Never a dark pill over the image. */
function ScreenTag({ children }: { children: ReactNode }) {
  return <span className="w-fit rounded-full border border-[#dcdcdc] bg-panel px-2.5 py-1 text-[11px] uppercase tracking-[0.06em] text-sub">{children}</span>;
}

export default function CaseStudyBlockView({ block }: { block: CaseStudyBlock }) {
  if (!block.visible || !hasContent(block)) return null;
  const medias = mediaList(block);
  const variant = block.variant;
  const natural = block.layout === "natural";
  const frame = block.layout === "desktop" ? "desktop" : "phone";
  const numbered = block.block_type === "INSIGHTS" || block.block_type === "DESIGN_DIRECTION";

  const kicker = (fallback: string) => (
    <span className="kicker flex flex-wrap items-center gap-2">
      {block.eyebrow || fallback}
      {block.draft && (
        <span title="Placeholder research. Replace it with real data, then remove draft from this block." className="rounded-full border border-dashed border-[#a8871a] bg-[#fdf8e6] px-2 py-0.5 text-[10px] normal-case tracking-normal text-[#6b5512]">
          Sample data
        </span>
      )}
    </span>
  );

  const header = (fallback: string) => (
    <div className="grid gap-4">
      {kicker(fallback)}
      {block.heading && (
        <h2 className="max-w-[640px] text-[clamp(24px,3vw,34px)] font-normal leading-[1.12] tracking-[-0.05em] text-ink">{block.heading}</h2>
      )}
      {block.description && <p className="max-w-[620px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
      {block.supporting_text && (
        <p className="max-w-[560px] border-l-2 border-[#dcdcdc] pl-4 text-[13.5px] leading-[1.65] text-sub">{block.supporting_text}</p>
      )}
    </div>
  );

  const captionText = block.caption && <p className="text-[12.5px] leading-relaxed text-muted">{block.caption}</p>;
  const cards = block.cards?.length ? <Cards cards={block.cards} variant={variant} layout={block.layout} numbered={numbered} /> : null;
  const section = (children: ReactNode) => <section className="grid min-w-0 gap-6 md:gap-7">{children}</section>;

  const figure = (src: string, label?: string, className?: string, showCaption = true) => (
    <figure key={src} className={`grid gap-3 ${className ?? ""}`}>
      {label && <ScreenTag>{label}</ScreenTag>}
      <div className={`relative w-full overflow-hidden rounded-[18px] border border-line bg-bg ${natural && !src.includes("crop=") ? "" : "aspect-[16/9]"}`}>
        {natural && !src.includes("crop=") ? (
          <img src={src} alt={block.alt_text || block.caption || "Case study visual"} loading="lazy" decoding="async" className="block h-auto w-full" />
        ) : (
          <Media src={src} alt={block.alt_text || block.caption || "Case study visual"} label={block.caption || "Media"} />
        )}
      </div>
      {showCaption && block.caption && <figcaption className="text-[12.5px] leading-relaxed text-muted">{block.caption}</figcaption>}
    </figure>
  );

  switch (block.block_type) {
    case "OVERVIEW": {
      const all = block.cards ?? [];
      if (variant === "table") {
        return section(
          <>
            {header("Overview")}
            <dl className="grid rounded-[18px] bg-panel px-5 sm:px-7">
              {all.map((card, i) => (
                <div key={card.title} className={`grid gap-1.5 py-5 sm:grid-cols-[110px_1fr] sm:gap-6 ${i > 0 ? `border-t ${RULE}` : ""}`}>
                  <dt className={`${LABEL} sm:pt-1`}>{card.label}</dt>
                  <dd className="grid gap-1">
                    <span className={H3}>{card.title}</span>
                    <span className={BODY}>{card.body}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </>
        );
      }
      if (variant === "split") {
        const [a, b, ...meta] = all;
        return section(
          <>
            {header("Overview")}
            <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
              {[a, b].filter(Boolean).map((card) => (
                <div key={card.title} className="grid content-start gap-2.5">
                  <span className={LABEL}>{card.label}</span>
                  <h3 className="text-[clamp(20px,2.6vw,24px)] font-normal leading-[1.2] tracking-[-0.035em] text-ink">{card.title}</h3>
                  <p className={BODY}>{card.body}</p>
                </div>
              ))}
            </div>
            {meta.length > 0 && (
              <dl className={`grid gap-5 border-t ${RULE} pt-5 sm:grid-cols-2 sm:gap-10`}>
                {meta.map((card) => (
                  <div key={card.title} className="grid content-start gap-1">
                    <dt className={LABEL}>{card.label}</dt>
                    <dd className="text-[13.5px] leading-[1.6] text-sub">
                      <span className="font-medium text-ink">{card.title}.</span> {card.body}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        );
      }
      if (variant === "quadrants") {
        return section(
          <>
            {header("Overview")}
            <div className="grid overflow-hidden rounded-[18px] bg-[#e4e4e4] sm:grid-cols-2" style={{ gap: 1 }}>
              {all.map((card) => (
                <div key={card.title} className="grid content-start gap-2 bg-panel p-6">
                  <span className={LABEL}>{card.label}</span>
                  <h3 className="text-[18px] font-normal leading-snug tracking-[-0.03em] text-ink">{card.title}</h3>
                  <p className="text-[13.5px] leading-[1.6] text-sub">{card.body}</p>
                </div>
              ))}
            </div>
          </>
        );
      }
      return section(
        <>
          {header("Overview")}
          {cards}
        </>
      );
    }

    case "RESULT_SHOWCASE": {
      const steps = block.steps ?? [];
      if (!steps.length) return null;
      const shot = (step: (typeof steps)[number], i: number, kind = step.frame ?? frame, className = "") => (
        <figure key={`${step.image}-${i}`} className={`grid content-start gap-2.5 ${className}`}>
          <DeviceFrame kind={kind} className={kind === "phone" ? "max-w-none" : ""}>
            <img src={step.image} alt={step.alt || step.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
          </DeviceFrame>
          <figcaption className={`text-[12px] leading-relaxed text-sub ${kind === "phone" ? "text-center" : ""}`}>{step.title}</figcaption>
        </figure>
      );
      let body: ReactNode;
      if (variant === "mosaic") {
        const desk = steps.filter((s) => (s.frame ?? frame) === "desktop");
        const phones = steps.filter((s) => (s.frame ?? frame) === "phone");
        body = (
          <div className="grid gap-8 rounded-[18px] bg-[#fafafa] p-4 sm:p-6">
            {desk.length > 0 && <div className="grid gap-x-5 gap-y-7 sm:grid-cols-2">{desk.map((s, i) => shot(s, i, "desktop", lastSpans(desk, i, 1) ? "sm:col-span-2" : ""))}</div>}
            {phones.length > 0 && <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">{phones.map((s, i) => shot(s, i, "phone"))}</div>}
          </div>
        );
      } else if (variant === "wall") {
        body = <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-[18px] bg-[#fafafa] p-4 sm:grid-cols-3 sm:p-6 md:grid-cols-5">{steps.map((s, i) => shot(s, i, "phone"))}</div>;
      } else if (variant === "staggered") {
        body = (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6 rounded-[18px] bg-[#fafafa] p-4 pb-10 sm:grid-cols-3 sm:gap-x-6 sm:p-8 sm:pb-16">
            {steps.map((s, i) => shot(s, i, "phone", i % 3 === 1 ? "sm:translate-y-10" : ""))}
          </div>
        );
      } else {
        body = <ResultShowcase steps={steps} frame={frame} />;
      }
      return section(
        <>
          {header("The result")}
          {body}
          {captionText}
        </>
      );
    }

    case "PROBLEM_STATEMENT": {
      const statement = <p className="max-w-[620px] text-[clamp(22px,3.2vw,30px)] font-normal leading-[1.22] tracking-[-0.04em] text-ink">{block.heading}</p>;
      const note = block.description && <p className="max-w-[560px] text-[14.5px] leading-[1.7] text-sub">{block.description}</p>;
      if (variant === "bar") {
        return (
          <section className="grid gap-4 border-l-[3px] border-ink py-1 pl-6 sm:pl-8">
            {kicker("How might we")}
            {statement}
            {note}
          </section>
        );
      }
      if (variant === "tint") {
        return (
          <section className="grid gap-4 rounded-[20px] bg-[#f3eee3] p-6 sm:p-9">
            {kicker("How might we")}
            {statement}
            {note}
          </section>
        );
      }
      return (
        <section className={`grid gap-4 border-y ${RULE} py-9 sm:py-11`}>
          {kicker("How might we")}
          {statement}
          {note}
        </section>
      );
    }

    case "AFFINITY_BOARD": {
      const groups = block.notes ?? [];
      let body: ReactNode = groups.length ? <AffinityBoard groups={groups} /> : null;
      if (variant === "tabs" && groups.length) body = <ThemeTabs groups={groups} />;
      if (variant === "insight-rows" && groups.length) {
        body = (
          <ol className={`grid border-t ${RULE}`}>
            {groups.map((g) => (
              <li key={g.theme} className={`grid gap-3 border-b ${RULE} py-6 sm:grid-cols-[180px_1fr] sm:gap-8`}>
                <span className="text-[13px] font-medium leading-snug text-ink sm:pt-1">{g.theme}</span>
                <div className="grid gap-3">
                  {g.insight && <p className="text-[clamp(18px,2.3vw,21px)] leading-[1.35] tracking-[-0.025em] text-ink">{g.insight}</p>}
                  <ul className="flex flex-wrap gap-2">
                    {g.notes.map((n) => {
                      const assumed = /^assumption:\s*/i.test(n);
                      return (
                        <li key={n} className={`rounded-full px-3 py-1 text-[12.5px] leading-snug ${assumed ? "border border-dashed border-[#bdbdbd] text-ink" : "bg-panel text-sub"}`}>
                          {assumed ? <><span className="font-medium">Assumed:</span> {n.replace(/^assumption:\s*/i, "")}</> : n}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        );
      }
      return section(
        <>
          {header("Research")}
          {body}
          {captionText}
        </>
      );
    }

    case "FLOW_PLAYER":
    case "EVOLUTION": {
      const steps = block.steps ?? [];
      if (!steps.length) return null;
      if (variant === "static") {
        return section(
          <>
            {header("Walkthrough")}
            <ol className="grid gap-10">
              {steps.map((step, i) => (
                <li key={step.image} className="grid gap-4">
                  <div className="grid gap-1.5 sm:grid-cols-[48px_1fr] sm:gap-4">
                    <span className="text-[13px] tabular-nums text-muted">{pad(i)}</span>
                    <div className="grid gap-1.5">
                      <h3 className="text-[18px] font-medium leading-snug tracking-[-0.02em] text-ink">{step.title}</h3>
                      {step.description && <p className={`${BODY} max-w-[560px]`}>{step.description}</p>}
                    </div>
                  </div>
                  <DeviceFrame kind={step.frame ?? frame}>
                    <img src={step.image} alt={step.alt || step.title} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
                  </DeviceFrame>
                </li>
              ))}
            </ol>
            {captionText}
          </>
        );
      }
      return section(
        <>
          {header(block.block_type === "EVOLUTION" ? "Iterations" : "Walkthrough")}
          <FlowPlayer steps={steps} frame={frame} autoplay={block.block_type === "FLOW_PLAYER"} />
          {captionText}
        </>
      );
    }

    case "SCREEN_GALLERY":
      return medias.length
        ? section(
            <>
              {header("Final design")}
              <div className={`grid gap-4 rounded-[18px] bg-[#fafafa] p-4 sm:p-6 ${frame === "phone" ? "grid-cols-2 md:grid-cols-4" : "sm:grid-cols-2"}`}>
                {medias.map((m, i) => (
                  <figure key={m} className="grid content-start gap-2">
                    <DeviceFrame kind={frame}>
                      <img src={m} alt={block.steps?.[i]?.alt || `${block.heading}: screen ${i + 1}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
                    </DeviceFrame>
                    {block.steps?.[i]?.title && <figcaption className="text-center text-[12px] leading-relaxed text-sub">{block.steps[i].title}</figcaption>}
                  </figure>
                ))}
              </div>
              {captionText}
            </>
          )
        : null;

    case "COMPARE_SLIDER": {
      if (medias.length < 2) return null;
      const labels = block.labels ?? ["Before", "After"];
      const screen = (src: string, i: number) => (
        <DeviceFrame kind={frame} className={frame === "phone" ? "max-w-none" : ""}>
          <img src={src} alt={`${labels[i]}: ${block.alt_text || block.heading}`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
        </DeviceFrame>
      );
      let body: ReactNode;
      if (variant === "stacked") {
        body = (
          <div className="grid gap-6 rounded-[18px] bg-[#fafafa] p-4 sm:p-6">
            {medias.slice(0, 2).map((m, i) => (
              <figure key={m} className={`grid gap-3 ${i === 0 ? "sm:w-[72%]" : ""}`}>
                <ScreenTag>{labels[i]}</ScreenTag>
                {screen(m, i)}
              </figure>
            ))}
          </div>
        );
      } else if (variant === "pair") {
        body = (
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-[18px] bg-[#fafafa] p-4 sm:gap-6 sm:p-8">
            {medias.slice(0, 2).map((m, i) => (
              <div key={m} className="contents">
                {i === 1 && <ArrowRight size={18} aria-hidden="true" className="text-muted" />}
                <figure className="mx-auto grid w-full max-w-[220px] gap-3">
                  <ScreenTag>{labels[i]}</ScreenTag>
                  {screen(m, i)}
                </figure>
              </div>
            ))}
          </div>
        );
      } else if (variant === "overlap") {
        body = (
          <div className="relative grid place-items-center overflow-hidden rounded-[18px] bg-[#fafafa] px-4 py-10 sm:py-12">
            <div className="relative h-[440px] w-full max-w-[420px] sm:h-[500px]">
              <figure className="absolute left-0 top-6 w-[52%] -rotate-[4deg] sm:w-[200px]">
                <figcaption className="mb-3"><ScreenTag>{labels[0]}</ScreenTag></figcaption>
                {screen(medias[0], 0)}
              </figure>
              <figure className="absolute right-0 top-0 w-[56%] rotate-[2deg] sm:w-[220px]">
                <figcaption className="mb-3 flex justify-end"><ScreenTag>{labels[1]}</ScreenTag></figcaption>
                {screen(medias[1], 1)}
              </figure>
            </div>
          </div>
        );
      } else {
        body = <CompareSlider before={medias[0]} after={medias[1]} labels={labels} alt={block.alt_text || block.heading} frame={frame} />;
      }
      return section(
        <>
          {header("Before / After")}
          {body}
          {captionText}
        </>
      );
    }

    case "METRIC_HIGHLIGHT":
      return section(
        <>
          {header("Metrics")}
          {(block.metrics?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {block.metrics.map((m, i) => (
                <div key={i} className="rounded-[18px] bg-panel p-6">
                  <div className="text-[clamp(28px,3.6vw,44px)] font-normal leading-none tracking-[-0.05em] text-ink">{m.value}</div>
                  <div className="mt-3 text-[13px] leading-[1.5] text-sub">{m.label}</div>
                  {m.bar && (
                    <div className={`mt-4 grid gap-2 border-t ${RULE} pt-4 text-[12px] text-sub`}>
                      {[["Before", m.bar.from, m.bar.fromLabel, "bg-[#9e9e9e]"], ["Target", m.bar.to, m.bar.toLabel, "bg-ink"]].map(([name, pct, text, tone]) => (
                        <div key={name as string} className="grid grid-cols-[52px_1fr_auto] items-center gap-3">
                          <span className="text-muted">{name as string}</span>
                          <span className="h-2 overflow-hidden rounded-full bg-[#ededed]">
                            <span className={`block h-full rounded-full ${tone as string}`} style={{ width: `${pct as number}%` }} />
                          </span>
                          <span className="text-ink">{text as string}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {cards}
        </>
      );

    case "QUOTE":
      return section(
        <>
          {kicker("Quote")}
          <figure className="grid gap-5">
            <blockquote className="text-[clamp(22px,3vw,32px)] font-normal leading-[1.25] tracking-[-0.04em]">{block.description || block.heading}</blockquote>
            {block.supporting_text && <figcaption className={LABEL}>— {block.supporting_text}</figcaption>}
          </figure>
        </>
      );

    case "IMAGE_GALLERY":
      return section(
        <>
          {header("Gallery")}
          {medias.length > 0 && (
            <div className={`grid gap-4 ${medias.length > 1 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {medias.map((m, i) => (
                <figure key={i}>
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] border border-line bg-bg">
                    <Media src={m} alt={block.alt_text || `${block.heading || "Gallery"} ${i + 1}`} label={block.caption || "Media"} />
                  </div>
                  {block.caption && i === 0 && <figcaption className="mt-2.5 text-[12.5px] leading-relaxed text-muted">{block.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
        </>
      );

    case "FULL_WIDTH_MEDIA":
      return medias.length ? figure(medias[0]) : null;

    case "TEXT_WITH_MEDIA":
      return section(
        <>
          {header("Detail")}
          {medias.length > 0 && figure(medias[0])}
          {cards}
        </>
      );

    case "STAGES":
      return block.cards?.length
        ? section(
            <>
              {header("Stages")}
              <ol className="grid gap-5 md:grid-cols-4 md:gap-0">
                {block.cards.map((card, i) => (
                  <li key={card.title} className="relative grid content-start gap-2 border-l border-[#d4d4d4] pb-2 pl-5 md:border-l-0 md:border-t md:pl-0 md:pr-5 md:pt-5">
                    <span aria-hidden="true" className={`absolute -left-[5px] top-1 h-[9px] w-[9px] rounded-full md:-top-[5px] md:left-0 ${card.label ? "border border-ink bg-panel" : "bg-ink"}`} />
                    <span className={LABEL}>
                      {pad(i)}
                      {card.label && <span className="ml-2 rounded-full border border-[#d4d4d4] px-2 py-0.5 normal-case tracking-normal text-ink">{card.label}</span>}
                    </span>
                    <h3 className={H3}>{card.title}</h3>
                    <p className="text-[13.5px] leading-[1.65] text-sub">{card.body}</p>
                  </li>
                ))}
              </ol>
              {captionText}
            </>
          )
        : null;

    case "BEFORE_AFTER":
      return medias.length
        ? section(
            <>
              {header("Before / After")}
              <div className="grid gap-4 md:grid-cols-2">{medias.slice(0, 2).map((m, i) => figure(m, i === 0 ? "Before" : "After"))}</div>
            </>
          )
        : null;

    case "VIDEO": {
      const url = embedUrl(medias[0] ?? "");
      if (!url) return null;
      return section(
        <>
          {header("Video")}
          <figure>
            <div className="aspect-video w-full overflow-hidden rounded-[18px] border border-line bg-panel">
              <iframe src={url} title={block.heading || "Video"} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
            {block.caption && <figcaption className="mt-2.5 text-[12.5px] leading-relaxed text-muted">{block.caption}</figcaption>}
          </figure>
        </>
      );
    }

    case "PROTOTYPE": {
      const url = embedUrl(medias[0] ?? "");
      if (url) {
        return section(
          <>
            {header("Prototype")}
            <figure>
              <div className="aspect-video w-full overflow-hidden rounded-[18px] border border-line bg-panel">
                <iframe src={url} title={block.heading || "Prototype"} className="h-full w-full" allowFullScreen />
              </div>
              {block.caption && <figcaption className="mt-2.5 text-[12.5px] text-muted">{block.caption}</figcaption>}
            </figure>
            <a href={medias[0]} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1.5 border-b border-ink pb-1 text-[13px] text-ink no-underline">
              Open prototype
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          </>
        );
      }
      return medias[0] ? figure(medias[0]) : null;
    }

    default: {
      if (!ARTICLE_TYPES.has(block.block_type)) return null;
      const fallback = block.block_type.replaceAll("_", " ");
      if (block.block_type === "REFLECTION" && variant === "note") {
        return (
          <section className="grid gap-4 rounded-[20px] bg-[#f6f3ec] p-6 sm:p-8">
            {kicker(fallback)}
            <p className="font-hand text-[clamp(24px,3.2vw,30px)] leading-[1.15] text-[#3b3427]">{block.heading}</p>
            {block.description && <p className="max-w-[600px] text-[14.5px] leading-[1.7] text-[#4f4a40]">{block.description}</p>}
          </section>
        );
      }
      if (block.block_type === "REFLECTION" && variant === "closing") {
        return (
          <section className="grid gap-5 border-t-2 border-ink pt-8">
            {kicker(fallback)}
            <h2 className="max-w-[620px] text-[clamp(26px,3.6vw,36px)] font-normal leading-[1.1] tracking-[-0.05em] text-ink">{block.heading}</h2>
            {block.description && <p className="max-w-[600px] text-[15px] leading-[1.7] text-sub">{block.description}</p>}
          </section>
        );
      }
      if (block.block_type === "REFLECTION" && variant === "quote") {
        return (
          <section className="grid gap-5">
            {kicker(fallback)}
            <figure className="grid gap-4">
              <blockquote className="max-w-[620px] text-[clamp(24px,3.4vw,32px)] font-normal leading-[1.2] tracking-[-0.045em] text-ink">
                <span aria-hidden="true" className="text-muted">“</span>
                {block.heading}
                <span aria-hidden="true" className="text-muted">”</span>
              </blockquote>
              {block.description && <figcaption className="max-w-[600px] text-[15px] leading-[1.7] text-sub">{block.description}</figcaption>}
            </figure>
          </section>
        );
      }
      return section(
        <>
          {header(fallback)}
          {cards}
          {medias.length > 0 && (
            <div className={`grid gap-4 ${block.block_type === "USER_FLOW" && medias.length === 3 ? "grid-cols-1 sm:grid-cols-3" : medias.length > 1 && !natural ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
              {medias.map((m, i) => figure(m, undefined, undefined, i === 0))}
            </div>
          )}
        </>
      );
    }
  }
}
