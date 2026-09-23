"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  RotateCcw,
  Undo2,
  X,
} from "lucide-react";
import type { CanvasItem } from "@/lib/canvas";
import Media from "./Media";
import LightboxModal from "./LightboxModal";

const STORAGE_KEY = "hisyam.canvas.nodes.v1";

const PREVIEW_WIDTH = 360;
const BASE_LAYOUT = [
  { x: 140, y: 160, rotation: -1.2 },
  { x: 700, y: 110, rotation: 1 },
  { x: 1140, y: 320, rotation: -0.8 },
  { x: 320, y: 660, rotation: 1.5 },
  { x: 820, y: 720, rotation: -1.5 },
  { x: 1220, y: 800, rotation: 1.2 },
  { x: 280, y: 1030, rotation: -1 },
  { x: 660, y: 1100, rotation: 0.6 },
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
  const [fullscreen, setFullscreen] = useState(false);

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

  const toggleFullscreen = () => {
    const next = !fullscreen;
    setFullscreen(next);
    if (next) window.setTimeout(() => actions.current.fitAll(), 120);
  };

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
  }, [fullscreen]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;

      if (gallerySlug) return;

      if (e.key === "Escape" && fullscreen) {
        setFullscreen(false);
        return;
      }

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
  }, [gallerySlug, selected, hover, fullscreen]);

  // Lock body scroll while full screen
  useEffect(() => {
    if (!fullscreen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [fullscreen]);

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

  const controlsClass = fullscreen
    ? "absolute bottom-4 right-4 top-auto z-10 flex items-center gap-0.5 rounded-[14px] border border-line bg-panel/90 p-1.5 shadow-soft"
    : "absolute right-3 top-3 z-10 flex items-center gap-0.5 rounded-[14px] border border-line bg-panel/90 p-1.5 shadow-soft sm:bottom-4 sm:right-4 sm:top-auto";

  const canvasArea = (
    <div
      ref={viewportElRef}
      onPointerDown={onViewportPointerDown}
      onPointerMove={onViewportPointerMove}
      onPointerUp={endPan}
      onPointerCancel={endPan}
      onPointerEnter={() => setHover(true)}
      onPointerLeave={() => setHover(false)}
      onAuxClick={(e) => e.preventDefault()}
      className={`canvas-grid relative cursor-grab touch-none select-none overflow-hidden ${
        fullscreen
          ? "h-full rounded-[18px]"
          : "h-[68vh] min-h-[600px] rounded-[18px] border border-line sm:min-h-[720px] sm:rounded-[22px] lg:rounded-[24px]"
      }`}
    >
      <div
        className="absolute left-0 top-0 h-full w-full"
        style={{ transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`, transformOrigin: "0 0" }}
      >
        <div className="pointer-events-none absolute" style={{ width: 4200, height: 3400 }}>
          {items.map((p, i) => {
            const layout = BASE_LAYOUT[i % BASE_LAYOUT.length];
            const pos = positions[p.slug] ?? { x: layout.x, y: layout.y };
            const isSelected = selected === p.slug;
            const entrance = nodeEntrance(i);
            return (
              <motion.div
                key={p.slug}
                initial={entrance ? entrance.initial : false}
                animate={entrance ? entrance.animate : undefined}
                transition={entrance ? entrance.transition : undefined}
                style={{ left: pos.x, top: pos.y, width: PREVIEW_WIDTH, zIndex: isSelected ? 5 : undefined }}
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
                  style={{ transform: `rotate(${layout.rotation}deg)` }}
                  className={`group pointer-events-auto cursor-move touch-none select-none overflow-hidden rounded-[24px] bg-[#f1f2f6] p-2 shadow-[0_22px_46px_-22px_rgba(22,22,22,0.32)] ${
                    spaceDown ? "cursor-grab" : "cursor-move"
                  }`}
                >
                  <FolderPreview image={p.image} title={p.title} year={p.year} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <span className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-line bg-panel/85 px-3 py-1.5  text-[10px] uppercase tracking-[0.06em] text-sub shadow-soft sm:hidden">
        Drag to explore · Pinch to zoom
      </span>

      <div className={controlsClass}>
        <IconBtn label="Zoom out" onClick={() => actions.current.zoomCenter(0.8)} disabled={viewport.zoom <= MIN_ZOOM}>
          <Minus size={15} />
        </IconBtn>
        <span className="w-11 text-center  text-[11px] tabular-nums text-sub">{zoomPercent}%</span>
        <IconBtn label="Zoom in" onClick={() => actions.current.zoomCenter(1.25)} disabled={viewport.zoom >= MAX_ZOOM}>
          <Plus size={15} />
        </IconBtn>
        <span className="mx-0.5 h-5 w-px bg-line" aria-hidden="true" />
        <IconBtn label="Reset view (0)" onClick={actions.current.resetView}>
          <RotateCcw size={15} />
        </IconBtn>
        <IconBtn
          label={fullscreen ? "Exit full screen" : "Full screen"}
          onClick={toggleFullscreen}
        >
          {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </IconBtn>
        <IconBtn label="Reset layout" onClick={actions.current.resetLayout}>
          <Undo2 size={15} />
        </IconBtn>
      </div>
    </div>
  );

  return (
    <div className="grid gap-3 md:gap-4">
      {!fullscreen && canvasArea}

      <AnimatePresence>
        {fullscreen && (
          <motion.div
            className="fixed inset-0 z-[120] bg-bg p-3 sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            role="presentation"
          >
            <motion.div
              className="relative h-full"
              initial={{ scale: 0.95, y: 14, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 14, opacity: 0 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              <button
                type="button"
                onClick={() => setFullscreen(false)}
                aria-label="Close full screen"
                title="Close full screen"
                className="absolute right-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-line bg-panel text-ink shadow-soft transition-colors hover:bg-bg"
              >
                <X size={18} />
              </button>
              {canvasArea}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

function FolderPreview({ image, title, year }: { image: string; title: string; year: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-[18px] bg-[#f5f5f7]">
      <div className="absolute left-[23%] top-[11%] z-[1] h-[54%] w-[56%] rotate-[-7deg] overflow-hidden rounded-[6px] border border-white/90 bg-white shadow-[0_10px_20px_rgba(28,29,36,0.18)]">
        <Media
          src={image}
          alt={`Preview document for ${title}`}
          label={year || title}
          imgClassName="h-full w-full object-cover pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/exploration-folder-foreground.png" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 z-[2] h-full w-full select-none object-contain" />
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
