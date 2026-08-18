"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { reducedMotion, isDesktop } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function HorizontalStory({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion() || !isDesktop()) return;
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const distance = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [projects]);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-panel lg:flex lg:h-screen lg:items-center">
      <div
        ref={trackRef}
        className="flex flex-col gap-5 px-5 py-10 lg:flex-row lg:items-stretch lg:py-0"
      >
        <div className="flex w-full shrink-0 flex-col justify-center lg:w-[380px] lg:pr-6">
          <span className="kicker">Storytelling</span>
          <h2 className="mt-4 text-[clamp(26px,3vw,40px)] font-normal leading-[1.05] tracking-[-0.055em]">
            A closer look at how each product came together.
          </h2>
        </div>
        {projects.map((p) => (
          <div key={p.slug} className="w-full shrink-0 lg:w-[420px]">
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </section>
  );
}