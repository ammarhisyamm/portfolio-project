"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";
import type { CaseStudy } from "@/lib/content";
import Media from "./Media";

export default function FeaturedWork({ caseStudies }: { caseStudies: CaseStudy[] }) {
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
    <div ref={ref} className="grid grid-cols-1 gap-3">
      {caseStudies.slice(0, 3).map((p) => (
        <Link
          key={p.slug}
          href={`/work/${p.slug}`}
          data-stagger
          className="group flex flex-col gap-4 overflow-hidden rounded-[18px] border border-line bg-panel p-3 transition-all duration-300 hover:border-line-strong hover:shadow-soft sm:flex-row sm:items-center sm:gap-5 sm:rounded-[22px] sm:p-4 lg:rounded-[24px]"
        >
          <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[14px] border border-line bg-bg sm:w-[200px]">
            <Media
              src={p.thumbnail}
              alt={p.thumbnail_alt || `Visual for ${p.title}`}
              label={p.year || p.category}
              imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2 px-1 pb-1 sm:px-2 sm:pb-0">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.02em] text-muted">
                {p.category}
              </span>
              {p.year && (
                <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
                  {p.year}
                  <ArrowUpRight
                    size={14}
                    className="text-ink transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden="true"
                  />
                </span>
              )}
            </div>
            <h3 className="text-[18px] font-medium leading-tight tracking-[-0.045em] sm:text-[21px]">
              {p.title}
            </h3>
            <p className="text-[13.5px] leading-relaxed text-sub">{p.short_description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
