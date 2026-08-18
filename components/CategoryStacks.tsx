"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import type { HomeCategory } from "@/lib/content";
import Media from "./Media";

const BASES = [
  { left: "4%", top: "8%", width: "58%" },
  { left: "auto", right: "4%", bottom: "7%", width: "56%" },
  { left: "26%", top: "30%", width: "48%" },
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
    <section className="panel p-5 sm:p-8">
      <span className="kicker">Design exploration</span>
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
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
  const count = published.length;

  return (
    <Link
      href={`/work/${cat.key}`}
      onClick={saveScroll}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-4"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[18px] border border-line bg-panel sm:rounded-[22px] lg:rounded-[24px]">
        {supporting.map((img, i) => {
          const base = BASES[i % BASES.length];
          return (
            <motion.div
              key={img.id ?? i}
              className="absolute"
              style={{ ...base, zIndex: img.z_order + 1 }}
              animate={
                hover
                  ? { x: img.offset_x * 1.8, y: img.offset_y * 1.8, rotate: img.rotation * 1.35 }
                  : { x: img.offset_x, y: img.offset_y, rotate: img.rotation }
              }
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-lg border border-line bg-bg shadow-soft">
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
          animate={hover ? { scale: 1.035 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 24 }}
        >
          {primary ? (
            <div className="h-full w-full overflow-hidden rounded-[16px] border border-line bg-bg shadow-soft sm:rounded-[20px] lg:rounded-[22px]">
              <Media
                src={primary.image_url}
                alt={primary.alt_text || cat.label}
                label={cat.label}
                imgClassName="h-full w-full object-cover select-none transition-transform duration-500 ease-out"
              />
            </div>
          ) : (
            <div className="media-ph h-full w-full">
              <span>{cat.label}</span>
            </div>
          )}
        </motion.div>

        {count > 0 && (
          <motion.span
            className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-[#2456ff] text-[13px] font-semibold text-white shadow-[0_6px_18px_rgba(36,86,255,0.4)] sm:h-10 sm:w-10"
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
    </Link>
  );
}
