"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

type ProjectGridProps = {
  projects: Project[];
};

export default function ProjectGrid({ projects }: ProjectGridProps) {
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
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
      {projects.map((p) => (
        <div key={p.slug} data-stagger>
          <ProjectCard project={p} />
        </div>
      ))}
    </div>
  );
}