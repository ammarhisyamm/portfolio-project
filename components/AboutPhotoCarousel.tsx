"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import type { AboutGalleryItem } from "@/lib/content";

export default function AboutPhotoCarousel({ items }: { items: AboutGalleryItem[] }) {
  const photos = items.filter((item) => item.image);
  const [active, setActive] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (!photos.length) return null;

  const index = Math.min(active, photos.length - 1);
  const photo = photos[index];

  function goTo(next: number) {
    setFlipped(false);
    setActive((next + photos.length) % photos.length);
  }

  return (
    <section className="panel min-w-0 overflow-hidden p-5 sm:p-8" aria-labelledby="about-album-title">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="kicker">Photo album</span>
          <h2 id="about-album-title" className="mt-3 text-[clamp(22px,3vw,28px)] font-normal tracking-[-0.05em]">
            A few frames beyond the screen.
          </h2>
        </div>
        <p className="max-w-[220px] text-[12px] leading-relaxed text-muted">
          Select a photo to turn it over and read its note.
        </p>
      </div>

      <div className="mx-auto mt-7 w-full max-w-[440px] [perspective:1200px]">
        <button
          key={index}
          type="button"
          onClick={() => setFlipped((value) => !value)}
          aria-label={flipped ? `Show photo: ${photo.title}` : `Read note for ${photo.title}`}
          aria-pressed={flipped}
          className="about-album-card relative block aspect-[4/5] w-full cursor-pointer text-left focus-visible:outline-offset-4"
        >
          <span className={`about-album-card-inner ${flipped ? "is-flipped" : ""}`}>
            <span className="about-album-face about-album-front">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.image} alt={photo.alt || photo.title} className="h-[78%] w-full object-cover" />
              <span className="flex min-h-0 flex-1 items-center justify-between gap-3 px-1 pt-4">
                <span className="line-clamp-2 text-[clamp(16px,3vw,21px)] leading-tight tracking-[-0.04em] text-ink">
                  {photo.title || "A moment to keep"}
                </span>
                <RotateCcw size={18} className="shrink-0 text-muted" aria-hidden="true" />
              </span>
            </span>
            <span className="about-album-face about-album-back" aria-hidden={!flipped}>
              <span className="text-[11px] uppercase tracking-[0.08em] text-muted">A note from the album</span>
              <span className="mt-auto block text-[clamp(22px,5vw,34px)] leading-[1.16] tracking-[-0.05em] text-ink">
                {photo.title || "A moment to keep"}
              </span>
              <span className="mt-5 block max-h-[45%] overflow-y-auto text-[clamp(13px,2.5vw,16px)] leading-[1.7] text-sub">
                {photo.note}
              </span>
              <span className="mt-auto border-t border-line-strong pt-5 text-[11px] text-muted">Select to see the photo again</span>
            </span>
          </span>
        </button>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-[440px] items-center justify-between gap-3">
        <button type="button" onClick={() => goTo(index - 1)} disabled={photos.length < 2} aria-label="Previous photo" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Choose a photo">
          {photos.map((item, photoIndex) => (
            <button
              key={`${item.image}-${photoIndex}`}
              type="button"
              onClick={() => goTo(photoIndex)}
              aria-label={`Photo ${photoIndex + 1}: ${item.title}`}
              aria-current={photoIndex === index ? "true" : undefined}
              className={`h-2 rounded-full transition-[width,background-color] duration-200 ${photoIndex === index ? "w-6 bg-ink" : "w-2 bg-line-strong hover:bg-muted"}`}
            />
          ))}
        </div>
        <button type="button" onClick={() => goTo(index + 1)} disabled={photos.length < 2} aria-label="Next photo" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-bg disabled:cursor-not-allowed disabled:opacity-40">
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </div>
      {photo.placeholder && <p className="mt-3 text-center text-[11px] text-muted">Sample photo. Replace it in the CMS.</p>}
    </section>
  );
}
