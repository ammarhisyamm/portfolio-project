"use client";

import { useEffect, useRef } from "react";
import { useProject } from "./ProjectContext";
import type { Project } from "@/lib/projects";
import Media from "./Media";

const OFFSETS = ["mt-0", "mt-14", "mt-24", "mt-6", "mt-32", "mt-10", "mt-20", "mt-2"];

export default function WorkCanvas({ projects }: { projects: Project[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });
  const { open } = useProject();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const half = el.scrollWidth / 2;
      if (el.scrollLeft >= half) el.scrollLeft -= half;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    const onPointerDown = (e: PointerEvent) => {
      drag.current = { active: true, startX: e.clientX, startLeft: el.scrollLeft };
      el.classList.add("cursor-grabbing");
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current.active) return;
      el.scrollLeft = drag.current.startLeft - (e.clientX - drag.current.startX);
    };
    const endDrag = () => {
      drag.current.active = false;
      el.classList.remove("cursor-grabbing");
    };

    el.addEventListener("scroll", onScroll);
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", endDrag);
    el.addEventListener("pointerleave", endDrag);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", endDrag);
      el.removeEventListener("pointerleave", endDrag);
    };
  }, []);

  const group = (key: string) => (
    <div key={key} className="flex items-start gap-8 px-8 pt-16">
      {projects.map((p, i) => (
        <figure key={p.slug} className={`w-64 shrink-0 sm:w-80 ${OFFSETS[i % OFFSETS.length]}`}>
          <button
            type="button"
            onClick={() => open(p.slug)}
            aria-label={`View ${p.title} case study`}
            className="group w-full cursor-pointer overflow-hidden rounded-card border border-line bg-panel text-left transition-colors duration-300 hover:border-line-strong hover:shadow-soft"
          >
            <div className="aspect-[4/3] w-full overflow-hidden border-b border-line bg-bg">
              <Media
                src={p.image}
                alt={`Visual for ${p.title}`}
                label={p.year}
                imgClassName="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <span className="truncate text-[14px] font-medium tracking-[-0.02em]">{p.title}</span>
              <span className="shrink-0 font-mono text-[10px] text-muted">{p.year}</span>
            </div>
          </button>
          <figcaption className="mt-2.5 flex justify-between font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
            <span>{p.category}</span>
            <span>Frame 0{i + 1}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden rounded-panel border border-line bg-panel">
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.02em] text-sub">
          Design canvas
        </span>
        <span className="hidden font-mono text-[11px] text-muted sm:block">
          Scroll or drag — endless
        </span>
        <span className="font-mono text-[11px] text-muted sm:hidden">Scroll ↔</span>
      </div>
      <div
        ref={scrollerRef}
        className="canvas-grid scrollbar-hide h-[68vh] cursor-grab select-none overflow-x-auto overflow-y-hidden"
      >
        <div className="flex w-max items-stretch">
          {group("a")}
          {group("b")}
        </div>
      </div>
    </div>
  );
}