"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Media from "./Media";

type LightboxImage = { id?: string; image_url: string; alt_text: string };

export default function Lightbox({ images }: { images: LightboxImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const prev = useCallback(() => {
    setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setIndex((i) => (i === null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="columns-1 gap-3 space-y-3 sm:columns-2 md:gap-4 md:space-y-4 lg:columns-3">
        {images.map((img, i) => (
          <button
            key={img.id ?? i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Open image ${i + 1}`}
            className="group block w-full cursor-zoom-in break-inside-avoid overflow-hidden rounded-[14px] border border-line bg-panel text-left sm:rounded-[18px]"
          >
            <Media
              src={img.image_url}
              alt={img.alt_text || `Visual ${i + 1}`}
              label={`Visual ${i + 1}`}
              imgClassName="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
          </button>
        ))}
      </div>

      {open && index !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setIndex(null)}
        >
          <button
            type="button"
            onClick={() => setIndex(null)}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
          >
            <ArrowLeft size={22} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
          >
            <ArrowRight size={22} />
          </button>

          <div
            className="max-h-full overflow-hidden rounded-[14px] bg-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <Media
              src={images[index].image_url}
              alt={images[index].alt_text || `Visual ${index + 1}`}
              label={images[index].alt_text || `Visual ${index + 1}`}
              imgClassName="max-h-[80vh] w-auto object-contain"
            />
          </div>

          <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}