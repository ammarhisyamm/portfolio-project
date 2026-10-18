"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type TouchEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { AboutGalleryItem } from "@/lib/content";

/** One page turn: the leaf shows page `lo` on its front and page `hi` on its back. */
type Turn = { lo: number; hi: number; dir: 1 | -1; to: number };

const pad = (value: number) => String(value).padStart(2, "0");

function PhotoPage({ photo, number, onClick }: { photo: AboutGalleryItem; number: number; onClick?: () => void }) {
  return (
    <div className="album-page is-left" onClick={onClick}>
      <figure className="album-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo.image} alt={photo.alt || photo.title} draggable={false} />
        <figcaption>No. {pad(number)}</figcaption>
      </figure>
    </div>
  );
}

function InfoPage({ photo, number, total, onClick }: { photo: AboutGalleryItem; number: number; total: number; onClick?: () => void }) {
  return (
    <div className="album-page is-right" onClick={onClick}>
      <span className="album-eyebrow">Photo {pad(number)} of {pad(total)}</span>
      <h3 className="album-title">{photo.title || "A moment to keep"}</h3>
      <span className="album-rule" aria-hidden="true" />
      <p className="album-note">{photo.note}</p>
    </div>
  );
}

export default function AboutPhotoCarousel({ items }: { items: AboutGalleryItem[] }) {
  const photos = items.filter((item) => item.image);
  const [index, setIndex] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);
  const [wide, setWide] = useState(true);
  const turnRef = useRef<Turn | null>(null);
  const touchStart = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    const wideQuery = window.matchMedia("(min-width: 768px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { setWide(wideQuery.matches); reduced.current = motionQuery.matches; };
    sync();
    wideQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => { wideQuery.removeEventListener("change", sync); motionQuery.removeEventListener("change", sync); };
  }, []);

  // The animation end normally lands the turn; this covers a tab that never ran it.
  useEffect(() => {
    if (!turn) return;
    const timer = window.setTimeout(finish, 1300);
    return () => window.clearTimeout(timer);
  }, [turn]);

  if (!photos.length) return null;

  const total = photos.length;
  const current = Math.min(index, total - 1);

  function finish() {
    const done = turnRef.current;
    if (!done) return;
    turnRef.current = null;
    setIndex(done.to);
    setTurn(null);
  }

  function go(dir: 1 | -1) {
    if (turnRef.current || total < 2) return;
    const to = (current + dir + total) % total;
    if (reduced.current) { setIndex(to); return; }
    const next: Turn = { dir, to, lo: dir === 1 ? current : to, hi: dir === 1 ? to : current };
    turnRef.current = next;
    setTurn(next);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") { event.preventDefault(); go(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(-1); }
  }
  function onTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    touchStart.current = null;
    if (start === null) return;
    const distance = event.changedTouches[0].clientX - start;
    if (Math.abs(distance) > 40) go(distance < 0 ? 1 : -1);
  }

  // Under the leaf the book already shows the pages it is about to reveal.
  const leftIndex = turn ? turn.lo : current;
  const rightIndex = turn ? turn.hi : current;
  const left = photos[leftIndex], right = photos[rightIndex];

  return (
    <section className="panel min-w-0 overflow-hidden p-5 sm:p-8" aria-labelledby="about-album-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">Photo album</span>
          <h2 id="about-album-title" className="mt-3 text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">
            A few frames beyond the screen.
          </h2>
        </div>
        <p className="max-w-[240px] text-[12px] leading-relaxed text-muted">
          Turn the page to see the next photo and read its note.
        </p>
      </div>

      <div
        className={`album-book mx-auto mt-7 w-full max-w-[860px]${wide ? "" : " is-compact"}`}
        role="group"
        aria-roledescription="photo album"
        aria-label="Photo album"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onTouchStart={(event) => { touchStart.current = event.touches[0].clientX; }}
        onTouchEnd={onTouchEnd}
      >
        {wide ? (
          <div className="album-spread is-wide">
            <PhotoPage photo={left} number={leftIndex + 1} onClick={() => go(-1)} />
            <InfoPage photo={right} number={rightIndex + 1} total={total} onClick={() => go(1)} />
            {turn && (
              <div
                className={`album-leaf ${turn.dir === 1 ? "is-next" : "is-prev"}`}
                style={{ left: "50%", width: "50%" }}
                aria-hidden="true"
                onAnimationEnd={(event) => { if (event.target === event.currentTarget) finish(); }}
              >
                <div className="album-leaf-face album-leaf-front"><InfoPage photo={photos[turn.lo]} number={turn.lo + 1} total={total} /></div>
                <div className="album-leaf-face album-leaf-back"><PhotoPage photo={photos[turn.hi]} number={turn.hi + 1} /></div>
              </div>
            )}
          </div>
        ) : (
          <div className="album-spread">
            <PhotoPage photo={right} number={rightIndex + 1} />
            <InfoPage photo={right} number={rightIndex + 1} total={total} />
            {turn && (
              <div
                className={`album-leaf ${turn.dir === 1 ? "is-next" : "is-prev"}`}
                style={{ left: 0, width: "100%" }}
                aria-hidden="true"
                onAnimationEnd={(event) => { if (event.target === event.currentTarget) finish(); }}
              >
                <div className="album-leaf-face album-leaf-front">
                  <div className="album-spread h-full"><PhotoPage photo={photos[turn.lo]} number={turn.lo + 1} /><InfoPage photo={photos[turn.lo]} number={turn.lo + 1} total={total} /></div>
                </div>
                <div className="album-leaf-face album-leaf-back"><div className="album-blank" /></div>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">Photo {current + 1} of {total}: {photos[current].title}</p>

      <div className="mx-auto mt-6 flex w-full max-w-[860px] items-center justify-between gap-3">
        <button type="button" onClick={() => go(-1)} disabled={total < 2} aria-label="Previous photo" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        <span className="text-[12px] tabular-nums tracking-[0.06em] text-muted" aria-hidden="true">{pad(current + 1)} / {pad(total)}</span>
        <button type="button" onClick={() => go(1)} disabled={total < 2} aria-label="Next photo" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
