"use client";

import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
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
  email: string;
  socials: SocialLink[];
  trust: TrustItem[];
  profilePhoto?: string;
};

const LOGO_SHADOW = "inset 0 0 0 2px rgba(255,255,255,0.9), 0 14px 32px -14px rgba(22,22,22,0.25)";

export default function Hero({ name, title, headline, intro, available, email, socials, trust, profilePhoto }: HeroProps) {
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
      <div className="relative z-10 flex w-full flex-col items-start gap-6">
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <span
            data-hero-fade
            className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3.5 py-1.5 text-xs font-medium text-sub"
          >
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
            {available ? "Available for selected projects" : "Currently booked"}
          </span>
          <div data-hero-fade>
            <Socials items={socials} />
          </div>
        </div>

        <div className="flex w-full max-w-[880px] flex-col items-start gap-6">
        <div data-hero-fade className="flex items-center gap-4">
          <div
            aria-hidden="true"
            className="grid h-12 w-12 place-items-center overflow-hidden rounded-[16px] bg-bg"
            style={{ boxShadow: LOGO_SHADOW }}
          >
            {profilePhoto ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="text-[20px] font-semibold tracking-tight text-ink">H</span>
            )}
          </div>
          <div>
            <h1 className="text-[22px] font-medium tracking-[-0.04em] sm:text-[24px]">{name}</h1>
            <p className="mt-0.5 text-[13px] text-sub">{title}</p>
          </div>
        </div>

        <h2
          aria-label={headline}
          className="text-[clamp(26px,4vw,32px)] font-normal leading-[1.1] tracking-[-0.05em]"
        >
          {splitWords(headline).map((word, i) => (
            <span key={i} data-hero-word className="inline-block will-change-transform">
              {word}
              {"\u00A0"}
            </span>
          ))}
        </h2>

        <p data-hero-fade className="max-w-[560px] text-[15px] leading-relaxed text-sub">
          {intro}
        </p>

        <div data-hero-fade className="flex w-full flex-wrap gap-3 sm:w-auto">
          <Btn href={`mailto:${email}`}>
            Let&rsquo;s work together
            <ArrowRight
              size={15}
              className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Btn>
          <Btn href="/playground" variant="secondary">
            View my projects
          </Btn>
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