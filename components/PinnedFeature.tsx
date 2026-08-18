"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { reducedMotion } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import Media from "./Media";

export default function PinnedFeature({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-feature-visual]",
        { scale: 0.96 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="panel grid gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-14 lg:p-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div
          data-feature-visual
          className="aspect-[4/3] w-full overflow-hidden rounded-card border border-line bg-bg"
        >
          <Media src={project.image} alt={`Featured visual for ${project.title}`} label={project.year} />
        </div>
      </div>
      <div>
        <span className="kicker">Featured project</span>
        <h2 className="mt-4 text-[clamp(30px,3.6vw,48px)] font-normal leading-[1.05] tracking-[-0.055em]">
          {project.title}
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-sub">{project.desc}</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <span className="kicker">Role</span>
            <p className="mt-3 text-sm leading-relaxed text-sub">{project.role}</p>
          </div>
          <div>
            <span className="kicker">Approach</span>
            <p className="mt-3 text-sm leading-relaxed text-sub">
              Discovery, user flows, wireframes, interface design, prototyping, and developer
              handoff.
            </p>
          </div>
          <div>
            <span className="kicker">Outcome</span>
            <p className="mt-3 text-sm leading-relaxed text-sub">
              A scalable product foundation with clear patterns for the team to develop and extend.
            </p>
          </div>
          <div>
            <span className="kicker">Status</span>
            <p className="mt-3 text-sm leading-relaxed text-sub">Shipped · {project.year}</p>
          </div>
        </div>
      </div>
    </section>
  );
}