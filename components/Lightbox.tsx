"use client";

import { useState } from "react";
import Media from "./Media";
import LightboxModal from "./LightboxModal";

export type PinterestImage = { id?: string; image_url: string; alt_text: string };

export function PinterestGrid({
  images,
  onOpen,
}: {
  images: PinterestImage[];
  onOpen: (index: number) => void;
}) {
  if (images.length === 0) return null;
  return (
    <div className="columns-1 gap-3 space-y-3 sm:columns-2 md:gap-4 md:space-y-4 lg:columns-3">
      {images.map((img, i) => (
        <button
          key={img.id ?? i}
          type="button"
          onClick={() => onOpen(i)}
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
  );
}

export default function Lightbox({ images }: { images: PinterestImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const modalImages = images.map((img, i) => ({
    src: img.image_url,
    alt: img.alt_text || `Visual ${i + 1}`,
  }));

  return (
    <>
      <PinterestGrid images={images} onOpen={setIndex} />
      <LightboxModal
        open={open && index !== null}
        images={modalImages}
        index={index ?? 0}
        onIndexChange={setIndex}
        onClose={() => setIndex(null)}
      />
    </>
  );
}