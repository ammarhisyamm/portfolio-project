"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
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
    <div ref={ref} className="grid gap-4">
      {caseStudies.slice(0, 3).map((p) => (
        <Link
          key={p.slug}
          href={`/playground/${p.slug}`}
          data-stagger
          className="group block overflow-hidden rounded-[18px] border border-line bg-panel no-underline transition-all duration-300 hover:border-line-strong hover:shadow-soft sm:rounded-[22px] lg:rounded-[24px]"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg">
            <Media
              src={p.thumbnail}
              alt={p.thumbnail_alt || `Visual for ${p.title}`}
              label={p.year || p.category}
              imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex items-baseline justify-between gap-3 p-5 sm:p-6">
            <h3 className="text-[17px] font-medium leading-tight tracking-[-0.04em]">{p.title}</h3>
            {p.year && <span className="font-mono text-[11px] text-muted">{p.year}</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}