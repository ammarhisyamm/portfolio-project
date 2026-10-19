"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { CaseStudyStep } from "@/lib/content";
import DeviceFrame from "./DeviceFrame";

/** The finished screens as a sideways strip, so the result is visible before any process. */
export default function ResultShowcase({ steps, frame }: { steps: CaseStudyStep[]; frame: "phone" | "desktop" }) {
  const strip = useRef<HTMLDivElement>(null);
  const scrollBy = (dir: 1 | -1) => strip.current?.scrollBy({ left: dir * strip.current.clientWidth * 0.8, behavior: "smooth" });

  return (
    <div className="relative min-w-0 max-w-full rounded-[14px] border border-line bg-[#fafafa] sm:rounded-[18px]">
      <div
        ref={strip}
        tabIndex={0}
        role="region"
        aria-label="Final screens, scroll sideways"
        className="scrollbar-hide flex snap-x snap-mandatory items-center gap-4 overflow-x-auto scroll-smooth p-4 sm:p-6"
      >
        {steps.map((step, i) => {
          const kind = step.frame ?? frame;
          return (
            <figure
              key={`${step.image}-${i}`}
              className={`grid shrink-0 snap-start content-start gap-2.5 ${kind === "phone" ? "w-[200px] sm:w-[230px]" : "w-[86%] sm:w-[520px]"}`}
            >
              <DeviceFrame kind={kind} className={kind === "phone" ? "max-w-none" : ""}>
                <img
                  src={step.image}
                  alt={step.alt || step.title}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  draggable={false}
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
              </DeviceFrame>
              <figcaption className="text-center text-[11.5px] leading-relaxed text-muted">{step.title}</figcaption>
            </figure>
          );
        })}
      </div>
      {steps.length > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-2.5 sm:px-6">
          <span className="text-[11.5px] text-muted">{steps.length} screens · scroll or use the arrows</span>
          <span className="flex gap-2">
            {([-1, 1] as const).map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => scrollBy(dir)}
                aria-label={dir === -1 ? "Previous screens" : "Next screens"}
                className="grid h-8 w-8 place-items-center rounded-full border border-line bg-panel text-ink transition-colors hover:bg-bg"
              >
                {dir === -1 ? <ArrowLeft size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
              </button>
            ))}
          </span>
        </div>
      )}
    </div>
  );
}
