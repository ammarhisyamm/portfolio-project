"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

export const EXPERIENCE = [
  {
    company: "Serba Mulia Group",
    role: "Product & UX/UI design",
    period: "2021 — Present",
    points: [
      "Lead product design across the group's digital products and platforms.",
      "Built and maintained a scalable design system shared by multiple teams.",
      "Translated business goals into clear, usable product experiences.",
      "Worked closely with product and engineering on design-to-development handoff.",
    ],
  },
  {
    company: "Peak Haven",
    role: "Digital product design",
    period: "2019 — 2021",
    points: [
      "Designed end-to-end digital experiences for hospitality and lifestyle products.",
      "Ran discovery and user research to shape the product roadmap.",
      "Delivered prototypes and specs that kept development teams moving fast.",
    ],
  },
  {
    company: "Gadai Mulia",
    role: "Fintech product design",
    period: "2017 — 2019",
    points: [
      "Designed a digital pawnbroking experience that made financial services more accessible.",
      "Simplified complex transaction flows into clear, step-by-step journeys.",
      "Contributed to the product's information architecture and visual system.",
    ],
  },
  {
    company: "Synqra",
    role: "SaaS product design",
    period: "2015 — 2017",
    points: [
      "Designed a meeting notes and workflow platform for teams.",
      "Turned discussions into actionable work through structured flows and templates.",
      "Collaborated with early customers to validate and refine the core experience.",
    ],
  },
  {
    company: "Drawtopia",
    role: "AI creative platform",
    period: "2013 — 2015",
    points: [
      "Designed an AI-assisted story-generation experience for creative users.",
      "Explored interaction patterns for AI output and user control.",
      "Built the visual system that gave the product its distinctive editorial feel.",
    ],
  },
  {
    company: "Base44",
    role: "AI productivity tools",
    period: "2011 — 2013",
    points: [
      "Designed AI-powered productivity tools for knowledge workers.",
      "Prototyped and tested early concepts for AI-assisted workflows.",
      "Helped define the product's design language and component library.",
    ],
  },
];

export default function ExperienceAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="panel p-5 sm:p-8">
      {EXPERIENCE.map((job, i) => {
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
  );
}