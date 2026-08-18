"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { ExperienceItem } from "@/lib/content";

export default function ExperienceAccordion({ items }: { items: ExperienceItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="panel p-5 sm:p-8">
      <span className="kicker">Working experience</span>
      <div className="mt-4 border-t border-line">
        {items.map((job, i) => {
          const isOpen = open === i;
          return (
            <div key={job.company} className={`border-line ${i > 0 ? "border-t" : ""}`}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              aria-controls={`experience-panel-${i}`}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <div className="min-w-0">
                <span className="block truncate text-[17px] font-medium tracking-[-0.02em] sm:text-[19px]">
                  {job.company}
                </span>
                <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.02em] text-muted">
                  {job.role} · {job.period}
                </span>
              </div>
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-300 ${
                  isOpen ? "border-ink bg-ink text-white" : "border-line text-sub"
                }`}
              >
                <Plus
                  size={16}
                  className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  aria-hidden="true"
                />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`experience-panel-${i}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="mb-5 grid gap-2.5" style={{ listStyle: "none" }}>
                    {job.points.map((point) => (
                      <li key={point} className="flex gap-2.5 pl-1 text-[13.5px] leading-relaxed text-sub">
                        <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-muted" aria-hidden="true" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
      </div>
    </div>
  );
}