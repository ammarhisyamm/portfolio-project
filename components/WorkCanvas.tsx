"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Plus,
  Minus,
  Maximize2,
  RotateCcw,
  Undo2,
} from "lucide-react";
import type { CanvasItem } from "@/lib/canvas";
import Media from "./Media";
import LightboxModal from "./LightboxModal";

const STORAGE_KEY = "hisyam.canvas.nodes.v1";

const BASE_LAYOUT = [
  { x: 140, y: 160, width: 420, rotation: -1.2 },
  { x: 700, y: 110, width: 360, rotation: 1 },
  { x: 1140, y: 320, width: 400, rotation: -0.8 },
  { x: 320, y: 660, width: 320, rotation: 1.5 },
  { x: 820, y: 720, width: 360, rotation: -1.5 },
  { x: 1220, y: 800, width: 300, rotation: 1.2 },
  { x: 280, y: 1030, width: 300, rotation: -1 },
  { x: 660, y: 1100, width: 320, rotation: 0.6 },
];

const MIN_ZOOM = 0.35;
const MAX_ZOOM = 2.5;
const INITIAL_VIEW = { x: 0, y: 0, zoom: 0.8 };
const DRAG_THRESHOLD = 6;

function defaultPositions(items: CanvasItem[]): Record<string, { x: number; y: number }> {
  return Object.fromEntries(
    items.map((it, i) => {
      const layout = BASE_LAYOUT[i % BASE_LAYOUT.length];
      return [it.slug, { x: layout.x, y: layout.y }];
    })
  );
}

function loadPositions(items: CanvasItem[]): Record<string, { x: number; y: number }> {
  const base = defaultPositions(items);
  if (typeof window === "undefined") return base;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw) as Record<string, { x: number; y: number }>;
    for (const it of items) {
      if (saved[it.slug]) base[it.slug] = saved[it.slug];
    }
    return base;
  } catch {
    return base;
  }
}

type Controls = {
  zoomCenter: (factor: number) => void;
  fitAll: () => void;
  resetView: () => void;
  resetLayout: () => void;
  closeGallery: () => void;
  openGallery: (slug: string) => void;
  stepGallery: (dir: 1 | -1) => void;
};

export default function WorkCanvas({ items }: { items: CanvasItem[] }) {
  const reduce = useReducedMotion();

  const viewportElRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const openedFrom = useRef<HTMLElement | null>(null);

  const [viewport, setViewport] = useState(INITIAL_VIEW);
  const viewportRef = useRef(viewport);
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(() =>
    loadPositions(items)
  );
  const positionsRef = useRef(positions);
  const [selected, setSelected] = useState<string | null>(null);
  const [gallerySlug, setGallerySlug] = useState<string | null>(null);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [spaceDown, setSpaceDown] = useState(false);
  const [hover, setHover] = useState(false);

  const spaceRef = useRef(false);
  const pan = useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number } | null>(null);
  const nodeDrag = useRef<{ slug: string | null; moved: boolean; startX: number; startY: number; origX: number; origY: number } | null>(null);

  viewportRef.current = viewport;
  positionsRef.current = positions;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(positions));
    } catch {
      /* storage unavailable */
    }
  }, [positions]);

  const bySlug = useCallback(
    (slug: string) => items.find((p) => p.slug === slug),
    [items]
  );
  const activeItem = gallerySlug ? bySlug(gallerySlug) : null;
  const galleryImages = activeItem ? [activeItem.image] : [];

  const zoomCenter = useCallback((factor: number) => {
    const el = viewportElRef.current;
    if (!el) return;
    const cx = el.clientWidth / 2;
    const cy = el.clientHeight / 2;
    setViewport((v) => {
      const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
      const wx = (cx - v.x) / v.zoom;
      const wy = (cy - v.y) / v.zoom;
      return { x: cx - wx * zoom, y: cy - wy * zoom, zoom };
    });
  }, []);

  const fitAll = useCallback(() => {
    const el = viewportElRef.current;
    if (!el) return;
    const pos = positionsRef.current;
    const xs = Object.values(pos).map((p) => p.x);
    const ys = Object.values(pos).map((p) => p.y);
    const minX = Math.min(...xs);
    const minY = Math.min(...ys);
    const maxX = Math.max(...xs);
    const maxY = Math.max(...ys);
    const pad = 90;
    const w = maxX - minX + pad * 2;
    const h = maxY - minY + pad * 2;
    const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.min((el.clientWidth - 40) / w, (el.clientHeight - 40) / h)));
    const cx = el.clientWidth / 2;
    const cy = el.clientHeight / 2;
    setViewport({ x: cx - (minX - pad + w / 2) * zoom, y: cy - (minY - pad + h / 2) * zoom, zoom });
  }, []);

  const resetView = useCallback(() => {
    setViewport(INITIAL_VIEW);
  }, []);

  const resetLayout = useCallback(() => {
    setPositions(defaultPositions(items));
    setViewport(INITIAL_VIEW);
  }, [items]);

  const closeGallery = useCallback(() => {
    setGallerySlug(null);
    const el = openedFrom.current;
    if (el) {
      el.focus();
      openedFrom.current = null;
    }
  }, []);

  const openGallery = useCallback((slug: string) => {
    openedFrom.current = nodeRefs.current[slug] ?? null;
    setGalleryIndex(0);
    setSelected(slug);
    setGallerySlug(slug);
  }, []);

  const stepGallery = useCallback(
    (dir: 1 | -1) => {
      if (galleryImages.length <= 1) return;
      setGalleryIndex((i) => (i + dir + galleryImages.length) % galleryImages.length);
    },
    [galleryImages.length]
  );

  const actions = useRef<Controls>({ zoomCenter, fitAll, resetView, resetLayout, closeGallery, openGallery, stepGallery });
  actions.current = { zoomCenter, fitAll, resetView, resetLayout, closeGallery, openGallery, stepGallery };

  // Wheel zoom (native listener for reliable preventDefault)
  useEffect(() => {
    const el = viewportElRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = Math.exp(-e.deltaY * 0.0015);
      setViewport((v) => {
        const zoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, v.zoom * factor));
        const wx = (cx - v.x) / v.zoom;
        const wy = (cy - v.y) / v.zoom;
        return { x: cx - wx * zoom, y: cy - wy * zoom, zoom };
      });
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      if (gallerySlug) return;

      if (e.code === "Space") {
        if (hover) {
          e.preventDefault();
          spaceRef.current = true;
          setSpaceDown(true);
        }
        return;
      }
      if (e.key === "+" || e.key === "=") actions.current.zoomCenter(1.25);
      else if (e.key === "-") actions.current.zoomCenter(0.8);
      else if (e.key === "0") actions.current.resetView();
      else if (e.key === "1") actions.current.fitAll();
      else if (e.key === "Escape") setSelected(null);
      else if (
        selected &&
        (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight")
      ) {
        e.preventDefault();
        const step = e.shiftKey ? 40 : 12;
        const dx = e.key === "ArrowLeft" ? -step : e.key === "ArrowRight" ? step : 0;
        const dy = e.key === "ArrowUp" ? -step : e.key === "ArrowDown" ? step : 0;
        setPositions((prev) => ({
          ...prev,
          [selected]: { x: prev[selected].x + dx, y: prev[selected].y + dy },
        }));
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceRef.current = false;
        setSpaceDown(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gallerySlug, selected, hover]);

  // Pan canvas (empty space, space+drag, or middle mouse)
  const onViewportPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.button !== 1) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("button, a, [role='button']")) return;
    const el = viewportElRef.current;
    if (!el) return;
    if (e.button === 1) e.preventDefault();
    el.setPointerCapture(e.pointerId);
    pan.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: viewportRef.current.x,
      origY: viewportRef.current.y,
    };
    el.classList.add("cursor-grabbing");
  };
  const onViewportPointerMove = (e: React.PointerEvent) => {
    if (!pan.current?.active) return;
    setViewport((v) => ({
      ...v,
      x: pan.current!.origX + (e.clientX - pan.current!.startX),
      y: pan.current!.origY + (e.clientY - pan.current!.startY),
    }));
  };
  const endPan = () => {
    if (pan.current?.active) viewportElRef.current?.classList.remove("cursor-grabbing");
    pan.current = null;
  };

  // Node drag
  const onNodePointerDown = (slug: string) => (e: React.PointerEvent) => {
    if (spaceRef.current || e.button !== 0) return;
    const el = nodeRefs.current[slug];
    if (!el) return;
    e.stopPropagation();
    el.setPointerCapture(e.pointerId);
    const pos = positionsRef.current[slug];
    nodeDrag.current = {
      slug,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
    };
    el.style.zIndex = "10";
  };
  const onNodePointerMove = (e: React.PointerEvent) => {
    const d = nodeDrag.current;
    if (!d?.slug) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD) d.moved = true;
    const zoom = viewportRef.current.zoom;
    setPositions((prev) => ({
      ...prev,
      [d.slug!]: { x: d.origX + dx / zoom, y: d.origY + dy / zoom },
    }));
  };
  const onNodePointerUp = () => {
    const d = nodeDrag.current;
    if (!d?.slug) return;
    const el = nodeRefs.current[d.slug];
    if (el) el.style.zIndex = "";
    if (!d.moved) actions.current.openGallery(d.slug);
    nodeDrag.current = null;
  };

  const zoomPercent = Math.round(viewport.zoom * 100);

  const nodeEntrance = (i: number) =>
    reduce
      ? null
      : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <div className="grid gap-3 md:gap-4">
      <div
        ref={viewportElRef}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={() => setHover(false)}
        onAuxClick={(e) => e.preventDefault()}
        className="canvas-grid relative h-[68vh] min-h-[600px] cursor-grab touch-none select-none overflow-hidden rounded-[18px] border border-line sm:min-h-[720px] sm:rounded-[22px] lg:rounded-[24px]"
      >
        <div
          className="absolute left-0 top-0 h-full w-full"
          style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`, transformOrigin: "0 0" }}
        >
          <div className="pointer-events-none absolute" style={{ width: 4200, height: 3400 }}>
            {items.map((p, i) => {
              const layout = BASE_LAYOUT[i % BASE_LAYOUT.length];
              const pos = positions[p.slug] ?? { x: layout.x, y: layout.y };
              const width = layout.width;
              const isSelected = selected === p.slug;
              const entrance = nodeEntrance(i);
              return (
                <motion.div
                  key={p.slug}
                  initial={entrance ? entrance.initial : false}
                  animate={entrance ? entrance.animate : undefined}
                  transition={entrance ? entrance.transition : undefined}
                  style={{ left: pos.x, top: pos.y, width, zIndex: isSelected ? 5 : undefined }}
                  className="absolute"
                >
                  <div
                    ref={(node) => {
                      nodeRefs.current[p.slug] = node;
                    }}
                    onPointerDown={onNodePointerDown(p.slug)}
                    onPointerMove={onNodePointerMove}
                    onPointerUp={onNodePointerUp}
                    onPointerCancel={onNodePointerUp}
                    role="button"
                    tabIndex={0}
                    aria-label={`${p.title}, ${p.category}, ${p.year}. Activate to view, drag to move.`}
                    aria-selected={isSelected || undefined}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        actions.current.openGallery(p.slug);
                      }
                    }}
                    style={{
                      transform: `rotate(${layout.rotation}deg)`,
                      boxShadow: "0 0 0 8px #ffffff, 0 22px 46px -22px rgba(22,22,22,0.32)",
                    }}
                    className={`group pointer-events-auto cursor-move touch-none select-none overflow-hidden rounded-[14px] bg-panel ${
                      spaceDown ? "cursor-grab" : "cursor-move"
                    }`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-bg">
                      <Media
                        src={p.image}
                        alt={`Visual for ${p.title}`}
                        label={p.year}
                        imgClassName="h-full w-full object-cover pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-panel/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-sub shadow-soft sm:hidden">
          Drag to explore · Pinch to zoom
        </span>

        <div className="absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-[14px] border border-line bg-panel/90 p-1.5 shadow-soft sm:bottom-4 sm:right-4 sm:top-auto">
          <IconBtn label="Zoom out" onClick={() => actions.current.zoomCenter(0.8)} disabled={viewport.zoom <= MIN_ZOOM}>
            <Minus size={15} />
          </IconBtn>
          <span className="w-11 text-center font-mono text-[11px] tabular-nums text-sub">{zoomPercent}%</span>
          <IconBtn label="Zoom in" onClick={() => actions.current.zoomCenter(1.25)} disabled={viewport.zoom >= MAX_ZOOM}>
            <Plus size={15} />
          </IconBtn>
          <span className="mx-0.5 h-5 w-px bg-line" aria-hidden="true" />
          <IconBtn label="Reset view (0)" onClick={actions.current.resetView}>
            <RotateCcw size={15} />
          </IconBtn>
          <IconBtn label="Fit all projects (1)" onClick={actions.current.fitAll}>
            <Maximize2 size={15} />
          </IconBtn>
          <IconBtn label="Reset layout" onClick={actions.current.resetLayout}>
            <Undo2 size={15} />
          </IconBtn>
        </div>
      </div>

      <LightboxModal
        open={!!activeItem}
        images={activeItem ? [{ src: activeItem.image, alt: `Visual for ${activeItem.title}` }] : []}
        index={galleryIndex}
        onIndexChange={setGalleryIndex}
        onClose={closeGallery}
      />
    </div>
  );
}

function IconBtn({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="grid h-8 w-8 place-items-center rounded-[10px] text-sub transition-colors hover:bg-bg hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}