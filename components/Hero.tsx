"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Download } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { reducedMotion, splitWords } from "@/lib/utils";
import type { SocialLink, TrustItem } from "@/lib/content";
import Btn from "./Btn";
import Socials from "./Socials";
import TrustStrip from "./TrustStrip";

type HeroProps = {
  name: string;
  title: string;
  headline: string;
  intro: string;
  available: boolean;
  socials: SocialLink[];
  trust: TrustItem[];
  profilePhoto?: string;
  cvUrl?: string;
};


export default function Hero({ name, title, headline, intro, available, socials, trust, profilePhoto, cvUrl }: HeroProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    let ctx: gsap.Context;
    const reveal = () => {
      ctx?.revert();
      ctx = gsap.context(() => {
        gsap.set("[data-hero-word]", { yPercent: 40, opacity: 0 });
        gsap.set("[data-hero-fade]", { opacity: 0, y: 14 });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.to("[data-hero-word]", { yPercent: 0, opacity: 1, duration: 0.8, stagger: 0.035 }, 0.05).to(
          "[data-hero-fade]",
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          0.45
        );
      }, ref);
    };
    if (!document.documentElement.hasAttribute("data-intro")) reveal();
    window.addEventListener("studio:entered", reveal);
    window.addEventListener("portfolio:intro-complete", reveal);
    return () => { window.removeEventListener("studio:entered", reveal); window.removeEventListener("portfolio:intro-complete", reveal); ctx?.revert(); };
  }, []);

  return (
    <section ref={ref} className="panel relative overflow-hidden p-5 sm:p-8 lg:p-10">
      <div className="relative z-10 flex w-full flex-col items-start gap-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <span
            data-hero-fade
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-medium text-sub"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            {available ? "Open to full-time roles and projects" : "Currently booked"}
          </span>
          <div data-hero-fade>
            <Socials items={socials} />
          </div>
        </div>

        <div className="flex w-full max-w-[880px] flex-col items-start gap-6">
        <div data-hero-fade className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="grid size-[68px] shrink-0 place-items-center rounded-full bg-panel p-[2px] ring-1 ring-black/10 sm:size-[84px]"
          >
            {profilePhoto ? (
              <span className="block size-full overflow-hidden rounded-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={profilePhoto} alt="" className="size-full scale-[1.36] object-cover" fetchPriority="high" />
              </span>
            ) : (
              <span className="text-[20px] font-medium tracking-tight text-ink">H</span>
            )}
          </div>
          <div>
            <h1 className="text-[22px] font-medium tracking-[-0.04em] sm:text-[24px]">{name}</h1>
            <p className="mt-0.5 text-[13px] text-sub">{title}</p>
          </div>
        </div>

        <h2
          aria-label={headline}
          className="t-display max-w-[19ch]"
        >
          {splitWords(headline).map((word, i) => (
            <span key={i} data-hero-word className="inline-block will-change-transform">
              {word}
              {"\u00A0"}
            </span>
          ))}
        </h2>

        <p data-hero-fade className="t-lede">
          {intro}
        </p>

        <div data-hero-fade className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Btn href="#selected-work">
            View selected work
            <ArrowRight
              size={15}
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Btn>
          {cvUrl && <Btn href={cvUrl} download variant="secondary">Download CV (PDF)<Download size={14} aria-hidden="true" /></Btn>}
        </div>
        </div>
      </div>

      {trust.length > 0 && (
        <div className="mt-10 border-t border-line pt-6">
          <TrustStrip items={trust} />
        </div>
      )}
    </section>
  );
}
