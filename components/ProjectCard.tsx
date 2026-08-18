"use client";

import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { useProject } from "./ProjectContext";
import Media from "./Media";

export default function ProjectCard({ project }: { project: Project }) {
  const { open } = useProject();

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`View ${project.title} case study`}
      onClick={() => open(project.slug)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(project.slug);
        }
      }}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[18px] border border-line bg-panel transition-all duration-300 hover:border-line-strong hover:shadow-soft sm:rounded-[22px] lg:rounded-[24px]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-line bg-bg">
        <Media
          src={project.image}
          alt={`Visual for ${project.title}`}
          label={project.year}
          imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.02em] text-muted">
            {project.category}
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
            {project.year}
            <ArrowUpRight
              size={14}
              className="text-ink transition-transform duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1"
              aria-hidden="true"
            />
          </span>
        </div>
        <h3 className="text-[18px] font-medium leading-tight tracking-[-0.045em] sm:text-[21px]">
          {project.title}
        </h3>
        <p className="text-[13.5px] leading-relaxed text-sub">{project.desc}</p>
      </div>
    </motion.article>
  );
}