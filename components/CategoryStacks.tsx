"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { HomeCategory } from "@/lib/content";
import Media from "./Media";

const BASES = [
  { left: "3%", top: "6%", width: "58%" },
  { left: "auto", right: "3%", bottom: "5%", width: "56%" },
  { left: "26%", top: "28%", width: "48%" },
];

function saveScroll() {
  try {
    sessionStorage.setItem("hisyam.homeScroll", String(window.scrollY));
    sessionStorage.setItem("hisyam.returnHome", "1");
  } catch {
    /* ignore */
  }
}

export default function CategoryStacks({ categories }: { categories: HomeCategory[] }) {
  if (categories.length === 0) return null;

  return (
    <section className="grid gap-12">
      <div>
        <p className="kicker">Work</p>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-y-16">
        {categories.map((cat) => (
          <CategoryStack key={cat.key} cat={cat} />
        ))}
      </div>
    </section>
  );
}

function CategoryStack({ cat }: { cat: HomeCategory }) {
  const [hover, setHover] = useState(false);
  const published = cat.images.filter((i) => i.visible);
  const primary = published.find((i) => i.is_primary) ?? published[0];
  const supporting = published
    .filter((i) => i !== primary)
    .sort((a, b) => a.z_order - b.z_order)
    .slice(0, 3);

  return (
    <Link
      href={`/work/${cat.key}`}
      onClick={saveScroll}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-panel">
        {supporting.map((img, i) => {
          const base = BASES[i % BASES.length];
          return (
            <motion.div
              key={img.id ?? i}
              className="absolute"
              style={{ ...base, zIndex: img.z_order + 1 }}
              animate={
                hover
                  ? { x: img.offset_x * 1.5, y: img.offset_y * 1.5, rotate: img.rotation * 1.2 }
                  : { x: img.offset_x, y: img.offset_y, rotate: img.rotation }
              }
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden border border-line bg-bg">
                <Media
                  src={img.image_url}
                  alt={img.alt_text || cat.label}
                  label={cat.label}
                  imgClassName="h-full w-full object-cover select-none"
                />
              </div>
            </motion.div>
          );
        })}

        <motion.div
          className="absolute inset-0 z-10"
          animate={hover ? { scale: 1.02 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          {primary ? (
            <div className="h-full w-full overflow-hidden border border-line bg-bg">
              <Media
                src={primary.image_url}
                alt={primary.alt_text || cat.label}
                label={cat.label}
                imgClassName="h-full w-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
          ) : (
            <div className="media-ph h-full w-full">
              <span>{cat.label}</span>
            </div>
          )}
        </motion.div>
      </div>

      <p className="mt-4 text-center text-[12px] uppercase tracking-[0.18em] text-ink transition-opacity duration-300 group-hover:opacity-50">
        {cat.label}
      </p>
    </Link>
  );
}
