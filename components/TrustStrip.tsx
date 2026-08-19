import type { CSSProperties } from "react";
import type { TrustItem } from "@/lib/content";

function Group({ items }: { items: TrustItem[] }) {
  return (
    <div className="flex items-center gap-12 pr-12">
      {items.map((logo) => (
        <div key={logo.label} className="flex h-8 shrink-0 items-center justify-center">
          {logo.image ? (
            <img
              src={logo.image}
              alt={logo.label}
              loading="lazy"
              className="h-8 w-auto max-w-[150px] object-contain opacity-70 grayscale transition-opacity duration-300 hover:opacity-100"
            />
          ) : (
            <span className="whitespace-nowrap  text-[11px] uppercase tracking-[0.06em] text-muted">
              {logo.label}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default function TrustStrip({ items, label = "I've collaborated with 40+ clients" }: { items: TrustItem[]; label?: string }) {
  const DUPLICATED = [...items, ...items];
  return (
    <div>
      <p className=" text-[10px] uppercase tracking-[0.08em] text-muted">{label}</p>
      <div className="marquee-fade relative mt-4 overflow-hidden" aria-hidden="true">
        <div
          className="marquee-track flex"
          style={{ "--marquee-duration": "110s" } as CSSProperties}
        >
          {DUPLICATED.map((_, i) => (
            <Group key={i} items={items} />
          ))}
        </div>
      </div>
    </div>
  );
}