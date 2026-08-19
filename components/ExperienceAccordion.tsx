"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import type { ExperienceItem } from "@/lib/content";
import Media from "./Media";
import LightboxModal from "./LightboxModal";

export default function ExperienceAccordion({ items }: { items: ExperienceItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const [lightbox, setLightbox] = useState<{ job: number; index: number } | null>(null);

  return (
    <div className="panel p-5 sm:p-8">
      <span className="kicker">Working experience</span>
      <div className="mt-4 border-t border-line">
        {items.map((job, i) => {
          const isOpen = open === i;
          const images = job.images?.filter(Boolean) ?? [];
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
                  className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border bg-white transition-colors duration-300 ${
                    isOpen ? "border-ink/30 text-sub" : "border-line text-sub"
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
                    <div className="pb-5">
                      <ul className="grid gap-2.5" style={{ listStyle: "none" }}>
                        {job.points.map((point) => (
                          <li key={point} className="flex gap-2.5 pl-1 text-[13.5px] leading-relaxed text-sub">
                            <span className="mt-[9px] h-[5px] w-[5px] shrink-0 rounded-full bg-muted" aria-hidden="true" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      {images.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2.5">
                          {images.slice(0, 3).map((src, imgIndex) => (
                            <button
                              key={src}
                              type="button"
                              onClick={() => setLightbox({ job: i, index: imgIndex })}
                              aria-label={`Open image ${imgIndex + 1} for ${job.company}`}
                              className="h-16 w-16 cursor-zoom-in overflow-hidden rounded-[10px] border-2 border-line bg-panel shadow-soft transition-transform duration-300 hover:-translate-y-0.5"
                            >
                              <Media
                                src={src}
                                alt={`Visual ${imgIndex + 1} for ${job.company}`}
                                label={`${job.company} · ${imgIndex + 1}`}
                                imgClassName="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <LightboxModal
        open={!!lightbox}
        images={
          lightbox
            ? (items[lightbox.job]?.images?.filter(Boolean) ?? []).slice(0, 3).map((src) => ({
                src,
                alt: `Visual for ${items[lightbox.job]?.company ?? ""}`,
              }))
            : []
        }
        index={lightbox?.index ?? 0}
        onIndexChange={(idx) => setLightbox((l) => (l ? { ...l, index: idx } : l))}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
}