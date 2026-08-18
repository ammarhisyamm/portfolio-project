import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { HomeCategory } from "@/lib/content";
import Media from "./Media";

export default function CategoryGallery({ cat }: { cat: HomeCategory }) {
  const images = cat.images.filter((i) => i.visible);
  const sorted = [...images].sort((a, b) => a.sort - b.sort);

  return (
    <div className="grid gap-3 pb-16 pt-3 md:gap-4">
      <Link
        href="/"
        className="flex w-fit items-center gap-1.5 px-0.5 text-[13px] text-sub no-underline transition-colors hover:text-ink"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to home
      </Link>

      <div className="grid gap-4 px-0.5 pt-6 sm:pt-8">
        <span className="kicker">Design exploration</span>
        <h1 className="text-[clamp(34px,5vw,64px)] font-normal leading-none tracking-[-0.06em]">{cat.label}</h1>
      </div>

      {sorted.length > 0 ? (
        <div className="columns-1 gap-3 space-y-3 sm:columns-2 md:gap-4 md:space-y-4 lg:columns-3">
          {sorted.map((img, i) => (
            <figure
              key={img.id ?? i}
              className="break-inside-avoid overflow-hidden rounded-[14px] border border-line bg-panel sm:rounded-[18px]"
            >
              <Media
                src={img.image_url}
                alt={img.alt_text || `${cat.label} visual ${i + 1}`}
                label={cat.label}
                imgClassName="h-auto w-full"
              />
            </figure>
          ))}
        </div>
      ) : (
        <p className="px-0.5 text-sm text-sub">Belum ada gambar untuk kategori ini.</p>
      )}
    </div>
  );
}
