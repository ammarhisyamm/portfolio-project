"use client";

import { useRef } from "react";
import { useProject } from "./ProjectContext";
import type { Project } from "@/lib/projects";
import Media from "./Media";

const SCATTER = [
  { x: 4, y: 8 },
  { x: 27, y: 16 },
  { x: 50, y: 6 },
  { x: 69, y: 18 },
  { x: 14, y: 44 },
  { x: 40, y: 52 },
  { x: 62, y: 44 },
  { x: 80, y: 54 },
];

type DragState = {
  slug: string | null;
  moved: boolean;
  startX: number;
  startY: number;
  origLeft: number;
  origTop: number;
};

export default function WorkCanvas({ projects }: { projects: Project[] }) {
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const drag = useRef<DragState>({
    slug: null,
    moved: false,
    startX: 0,
    startY: 0,
    origLeft: 0,
    origTop: 0,
  });
  const { open } = useProject();

  const down = (slug: string) => (e: React.PointerEvent) => {
    const el = refs.current[slug];
    if (!el) return;
    drag.current = {
      slug,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origLeft: el.offsetLeft,
      origTop: el.offsetTop,
    };
    el.setPointerCapture(e.pointerId);
    el.classList.add("cursor-grabbing");
    el.style.zIndex = "10";
  };

  const move = (e: React.PointerEvent) => {
    const d = drag.current;
    const el = d.slug ? refs.current[d.slug] : null;
    if (!el) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) d.moved = true;
    el.style.left = `${d.origLeft + dx}px`;
    el.style.top = `${d.origTop + dy}px`;
  };

  const up = () => {
    const d = drag.current;
    if (!d.slug) return;
    const el = refs.current[d.slug];
    if (el) {
      el.classList.remove("cursor-grabbing");
      el.style.zIndex = "";
    }
    if (!d.moved) open(d.slug);
    drag.current = {
      slug: null,
      moved: false,
      startX: 0,
      startY: 0,
      origLeft: 0,
      origTop: 0,
    };
  };

  return (
    <div className="canvas-grid relative h-[60vh] overflow-hidden rounded-[18px] border border-line sm:h-[70vh] sm:rounded-[22px] lg:rounded-[24px]">
      {projects.map((p, i) => {
        const pos = SCATTER[i % SCATTER.length];
        return (
          <div
            key={p.slug}
            ref={(node) => {
              refs.current[p.slug] = node;
            }}
            onPointerDown={down(p.slug)}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
            role="button"
            tabIndex={0}
            aria-label={`Drag ${p.title}, or press Enter to view its case study`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(p.slug);
              }
            }}
            className="absolute w-52 cursor-grab touch-none select-none overflow-hidden rounded-[16px] border border-line bg-panel shadow-soft sm:w-64"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-bg">
              <Media
                src={p.image}
                alt={`Visual for ${p.title}`}
                label={p.year}
                imgClassName="h-full w-full object-cover pointer-events-none select-none"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}