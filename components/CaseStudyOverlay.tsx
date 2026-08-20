"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, X } from "lucide-react";
import type { CaseStudy } from "@/lib/content";
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

export default function CaseStudyOverlay({
  cs,
  onClose,
}: {
  cs: CaseStudy | null;
  onClose: () => void;
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
  const heroImage = cs ? cs.hero_image || cs.thumbnail : "";

  return (
    <AnimatePresence>
      {cs && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`${cs.title} case study`}
          className="fixed inset-0 z-[300] overflow-y-auto bg-bg"
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
              </div>

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
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}