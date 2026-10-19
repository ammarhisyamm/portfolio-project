"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from "lucide-react";
import Link from "next/link";
import type { CaseStudy } from "@/lib/content";
import { caseStudyCover } from "@/lib/case-study-visuals";
import Media from "./Media";
import CaseStudyBlockView from "./CaseStudyBlockView";

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

  const info = cs ? projectInfo(cs) : [];
  const blocks = cs ? cs.blocks.filter((b) => b.visible) : [];
  const meta = cs ? [cs.category, cs.year, cs.platform, cs.project_status].filter(Boolean).join(" · ") : "";
  const heroImage = cs ? cs.hero_image || cs.thumbnail || caseStudyCover(cs.slug) : "";

  return (
    <AnimatePresence>
      {cs && (
        <motion.div
          key={cs.slug}
          role="dialog"
          aria-modal="true"
          aria-label={`${cs.title} case study`}
          className="fixed inset-0 z-[300] overflow-y-auto bg-bg text-ink"
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <div className="mx-auto w-full max-w-[720px] px-4 sm:px-6">
            <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between border-b border-line bg-bg/95 px-4 py-3 sm:-mx-6 sm:px-6">
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 text-[13px] text-sub no-underline transition-colors hover:text-ink"
              >
                <ArrowLeft size={14} aria-hidden="true" />
                Back to work
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close case study"
                className="grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-ink transition-colors hover:bg-bg"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-3 pb-16 pt-4 md:gap-4">
              <div className="panel grid gap-5 p-5 sm:p-8">
                {meta && <span className="kicker">{meta}</span>}
                <h2 className="text-[clamp(26px,4vw,32px)] font-normal leading-[1.08] tracking-[-0.05em]">
                  {cs.hero_headline || cs.title}
                </h2>
                {cs.hero_description && (
                  <p className="max-w-[640px] text-[15px] leading-[1.7] text-sub sm:text-[16px]">
                    {cs.hero_description}
                  </p>
                )}
                {cs.live_url && (
                  <a
                    href={cs.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center gap-1.5 text-[14px] font-medium text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
                  >
                    Visit the live product: {cs.live_url.replace(/^https?:\/\//, "")}
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
                <div className="grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-8">
                  {info.map(([label, value]) => (
                    <div key={label} className="grid content-start gap-1.5">
                      <span className="text-[10px] uppercase tracking-[0.08em] text-muted">{label}</span>
                      <span className="text-[13px] leading-relaxed text-ink">{value}</span>
                    </div>
                  ))}
                </div>
              )}

              {blocks.length > 0 && (
                <div className="grid gap-3 md:gap-4">
                  {blocks.map((b, i) => (
                    <CaseStudyBlockView key={`${i}-${b.block_type}`} block={b} />
                  ))}
                </div>
              )}

              {next && onNext && (
                <button
                  type="button"
                  onClick={() => onNext(next)}
                  aria-label={`Next case study: ${next.title}`}
                  className="group mt-6 grid gap-4 border-t border-line pt-8 text-left"
                >
                  <span className="kicker">Next case study</span>
                  <span
                    className="relative block aspect-[16/9] w-full overflow-hidden rounded-[16px] border-8 border-white bg-bg sm:rounded-[20px]"
                    style={{ boxShadow: "0 1px 2px rgba(22,22,22,.04), 0 8px 24px -12px rgba(22,22,22,.06)" }}
                  >
                    <Media
                      src={next.thumbnail || caseStudyCover(next.slug)}
                      alt={next.thumbnail_alt || `Visual for ${next.title}`}
                      label={next.title}
                      imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    />
                  </span>
                  <span className="flex items-baseline justify-between gap-4">
                    <span className="text-[clamp(20px,3.2vw,26px)] font-medium leading-tight tracking-[-0.045em]">{next.title}</span>
                    <ArrowRight size={20} aria-hidden="true" className="shrink-0 self-center text-ink transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                  {next.short_description && <span className="max-w-[560px] text-[15px] leading-relaxed text-sub">{next.short_description}</span>}
                </button>
              )}

              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-6">
                <span className="text-[15px] text-sub">Hiring a product designer?</span>
                <Link href="/contact" className="btn btn-primary">
                  Get in touch
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
