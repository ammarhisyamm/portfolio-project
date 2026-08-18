"use client";

import { useCallback, useEffect } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import Media from "./Media";

type LightboxImage = { src: string; alt: string };

type LightboxModalProps = {
  open: boolean;
  images: LightboxImage[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
};

export default function LightboxModal({ open, images, index, onIndexChange, onClose }: LightboxModalProps) {
  const count = images.length;

  const prev = useCallback(() => {
    if (count > 1) onIndexChange((index - 1 + count) % count);
  }, [index, count, onIndexChange]);

  const next = useCallback(() => {
    if (count > 1) onIndexChange((index + 1) % count);
  }, [index, count, onIndexChange]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, next, prev, onClose]);

  if (!open || count === 0 || !images[index]) return null;
  const img = images[index];

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X size={20} />
      </button>

      {count > 1 && (
        <>
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
        </>
      )}

      <div
        className="max-h-full overflow-hidden rounded-[14px] bg-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <Media
          src={img.src}
          alt={img.alt}
          label={img.alt}
          imgClassName="max-h-[80vh] w-auto object-contain"
        />
      </div>

      <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-white">
        {index + 1} / {count}
      </div>
    </div>
  );
}