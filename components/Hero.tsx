"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { reducedMotion, splitWords } from "@/lib/utils";
import Btn from "./Btn";

const HEADLINE = "I design thoughtful digital products that make complex experiences feel simple.";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set("[data-hero-word]", { yPercent: 40, opacity: 0 });
      gsap.set("[data-hero-fade]", { opacity: 0, y: 14 });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to("[data-hero-word]", { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.035 }, 0.05).to(
        "[data-hero-fade]",
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
        0.45
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="panel relative overflow-hidden p-5 sm:p-8 lg:p-10">
      <div className="relative z-10 flex max-w-[880px] flex-col items-start gap-6">
        <span
          data-hero-fade
          className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-medium text-sub"
        >
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
          Available for selected projects
        </span>

        <div data-hero-fade className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="grid h-[74px] w-[74px] place-items-center rounded-[20px] border border-line bg-bg text-[30px] font-semibold tracking-tight text-ink"
          >
            H
          </div>
          <div>
            <h1 className="text-[22px] font-semibold tracking-[-0.04em] sm:text-[24px]">Hisyam</h1>
            <p className="mt-0.5 text-[13px] text-sub">Senior UX/UI &amp; Product Designer</p>
          </div>
        </div>

        <h2
          aria-label={HEADLINE}
          className="text-[clamp(30px,5vw,54px)] font-normal leading-[1.05] tracking-[-0.055em]"
        >
          {splitWords(HEADLINE).map((word, i) => (
            <span key={i} data-hero-word className="inline-block will-change-transform">
              {word}
              {"\u00A0"}
            </span>
          ))}
        </h2>

        <p data-hero-fade className="max-w-[560px] text-[15px] leading-relaxed text-sub">
          I help teams turn ideas into clear, useful, and engaging experiences across fintech, SaaS,
          marketplaces, dashboards, and AI-powered products.
        </p>

        <div data-hero-fade className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Btn href="mailto:hello@hisyam.design">
            Let&rsquo;s work together
            <ArrowRight
              size={15}
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Btn>
          <Btn href="/work" variant="secondary">
            View my projects
          </Btn>
        </div>
      </div>
    </section>
  );
}