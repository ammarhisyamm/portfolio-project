import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { HomeCategory } from "@/lib/content";
import Media from "./Media";

export default function CategoryGallery({ cat }: { cat: HomeCategory }) {
  const images = cat.images.filter((i) => i.visible);
  const sorted = [...images].sort((a, b) => a.sort - b.sort);

  return (
    <div className="mx-auto w-full max-w-[650px] px-4 pb-20 pt-8 sm:px-0">
      <Link
        href="/"
        className="group flex w-fit items-center gap-1.5 text-[13px] text-sub no-underline transition-colors hover:text-ink"
      >
        <ArrowLeft
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-0.5"
          aria-hidden="true"
        />
        Back to home
      </Link>

      <div className="pt-12 sm:pt-16">
        <p className="kicker">Work</p>
        <h1 className="mt-4 text-[26px] font-medium tracking-[-0.02em] text-ink sm:text-[30px]">
          {cat.label}
        </h1>
      </div>

      {sorted.length > 0 ? (
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sorted.map((img, i) => (
            <figure key={img.id ?? i} className="m-0">
              <div className="overflow-hidden border border-line bg-panel">
                <Media
                  src={img.image_url}
                  alt={img.alt_text || `${cat.label} visual ${i + 1}`}
                  label={cat.label}
                  imgClassName="h-auto w-full"
                />
              </div>
            </figure>
          ))}
        </div>
      ) : (
        <p className="mt-12 text-sm text-sub">Belum ada gambar untuk kategori ini.</p>
      )}
    </div>
  );
}
