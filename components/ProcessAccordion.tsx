"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { ProcessStep } from "@/lib/content";


export default function ProcessAccordion({ steps }: { steps: ProcessStep[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      {steps.map((step, i) => {
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
                <span className="mr-3  text-[11px] text-muted">{String(i + 1).padStart(2, "0")}</span>
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
                  <p className="pb-5 text-sm leading-relaxed text-sub">{step.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}