"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Lightbulb, LightbulbOff, Minus, Plus, X } from "lucide-react";
import type { CanvasItem } from "@/lib/canvas";
import Media from "./Media";

type Props = {
  open: boolean;
  items: CanvasItem[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export default function MuseumGallery({ open, items, index, onIndexChange, onClose }: Props) {
  const [lightsOn, setLightsOn] = useState(true);
  const [zoom, setZoom] = useState(100);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = items.length;
  const item = items[index];

  const step = useCallback((direction: -1 | 1) => {
    if (count > 1) onIndexChange((index + direction + count) % count);
  }, [count, index, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => { setZoom(100); }, [index]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); }
      else if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
      else if (event.key === "Tab") {
        const buttons = dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)");
        if (!buttons?.length) return;
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, step]);

  if (!open || !item) return null;

  return createPortal(
    <div className="museum-gallery" data-lights={lightsOn ? "on" : "off"} role="dialog" aria-modal="true" aria-label="Design exploration gallery" ref={dialogRef}>
      <div className="museum-gallery-wall" aria-hidden="true" />
      <header className="museum-gallery-topbar">
        <span className="museum-gallery-count">Gallery <span aria-hidden="true">/</span> {String(index + 1).padStart(2, "0")} of {String(count).padStart(2, "0")}</span>
        <div className="museum-gallery-top-actions">
          <button type="button" className="museum-gallery-icon-button museum-gallery-light-button" onClick={() => setLightsOn((value) => !value)} aria-label={lightsOn ? "Turn gallery light off" : "Turn gallery light on"} aria-pressed={lightsOn} title={lightsOn ? "Turn light off" : "Turn light on"}>
            {lightsOn ? <Lightbulb size={19} strokeWidth={1.7} /> : <LightbulbOff size={19} strokeWidth={1.7} />}
            <span>{lightsOn ? "Lights on" : "Lights off"}</span>
          </button>
          <button ref={closeRef} type="button" className="museum-gallery-icon-button museum-gallery-close" onClick={onClose} aria-label="Close gallery" title="Close gallery"><X size={20} strokeWidth={1.7} /></button>
        </div>
      </header>

      <main className="museum-gallery-stage" onTouchStart={(event) => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={(event) => {
        if (!touchStart.current) return;
        const dx = event.changedTouches[0].clientX - touchStart.current.x;
        const dy = event.changedTouches[0].clientY - touchStart.current.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }}>
        <div className="museum-gallery-lamp" aria-hidden="true"><span /></div>
        <div className="museum-gallery-beam" aria-hidden="true" />
        {count > 1 && <button type="button" className="museum-gallery-arrow museum-gallery-arrow-prev" onClick={() => step(-1)} aria-label="Previous artwork"><ArrowLeft size={21} strokeWidth={1.6} /></button>}
        <div className="museum-gallery-display">
          <div className="museum-gallery-frame" aria-live="polite">
            <div className="museum-gallery-art-viewport">
              <div className="museum-gallery-artwork" key={item.slug} style={{ transform: `scale(${zoom / 100})` }}>
                <Media src={item.image} alt={item.title} label={item.title} imgClassName="h-full w-full object-contain" />
              </div>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="museum-gallery-frame-image" src="/images/museum-frame.png" alt="" aria-hidden="true" />
          </div>
          <div className="museum-gallery-plaque">
            <span className="museum-gallery-plaque-title">{item.title}</span>
            <span className="museum-gallery-plaque-meta">{[item.category, item.year].filter(Boolean).join(" · ")}</span>
          </div>
        </div>
        {count > 1 && <button type="button" className="museum-gallery-arrow museum-gallery-arrow-next" onClick={() => step(1)} aria-label="Next artwork"><ArrowRight size={21} strokeWidth={1.6} /></button>}
      </main>

      <footer className="museum-gallery-footer">
        <div className="museum-gallery-details">
          <span className="museum-gallery-footer-label">Currently on view</span>
          <h2>{item.title}</h2>
          <span>{[item.category, item.year].filter(Boolean).join(" · ")}</span>
        </div>
        <div className="museum-gallery-footer-controls">
          <div className="museum-gallery-thumbs" aria-label="Choose artwork">
            {items.map((work, thumbIndex) => (
              <button key={work.slug} type="button" className="museum-gallery-thumb" data-active={thumbIndex === index} aria-label={`View ${work.title}`} aria-current={thumbIndex === index ? "true" : undefined} onClick={() => onIndexChange(thumbIndex)}>
                <Media src={work.image} alt="" label={work.title} imgClassName="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="museum-gallery-zoom" aria-label="Artwork zoom">
            <button type="button" onClick={() => setZoom((value) => Math.max(100, value - 20))} disabled={zoom === 100} aria-label="Zoom out"><Minus size={16} /></button>
            <output aria-live="polite">{zoom}%</output>
            <button type="button" onClick={() => setZoom((value) => Math.min(160, value + 20))} disabled={zoom === 160} aria-label="Zoom in"><Plus size={16} /></button>
          </div>
        </div>
      </footer>
    </div>, document.body
  );
}
