"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { reducedMotion, isDesktop } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

type ProjectGridProps = {
  projects: Project[];
  spans?: string[];
};

export default function ProjectGrid({ projects, spans }: ProjectGridProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stagger]",
        { y: 36, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ref.current, start: "top 85%" },
        }
      );
      if (isDesktop()) {
        gsap.utils.toArray<HTMLElement>(".media-parallax", ref.current).forEach((el) => {
          gsap.fromTo(
            el,
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            }
          );
        });
      }
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 gap-[18px] md:grid-cols-2 lg:grid-cols-12 lg:gap-[22px]"
    >
      {projects.map((p, i) => (
        <div key={p.slug} data-stagger className={spans ? spans[i] ?? "lg:col-span-6" : "lg:col-span-6"}>
          <ProjectCard project={p} />
        </div>
      ))}
    </div>
  );
}