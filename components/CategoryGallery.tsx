import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { HomeCategory } from "@/lib/content";
import Lightbox from "./Lightbox";

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

      <div className="panel p-5 sm:p-8">
        <span className="kicker">Design exploration</span>
        <h1 className="mt-2 text-[clamp(24px,4vw,32px)] font-normal leading-[1.1] tracking-[-0.05em]">
          {cat.label}
        </h1>
      </div>

      {sorted.length > 0 ? (
        <Lightbox images={sorted} />
      ) : (
        <p className="px-0.5 text-sm text-sub">Belum ada gambar untuk kategori ini.</p>
      )}
    </div>
  );
}
