"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

const STEPS = [
  {
    title: "Understand",
    body: "Clarify the business context, users, and constraints before anything is drawn. Research, stakeholder interviews, and framing the problem space.",
  },
  {
    title: "Structure",
    body: "Map user flows and information architecture. Wireframes turn the messy middle into a usable model the whole team can react to.",
  },
  {
    title: "Refine",
    body: "Build the visual system, interaction details, and responsive behavior. Prototypes let teams feel the product before it ships.",
  },
  {
    title: "Hand off",
    body: "Design-to-development handoff with documented patterns, specs, and checkpoints so engineering can move with confidence.",
  },
];

export default function ProcessAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {STEPS.map((step, i) => {
        const isOpen = open === i;
        return (
          <div key={step.title} className="border-t border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-4 text-left"
            >
              <span className="text-[15px] font-medium">
                <span className="mr-3  text-[11px] text-muted">0{i + 1}</span>
                {step.title}
              </span>
              <Plus
                size={16}
                className={`shrink-0 text-sub transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                aria-hidden="true"
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="pb-5 text-sm leading-relaxed text-sub">{step.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}