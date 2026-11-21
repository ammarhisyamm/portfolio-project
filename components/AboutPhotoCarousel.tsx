"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type TransitionEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { AboutGalleryItem } from "@/lib/content";

/**
 * One page turn. The leaf shows page `lo` on its front and page `hi` on its back, and
 * `angle` runs from 0 (lying on the right) to -180 (lying on the left). While a drag
 * holds it the angle follows the pointer; once released it settles to the nearer side.
 */
type Turn = { dir: 1 | -1; to: number; lo: number; hi: number; angle: number; dragging: boolean; settle?: "done" | "cancel" };

type Drag = { x: number; y: number; half: number; dir: 0 | 1 | -1; progress: number; moved: boolean; side: 1 | -1 };

const pad = (value: number) => String(value).padStart(2, "0");

function PhotoPage({ photo, number }: { photo: AboutGalleryItem; number: number }) {
  return (
    <div className="album-page is-left">
      <figure className="album-photo">
        <span className="album-corner is-tl" aria-hidden="true" />
        <span className="album-corner is-tr" aria-hidden="true" />
        <span className="album-corner is-br" aria-hidden="true" />
        <span className="album-corner is-bl" aria-hidden="true" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.image} alt={photo.alt || photo.title} draggable={false} />
        <figcaption>No. {pad(number)}</figcaption>
      </figure>
    </div>
  );
}

function InfoPage({ photo, number, total }: { photo: AboutGalleryItem; number: number; total: number }) {
  return (
    <div className="album-page is-right">
      <span className="album-eyebrow">Page {pad(number)} of {pad(total)}</span>
      <h3 className="album-title">{photo.title || "A moment to keep"}</h3>
      <span className="album-rule" aria-hidden="true" />
      <p className="album-note">{photo.note}</p>
    </div>
  );
}

export default function AboutPhotoCarousel({ items }: { items: AboutGalleryItem[] }) {
  const photos = items.filter((item) => item.image);
  const [index, setIndex] = useState(0);
  const [turn, setTurnState] = useState<Turn | null>(null);
  const [closed, setClosed] = useState(true);
  const [wide, setWide] = useState(true);
  const turnRef = useRef<Turn | null>(null);
  const drag = useRef<Drag | null>(null);
  const reduced = useRef(false);

  const setTurn = (next: Turn | null) => {
    turnRef.current = next;
    setTurnState(next);
  };

  useEffect(() => {
    const wideQuery = window.matchMedia("(min-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setWide(wideQuery.matches);
      reduced.current = motionQuery.matches;
    };
    sync();
    wideQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      wideQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  // The transition end normally lands a settling turn; this covers a tab that never ran it.
  useEffect(() => {
    if (!turn?.settle) return;
    const timer = window.setTimeout(land, 1000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turn?.settle]);

  if (!photos.length) return null;

  const total = photos.length;
  const current = Math.min(index, total - 1);

  function land() {
    const done = turnRef.current;
    if (!done?.settle) return;
    if (done.settle === "done") setIndex(done.to);
    setTurn(null);
  }

  function begin(dir: 1 | -1, dragging: boolean): Turn | null {
    if (turnRef.current || total < 2 || closed) return null;
    const to = (current + dir + total) % total;
    const next: Turn = { dir, to, lo: dir === 1 ? current : to, hi: dir === 1 ? to : current, angle: dir === 1 ? 0 : -180, dragging };
    setTurn(next);
    return next;
  }

  function settle(t: Turn, done: boolean) {
    const end = done === (t.dir === 1) ? -180 : 0;
    setTurn({ ...t, dragging: false, angle: end, settle: done ? "done" : "cancel" });
  }

  function go(dir: 1 | -1) {
    if (closed) {
      setClosed(false);
      return;
    }
    if (reduced.current) {
      if (total > 1) setIndex((current + dir + total) % total);
      return;
    }
    const t = begin(dir, false);
    if (!t) return;
    // Let the leaf paint at its starting angle first, so the transition has somewhere to run from.
    requestAnimationFrame(() => requestAnimationFrame(() => settle(t, true)));
  }

  function jumpTo(target: number) {
    if (target === current || turnRef.current) return;
    setIndex(target);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
    if (closed && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); setClosed(false); }
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (closed || turnRef.current || event.button !== 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const side = !wide || event.clientX > rect.left + rect.width / 2 ? 1 : -1;
    drag.current = { x: event.clientX, y: event.clientY, half: wide ? rect.width / 2 : rect.width, dir: 0, progress: 0, moved: false, side };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const d = drag.current;
    if (!d) return;
    const dx = event.clientX - d.x;
    if (!d.moved) {
      if (Math.abs(dx) < 6) return;
      // A mostly vertical move is the page scrolling, not a turn.
      if (Math.abs(event.clientY - d.y) > Math.abs(dx)) { drag.current = null; return; }
      d.moved = true;
      // On a spread you pull the page you grabbed; on a single page the swipe sets the way.
      d.dir = wide ? d.side : dx < 0 ? 1 : -1;
      if (reduced.current || !begin(d.dir, true)) { drag.current = null; return; }
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const t = turnRef.current;
    if (!t || !t.dragging || d.dir === 0) return;
    d.progress = Math.min(1, Math.max(0, (d.dir === 1 ? -dx : dx) / d.half));
    setTurn({ ...t, angle: d.dir === 1 ? -180 * d.progress : -180 + 180 * d.progress });
  }

  function onPointerUp() {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      // A plain click: the right page turns forward, the left page turns back.
      go(d.side);
      return;
    }
    const t = turnRef.current;
    if (t?.dragging) settle(t, d.progress > 0.3);
  }

  function onPointerCancel() {
    drag.current = null;
    const t = turnRef.current;
    if (t?.dragging) settle(t, false);
  }

  // Under the leaf the book already shows the pages it is about to reveal.
  const leftIndex = turn ? turn.lo : current;
  const rightIndex = turn ? turn.hi : current;
  const left = photos[leftIndex], right = photos[rightIndex];
  const angle = turn?.angle ?? 0;
  const leafStyle = (base: CSSProperties) =>
    ({ ...base, transform: `rotateY(${angle}deg)`, "--shade": Math.sin((Math.abs(angle) * Math.PI) / 180).toFixed(3) }) as CSSProperties;
  const onLeafEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && event.propertyName === "transform") land();
  };

  return (
    <section className="panel min-w-0 overflow-hidden p-5 sm:p-8" aria-labelledby="about-album-title">
      <div className="section-head">
        <div>
          <span className="kicker">Photo album</span>
          <h2 id="about-album-title" className="t-title mt-1">A few frames beyond the screen.</h2>
        </div>
        <p className="t-caption max-w-[280px]">
          {closed ? "Open the cover to start." : wide ? "Click a page, drag it across the spine, or use the arrows." : "Swipe the page, or use the arrows."}
        </p>
      </div>

      <div
        className={`album-book mx-auto mt-10 w-full max-w-[880px]${wide ? "" : " is-compact"}${closed ? " is-closed" : ""}${turn?.dragging ? " is-dragging" : ""}`}
        role="group"
        aria-roledescription="photo album"
        aria-label={closed ? "Photo album, closed. Press Enter to open it." : "Photo album"}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <div className="album-shadow" aria-hidden="true" />
        <div className="album-stage">
          <div className="album-board" aria-hidden="true" />
          <div
            className="album-spread"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerCancel}
          >
            {wide ? (
              <>
                <PhotoPage photo={left} number={leftIndex + 1} />
                <InfoPage photo={right} number={rightIndex + 1} total={total} />
                {turn && (
                  <div className={`album-leaf${turn.dragging ? "" : " is-settling"}`} style={leafStyle({ left: "50%", width: "50%" })} aria-hidden="true" onTransitionEnd={onLeafEnd}>
                    <div className="album-leaf-face album-leaf-front"><InfoPage photo={photos[turn.lo]} number={turn.lo + 1} total={total} /></div>
                    <div className="album-leaf-face album-leaf-back"><PhotoPage photo={photos[turn.hi]} number={turn.hi + 1} /></div>
                  </div>
                )}
              </>
            ) : (
              <>
                <PhotoPage photo={right} number={rightIndex + 1} />
                <InfoPage photo={right} number={rightIndex + 1} total={total} />
                {turn && (
                  <div className={`album-leaf${turn.dragging ? "" : " is-settling"}`} style={leafStyle({ left: 0, width: "100%" })} aria-hidden="true" onTransitionEnd={onLeafEnd}>
                    <div className="album-leaf-face album-leaf-front">
                      <div className="album-single">
                        <PhotoPage photo={photos[turn.lo]} number={turn.lo + 1} />
                        <InfoPage photo={photos[turn.lo]} number={turn.lo + 1} total={total} />
                      </div>
                    </div>
                    <div className="album-leaf-face album-leaf-back"><div className="album-blank" /></div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="album-cover" onClick={() => closed && setClosed(false)} aria-hidden="true">
            <div className="album-cover-face album-cover-front">
              <div className="album-label">
                <span className="album-label-kicker">Hisyam · Jakarta</span>
                <span className="album-label-title">Photo album</span>
                <span className="album-label-hint"><b>{pad(total)}</b> pages · tap to open</span>
              </div>
            </div>
            <div className="album-cover-face album-cover-back" />
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{closed ? "Album closed." : `Page ${current + 1} of ${total}: ${photos[current].title}`}</p>

      <div className="mx-auto mt-10 flex w-full max-w-[880px] items-center justify-between gap-3">
        <button type="button" onClick={() => go(-1)} disabled={closed || total < 2} aria-label="Previous page" className="album-nav">
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        {closed ? (
          <button type="button" onClick={() => setClosed(false)} className="btn btn-primary">
            Open the album
            <ArrowRight size={15} aria-hidden="true" />
          </button>
        ) : (
          <div className="album-dots" role="group" aria-label="Pages">
            {photos.map((photo, i) => (
              <button key={`${i}-${photo.image}`} type="button" aria-label={`Page ${i + 1}: ${photo.title}`} aria-current={i === current ? "true" : undefined} onClick={() => jumpTo(i)} />
            ))}
          </div>
        )}
        <button type="button" onClick={() => go(1)} disabled={!closed && total < 2} aria-label={closed ? "Open the album" : "Next page"} className="album-nav">
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
