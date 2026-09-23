"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import type { CategoryImage, HomeCategory } from "@/lib/content";
import Media from "./Media";
import { PinterestGrid } from "./Lightbox";
import LightboxModal from "./LightboxModal";

const DOCUMENT_LAYOUTS = [
  { left: "21%", top: "27%", width: "48%", rotate: -6, x: -14 },
  { left: "31%", top: "25%", width: "47%", rotate: 5, x: 16 },
  { left: "25%", top: "20%", width: "52%", rotate: 1, x: 1 },
];

export default function CategoryStacks({ categories }: { categories: HomeCategory[] }) {
  const [feed, setFeed] = useState<HomeCategory | null>(null);
  if (categories.length === 0) return null;

  return (
    <section className="panel p-5 sm:p-8">
      <span className="kicker">Design exploration</span>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
        {categories.map((cat) => (
          <CategoryStack key={cat.key} cat={cat} onOpen={() => setFeed(cat)} />
        ))}
      </div>

      {feed && <FeedOverlay cat={feed} onClose={() => setFeed(null)} />}
    </section>
  );
}

function CategoryStack({ cat, onOpen }: { cat: HomeCategory; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const published = cat.images.filter((i) => i.visible);
  const previews = published
    .sort((a, b) => a.sort - b.sort)
    .slice(0, 3);
  const count = published.length;

  return (
    <button
      type="button"
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      aria-label={`Open ${cat.label} image feed`}
      className={`group relative block w-full text-left focus-visible:outline-2 focus-visible:outline-offset-4 ${hover ? "z-20" : "z-0"}`}
    >
      <div className="relative aspect-[4/3] w-full rounded-[18px] border border-line bg-[#f0f1f4] sm:rounded-[22px] lg:rounded-[24px]">
        {previews.map((img, i) => {
          const layout = DOCUMENT_LAYOUTS[i % DOCUMENT_LAYOUTS.length];
          return (
            <motion.div
              key={img.id ?? i}
              className="absolute z-[1] overflow-hidden rounded-[7px] border border-white/90 bg-white shadow-[0_14px_28px_rgba(28,29,36,0.18)]"
              style={{ left: layout.left, top: layout.top, width: layout.width }}
                animate={
                  hover
                  ? { opacity: 1, x: layout.x, y: -2 - i * 4, rotate: layout.rotate }
                  : { opacity: 0, x: 0, y: 42, rotate: 0 }
              }
              transition={{ type: "spring", stiffness: 280, damping: 24, delay: hover ? i * 0.045 : 0 }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <Media src={img.image_url} alt={img.alt_text || cat.label} label={cat.label} imgClassName="h-full w-full object-cover select-none" />
              </div>
            </motion.div>
          );
        })}
        <motion.div
          className="pointer-events-none absolute inset-0 z-10"
          animate={hover ? { scale: 1.03, y: 5 } : { scale: 1, y: 12 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/exploration-folder-foreground.png" alt="" aria-hidden="true" className="h-full w-full select-none object-contain" />
        </motion.div>

        {count > 0 && (
          <motion.span
            className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full border border-line bg-panel text-[13px] font-medium text-ink shadow-soft sm:h-10 sm:w-10"
            animate={hover ? { y: -3 } : { y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {count}
          </motion.span>
        )}
      </div>

      <div className="mt-4 text-center">
        <span className="text-[15px] font-medium tracking-[-0.02em] text-ink underline-offset-[6px] transition-opacity duration-300 group-hover:opacity-55">
          {cat.label}
        </span>
      </div>
    </button>
  );
}

function FeedOverlay({ cat, onClose }: { cat: HomeCategory; onClose: () => void }) {
  const [index, setIndex] = useState<number | null>(null);
  const images = cat.images.filter((i) => i.visible).sort((a, b) => a.sort - b.sort);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && index === null) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose]);

  return (
    <div className="fixed inset-0 z-[160] overflow-y-auto bg-bg">
      <div className="mx-auto w-full max-w-[720px] px-4 pb-16 pt-6 sm:px-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <span className="kicker">Design exploration</span>
            <h2 className="mt-2 text-[clamp(22px,4vw,30px)] font-normal leading-[1.1] tracking-[-0.05em]">
              {cat.label}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close image feed"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line bg-panel text-ink shadow-soft transition-colors hover:bg-bg"
          >
            <X size={18} />
          </button>
        </div>

        <PinterestGrid images={images} onOpen={setIndex} />
      </div>

      <LightboxModal
        open={index !== null}
        images={images.map((img, i) => ({
          src: img.image_url,
          alt: img.alt_text || `Visual ${i + 1} for ${cat.label}`,
        }))}
        index={index ?? 0}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </div>
  );
}
