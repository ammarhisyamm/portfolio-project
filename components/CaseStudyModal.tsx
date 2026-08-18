"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useProject } from "./ProjectContext";
import Media from "./Media";

export default function CaseStudyModal() {
  const { active, close } = useProject();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    const onScroll = () => {
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? el.scrollTop / max : 0);
    };
    el?.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el?.removeEventListener("scroll", onScroll);
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close]);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={`${active.title} case study`}
        >
          <motion.div
            ref={scrollRef}
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-[94dvh] w-full max-w-5xl flex-col overflow-y-auto rounded-t-panel border border-line bg-panel sm:rounded-panel"
            initial={{ y: 60, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-panel/95 px-5 py-3.5 backdrop-blur sm:px-8">
              <span className="kicker !mb-0">
                {active.category} · {active.year}
              </span>
              <button
                onClick={close}
                aria-label="Close project"
                className="grid h-9 w-9 place-items-center rounded-full border border-line transition-colors hover:border-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="h-[3px] w-full origin-left bg-line">
              <div
                className="h-full w-full origin-left bg-ink"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>

            <div className="grid gap-5 px-5 pb-8 pt-8 sm:px-8 sm:pb-10">
              <h2 className="text-[clamp(32px,6vw,52px)] font-normal leading-none tracking-[-0.06em]">
                {active.title}
              </h2>
              <p className="max-w-[560px] text-[15px] leading-relaxed text-sub">{active.desc}</p>
            </div>

            <div className="aspect-[4/3] border-y border-line bg-bg sm:aspect-[16/9]">
              <Media src={active.image} alt={`Visual for ${active.title}`} label={active.year} />
            </div>

            <div className="grid gap-8 px-5 py-8 sm:grid-cols-[0.9fr_1.1fr] sm:px-8 sm:py-10">
              <div>
                <span className="kicker">Context</span>
                <h3 className="mt-4 text-[22px] font-medium leading-snug tracking-[-0.04em]">
                  A focused product problem, approached with care.
                </h3>
              </div>
              <div className="text-[14px] leading-relaxed text-sub">
                <p className="mb-4">
                  This case study is structured as a ready-to-complete project record. The work
                  centered on translating a complex workflow into a calm, navigable product
                  experience.
                </p>
                <p className="mb-4">
                  <b className="font-mono text-[11px] text-ink">Role</b>
                  <br />
                  {active.role}
                </p>
                <p>
                  <b className="font-mono text-[11px] text-ink">Approach</b>
                  <br />
                  Discovery, user flows, wireframes, interface design, prototyping, and developer
                  handoff.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 border-t border-line sm:grid-cols-3">
              {[
                ["01", "Understand", "Clarify the context, users, and constraints."],
                ["02", "Structure", "Map flows and create a usable information model."],
                ["03", "Refine", "Build a visual system that makes the work feel natural."],
              ].map(([num, title, body], i) => (
                <div
                  key={num}
                  className={`border-b border-line p-5 sm:border-b-0 ${
                    i > 0 ? "sm:border-l" : ""
                  }`}
                >
                  <span className="font-mono text-[11px] text-muted">{num}</span>
                  <b className="mt-4 block text-[15px] font-semibold">{title}</b>
                  <p className="mt-1 text-[12px] leading-relaxed text-sub">{body}</p>
                </div>
              ))}
            </div>

            <p className="px-5 py-8 text-[clamp(20px,2.4vw,26px)] tracking-[-0.04em] sm:px-8">
              <span className="kicker !mb-3">Outcome</span>
              A scalable product foundation with clear patterns for the team to develop and extend.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}