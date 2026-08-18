"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { FILTERS, projects } from "@/lib/projects";
import ProjectCard from "./ProjectCard";

export default function WorkArchive() {
  const [active, setActive] = useState("All");
  const list = active === "All" ? projects : projects.filter((p) => p.filters.includes(active));

  return (
    <div>
      <div className="rounded-card border border-line bg-panel p-4">
        <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filter projects">
          {FILTERS.map((f) => {
            const isActive = f === active;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={isActive}
                className={`relative rounded-full px-4 py-2 text-[13px] transition-colors duration-200 ${
                  isActive ? "text-white" : "text-sub hover:text-ink"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-ink"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{f}</span>
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout className="mt-5 grid grid-cols-1 gap-[18px] md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}