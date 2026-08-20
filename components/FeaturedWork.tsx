"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";
import type { CaseStudy } from "@/lib/content";
import Media from "./Media";

export default function FeaturedWork({
  caseStudies,
  onOpen,
}: {
  caseStudies: CaseStudy[];
  onOpen: (cs: CaseStudy) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

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
      {caseStudies.slice(0, 3).map((p, i) => (
        <button
          key={p.slug}
          type="button"
          onClick={() => onOpen(p)}
          aria-label={`Open case study: ${p.title}`}
          data-stagger
          className={`group block w-full text-left no-underline focus-visible:outline-2 focus-visible:outline-offset-4 ${
            i > 0 ? "border-t border-line" : ""
          }`}
        >
          <div className={`grid gap-5 sm:gap-6 ${i > 0 ? "pb-7 pt-7 sm:pb-9 sm:pt-9" : "pb-7 sm:pb-9"}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1.5">
              <h3 className="flex items-center gap-2.5 text-[clamp(20px,3.2vw,26px)] font-medium leading-tight tracking-[-0.045em]">
                {p.title}
                <ArrowUpRight
                  size={18}
                  strokeWidth={1.6}
                  className="shrink-0 text-ink opacity-0 transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  aria-hidden="true"
                />
              </h3>
              {p.year && (
                <span className="shrink-0 text-[12px] tracking-[0.02em] text-muted sm:text-[13px]">
                  {p.year}
                </span>
              )}
            </div>

            <div
              className="relative aspect-[16/9] w-full overflow-hidden rounded-[16px] border-8 border-white bg-bg sm:rounded-[20px]"
              style={{ boxShadow: "0 1px 2px rgba(22,22,22,.04), 0 8px 24px -12px rgba(22,22,22,.06)" }}
            >
              <Media
                src={p.thumbnail}
                alt={p.thumbnail_alt || `Visual for ${p.title}`}
                label={p.year || p.category}
                imgClassName="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>

            {p.short_description && (
              <p className="max-w-[560px] text-[15px] leading-relaxed text-sub">
                {p.short_description}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}