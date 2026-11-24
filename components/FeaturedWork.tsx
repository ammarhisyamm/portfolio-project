"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";
import type { CaseStudy } from "@/lib/content";
import CaseStudyCover from "./CaseStudyCover";

/** Studies shown before "View all work"; the rest stay one click away. */
const INITIAL_COUNT = 3;

export default function FeaturedWork({
  caseStudies,
  onOpen,
}: {
  caseStudies: CaseStudy[];
  onOpen: (cs: CaseStudy) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? caseStudies : caseStudies.slice(0, INITIAL_COUNT);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stagger]",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 88%" },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [caseStudies.length]);

  if (caseStudies.length === 0) return null;

  return (
    <div ref={ref}>
      {visible.map((p, i) => (
        <article
          key={p.slug}
          data-stagger
          className={`group block w-full text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-4 ${
            i > 0 ? "border-t border-line" : ""
          }`}
        >
          <div className={`grid gap-5 sm:gap-6 ${i > 0 ? "pb-7 pt-7 sm:pb-9 sm:pt-9" : "pb-7 sm:pb-9"}`}>
            {(p.year || p.category) && <span className="kicker -mb-3 sm:-mb-4">{[p.year, p.category].filter(Boolean).join(" · ")}</span>}
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
              <h3 className="flex items-center gap-2.5 text-[clamp(19px,2.2vw,21px)] font-medium leading-snug tracking-[-0.03em]">
                <button type="button" onClick={() => onOpen(p)} className="text-left focus-visible:outline-2 focus-visible:outline-offset-4">{p.title}</button>
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.6}
                  className="shrink-0 text-ink opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </h3>
            </div>

            <CaseStudyCover study={p} onOpen={() => onOpen(p)} />

            {p.short_description && (
              <p className="t-lede">
                {p.short_description}
              </p>
            )}
            {(p.role || p.platform || p.project_status) && (
              <dl className="grid grid-cols-3 gap-4 border-t border-[#ececec] pt-4">
                {([["Role", p.role?.split(/,| and /)[0]], ["Platform", p.platform], ["Status", p.project_status]] as const)
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="grid content-start gap-1">
                      <dt className="text-[12px] text-muted">{k}</dt>
                      <dd className="text-[13.5px] leading-snug text-ink">{v}</dd>
                    </div>
                  ))}
              </dl>
            )}
            <button type="button" onClick={() => onOpen(p)} className="link-arrow -mt-1 w-fit text-ink group-hover:bg-[length:100%_1px]">
              Read case study
              <ArrowRight size={14} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </article>
      ))}
      {caseStudies.length > INITIAL_COUNT && (
        <div className="border-t border-line pt-7 sm:pt-9">
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            aria-expanded={showAll}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-panel px-5 text-[13px] font-medium text-ink transition-colors hover:bg-bg"
          >
            {showAll ? "Show featured work" : `View ${caseStudies.length - INITIAL_COUNT} more ${caseStudies.length - INITIAL_COUNT === 1 ? "case study" : "case studies"}`}
            <ChevronDown size={15} aria-hidden="true" className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}
