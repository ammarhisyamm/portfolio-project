"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/content";
import { cardCover, caseStudyCover } from "@/lib/case-study-visuals";
import Media from "./Media";
import CaseStudyBlockView from "./CaseStudyBlockView";

const SHORT_TYPES = new Set(["OVERVIEW", "PROBLEM_STATEMENT", "RESULT_SHOWCASE", "METRIC_HIGHLIGHT", "OUTCOME", "REFLECTION"]);

/** Rough reading time at 220 words a minute, counted over the text a reader actually sees. */
function readingMinutes(cs: CaseStudy, blocks: CaseStudy["blocks"]) {
  const parts: string[] = [cs.hero_description ?? ""];
  for (const b of blocks) {
    parts.push(b.heading ?? "", b.description ?? "", b.supporting_text ?? "");
    for (const c of b.cards ?? []) parts.push(c.title ?? "", c.body ?? "");
  }
  const words = parts.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
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
  ];
  for (const [label, value] of fields) {
    if (value && value.trim()) rows.push([label, value]);
  }
  return rows;
}

export default function CaseStudyOverlay({
  cs,
  onClose,
  next,
  onNext,
}: {
  cs: CaseStudy | null;
  onClose: () => void;
  /** The study to offer at the end, so a reader never hits a dead end. */
  next?: CaseStudy | null;
  onNext?: (study: CaseStudy) => void;
}) {
  useEffect(() => {
    if (!cs) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [cs, onClose]);

  const scroller = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(-1);
  // "Full" reads the whole story; "In short" keeps the overview, the problem, what shipped and the outcome.
  const [short, setShort] = useState(false);

  const info = cs ? projectInfo(cs) : [];
  const allBlocks = cs ? cs.blocks.filter((b) => b.visible && !b.draft) : [];
  const blocks = short ? allBlocks.filter((b) => SHORT_TYPES.has(b.block_type)) : allBlocks;
  const minutes = cs ? readingMinutes(cs, allBlocks) : 0;
  const meta = cs ? [cs.year, cs.category, `${minutes} min read`].filter(Boolean).join(" · ") : "";
  const heroImage = cs ? cs.hero_image || cs.thumbnail || caseStudyCover(cs.slug) : "";
  // Numbered eyebrows ("03 · Landscape") are the study's chapters; they become the jump links.
  const chapters = blocks
    .map((b, i) => ({ i, match: /^(\d{2})\s*·\s*(.+)$/.exec(b.eyebrow ?? "") }))
    .filter((c): c is { i: number; match: RegExpExecArray } => Boolean(c.match))
    // Renumber in reading order, so a hidden draft block never leaves a gap (01, 02, 04).
    .map(({ i, match }, n) => ({ i, num: String(n + 1).padStart(2, "0"), label: match[2] }));
  const chapterNo = new Map(chapters.map((c) => [c.i, c.num]));
  const chapterKey = chapters.map((c) => c.i).join(",");

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    setProgress(0);
    setActive(-1);
    let raf = 0;
    const update = () => {
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(1, el.scrollTop / max) : 0);
      let current = -1;
      for (const c of chapters) {
        const target = document.getElementById(`cs-block-${c.i}`);
        if (target && target.getBoundingClientRect().top < 220) current = c.i;
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
    };
    // chapterKey stands in for chapters, which is rebuilt every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cs?.slug, chapterKey]);

  useEffect(() => setShort(false), [cs?.slug]);

  // Keep the active chapter pill in view inside the scrolling nav.
  useEffect(() => {
    if (active < 0) return;
    document.getElementById(`cs-nav-${active}`)?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  const jump = (i: number) => {
    const el = scroller.current;
    const target = document.getElementById(`cs-block-${i}`);
    if (!el || !target) return;
    const top = target.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 120;
    el.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <AnimatePresence>
      {cs && (
        <motion.div
          key={cs.slug}
          role="dialog"
          aria-modal="true"
          aria-label={`${cs.title} case study`}
          ref={scroller}
          className="fixed inset-0 z-[300] overflow-y-auto bg-bg text-ink"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6">
            <div className="sticky top-0 z-10 -mx-4 border-b border-[#e8e8e8] bg-bg/90 px-4 backdrop-blur-md sm:-mx-6 sm:px-6">
             <div className="flex items-center justify-between gap-4 py-3">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 text-[13px] text-sub no-underline transition-colors hover:text-ink"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Back to work
              </button>
              <div role="group" aria-label="Reading length" className="relative flex rounded-full border border-[#e2e2e2] bg-panel p-0.5 text-[12px]">
                {([[false, "Full story"], [true, "In short"]] as const).map(([value, label]) => (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={short === value}
                    onClick={() => {
                      setShort(value);
                      scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={`relative rounded-full px-3 py-1.5 transition-colors duration-200 ${short === value ? "text-white" : "text-sub hover:text-ink"}`}
                  >
                    {short === value && (
                      <motion.span layoutId="cs-length" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 500, damping: 38 }} />
                    )}
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink transition-colors hover:bg-bg"
              >
                <X size={16} aria-hidden="true" />
              </button>
             </div>
              {chapters.length > 2 && (
                <nav aria-label="Case study sections" className="-mx-4 overflow-x-auto xl:hidden px-4 pb-3 [mask-image:linear-gradient(90deg,transparent,#000_16px,#000_calc(100%-32px),transparent)] [scrollbar-width:none] sm:-mx-6 sm:px-6 [&::-webkit-scrollbar]:hidden">
                  <ol className="flex w-max gap-1.5">
                    {chapters.map((c) => (
                      <li key={c.i}>
                        <button
                          id={`cs-nav-${c.i}`}
                          type="button"
                          onClick={() => jump(c.i)}
                          aria-current={active === c.i ? "true" : undefined}
                          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-200 ${
                            active === c.i ? "border-[#cfcfcf] bg-panel text-ink" : "border-transparent text-muted hover:bg-panel/70 hover:text-ink"
                          }`}
                        >
                          <span className="tabular-nums text-[11px] opacity-70">{c.num}</span>
                          {c.label}
                        </button>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <div aria-hidden="true" className="absolute inset-x-0 -bottom-px h-[2px]">
                <div className="h-full origin-left bg-ink transition-transform duration-150 ease-out" style={{ transform: `scaleX(${progress})` }} />
              </div>
            </div>

            {chapters.length > 2 && (
              <nav aria-label="Case study contents" className="fixed top-28 hidden w-[180px] xl:block" style={{ left: "max(24px, calc(50% - 360px - 220px))" }}>
                <span className="kicker mb-3">Contents</span>
                <ol className="grid gap-0.5 border-l border-[#e2e2e2]">
                  {chapters.map((c) => (
                    <li key={c.i}>
                      <button
                        type="button"
                        onClick={() => jump(c.i)}
                        aria-current={active === c.i ? "true" : undefined}
                        className={`-ml-px flex w-full items-baseline gap-2 border-l py-1.5 pl-3 text-left text-[13px] leading-snug transition-colors duration-200 ${
                          active === c.i ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"
                        }`}
                      >
                        <span className="tabular-nums text-[11px] opacity-70">{c.num}</span>
                        {c.label}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <div className="grid grid-cols-[minmax(0,1fr)] gap-3 pb-16 pt-4 md:gap-4">
              <div className="panel grid gap-5 p-5 sm:p-8">
                {meta && <span className="kicker">{meta}</span>}
                <h2 className="t-display">
                  {cs.hero_headline || cs.title}
                </h2>
                {cs.hero_description && (
                  <p className="t-lede max-w-[640px]">
                    {cs.hero_description}
                  </p>
                )}
                {cs.live_url && (
                  <a
                    href={cs.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="link-arrow w-fit text-[14px] text-ink"
                  >
                    {cs.live_url.includes("behance.net")
                      ? "View the full case study on Behance"
                      : `Visit the live product: ${cs.live_url.replace(/^https?:\/\//, "")}`}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                )}
              </div>

              {heroImage && (
                <div className="aspect-[16/9] w-full overflow-hidden rounded-[18px] border border-line bg-bg sm:rounded-[24px]">
                  <Media
                    src={heroImage}
                    poster={heroImage.endsWith(".mp4") ? cs.thumbnail : undefined}
                    alt={cs.hero_image_alt || cs.hero_description || `Visual for ${cs.title}`}
                    label={cs.title}
                  />
                </div>
              )}

              {info.length > 0 && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-[#e4e4e4] pt-8 sm:grid-cols-3">
                  {info.map(([label, value]) => (
                    <div key={label} className="grid content-start gap-2">
                      <span className="kicker">{label}</span>
                      <span className="text-[14px] leading-relaxed text-ink">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {blocks.length > 0 && (
                <div className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-16 md:mt-14 md:gap-20">
                  {blocks.map((b, i) => (
                    <motion.div
                      key={`${short ? "s" : "f"}-${i}-${b.block_type}`}
                      id={`cs-block-${i}`}
                      className="min-w-0"
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "0px 0px -12% 0px", root: scroller }}
                      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                    >
                      <CaseStudyBlockView block={b} chapter={chapterNo.get(i)} />
                    </motion.div>
                  ))}
                </div>
              )}

              {next && onNext && (
                <button
                  type="button"
                  onClick={() => onNext(next)}
                  aria-label={`Next case study: ${next.title}`}
                  className="group mt-6 grid gap-4 border-t border-[#e4e4e4] pt-8 text-left"
                >
                  <span className="kicker">Next case study</span>
                  <span
                    className="relative block aspect-[16/9] w-full overflow-hidden rounded-[16px] border-8 border-white bg-bg sm:rounded-[20px]"
                    style={{ boxShadow: "0 1px 2px rgba(22,22,22,.04), 0 8px 24px -12px rgba(22,22,22,.06)" }}
                  >
                    <Media
                      src={cardCover(next.slug)?.video || next.thumbnail || caseStudyCover(next.slug)}
                      poster={cardCover(next.slug)?.poster}
                      alt={cardCover(next.slug)?.alt || next.thumbnail_alt || `Visual for ${next.title}`}
                      label={next.title}
                      imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </span>
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="t-title">{next.title}</span>
                    <ArrowRight size={20} aria-hidden="true" className="shrink-0 self-center text-ink transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {next.short_description && <span className="t-lede">{next.short_description}</span>}
                </button>
              )}

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[#e4e4e4] pt-6">
                <span className="text-[15px] text-sub">Hiring a product designer?</span>
                <Link href="/contact" className="btn btn-primary">
                  Get in touch
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
